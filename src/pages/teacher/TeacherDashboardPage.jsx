import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useApi }       from "../../hooks/useApi";
import { teacherAPI }   from "../../api/services";

const SUBJECT_LABELS = {
  algorithms:      "Algorithms",
  databases:       "Databases",
  os:              "Operating Systems",
  networks:        "Computer Networks",
  data_structures: "Data Structures",
  web:             "Web Technologies",
};

const SUBJECT_ICONS = {
  algorithms:      "ti-math",
  databases:       "ti-database",
  os:              "ti-cpu",
  networks:        "ti-network",
  data_structures: "ti-code",
  web:             "ti-world",
};

function StatCard({ label, value, icon, iconBg, iconColor, sub }) {
  return (
    <div className="flex flex-col gap-3 p-5 rounded-[var(--radius-lg)] border border-[var(--color-border)]"
      style={{ background: "var(--color-surface)" }}>
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-semibold uppercase tracking-[0.5px]"
          style={{ color: "var(--color-muted)" }}>{label}</span>
        <div className="w-9 h-9 rounded-[var(--radius-md)] flex items-center justify-center text-[18px]"
          style={{ background: iconBg, color: iconColor }}>
          <i className={`ti ${icon}`} />
        </div>
      </div>
      <div className="text-[28px] font-bold leading-none"
        style={{ fontFamily: "var(--font-display)", color: "var(--color-text)" }}>
        {value ?? "—"}
      </div>
      {sub && <p className="text-[12px]" style={{ color: "var(--color-muted)" }}>{sub}</p>}
    </div>
  );
}

function Skeleton({ className = "" }) {
  return <div className={`rounded-[var(--radius-md)] animate-pulse ${className}`}
    style={{ background: "var(--color-border)" }} />;
}

function scoreColor(s) {
  if (s >= 80) return "var(--color-primary)";
  if (s >= 60) return "var(--color-medium)";
  return "var(--color-hard)";
}

export default function TeacherDashboardPage() {
  const navigate = useNavigate();
  const fetcher  = useCallback(() => teacherAPI.getDashboard(), []);
  const { data, loading, error, refetch } = useApi(fetcher);

  const d = data?.data;
  const s = d?.stats || {};

  if (error) return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
      <i className="ti ti-wifi-off text-[40px]" style={{ color: "var(--color-border)" }} />
      <p className="text-[14px]" style={{ color: "var(--color-muted)" }}>{error}</p>
      <button onClick={refetch} className="px-5 py-2 rounded-[var(--radius-md)] text-white text-[13px] font-semibold cursor-pointer"
        style={{ background: "var(--color-primary)" }}>Retry</button>
    </div>
  );

  return (
    <div className="flex flex-col gap-6 max-w-[1100px]">

      {/* ── Stat cards ── */}
      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="p-5 rounded-[var(--radius-lg)] border border-[var(--color-border)]"
              style={{ background: "var(--color-surface)" }}>
              <Skeleton className="h-3 w-24 mb-4" /><Skeleton className="h-8 w-16 mb-2" /><Skeleton className="h-3 w-20" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Total Students"   value={s.totalStudents}    icon="ti-users"        iconBg="var(--color-primary-bg)" iconColor="var(--color-primary)" />
          <StatCard label="Total Attempts"   value={s.totalAttempts}    icon="ti-file-check"   iconBg="#E8F4FF"                 iconColor="#2563EB" />
          <StatCard label="Avg Score"        value={`${s.overallAvgScore}%`} icon="ti-chart-bar" iconBg="#FEF3C7"             iconColor="#D97706" sub={`${s.passRate}% pass rate`} />
          <StatCard label="Questions"        value={s.totalQuestions}   icon="ti-pencil"       iconBg="var(--color-accent-bg)" iconColor="var(--color-accent)"  sub={`${s.myQuestions} added by you`} />
        </div>
      )}

      {/* ── Middle row: Recent Activity + Subject Breakdown ── */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-5">

        {/* Recent Activity */}
        <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] p-6"
          style={{ background: "var(--color-surface)" }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[15px] font-bold"
              style={{ fontFamily: "var(--font-display)", color: "var(--color-text)" }}>
              Recent Student Activity
            </h2>
            <button onClick={() => navigate("/teacher/students")}
              className="text-[12px] font-semibold bg-transparent border-none cursor-pointer hover:underline"
              style={{ color: "var(--color-primary)" }}>
              All students →
            </button>
          </div>

          {loading ? (
            <div className="flex flex-col gap-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center gap-3 animate-pulse">
                  <Skeleton className="w-9 h-9 rounded-full flex-shrink-0" />
                  <div className="flex-1"><Skeleton className="h-3 w-40 mb-1" /><Skeleton className="h-2 w-24" /></div>
                  <Skeleton className="h-7 w-12 rounded-[var(--radius-md)]" />
                </div>
              ))}
            </div>
          ) : !d?.recentActivity?.length ? (
            <div className="flex flex-col items-center justify-center py-10 gap-2">
              <i className="ti ti-chart-off text-[32px]" style={{ color: "var(--color-border)" }} />
              <p className="text-[13px]" style={{ color: "var(--color-muted)" }}>No attempts yet</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {d.recentActivity.map((score) => {
                const mins = score.durationSecs ? Math.floor(score.durationSecs / 60) : null;
                const secs = score.durationSecs ? score.durationSecs % 60 : null;
                return (
                  <div key={score._id}
                    className="flex items-center gap-3 p-3 rounded-[var(--radius-md)] border border-[var(--color-border)] hover:border-[var(--color-primary-lt)] transition-colors cursor-pointer"
                    onClick={() => navigate(`/teacher/students/${score.student?._id}`)}>
                    {/* Avatar */}
                    <div className="w-9 h-9 rounded-full flex items-center justify-center text-[12px] font-bold flex-shrink-0"
                      style={{ background: "var(--color-primary-bg)", color: "var(--color-primary)", fontFamily: "var(--font-display)" }}>
                      {score.student?.name?.split(" ").map((w) => w[0]).slice(0,2).join("") || "?"}
                    </div>
                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-semibold truncate" style={{ color: "var(--color-text)" }}>
                        {score.student?.name || "Student"}
                      </p>
                      <p className="text-[11px]" style={{ color: "var(--color-muted)" }}>
                        {score.quiz?.title || SUBJECT_LABELS[score.quiz?.subject] || "Quiz"}
                        {mins !== null ? ` · ${mins}m ${secs}s` : ""}
                        {` · ${score.isPassed ? "✓ Passed" : "✗ Failed"}`}
                      </p>
                    </div>
                    {/* Score */}
                    <div className="px-3 py-1 rounded-[var(--radius-md)] text-[13px] font-bold flex-shrink-0"
                      style={{ background: score.scorePercent >= 60 ? "var(--color-primary-bg)" : "var(--color-accent-bg)",
                               color: scoreColor(score.scorePercent) }}>
                      {score.scorePercent}%
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-5">

          {/* Subject breakdown */}
          <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] p-5"
            style={{ background: "var(--color-surface)" }}>
            <h3 className="text-[15px] font-bold mb-4"
              style={{ fontFamily: "var(--font-display)", color: "var(--color-text)" }}>
              Attempts by Subject
            </h3>
            {loading ? (
              <div className="flex flex-col gap-3">{[...Array(4)].map((_, i) => <Skeleton key={i} className="h-8 w-full" />)}</div>
            ) : !d?.subjectBreakdown?.length ? (
              <p className="text-[13px]" style={{ color: "var(--color-muted)" }}>No data yet</p>
            ) : (
              <div className="flex flex-col gap-3">
                {d.subjectBreakdown.map(({ subject, attempts, avgScore }) => {
                  const maxAttempts = Math.max(...d.subjectBreakdown.map((s) => s.attempts));
                  return (
                    <div key={subject}>
                      <div className="flex items-center justify-between text-[12px] mb-1">
                        <div className="flex items-center gap-2">
                          <i className={`ti ${SUBJECT_ICONS[subject] || "ti-brain"} text-[14px]`}
                            style={{ color: "var(--color-primary)" }} />
                          <span style={{ color: "var(--color-text)" }}>
                            {SUBJECT_LABELS[subject] || subject}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span style={{ color: "var(--color-muted)" }}>{attempts} attempts</span>
                          <span className="font-semibold" style={{ color: scoreColor(avgScore) }}>
                            {avgScore}%
                          </span>
                        </div>
                      </div>
                      <div className="h-2 rounded-full overflow-hidden" style={{ background: "var(--color-bg)" }}>
                        <div className="h-full rounded-full transition-all duration-500"
                          style={{ width: `${Math.round((attempts / maxAttempts) * 100)}%`, background: "var(--color-primary)" }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Difficulty breakdown */}
          <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] p-5"
            style={{ background: "var(--color-surface)" }}>
            <h3 className="text-[15px] font-bold mb-4"
              style={{ fontFamily: "var(--font-display)", color: "var(--color-text)" }}>
              Question Bank
            </h3>
            {loading ? (
              <Skeleton className="h-24 w-full" />
            ) : (
              <div className="flex flex-col gap-3">
                {(d?.difficultyBreakdown || []).map(({ difficulty, count }) => {
                  const cfg = {
                    easy:   { color: "var(--color-easy)",   bg: "var(--color-primary-bg)" },
                    medium: { color: "#D97706",              bg: "#FEF3C7" },
                    hard:   { color: "var(--color-hard)",   bg: "var(--color-accent-bg)" },
                  }[difficulty] || { color: "var(--color-muted)", bg: "var(--color-bg)" };
                  return (
                    <div key={difficulty} className="flex items-center justify-between p-3 rounded-[var(--radius-md)]"
                      style={{ background: cfg.bg }}>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold uppercase tracking-[0.4px]" style={{ color: cfg.color }}>
                          {difficulty}
                        </span>
                      </div>
                      <span className="text-[18px] font-bold" style={{ fontFamily: "var(--font-display)", color: cfg.color }}>
                        {count}
                      </span>
                    </div>
                  );
                })}
                <button onClick={() => navigate("/teacher/questions")}
                  className="w-full py-2 rounded-[var(--radius-md)] border text-[13px] font-semibold cursor-pointer transition-all hover:bg-[var(--color-primary-bg)] mt-1"
                  style={{ borderColor: "var(--color-primary)", color: "var(--color-primary)", background: "transparent" }}>
                  + Add Question
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}