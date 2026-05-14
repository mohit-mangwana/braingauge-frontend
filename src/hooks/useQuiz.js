import { useState, useEffect, useCallback, useRef } from "react";
import { quizAPI, participationAPI } from "../api/services";
import { getErrorMessage } from "../api/client";

export function useQuiz(subjectId) {
  const [phase,      setPhase]      = useState("idle");   // idle|loading|active|submitting|result|error
  const [quizMeta,   setQuizMeta]   = useState(null);
  const [questions,  setQuestions]  = useState([]);
  const [sessionId,  setSessionId]  = useState(null);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers,    setAnswers]    = useState({});       // { [_id]: optionIdx }
  const [result,     setResult]     = useState(null);     // backend graded result
  const [timeLeft,   setTimeLeft]   = useState(null);
  const [error,      setError]      = useState(null);

  const timerRef      = useRef(null);
  const submittingRef = useRef(false);

  useEffect(() => () => clearInterval(timerRef.current), []);

  // Timer
  useEffect(() => {
    if (phase !== "active") return;
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) { clearInterval(timerRef.current); handleTimeout(); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [phase]); // eslint-disable-line

  // ── Fetch quiz + start session ────────────────────────────
  const fetchAndStart = useCallback(async () => {
    setPhase("loading");
    setError(null);
    try {
      
      const metaRes = await quizAPI.getBySubject(subjectId);
      const meta    = metaRes.data;

      
      const attemptRes  = await quizAPI.getForAttempt(meta._id);
      const { quizMeta: fullMeta, questions: qs } = attemptRes.data;

      
      const sessRes = await participationAPI.start(meta._id);
      const sid     = sessRes.data.sessionId;

      setQuizMeta(fullMeta);
      setQuestions(qs);
      setSessionId(sid);
      setCurrentIdx(0);
      setAnswers({});
      setResult(null);
      setTimeLeft((fullMeta.timeLimitMinutes || 10) * 60);
      setPhase("active");
    } catch (err) {
      setError(getErrorMessage(err));
      setPhase("error");
    }
  }, [subjectId]);


  const selectAnswer = useCallback((questionId, optionIdx) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionIdx }));
    if (sessionId && quizMeta?._id) {
      participationAPI.recordAnswer(quizMeta._id, sessionId, questionId, optionIdx, null)
        .catch(() => {});
    }
  }, [sessionId, quizMeta]);


  const submitQuiz = useCallback(async (status = "completed") => {
    if (submittingRef.current) return;
    submittingRef.current = true;
    clearInterval(timerRef.current);
    setPhase("submitting");

    const payload = questions.map((q) => ({
      questionId:     q._id,
      selectedOption: answers[q._id] ?? null,
    }));

    try {
      const res = await participationAPI.submit(quizMeta._id, sessionId, payload);
      setResult(res.data);
      setPhase("result");
    } catch (err) {
      setError(getErrorMessage(err));
      setPhase("error");
    } finally {
      submittingRef.current = false;
    }
  }, [questions, answers, quizMeta, sessionId]);

  // ── Timeout ───────────────────────────────────────────────
  const handleTimeout = useCallback(async () => {
    if (submittingRef.current) return;
    submittingRef.current = true;
    setPhase("submitting");
    try {
      const res = await participationAPI.timeout(quizMeta._id, sessionId);
      setResult(res.data);
      setPhase("result");
    } catch {
      const payload = questions.map((q) => ({ questionId: q._id, selectedOption: answers[q._id] ?? null }));
      try {
        const res = await participationAPI.submit(quizMeta._id, sessionId, payload);
        setResult(res.data);
        setPhase("result");
      } catch (err2) {
        setError(getErrorMessage(err2));
        setPhase("error");
      }
    } finally {
      submittingRef.current = false;
    }
  }, [quizMeta, sessionId, questions, answers]);

  
  const reset = useCallback(() => {
    clearInterval(timerRef.current);
    submittingRef.current = false;
    setPhase("idle"); setQuizMeta(null); setQuestions([]);
    setSessionId(null); setCurrentIdx(0); setAnswers({});
    setResult(null); setTimeLeft(null); setError(null);
  }, []);

  
  const goNext = useCallback(() => setCurrentIdx((i) => Math.min(i + 1, questions.length - 1)), [questions.length]);
  const goPrev = useCallback(() => setCurrentIdx((i) => Math.max(i - 1, 0)), []);
  const goTo   = useCallback((idx) => setCurrentIdx(idx), []);

  const currentQuestion = questions[currentIdx] || null;
  const isLastQuestion  = questions.length > 0 && currentIdx === questions.length - 1;
  const answeredCount   = Object.keys(answers).length;
  const progressPercent = questions.length ? Math.round((answeredCount / questions.length) * 100) : 0;
  const timerDisplay    = timeLeft !== null
    ? `${String(Math.floor(timeLeft / 60)).padStart(2, "0")}:${String(timeLeft % 60).padStart(2, "0")}`
    : null;
  const isTimeLow = timeLeft !== null && timeLeft <= 60;

  return {
    phase, quizMeta, questions, currentIdx, currentQuestion,
    answers, result, timeLeft, timerDisplay, isTimeLow, error,
    isLastQuestion, answeredCount, progressPercent,
    fetchAndStart, selectAnswer, submitQuiz, reset,
    goNext, goPrev, goTo,
  };
}
