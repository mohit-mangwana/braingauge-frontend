import { useNavigate } from "react-router-dom";

function scoreColor(score) {
  if (score >= 80) return "var(--color-primary)";
  if (score >= 65) return "var(--color-medium)";
  return "var(--color-hard)";
}

export default function RecentQuizzes({
  quizzes = [],
  loading = false,
}) {
  const navigate = useNavigate();

  if (loading) {
    return (
      <div
        className="rounded-[var(--radius-lg)] border border-[var(--color-border)] p-6"
        style={{ background: "var(--color-surface)" }}
      >
        <p style={{ color: "var(--color-muted)" }}>
          Loading recent quizzes...
        </p>
      </div>
    );
  }

  return (
    <div
      className="rounded-[var(--radius-lg)] border border-[var(--color-border)] p-6"
      style={{ background: "var(--color-surface)" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2
          className="text-[15px] font-bold"
          style={{
            fontFamily: "var(--font-display)",
            color: "var(--color-text)",
          }}
        >
          Recent Quizzes
        </h2>

        <button
          onClick={() => navigate("/quiz")}
          className="text-[12px] font-semibold bg-transparent border-none cursor-pointer hover:underline"
          style={{ color: "var(--color-primary)" }}
        >
          View all →
        </button>
      </div>

      {/* Empty State */}
      {quizzes?.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center py-8 text-center"
        >
          <i
            className="ti ti-book-off text-[32px] mb-2"
            style={{ color: "var(--color-muted)" }}
          />

          <p
            className="text-[14px] font-semibold"
            style={{ color: "var(--color-text)" }}
          >
            No quizzes attempted yet
          </p>

          <p
            className="text-[12px] mt-1"
            style={{ color: "var(--color-muted)" }}
          >
            Start your first quiz to see progress here
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-[10px]">
          {quizzes.map((quiz, index) => (
            <div
              key={quiz?._id || index}
              className="flex items-center gap-3 p-3 rounded-[var(--radius-md)] border border-[var(--color-border)] cursor-pointer transition-all duration-150 hover:border-[var(--color-primary)] hover:bg-[var(--color-primary-bg)]"
              onClick={() =>
                navigate(`/quiz/${quiz?.subject || quiz?._id}`)
              }
            >
              {/* Icon */}
              <div
                className="w-9 h-9 rounded-[var(--radius-md)] flex items-center justify-center text-[18px] flex-shrink-0"
                style={{
                  background: "var(--color-primary-bg)",
                  color: "var(--color-primary)",
                }}
              >
                <i
                  className={`ti ${quiz?.icon || "ti-book"}`}
                  aria-hidden="true"
                />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p
                  className="text-[13px] font-semibold truncate"
                  style={{ color: "var(--color-text)" }}
                >
                  {quiz?.name || quiz?.title || "Untitled Quiz"}
                </p>

                <p
                  className="text-[11px] mt-[2px]"
                  style={{ color: "var(--color-muted)" }}
                >
                  {quiz?.questions || 0} questions ·{" "}
                  {quiz?.duration || "0 min"} ·{" "}
                  {quiz?.difficulty || "Normal"}
                </p>
              </div>

              {/* Score */}
              <div className="text-right flex-shrink-0">
                <p
                  className="text-[16px] font-bold leading-none"
                  style={{
                    fontFamily: "var(--font-display)",
                    color: scoreColor(quiz?.score || 0),
                  }}
                >
                  {quiz?.score || 0}%
                </p>

                <p
                  className="text-[10px] mt-[2px]"
                  style={{ color: "var(--color-muted)" }}
                >
                  Score
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}