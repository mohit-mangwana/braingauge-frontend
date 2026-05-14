// ─────────────────────────────────────────────────────────────
//  BrainGauge · hooks/useQuiz.js
//  Manages quiz attempt state: question flow, answers, timer,
//  submission, and result. Uses static data — no API needed.
// ─────────────────────────────────────────────────────────────
import { useState, useEffect, useCallback, useRef } from "react";
import { buildQuizSet, getNextDifficulty } from "../data/quizData";

export function useQuiz(subjectId, questionCount = 10) {
  // ── State ──────────────────────────────────────────────────
  const [phase, setPhase]           = useState("idle");     // idle | active | result
  const [questions, setQuestions]   = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers]       = useState({});         // { [questionId]: selectedIndex }
  const [result, setResult]         = useState(null);
  const [timeLeft, setTimeLeft]     = useState(null);       // seconds
  const timerRef = useRef(null);

  const TIME_LIMIT = 10 * 60; // 10 minutes per quiz

  // ── Start quiz ─────────────────────────────────────────────
  const startQuiz = useCallback(() => {
    const qs = buildQuizSet(subjectId, questionCount);
    if (!qs.length) return;
    setQuestions(qs);
    setCurrentIdx(0);
    setAnswers({});
    setResult(null);
    setTimeLeft(TIME_LIMIT);
    setPhase("active");
  }, [subjectId, questionCount]);

  // ── Timer ──────────────────────────────────────────────────
  useEffect(() => {
    if (phase !== "active") return;
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          submitQuiz("timed_out");
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [phase]);

  // ── Select an answer ───────────────────────────────────────
  const selectAnswer = useCallback((questionId, optionIdx) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionIdx }));
  }, []);

  // ── Navigate ───────────────────────────────────────────────
  const goNext = useCallback(() => {
    setCurrentIdx((i) => Math.min(i + 1, questions.length - 1));
  }, [questions.length]);

  const goPrev = useCallback(() => {
    setCurrentIdx((i) => Math.max(i - 1, 0));
  }, []);

  const goTo = useCallback((idx) => {
    setCurrentIdx(idx);
  }, []);

  // ── Submit ─────────────────────────────────────────────────
  const submitQuiz = useCallback((status = "completed") => {
    clearInterval(timerRef.current);

    let correct = 0, wrong = 0, skipped = 0;
    const detailed = questions.map((q) => {
      const selected = answers[q.id] ?? null;
      const isCorrect = selected === q.answer;
      if (selected === null || selected === undefined) skipped++;
      else if (isCorrect) correct++;
      else wrong++;
      return {
        id:          q.id,
        question:    q.question,
        options:     q.options,
        selected,
        correct:     q.answer,
        isCorrect:   selected !== null ? isCorrect : null,
        explanation: q.explanation,
      };
    });

    const total        = questions.length;
    const scorePercent = Math.round((correct / total) * 100);
    const isPassed     = scorePercent >= 60;

    // Rule-based adaptive difficulty from last answers
    const history = detailed.map((d) => d.isCorrect === true);
    const nextDifficulty = getNextDifficulty(history);

    setResult({
      scorePercent,
      correct,
      wrong,
      skipped,
      total,
      isPassed,
      status,
      nextDifficulty,
      detailed,
    });
    setPhase("result");
  }, [questions, answers]);

  // ── Reset ──────────────────────────────────────────────────
  const reset = useCallback(() => {
    clearInterval(timerRef.current);
    setPhase("idle");
    setQuestions([]);
    setCurrentIdx(0);
    setAnswers({});
    setResult(null);
    setTimeLeft(null);
  }, []);

  // ── Derived ────────────────────────────────────────────────
  const currentQuestion   = questions[currentIdx] || null;
  const isLastQuestion    = currentIdx === questions.length - 1;
  const answeredCount     = Object.keys(answers).length;
  const progressPercent   = questions.length
    ? Math.round((answeredCount / questions.length) * 100)
    : 0;

  // Timer format mm:ss
  const timerDisplay = timeLeft !== null
    ? `${String(Math.floor(timeLeft / 60)).padStart(2, "0")}:${String(timeLeft % 60).padStart(2, "0")}`
    : null;

  const isTimeLow = timeLeft !== null && timeLeft <= 60;

  return {
    phase, questions, currentIdx, currentQuestion,
    answers, result, timeLeft, timerDisplay, isTimeLow,
    isLastQuestion, answeredCount, progressPercent,
    startQuiz, selectAnswer, goNext, goPrev, goTo, submitQuiz, reset,
  };
}
