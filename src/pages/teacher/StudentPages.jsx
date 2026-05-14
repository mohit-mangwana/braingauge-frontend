import { useState, useCallback } from "react";
import { useApi }      from "../../hooks/useApi";
import { teacherAPI }  from "../../api/services";

const DIFF_COLOR = {
  easy:   "var(--color-easy)",
  medium: "#D97706",
  hard:   "var(--color-hard)",
};

const SUBJECT_LABELS = {
  algorithms: "Algorithms", databases: "Databases", os: "OS",
  networks: "Networks", data_structures: "Data Structures", web: "Web",
};

function scoreColor(s) {
  if (s >= 80) return "var(--color-primary)";
  if (s >= 60) return "var(--color-medium)";
  return "var(--color-hard)";
}


function StudentDetail({ studentId, onClose }) {
  const fetcher = useCallback(() => teacherAPI.getStudentDetail(studentId), [studentId]);
  const { data, loading } = useApi(fetcher);
  const d = data?.data;

  return (
    <div className="fixed inset-0 bg-black/40 z-[150] flex justify-end" onClick={onClose}>
      <div className="w-full max-w-[480px] h-full overflow-y-auto border-l border-[var(--color-border)] flex flex-col"
        style={{ background: "var(--color-surface)" }}
        onClick={(e) => e.stopPropagation()}>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--color-border)] sticky top-0 z-10"
          style={{ background: "var(--color-surface)" }}>
          <h2 className="text-[17px] font-bold"
            style={{ fontFamily: "var(--font-display)", color: "var(--color-text)" }}>
            Student Detail
          </h2>
          <button onClick={onClose}
            className="w-8 h-8 rounded-[var(--radius-md)] flex items-center justify-center bg-transparent border-none cursor-pointer hover:bg-[var(--color-bg)]"
            style={{ color: "var(--color-muted)", fontSize: 18 }}>
            <i className="ti ti-x" />
          </button>
        </div>

        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-[var(--color-border)] border-t-[var(--color-primary)] rounded-full animate-spin" />
          </div>
        ) : !d ? (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-[13px]" style={{ color: "var(--color-muted)" }}>Student not found</p>
          </div>
        ) : (
          <div className="flex-1 p-6 flex flex-col gap-5">
            {/* Profile */}
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full flex items-center justify-center text-[20px] font-bold"
                style={{ background: "var(--color-primary-bg)", color: "var(--color-primary)", fontFamily: "var(--font-display)" }}>
                {d.student.name?.split(" ").map((w) => w[0]).slice(0,2).join("") || "?"}
              </div>
              <div>
                <p className="text-[16px] font-bold" style={{ color: "var(--color-text)" }}>{d.student.name}</p>
                <p className="text-[12px]" style={{ color: "var(--color-muted)" }}>{d.student.email}</p>
                <p className="text-[12px] mt-0.5" style={{ color: "var(--color-muted)" }}>
                  {d.student.course} · {d.student.institution}
                </p>
              </div>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "Avg Score",  value: `${d.student.averageScore ?? 0}%`,     color: "var(--color-primary)" },
                { label: "Quizzes",    value: d.student.totalQuizzesTaken ?? 0,      color: "#2563EB" },
                { label: "Streak",     value: `${d.student.currentStreak ?? 0}🔥`,   color: "#D97706" },
              ].map(({ label, value, color }) => (
                <div key={label} className="p-3 rounded-[var(--radius-md)] text-center border border-[var(--color-border)]">
                  <p className="text-[18px] font-bold" style={{ fontFamily: "var(--font-display)", color }}>{value}</p>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.4px]" style={{ color: "var(--color-muted)" }}>{label}</p>
                </div>
              ))}
            </div>

            {/* Adaptive difficulty */}
            <div className="flex items-center gap-3 p-3 rounded-[var(--radius-md)] border border-[var(--color-border)]">
              <i className="ti ti-adjustments-horizontal text-[20px]" style={{ color: "var(--color-primary)" }} />
              <div>
                <p className="text-[12px] font-semibold" style={{ color: "var(--color-text)" }}>Current Difficulty</p>
                <p className="text-[13px] font-bold capitalize" style={{ color: DIFF_COLOR[d.student.currentDifficulty] || "var(--color-muted)" }}>
                  {d.student.currentDifficulty || "easy"}
                </p>
              </div>
            </div>

            {/* Subject progress */}
            {d.student.subjectProgress?.length > 0 && (
              <div>
                <p className="text-[13px] font-semibold mb-3" style={{ color: "var(--color-text)" }}>Subject Progress</p>
                <div className="flex flex-col gap-2">
                  {d.student.subjectProgress.map((sp) => (
                    <div key={sp.subjectId}>
                      <div className="flex justify-between text-[12px] mb-1">
                        <span style={{ color: "var(--color-muted)" }}>{SUBJECT_LABELS[sp.subjectId] || sp.subjectId}</span>
                        <span className="font-semibold" style={{ color: scoreColor(sp.avgScore) }}>{sp.avgScore}%</span>
                      </div>
                      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "var(--color-bg)" }}>
                        <div className="h-full rounded-full" style={{ width: `${sp.avgScore}%`, background: "var(--color-primary)" }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recent attempts */}
            <div>
              <p className="text-[13px] font-semibold mb-3" style={{ color: "var(--color-text)" }}>
                Recent Attempts ({d.scores.length})
              </p>
              {d.scores.length === 0 ? (
                <p className="text-[13px]" style={{ color: "var(--color-muted)" }}>No attempts yet</p>
              ) : (
                <div className="flex flex-col gap-2">
                  {d.scores.map((sc) => {
                    const mins = sc.durationSecs ? Math.floor(sc.durationSecs / 60) : null;
                    const secs = sc.durationSecs ? sc.durationSecs % 60 : null;
                    return (
                      <div key={sc._id} className="flex items-center justify-between p-3 rounded-[var(--radius-md)] border border-[var(--color-border)]">
                        <div className="min-w-0 flex-1">
                          <p className="text-[12px] font-semibold truncate" style={{ color: "var(--color-text)" }}>
                            {sc.quiz?.title || SUBJECT_LABELS[sc.quiz?.subject] || "Quiz"}
                          </p>
                          <p className="text-[11px]" style={{ color: "var(--color-muted)" }}>
                            {sc.correctCount}/{sc.totalQuestions} correct
                            {mins !== null ? ` · ${mins}m ${secs}s` : ""}
                            {` · ${new Date(sc.createdAt).toLocaleDateString("en-IN")}`}
                          </p>
                        </div>
                        <div className="flex-shrink-0 ml-3 px-2 py-1 rounded-[var(--radius-sm)] text-[13px] font-bold"
                          style={{ background: sc.scorePercent >= 60 ? "var(--color-primary-bg)" : "var(--color-accent-bg)",
                                   color: scoreColor(sc.scorePercent) }}>
                          {sc.scorePercent}%
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Main students list ────────────────────────────────────────
export default function StudentsPage() {
  const [search,     setSearch]     = useState("");
  const [page,       setPage]       = useState(1);
  const [detailId,   setDetailId]   = useState(null);

  const fetcher = useCallback(
    () => teacherAPI.getStudents({ search, page, limit: 20 }),
    [search, page]
  );
  const { data, loading, error, refetch } = useApi(fetcher, { deps: [search, page] });

  const students   = data?.students   || [];
  const pagination = data?.pagination || {};

  return (
    <div className="flex flex-col gap-5 max-w-[1000px]">

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-[22px] font-bold"
            style={{ fontFamily: "var(--font-display)", color: "var(--color-text)" }}>
            Students
          </h1>
          <p className="text-[13px] mt-1" style={{ color: "var(--color-muted)" }}>
            {loading ? "Loading…" : `${pagination.total ?? 0} registered students`}
          </p>
        </div>

        {/* Search */}
        <div className="relative">
          <i className="ti ti-search absolute left-3 top-1/2 -translate-y-1/2 text-[15px]"
            style={{ color: "var(--color-muted)" }} />
          <input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search by name or email…"
            className="pl-9 pr-4 py-2 rounded-[var(--radius-md)] border border-[var(--color-border)] text-[13px] outline-none focus:border-[var(--color-primary)] w-[240px]"
            style={{ background: "var(--color-bg)", color: "var(--color-text)" }} />
        </div>
      </div>

      {/* Table */}
      <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] overflow-hidden"
        style={{ background: "var(--color-surface)" }}>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr style={{ background: "var(--color-bg)", borderBottom: "1px solid var(--color-border)" }}>
              {["Student","Avg Score","Quizzes","Streak","Difficulty","Last Active"].map((h) => (
                <th key={h} className="px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.5px]"
                  style={{ color: "var(--color-muted)" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              [...Array(8)].map((_, i) => (
                <tr key={i} className="border-b border-[var(--color-border)]">
                  {[...Array(6)].map((__, j) => (
                    <td key={j} className="px-4 py-3">
                      <div className="h-3 rounded animate-pulse" style={{ background: "var(--color-border)", width: j === 0 ? "80%" : "50%" }} />
                    </td>
                  ))}
                </tr>
              ))
            ) : error ? (
              <tr><td colSpan={6} className="px-4 py-10 text-center">
                <p className="text-[13px]" style={{ color: "var(--color-muted)" }}>{error}</p>
                <button onClick={refetch} className="mt-2 text-[12px] font-semibold"
                  style={{ color: "var(--color-primary)" }}>Retry</button>
              </td></tr>
            ) : students.length === 0 ? (
              <tr><td colSpan={6} className="px-4 py-12 text-center">
                <i className="ti ti-users-off text-[32px] block mb-2" style={{ color: "var(--color-border)" }} />
                <p className="text-[13px]" style={{ color: "var(--color-muted)" }}>No students found</p>
              </td></tr>
            ) : (
              students.map((st) => {
                const lastActive = st.lastActiveDate
                  ? new Date(st.lastActiveDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" })
                  : "Never";
                return (
                  <tr key={st._id}
                    className="border-b border-[var(--color-border)] hover:bg-[var(--color-bg)] transition-colors cursor-pointer"
                    onClick={() => setDetailId(st._id)}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0"
                          style={{ background: "var(--color-primary-bg)", color: "var(--color-primary)", fontFamily: "var(--font-display)" }}>
                          {st.name?.split(" ").map((w) => w[0]).slice(0,2).join("") || "?"}
                        </div>
                        <div className="min-w-0">
                          <p className="text-[13px] font-semibold truncate" style={{ color: "var(--color-text)" }}>{st.name}</p>
                          <p className="text-[11px] truncate" style={{ color: "var(--color-muted)" }}>{st.course || "Student"}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-[14px] font-bold" style={{ fontFamily: "var(--font-display)", color: scoreColor(st.averageScore || 0) }}>
                        {st.averageScore ?? 0}%
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[13px]" style={{ color: "var(--color-text)" }}>
                      {st.totalQuizzesTaken ?? 0}
                    </td>
                    <td className="px-4 py-3 text-[13px]" style={{ color: "var(--color-text)" }}>
                      {st.currentStreak ?? 0} 🔥
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-[11px] font-semibold capitalize px-2 py-0.5 rounded-full"
                        style={{ background: "var(--color-bg)", color: DIFF_COLOR[st.currentDifficulty] || "var(--color-muted)" }}>
                        {st.currentDifficulty || "easy"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[12px]" style={{ color: "var(--color-muted)" }}>
                      {lastActive}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>

        {pagination.pages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-[var(--color-border)]">
            <button onClick={() => setPage((p) => Math.max(p - 1, 1))} disabled={page === 1}
              className="flex items-center gap-1 px-3 py-1.5 rounded-[var(--radius-md)] border border-[var(--color-border)] text-[12px] font-semibold cursor-pointer disabled:opacity-40"
              style={{ background: "transparent", color: "var(--color-muted)" }}>
              <i className="ti ti-chevron-left" /> Prev
            </button>
            <span className="text-[12px]" style={{ color: "var(--color-muted)" }}>
              Page {page} of {pagination.pages}
            </span>
            <button onClick={() => setPage((p) => Math.min(p + 1, pagination.pages))}
              disabled={page === pagination.pages}
              className="flex items-center gap-1 px-3 py-1.5 rounded-[var(--radius-md)] border border-[var(--color-border)] text-[12px] font-semibold cursor-pointer disabled:opacity-40"
              style={{ background: "transparent", color: "var(--color-muted)" }}>
              Next <i className="ti ti-chevron-right" />
            </button>
          </div>
        )}
      </div>

      {/* Student detail drawer */}
      {detailId && (
        <StudentDetail studentId={detailId} onClose={() => setDetailId(null)} />
      )}
    </div>
  );
}