// ─────────────────────────────────────────────────────────────
//  BrainGauge · pages/QuizHistoryPage.jsx
//  Shows all past quiz attempts with scores, subjects, timing.
// ─────────────────────────────────────────────────────────────
import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useApi } from "../hooks/useApi";
import { quizAPI } from "../api/services";

const SUBJECT_ICONS = {
  algorithms:      "ti-math",
  databases:       "ti-database",
  os:              "ti-cpu",
  networks:        "ti-network",
  data_structures: "ti-code",
  web:             "ti-world",
};

const SUBJECT_LABELS = {
  algorithms:      "Algorithms",
  databases:       "Databases",
  os:              "Operating Systems",
  networks:        "Computer Networks",
  data_structures: "Data Structures",
  web:             "Web Technologies",
};

function scoreColor(s) {
  if (s >= 80) return "var(--color-primary)";
  if (s >= 60) return "var(--color-medium)";
  return "var(--color-hard)";
}

function scoreBg(s) {
  if (s >= 80) return "var(--color-primary-bg)";
  if (s >= 60) return "#FEF3C7";
  return "var(--color-accent-bg)";
}

function DiffBadge({ d }) {
  const cfg = {
    easy:   { bg: "var(--color-primary-bg)", color: "var(--color-easy)" },
    medium: { bg: "#FEF3C7",                 color: "#D97706" },
    hard:   { bg: "var(--color-accent-bg)",  color: "var(--color-hard)" },
    mixed:  { bg: "var(--color-bg)",          color: "var(--color-muted)" },
  }[d] || { bg: "var(--color-bg)", color: "var(--color-muted)" };
  return (
    <span className="text-[10px] font-semibold uppercase tracking-[0.4px] px-2 py-0.5 rounded-full"
      style={{ background: cfg.bg, color: cfg.color }}>
      {d}
    </span>
  );
}

function SkeletonRow() {
  return (
    <div className="flex items-center gap-4 p-4 rounded-[var(--radius-lg)] border border-[var(--color-border)] animate-pulse"
      style={{ background: "var(--color-surface)" }}>
      <div className="w-10 h-10 rounded-[var(--radius-md)]" style={{ background: "var(--color-border)" }} />
      <div className="flex-1">
        <div className="h-3 rounded w-48 mb-2" style={{ background: "var(--color-border)" }} />
        <div className="h-2 rounded w-32" style={{ background: "var(--color-border)" }} />
      </div>
      <div className="h-8 w-14 rounded-[var(--radius-md)]" style={{ background: "var(--color-border)" }} />
    </div>
  );
}

export default function QuizHistoryPage() {
  const navigate  = useNavigate();
  const [page, setPage]         = useState(1);
  const [filter, setFilter]     = useState("all"); // all | passed | failed

  const fetcher = useCallback(
    () => quizAPI.history({ page, limit: 15 }),
    [page]
  );
  const { data, loading, error, refetch } = useApi(fetcher, { deps: [page] });

  const scores     = data?.scores || [];
  const pagination = data?.pagination || {};

  const filtered = scores.filter((s) => {
    if (filter === "passed") return s.isPassed;
    if (filter === "failed") return !s.isPassed;
    return true;
  });

  // Summary stats from loaded data
  const totalLoaded = scores.length;
  const passedCount = scores.filter((s) => s.isPassed).length;
  const avgScore    = totalLoaded
    ? Math.round(scores.reduce((sum, s) => sum + s.scorePercent, 0) / totalLoaded)
    : 0;

  return (
    <div className="flex flex-col gap-6 max-w-[860px]">

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-[22px] font-bold"
            style={{ fontFamily: "var(--font-display)", color: "var(--color-text)" }}>
            Quiz History
          </h1>
          <p className="text-[13px] mt-1" style={{ color: "var(--color-muted)" }}>
            {loading ? "Loading…" : `${pagination.total ?? 0} total attempts`}
          </p>
        </div>
        <button onClick={() => navigate("/quiz")}
          className="flex items-center gap-2 px-4 py-2 rounded-[var(--radius-md)] text-white text-[13px] font-semibold cursor-pointer hover:opacity-90 border-none"
          style={{ background: "var(--color-primary)" }}>
          <i className="ti ti-plus" /> New Quiz
        </button>
      </div>

      {/* Summary cards */}
      {!loading && totalLoaded > 0 && (
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Attempts",  value: pagination.total ?? totalLoaded, icon: "ti-file-check",  color: "var(--color-primary)" },
            { label: "Passed",    value: passedCount,  icon: "ti-circle-check",   color: "var(--color-correct)" },
            { label: "Avg Score", value: `${avgScore}%`, icon: "ti-chart-bar",    color: "#2563EB" },
          ].map(({ label, value, icon, color }) => (
            <div key={label} className="p-4 rounded-[var(--radius-lg)] border border-[var(--color-border)] text-center"
              style={{ background: "var(--color-surface)" }}>
              <i className={`ti ${icon} text-[22px] block mb-1`} style={{ color }} />
              <p className="text-[20px] font-bold"
                style={{ fontFamily: "var(--font-display)", color: "var(--color-text)" }}>
                {value}
              </p>
              <p className="text-[11px] font-semibold uppercase tracking-[0.4px]"
                style={{ color: "var(--color-muted)" }}>{label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Filter tabs */}
      <div className="flex gap-2 p-1 rounded-[var(--radius-md)]" style={{ background: "var(--color-bg)" }}>
        {["all","passed","failed"].map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className="flex-1 py-2 rounded-[var(--radius-sm)] text-[13px] font-semibold capitalize cursor-pointer transition-all border-none"
            style={{
              background: filter === f ? "var(--color-surface)" : "transparent",
              color:      filter === f ? "var(--color-primary)" : "var(--color-muted)",
              boxShadow:  filter === f ? "0 1px 4px rgba(0,0,0,0.08)" : "none",
            }}>
            {f === "all" ? "All" : f === "passed" ? "✓ Passed" : "✗ Failed"}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="flex flex-col gap-3">
        {loading ? (
          [...Array(6)].map((_, i) => <SkeletonRow key={i} />)
        ) : error ? (
          <div className="text-center py-16">
            <i className="ti ti-wifi-off text-[36px]" style={{ color: "var(--color-border)" }} />
            <p className="mt-3 text-[14px]" style={{ color: "var(--color-muted)" }}>{error}</p>
            <button onClick={refetch} className="mt-2 text-[13px] font-semibold"
              style={{ color: "var(--color-primary)" }}>Retry</button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <i className="ti ti-history text-[40px]" style={{ color: "var(--color-border)" }} />
            <p className="text-[14px]" style={{ color: "var(--color-muted)" }}>
              {filter === "all" ? "No attempts yet. Start your first quiz!" : `No ${filter} quizzes found`}
            </p>
            {filter === "all" && (
              <button onClick={() => navigate("/quiz")}
                className="px-5 py-2 rounded-[var(--radius-md)] text-white text-[13px] font-semibold cursor-pointer"
                style={{ background: "var(--color-primary)" }}>
                Take a Quiz
              </button>
            )}
          </div>
        ) : (
          filtered.map((score) => {
            const subj    = score.quiz?.subject || "";
            const mins    = score.durationSecs ? Math.floor(score.durationSecs / 60) : null;
            const secs    = score.durationSecs ? score.durationSecs % 60 : null;
            const dateStr = new Date(score.createdAt).toLocaleDateString("en-IN", {
              day: "numeric", month: "short", year: "numeric",
            });
            return (
              <div key={score._id}
                className="flex items-center gap-4 p-4 rounded-[var(--radius-lg)] border border-[var(--color-border)] transition-all cursor-default hover:border-[var(--color-primary-lt)] hover:shadow-sm"
                style={{ background: "var(--color-surface)" }}>

                {/* Subject icon */}
                <div className="w-10 h-10 rounded-[var(--radius-md)] flex items-center justify-center text-[20px] flex-shrink-0"
                  style={{ background: "var(--color-primary-bg)", color: "var(--color-primary)" }}>
                  <i className={`ti ${SUBJECT_ICONS[subj] || "ti-brain"}`} />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-[14px] font-semibold truncate"
                      style={{ color: "var(--color-text)" }}>
                      {score.quiz?.title || SUBJECT_LABELS[subj] || "Quiz"}
                    </p>
                    <DiffBadge d={score.difficultyAttempted || score.quiz?.difficulty} />
                    {score.isPassed
                      ? <span className="text-[10px] font-bold text-[#10B981]">PASSED</span>
                      : <span className="text-[10px] font-bold" style={{ color: "var(--color-accent)" }}>FAILED</span>
                    }
                  </div>
                  <p className="text-[12px] mt-0.5" style={{ color: "var(--color-muted)" }}>
                    {score.correctCount}/{score.totalQuestions} correct
                    {mins !== null ? ` · ${mins}m ${secs}s` : ""}
                    {` · ${dateStr}`}
                  </p>
                </div>

                {/* Score badge */}
                <div className="flex-shrink-0 w-14 h-14 rounded-[var(--radius-md)] flex items-center justify-center flex-col"
                  style={{ background: scoreBg(score.scorePercent) }}>
                  <span className="text-[18px] font-bold leading-none"
                    style={{ fontFamily: "var(--font-display)", color: scoreColor(score.scorePercent) }}>
                    {score.scorePercent}%
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex items-center justify-between pt-2">
          <button onClick={() => setPage((p) => Math.max(p - 1, 1))} disabled={page === 1}
            className="flex items-center gap-1 px-4 py-2 rounded-[var(--radius-md)] border border-[var(--color-border)] text-[13px] font-semibold cursor-pointer disabled:opacity-40 hover:bg-[var(--color-bg)]"
            style={{ background: "transparent", color: "var(--color-muted)" }}>
            <i className="ti ti-chevron-left" /> Previous
          </button>
          <span className="text-[13px]" style={{ color: "var(--color-muted)" }}>
            Page {page} of {pagination.pages}
          </span>
          <button onClick={() => setPage((p) => Math.min(p + 1, pagination.pages))}
            disabled={page === pagination.pages}
            className="flex items-center gap-1 px-4 py-2 rounded-[var(--radius-md)] border border-[var(--color-border)] text-[13px] font-semibold cursor-pointer disabled:opacity-40 hover:bg-[var(--color-bg)]"
            style={{ background: "transparent", color: "var(--color-muted)" }}>
            Next <i className="ti ti-chevron-right" />
          </button>
        </div>
      )}
    </div>
  );
}