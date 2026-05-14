import { useNavigate } from "react-router-dom";

// ── Progress Ring ──────────────────────────────
function ProgressRing({ pct = 75 }) {
  const r = 30;
  const circ = 2 * Math.PI * r;
  const offset = circ - (circ * pct) / 100;

  return (
    <svg
      width="72"
      height="72"
      viewBox="0 0 72 72"
      style={{ transform: "rotate(-90deg)" }}
    >
      <circle
        cx="36"
        cy="36"
        r={r}
        fill="none"
        stroke="var(--color-border)"
        strokeWidth="6"
      />
      <circle
        cx="36"
        cy="36"
        r={r}
        fill="none"
        stroke="var(--color-primary)"
        strokeWidth="6"
        strokeLinecap="round"
        strokeDasharray={circ}
        strokeDashoffset={offset}
        style={{ transition: "stroke-dashoffset 0.8s ease" }}
      />
    </svg>
  );
}

export default function RightPanel({
  stats = {},
  overallProgress = {},
  topicProgress = [],
  upcomingQuizzes = [],
  loading = false,
}) {
  const navigate = useNavigate();

  const QUICK_ACTIONS = [
    {
      label: "Start Quiz",
      icon: "ti-player-play",
      action: () => navigate("/quiz"),
    },
    {
      label: "Retry Last",
      icon: "ti-refresh",
      action: () => navigate("/quiz"),
    },
    {
      label: "Analytics",
      icon: "ti-chart-line",
      action: () => navigate("/dashboard"),
    },
    {
      label: "Leaderboard",
      icon: "ti-trophy",
      action: () => navigate("/dashboard"),
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-10">
        <p style={{ color: "var(--color-muted)" }}>Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">

      {/* ── Streak Card ── */}
      <div
        className="rounded-[var(--radius-lg)] p-5 text-white relative overflow-hidden"
        style={{ background: "var(--color-primary)" }}
      >
        <div className="absolute -top-5 -right-5 w-24 h-24 rounded-full bg-white/10" />
        <div className="absolute -bottom-8 right-5 w-16 h-16 rounded-full bg-white/[0.06]" />

        <div className="relative z-10">
          <div className="text-[24px] mb-1">🔥</div>

          <p className="text-[11px] font-semibold uppercase tracking-[0.6px] opacity-80 mb-1">
            Current Streak
          </p>

          <p
            className="text-[36px] font-bold leading-none"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {stats?.streak || 0} Days
          </p>

          <p className="text-[12px] opacity-75 mt-2">
            Keep going!{" "}
            {(stats?.bestStreak || 0) - (stats?.streak || 0)} more days for your best
          </p>
        </div>
      </div>

      {/* ── Quick Actions ── */}
      <div
        className="rounded-[var(--radius-lg)] border border-[var(--color-border)] p-[18px]"
        style={{ background: "var(--color-surface)" }}
      >
        <h3
          className="text-[15px] font-bold mb-4"
          style={{
            fontFamily: "var(--font-display)",
            color: "var(--color-text)",
          }}
        >
          Quick Actions
        </h3>

        <div className="grid grid-cols-2 gap-[10px]">
          {QUICK_ACTIONS.map(({ label, icon, action }) => (
            <button
              key={label}
              onClick={action}
              className="flex flex-col items-center gap-1 p-3 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-transparent cursor-pointer transition-all duration-150 hover:border-[var(--color-primary)] hover:bg-[var(--color-primary-bg)]"
            >
              <i
                className={`ti ${icon} text-[22px]`}
                style={{ color: "var(--color-primary)" }}
                aria-hidden="true"
              />

              <span
                className="text-[11px] font-semibold"
                style={{ color: "var(--color-text)" }}
              >
                {label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Overall Progress ── */}
      <div
        className="rounded-[var(--radius-lg)] border border-[var(--color-border)] p-[18px]"
        style={{ background: "var(--color-surface)" }}
      >
        <h3
          className="text-[15px] font-bold mb-4"
          style={{
            fontFamily: "var(--font-display)",
            color: "var(--color-text)",
          }}
        >
          Overall Progress
        </h3>

        <div
          className="flex items-center gap-4 p-4 rounded-[var(--radius-md)] mb-4"
          style={{ background: "var(--color-bg)" }}
        >
          <ProgressRing pct={overallProgress?.pct || 0} />

          <div>
            <p
              className="text-[18px] font-bold leading-none"
              style={{
                fontFamily: "var(--font-display)",
                color: "var(--color-text)",
              }}
            >
              {overallProgress?.pct || 0}%
            </p>

            <p
              className="text-[12px] mt-1"
              style={{ color: "var(--color-muted)" }}
            >
              Course completed
            </p>

            <p
              className="text-[11px] mt-1"
              style={{ color: "var(--color-muted)" }}
            >
              {overallProgress?.done || 0} / {overallProgress?.total || 0} topics done
            </p>
          </div>
        </div>

        {/* ── Topic Progress ── */}
        <div className="flex flex-col gap-[10px]">
          {topicProgress?.map((topic, index) => (
            <div key={index}>
              <div className="flex justify-between text-[12px] mb-1">
                <span style={{ color: "var(--color-muted)" }}>
                  {topic?.label}
                </span>

                <span
                  className="font-semibold"
                  style={{ color: "var(--color-text)" }}
                >
                  {topic?.pct || 0}%
                </span>
              </div>

              <div
                className="h-[5px] rounded-full overflow-hidden"
                style={{ background: "var(--color-bg)" }}
              >
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${topic?.pct || 0}%`,
                    background: topic?.color || "var(--color-primary)",
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Upcoming Quizzes ── */}
      {upcomingQuizzes?.length > 0 && (
        <div
          className="rounded-[var(--radius-lg)] border border-[var(--color-border)] p-[18px]"
          style={{ background: "var(--color-surface)" }}
        >
          <h3
            className="text-[15px] font-bold mb-4"
            style={{
              fontFamily: "var(--font-display)",
              color: "var(--color-text)",
            }}
          >
            Upcoming
          </h3>

          <div className="flex flex-col gap-[10px]">
            {upcomingQuizzes.map((q) => (
              <div
                key={q._id || q.id}
                className="flex items-center gap-[10px] p-[10px] rounded-[var(--radius-md)]"
                style={{
                  background: q.accent
                    ? "var(--color-bg)"
                    : "var(--color-primary-bg)",

                  border: q.accent
                    ? "1px solid var(--color-border)"
                    : "none",
                }}
              >
                <div
                  className="w-8 h-8 rounded-[var(--radius-sm)] flex items-center justify-center flex-shrink-0 text-[15px]"
                  style={
                    q.accent
                      ? {
                          background: "var(--color-accent-bg)",
                          color: "var(--color-accent)",
                        }
                      : {
                          background: "var(--color-primary)",
                          color: "#fff",
                        }
                  }
                >
                  <i className={`ti ${q.icon || "ti-book"}`} />
                </div>

                <div>
                  <p
                    className="text-[13px] font-semibold"
                    style={{ color: "var(--color-text)" }}
                  >
                    {q.name}
                  </p>

                  <p
                    className="text-[11px]"
                    style={{ color: "var(--color-muted)" }}
                  >
                    {q.when} · {q.questions} questions
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}