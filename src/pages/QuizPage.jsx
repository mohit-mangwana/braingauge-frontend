import { useState } from "react";
import { SUBJECTS } from "../data/quizData";
import { useQuiz } from "../hooks/useQuiz";

const SUBJECT_ICONS = {
  algorithms:      "ti-math",
  databases:       "ti-database",
  os:              "ti-cpu",
  networks:        "ti-network",
  data_structures: "ti-code",
  web:             "ti-world",
};

function DiffBadge({ difficulty }) {
  const cfg = {
    easy:   { bg: "var(--color-primary-bg)", color: "var(--color-easy)" },
    medium: { bg: "#FEF3C7",                 color: "#D97706"            },
    hard:   { bg: "var(--color-accent-bg)",  color: "var(--color-hard)" },
  }[difficulty] || { bg: "var(--color-bg)", color: "var(--color-muted)" };

  return (
    <span className="text-[11px] font-semibold uppercase tracking-[0.5px] px-2 py-1 rounded-full"
      style={{ background: cfg.bg, color: cfg.color }}>
      {difficulty}
    </span>
  );
}


function Spinner({ label = "Loading…" }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <div className="w-12 h-12 rounded-full border-4 border-[var(--color-border)] border-t-[var(--color-primary)] animate-spin" />
      <p className="text-[14px] font-medium" style={{ color: "var(--color-muted)" }}>{label}</p>
    </div>
  );
}

function SubjectGrid({ onSelect }) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-[22px] font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--color-text)" }}>
          Choose a Subject
        </h1>
        <p className="text-[13px] mt-1" style={{ color: "var(--color-muted)" }}>
          Pick a topic — your quiz is generated instantly from the question bank
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {SUBJECTS.map((subject) => (
          <button key={subject.id} onClick={() => onSelect(subject.id)}
            className="flex flex-col items-center gap-3 p-5 rounded-[var(--radius-lg)] border-2 border-[var(--color-border)] bg-[var(--color-surface)] cursor-pointer transition-all duration-150 hover:border-[var(--color-primary)] hover:bg-[var(--color-primary-bg)] hover:shadow-[0_4px_16px_rgba(15,155,119,0.12)]">
            <div className="w-14 h-14 rounded-[var(--radius-lg)] flex items-center justify-center text-[28px]"
              style={{ background: "var(--color-primary-bg)", color: "var(--color-primary)" }}>
              <i className={`ti ${SUBJECT_ICONS[subject.id] || "ti-brain"}`} />
            </div>
            <span className="text-[14px] font-semibold text-center"
              style={{ fontFamily: "var(--font-display)", color: "var(--color-text)" }}>
              {subject.label}
            </span>
          </button>
        ))}
      </div>

      <div className="flex items-start gap-3 p-4 rounded-[var(--radius-lg)] border border-[var(--color-border)]"
        style={{ background: "var(--color-surface)" }}>
        <i className="ti ti-info-circle text-[20px] mt-0.5 flex-shrink-0" style={{ color: "var(--color-primary)" }} />
        <p className="text-[13px]" style={{ color: "var(--color-muted)" }}>
          Each quiz has <strong style={{ color: "var(--color-text)" }}>10 questions</strong> · {" "}
          <strong style={{ color: "var(--color-text)" }}>10-minute</strong> timer · {" "}
          Passing score: <strong style={{ color: "var(--color-text)" }}>60%</strong> · {" "}
          Difficulty adapts based on your recent results.
        </p>
      </div>
    </div>
  );
}


function QuizEngine({ subjectId, onBack }) {
  const {
    phase, quizMeta, questions, currentIdx, currentQuestion,
    answers, result, timerDisplay, isTimeLow, error,
    isLastQuestion, answeredCount, progressPercent,
    fetchAndStart, selectAnswer, submitQuiz, reset,
    goNext, goPrev, goTo,
  } = useQuiz(subjectId);

  const [showConfirm, setShowConfirm] = useState(false);
  const [reviewIdx,   setReviewIdx]   = useState(0);
  const [reviewMode,  setReviewMode]  = useState(false);

  const subject = SUBJECTS.find((s) => s.id === subjectId);

  
  if (phase === "idle") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
        <div className="w-20 h-20 rounded-[var(--radius-xl)] flex items-center justify-center text-[36px]"
          style={{ background: "var(--color-primary-bg)", color: "var(--color-primary)" }}>
          <i className={`ti ${SUBJECT_ICONS[subjectId] || "ti-brain"}`} />
        </div>
        <div className="text-center">
          <h2 className="text-[24px] font-bold mb-2"
            style={{ fontFamily: "var(--font-display)", color: "var(--color-text)" }}>
            {subject?.label} Quiz
          </h2>
          <p className="text-[14px]" style={{ color: "var(--color-muted)" }}>
            10 questions · 10 minutes · Adaptive difficulty
          </p>
          <p className="text-[13px] mt-1" style={{ color: "var(--color-muted)" }}>
            Passing score: 60% — your answers are graded on the server
          </p>
        </div>
        <div className="flex gap-3">
          <button onClick={onBack}
            className="px-6 py-3 rounded-[var(--radius-md)] border border-[var(--color-border)] text-[14px] font-semibold cursor-pointer hover:bg-[var(--color-bg)]"
            style={{ background: "transparent", color: "var(--color-muted)" }}>
            ← Back
          </button>
          <button onClick={fetchAndStart}
            className="px-8 py-3 rounded-[var(--radius-md)] text-white text-[14px] font-semibold cursor-pointer hover:opacity-90 hover:shadow-md"
            style={{ background: "var(--color-primary)" }}>
            Start Quiz →
          </button>
        </div>
      </div>
    );
  }


  if (phase === "loading") return <Spinner label="Preparing your quiz…" />;


  if (phase === "submitting") return <Spinner label="Grading your answers…" />;


  if (phase === "error") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <i className="ti ti-alert-circle text-[44px]" style={{ color: "var(--color-accent)" }} />
        <h2 className="text-[18px] font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--color-text)" }}>
          Something went wrong
        </h2>
        <p className="text-[13px] text-center max-w-[360px]" style={{ color: "var(--color-muted)" }}>{error}</p>
        <div className="flex gap-3">
          <button onClick={onBack}
            className="px-5 py-2 rounded-[var(--radius-md)] border border-[var(--color-border)] text-[13px] font-semibold cursor-pointer"
            style={{ background: "transparent", color: "var(--color-muted)" }}>
            ← Back
          </button>
          <button onClick={() => { reset(); fetchAndStart(); }}
            className="px-5 py-2 rounded-[var(--radius-md)] text-white text-[13px] font-semibold cursor-pointer"
            style={{ background: "var(--color-primary)" }}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

 
  if (phase === "active" && currentQuestion) {
    const selectedAnswer = answers[currentQuestion._id] ?? null;

    return (
      <div className="max-w-[720px] mx-auto flex flex-col gap-5">

        {/* ── Header bar ── */}
        <div className="flex items-center justify-between p-4 rounded-[var(--radius-lg)] border border-[var(--color-border)]"
          style={{ background: "var(--color-surface)" }}>
          <div className="flex items-center gap-3">
            <button onClick={() => setShowConfirm(true)}
              className="text-[13px] font-medium cursor-pointer bg-transparent border-none flex items-center gap-1 hover:underline"
              style={{ color: "var(--color-muted)" }}>
              <i className="ti ti-arrow-left text-[16px]" /> Exit
            </button>
            <span className="text-[13px] font-semibold" style={{ color: "var(--color-text)" }}>
              Q{currentIdx + 1} / {questions.length}
            </span>
            <span className="text-[12px] px-2 py-0.5 rounded-full"
              style={{ background: "var(--color-primary-bg)", color: "var(--color-primary)" }}>
              {answeredCount} answered
            </span>
          </div>

          {/* Progress bar */}
          <div className="flex-1 mx-4 h-2 rounded-full overflow-hidden" style={{ background: "var(--color-bg)" }}>
            <div className="h-full rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%`, background: "var(--color-primary)" }} />
          </div>

          {/* Timer */}
          <div className="flex items-center gap-1 text-[14px] font-bold px-3 py-1 rounded-[var(--radius-md)]"
            style={{
              color:      isTimeLow ? "var(--color-accent)" : "var(--color-primary)",
              background: isTimeLow ? "var(--color-accent-bg)" : "var(--color-primary-bg)",
            }}>
            <i className={`ti ti-clock text-[16px] ${isTimeLow ? "animate-pulse" : ""}`} />
            {timerDisplay}
          </div>
        </div>

        {/* ── Question card ── */}
        <div className="p-6 rounded-[var(--radius-lg)] border border-[var(--color-border)]"
          style={{ background: "var(--color-surface)" }}>
          {currentQuestion.difficulty && <DiffBadge difficulty={currentQuestion.difficulty} />}

          <p className="text-[17px] font-semibold mt-4 mb-6 leading-relaxed"
            style={{ color: "var(--color-text)" }}>
            {currentQuestion.question}
          </p>

          <div className="flex flex-col gap-3">
            {currentQuestion.options.map((opt, idx) => {
              const isSelected = selectedAnswer === idx;
              return (
                <button key={idx}
                  onClick={() => selectAnswer(currentQuestion._id, idx)}
                  className="flex items-center gap-3 p-4 rounded-[var(--radius-md)] border-2 text-left cursor-pointer transition-all duration-150 w-full"
                  style={{
                    background:  isSelected ? "var(--color-primary-bg)" : "var(--color-bg)",
                    borderColor: isSelected ? "var(--color-primary)"    : "var(--color-border)",
                  }}>
                  <span className="w-7 h-7 rounded-full flex items-center justify-center text-[12px] font-bold flex-shrink-0"
                    style={{
                      background: isSelected ? "var(--color-primary)" : "var(--color-border)",
                      color:      isSelected ? "#fff"                  : "var(--color-muted)",
                    }}>
                    {["A","B","C","D"][idx]}
                  </span>
                  <span className="text-[14px] font-medium" style={{ color: "var(--color-text)" }}>
                    {opt}
                  </span>
                  {isSelected && (
                    <i className="ti ti-check ml-auto text-[16px]" style={{ color: "var(--color-primary)" }} />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Navigation ── */}
        <div className="flex items-center justify-between">
          <button onClick={goPrev} disabled={currentIdx === 0}
            className="px-4 py-2 rounded-[var(--radius-md)] border border-[var(--color-border)] text-[13px] font-semibold cursor-pointer disabled:opacity-40 hover:bg-[var(--color-bg)]"
            style={{ background: "transparent", color: "var(--color-muted)" }}>
            ← Previous
          </button>

          {/* Question dots */}
          <div className="flex gap-1 flex-wrap justify-center max-w-[380px]">
            {questions.map((q, i) => {
              const isAnswered = answers[q._id] !== undefined;
              const isCurrent  = i === currentIdx;
              return (
                <button key={q._id} onClick={() => goTo(i)}
                  className="w-7 h-7 rounded-full text-[10px] font-bold cursor-pointer transition-all"
                  style={{
                    background: isCurrent  ? "var(--color-primary)"
                              : isAnswered ? "var(--color-primary-bg)"
                              : "var(--color-border)",
                    color:      isCurrent  ? "#fff"
                              : isAnswered ? "var(--color-primary)"
                              : "var(--color-muted)",
                    border:     isCurrent  ? "2px solid var(--color-primary)" : "none",
                  }}>
                  {i + 1}
                </button>
              );
            })}
          </div>

          {isLastQuestion ? (
            <button onClick={() => submitQuiz()}
              className="px-6 py-2 rounded-[var(--radius-md)] text-white text-[13px] font-semibold cursor-pointer hover:opacity-90"
              style={{ background: "var(--color-primary)" }}>
              Submit ✓
            </button>
          ) : (
            <button onClick={goNext}
              className="px-4 py-2 rounded-[var(--radius-md)] text-white text-[13px] font-semibold cursor-pointer hover:opacity-90"
              style={{ background: "var(--color-primary)" }}>
              Next →
            </button>
          )}
        </div>

        {/* ── Exit confirm modal ── */}
        {showConfirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[200] p-4">
            <div className="rounded-[var(--radius-xl)] p-6 max-w-[360px] w-full border border-[var(--color-border)]"
              style={{ background: "var(--color-surface)" }}>
              <h3 className="text-[18px] font-bold mb-2"
                style={{ fontFamily: "var(--font-display)", color: "var(--color-text)" }}>
                Exit Quiz?
              </h3>
              <p className="text-[13px] mb-5" style={{ color: "var(--color-muted)" }}>
                Your session will be abandoned and not saved.
              </p>
              <div className="flex gap-3">
                <button onClick={() => setShowConfirm(false)}
                  className="flex-1 py-2 rounded-[var(--radius-md)] border border-[var(--color-border)] text-[13px] font-semibold cursor-pointer hover:bg-[var(--color-bg)]"
                  style={{ background: "transparent", color: "var(--color-muted)" }}>
                  Keep Going
                </button>
                <button onClick={() => { setShowConfirm(false); reset(); onBack(); }}
                  className="flex-1 py-2 rounded-[var(--radius-md)] text-white text-[13px] font-semibold cursor-pointer"
                  style={{ background: "var(--color-accent)" }}>
                  Exit
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ── RESULT: graded by backend ─────────────────────────────
  if (phase === "result" && result) {
    // Backend returns: { scorePercent, correctCount, wrongCount, skippedCount,
    //                    totalQuestions, isPassed, durationSecs, answers[], nextDifficulty }
    const { scorePercent, correctCount, wrongCount, skippedCount,
            totalQuestions, isPassed, durationSecs, answers: gradedAnswers,
            nextDifficulty } = result;

    const reviewQ = gradedAnswers?.[reviewIdx];

    // ── Review mode ──
    if (reviewMode && reviewQ) {
      return (
        <div className="max-w-[720px] mx-auto flex flex-col gap-5">
          <div className="flex items-center justify-between">
            <button onClick={() => setReviewMode(false)}
              className="flex items-center gap-1 text-[13px] font-medium cursor-pointer bg-transparent border-none hover:underline"
              style={{ color: "var(--color-muted)" }}>
              <i className="ti ti-arrow-left" /> Back to Results
            </button>
            <span className="text-[13px]" style={{ color: "var(--color-muted)" }}>
              {reviewIdx + 1} / {gradedAnswers.length}
            </span>
          </div>

          <div className="p-6 rounded-[var(--radius-lg)] border border-[var(--color-border)]"
            style={{ background: "var(--color-surface)" }}>
            <p className="text-[17px] font-semibold mb-5" style={{ color: "var(--color-text)" }}>
              {reviewQ.questionText}
            </p>
            <div className="flex flex-col gap-3 mb-5">
              {reviewQ.options?.map((opt, idx) => {
                const isCorrect  = idx === reviewQ.correctOption;
                const isSelected = idx === reviewQ.selectedOption;
                return (
                  <div key={idx} className="flex items-center gap-3 p-4 rounded-[var(--radius-md)] border-2"
                    style={{
                      borderColor: isCorrect                   ? "var(--color-correct)"
                                 : isSelected && !isCorrect   ? "var(--color-wrong)"
                                 : "var(--color-border)",
                      background:  isCorrect                   ? "var(--color-primary-bg)"
                                 : isSelected && !isCorrect   ? "var(--color-accent-bg)"
                                 : "var(--color-bg)",
                    }}>
                    <span className="w-7 h-7 rounded-full flex items-center justify-center text-[12px] font-bold flex-shrink-0"
                      style={{
                        background: isCorrect ? "var(--color-correct)" : isSelected ? "var(--color-wrong)" : "var(--color-border)",
                        color: "#fff",
                      }}>
                      {isCorrect ? "✓" : isSelected ? "✗" : ["A","B","C","D"][idx]}
                    </span>
                    <span className="text-[14px] font-medium" style={{ color: "var(--color-text)" }}>
                      {opt}
                    </span>
                  </div>
                );
              })}
            </div>
            {reviewQ.explanation && (
              <div className="p-4 rounded-[var(--radius-md)]" style={{ background: "var(--color-primary-bg)" }}>
                <p className="text-[12px] font-semibold mb-1" style={{ color: "var(--color-primary)" }}>
                  💡 Explanation
                </p>
                <p className="text-[13px]" style={{ color: "var(--color-text)" }}>
                  {reviewQ.explanation}
                </p>
              </div>
            )}
            {/* Skipped indicator */}
            {reviewQ.selectedOption === null && (
              <div className="p-3 rounded-[var(--radius-md)] mt-3" style={{ background: "var(--color-bg)" }}>
                <p className="text-[13px]" style={{ color: "var(--color-muted)" }}>
                  ⏭ This question was skipped
                </p>
              </div>
            )}
          </div>

          <div className="flex justify-between">
            <button onClick={() => setReviewIdx((i) => Math.max(i - 1, 0))}
              disabled={reviewIdx === 0}
              className="px-4 py-2 rounded-[var(--radius-md)] border border-[var(--color-border)] text-[13px] font-semibold cursor-pointer disabled:opacity-40"
              style={{ background: "transparent", color: "var(--color-muted)" }}>
              ← Prev
            </button>
            <button onClick={() => setReviewIdx((i) => Math.min(i + 1, gradedAnswers.length - 1))}
              disabled={reviewIdx === gradedAnswers.length - 1}
              className="px-4 py-2 rounded-[var(--radius-md)] text-white text-[13px] font-semibold cursor-pointer disabled:opacity-40"
              style={{ background: "var(--color-primary)" }}>
              Next →
            </button>
          </div>
        </div>
      );
    }

    // ── Score summary ──
    const mins = durationSecs ? Math.floor(durationSecs / 60) : null;
    const secs = durationSecs ? durationSecs % 60 : null;

    return (
      <div className="max-w-[560px] mx-auto flex flex-col gap-5">
        {/* Score card */}
        <div className="p-8 rounded-[var(--radius-xl)] border border-[var(--color-border)] text-center"
          style={{ background: "var(--color-surface)" }}>

          {/* Score ring */}
          <div className="w-28 h-28 rounded-full flex items-center justify-center mx-auto mb-4 border-[6px]"
            style={{
              borderColor: isPassed ? "var(--color-primary)" : "var(--color-accent)",
              background:  isPassed ? "var(--color-primary-bg)" : "var(--color-accent-bg)",
            }}>
            <span className="text-[32px] font-bold"
              style={{
                fontFamily: "var(--font-display)",
                color: isPassed ? "var(--color-primary)" : "var(--color-accent)",
              }}>
              {scorePercent}%
            </span>
          </div>

          <h2 className="text-[22px] font-bold mb-1"
            style={{ fontFamily: "var(--font-display)", color: "var(--color-text)" }}>
            {isPassed ? "Quiz Passed! 🎉" : "Keep Practising 💪"}
          </h2>
          <p className="text-[13px]" style={{ color: "var(--color-muted)" }}>
            {durationSecs !== null
              ? `Completed in ${mins}m ${secs}s`
              : "Quiz completed"}
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mt-6">
            {[
              { label: "Correct",  value: correctCount,  color: "var(--color-correct)" },
              { label: "Wrong",    value: wrongCount,    color: "var(--color-wrong)"   },
              { label: "Skipped",  value: skippedCount,  color: "var(--color-muted)"   },
            ].map(({ label, value, color }) => (
              <div key={label} className="p-3 rounded-[var(--radius-md)]"
                style={{ background: "var(--color-bg)" }}>
                <p className="text-[22px] font-bold"
                  style={{ fontFamily: "var(--font-display)", color }}>{value}</p>
                <p className="text-[11px] font-semibold" style={{ color: "var(--color-muted)" }}>
                  {label}
                </p>
              </div>
            ))}
          </div>

          {/* Accuracy bar */}
          <div className="mt-5 text-left">
            <div className="flex justify-between text-[12px] mb-1">
              <span style={{ color: "var(--color-muted)" }}>Accuracy</span>
              <span className="font-semibold" style={{ color: "var(--color-text)" }}>
                {Math.round((correctCount / totalQuestions) * 100)}%
              </span>
            </div>
            <div className="h-2 rounded-full overflow-hidden" style={{ background: "var(--color-bg)" }}>
              <div className="h-full rounded-full"
                style={{
                  width: `${Math.round((correctCount / totalQuestions) * 100)}%`,
                  background: "var(--color-primary)",
                }} />
            </div>
          </div>

          {/* Next difficulty */}
          {nextDifficulty && (
            <div className="inline-flex items-center gap-2 mt-4 px-3 py-2 rounded-full"
              style={{ background: "var(--color-primary-bg)" }}>
              <i className="ti ti-trending-up text-[14px]" style={{ color: "var(--color-primary)" }} />
              <span className="text-[12px] font-semibold" style={{ color: "var(--color-primary)" }}>
                Next difficulty: <strong>{nextDifficulty}</strong>
              </span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button onClick={() => { reset(); onBack(); }}
            className="flex-1 py-3 rounded-[var(--radius-md)] border border-[var(--color-border)] text-[14px] font-semibold cursor-pointer hover:bg-[var(--color-bg)]"
            style={{ background: "transparent", color: "var(--color-muted)" }}>
            ← Subjects
          </button>
          {gradedAnswers?.length > 0 && (
            <button onClick={() => { setReviewMode(true); setReviewIdx(0); }}
              className="flex-1 py-3 rounded-[var(--radius-md)] border text-[14px] font-semibold cursor-pointer hover:bg-[var(--color-primary-bg)]"
              style={{ borderColor: "var(--color-primary)", color: "var(--color-primary)", background: "transparent" }}>
              Review
            </button>
          )}
          <button onClick={() => { reset(); fetchAndStart(); }}
            className="flex-1 py-3 rounded-[var(--radius-md)] text-white text-[14px] font-semibold cursor-pointer hover:opacity-90"
            style={{ background: "var(--color-primary)" }}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  return null;
}

// ── Quiz Page root ────────────────────────────────────────────
export default function QuizPage() {
  const [selectedSubject, setSelectedSubject] = useState(null);

  if (selectedSubject) {
    return <QuizEngine subjectId={selectedSubject} onBack={() => setSelectedSubject(null)} />;
  }

  return <SubjectGrid onSelect={setSelectedSubject} />;
}
