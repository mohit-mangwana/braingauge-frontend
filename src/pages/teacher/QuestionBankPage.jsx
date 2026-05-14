import { useState, useCallback } from "react";
import { useApi }      from "../../hooks/useApi";
import { teacherAPI }  from "../../api/services";
import { getErrorMessage } from "../../api/client";

const SUBJECTS = [
  { id: "algorithms",      label: "Algorithms"        },
  { id: "databases",       label: "Databases"         },
  { id: "os",              label: "Operating Systems" },
  { id: "networks",        label: "Computer Networks" },
  { id: "data_structures", label: "Data Structures"   },
  { id: "web",             label: "Web Technologies"  },
];
const DIFFICULTIES = ["easy", "medium", "hard"];

const DIFF_STYLE = {
  easy:   { bg: "var(--color-primary-bg)", color: "var(--color-easy)"   },
  medium: { bg: "#FEF3C7",                  color: "#D97706"             },
  hard:   { bg: "var(--color-accent-bg)",  color: "var(--color-hard)"   },
};

// ── Question Form modal ───────────────────────────────────────
function QuestionModal({ initial, onSave, onClose, saving, saveError }) {
  const [form, setForm] = useState(initial || {
    question: "", options: ["","","",""], answer: 0,
    explanation: "", subject: "algorithms", difficulty: "easy",
  });

  function setOpt(i, val) {
    setForm((p) => { const opts = [...p.options]; opts[i] = val; return { ...p, options: opts }; });
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[200] p-4 overflow-y-auto">
      <div className="w-full max-w-[560px] rounded-[var(--radius-xl)] border border-[var(--color-border)] my-4"
        style={{ background: "var(--color-surface)" }}>

        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--color-border)]">
          <h2 className="text-[17px] font-bold"
            style={{ fontFamily: "var(--font-display)", color: "var(--color-text)" }}>
            {initial ? "Edit Question" : "Add Question"}
          </h2>
          <button onClick={onClose} className="bg-transparent border-none cursor-pointer text-[20px]"
            style={{ color: "var(--color-muted)" }}>
            <i className="ti ti-x" />
          </button>
        </div>

        <div className="p-6 flex flex-col gap-4">
          {saveError && (
            <div className="flex items-center gap-2 p-3 rounded-[var(--radius-md)] text-[13px] font-medium"
              style={{ background: "var(--color-accent-bg)", color: "var(--color-accent)" }}>
              <i className="ti ti-alert-circle" /> {saveError}
            </div>
          )}

          {/* Subject + Difficulty */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[12px] font-semibold mb-1" style={{ color: "var(--color-muted)" }}>Subject</label>
              <select value={form.subject} onChange={(e) => setForm((p) => ({ ...p, subject: e.target.value }))}
                className="w-full px-3 py-2 rounded-[var(--radius-md)] border border-[var(--color-border)] text-[13px] outline-none focus:border-[var(--color-primary)]"
                style={{ background: "var(--color-bg)", color: "var(--color-text)" }}>
                {SUBJECTS.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[12px] font-semibold mb-1" style={{ color: "var(--color-muted)" }}>Difficulty</label>
              <select value={form.difficulty} onChange={(e) => setForm((p) => ({ ...p, difficulty: e.target.value }))}
                className="w-full px-3 py-2 rounded-[var(--radius-md)] border border-[var(--color-border)] text-[13px] outline-none focus:border-[var(--color-primary)]"
                style={{ background: "var(--color-bg)", color: "var(--color-text)" }}>
                {DIFFICULTIES.map((d) => <option key={d} value={d}>{d.charAt(0).toUpperCase() + d.slice(1)}</option>)}
              </select>
            </div>
          </div>

          {/* Question text */}
          <div>
            <label className="block text-[12px] font-semibold mb-1" style={{ color: "var(--color-muted)" }}>Question *</label>
            <textarea rows={3} value={form.question}
              onChange={(e) => setForm((p) => ({ ...p, question: e.target.value }))}
              placeholder="Enter your question here…"
              className="w-full px-3 py-2 rounded-[var(--radius-md)] border border-[var(--color-border)] text-[14px] outline-none resize-none focus:border-[var(--color-primary)]"
              style={{ background: "var(--color-bg)", color: "var(--color-text)" }} />
          </div>

          {/* Options A–D */}
          <div>
            <label className="block text-[12px] font-semibold mb-2" style={{ color: "var(--color-muted)" }}>
              Options (select the correct one)
            </label>
            <div className="flex flex-col gap-2">
              {form.options.map((opt, i) => (
                <div key={i} className="flex items-center gap-2">
                  <button
                    onClick={() => setForm((p) => ({ ...p, answer: i }))}
                    className="w-7 h-7 rounded-full flex items-center justify-center text-[12px] font-bold flex-shrink-0 cursor-pointer border-none transition-all"
                    style={{
                      background: form.answer === i ? "var(--color-primary)" : "var(--color-border)",
                      color:      form.answer === i ? "#fff"                  : "var(--color-muted)",
                    }}
                    title="Mark as correct answer">
                    {["A","B","C","D"][i]}
                  </button>
                  <input value={opt} onChange={(e) => setOpt(i, e.target.value)}
                    placeholder={`Option ${["A","B","C","D"][i]}`}
                    className="flex-1 px-3 py-2 rounded-[var(--radius-md)] border text-[13px] outline-none focus:border-[var(--color-primary)] transition-colors"
                    style={{
                      background:  "var(--color-bg)",
                      color:       "var(--color-text)",
                      borderColor: form.answer === i ? "var(--color-primary)" : "var(--color-border)",
                    }} />
                  {form.answer === i && (
                    <i className="ti ti-check text-[16px] flex-shrink-0" style={{ color: "var(--color-primary)" }} />
                  )}
                </div>
              ))}
            </div>
            <p className="text-[11px] mt-1" style={{ color: "var(--color-muted)" }}>
              Click a letter to mark it as the correct answer
            </p>
          </div>

          {/* Explanation */}
          <div>
            <label className="block text-[12px] font-semibold mb-1" style={{ color: "var(--color-muted)" }}>
              Explanation (shown after answer)
            </label>
            <textarea rows={2} value={form.explanation}
              onChange={(e) => setForm((p) => ({ ...p, explanation: e.target.value }))}
              placeholder="Why is this the correct answer?"
              className="w-full px-3 py-2 rounded-[var(--radius-md)] border border-[var(--color-border)] text-[13px] outline-none resize-none focus:border-[var(--color-primary)]"
              style={{ background: "var(--color-bg)", color: "var(--color-text)" }} />
          </div>
        </div>

        <div className="flex gap-3 px-6 py-4 border-t border-[var(--color-border)]">
          <button onClick={onClose}
            className="flex-1 py-2 rounded-[var(--radius-md)] border border-[var(--color-border)] text-[14px] font-semibold cursor-pointer hover:bg-[var(--color-bg)]"
            style={{ background: "transparent", color: "var(--color-muted)" }}>
            Cancel
          </button>
          <button onClick={() => onSave(form)} disabled={saving}
            className="flex-1 py-2 rounded-[var(--radius-md)] text-white text-[14px] font-semibold cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2 border-none"
            style={{ background: "var(--color-primary)" }}>
            {saving
              ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Saving…</>
              : <><i className="ti ti-check" />{initial ? "Update" : "Add Question"}</>}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────
export default function QuestionBankPage() {
  const [filters,   setFilters]   = useState({ subject: "", difficulty: "", search: "", page: 1 });
  const [modal,     setModal]     = useState(null);   // null | { mode: "add"|"edit", data?: q }
  const [saving,    setSaving]    = useState(false);
  const [saveError, setSaveError] = useState("");
  const [deleteId,  setDeleteId]  = useState(null);
  const [toast,     setToast]     = useState("");

  const fetcher = useCallback(
    () => teacherAPI.listQuestions({ ...filters }),
    [filters]
  );
  const { data, loading, refetch } = useApi(fetcher, { deps: [filters] });

  const questions  = data?.questions  || [];
  const pagination = data?.pagination || {};

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  }

  async function handleSave(form) {
    setSaving(true);
    setSaveError("");
    try {
      if (modal.mode === "edit") {
        await teacherAPI.editQuestion(modal.data._id, form);
        showToast("Question updated ✓");
      } else {
        await teacherAPI.addQuestion(form);
        showToast("Question added ✓");
      }
      setModal(null);
      refetch();
    } catch (err) {
      setSaveError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    try {
      await teacherAPI.deleteQuestion(id);
      setDeleteId(null);
      showToast("Question deleted");
      refetch();
    } catch (err) {
      showToast(getErrorMessage(err));
    }
  }

  function setFilter(key, val) {
    setFilters((p) => ({ ...p, [key]: val, page: 1 }));
  }

  return (
    <div className="flex flex-col gap-5 max-w-[1000px]">

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-[22px] font-bold"
            style={{ fontFamily: "var(--font-display)", color: "var(--color-text)" }}>
            Question Bank
          </h1>
          <p className="text-[13px] mt-1" style={{ color: "var(--color-muted)" }}>
            {loading ? "Loading…" : `${pagination.total ?? 0} questions total`}
          </p>
        </div>
        <button onClick={() => { setSaveError(""); setModal({ mode: "add" }); }}
          className="flex items-center gap-2 px-4 py-2 rounded-[var(--radius-md)] text-white text-[13px] font-semibold cursor-pointer hover:opacity-90 border-none"
          style={{ background: "var(--color-primary)" }}>
          <i className="ti ti-plus" /> Add Question
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 p-4 rounded-[var(--radius-lg)] border border-[var(--color-border)]"
        style={{ background: "var(--color-surface)" }}>
        <div className="relative flex-1 min-w-[180px]">
          <i className="ti ti-search absolute left-3 top-1/2 -translate-y-1/2 text-[15px]"
            style={{ color: "var(--color-muted)" }} />
          <input placeholder="Search questions…" value={filters.search}
            onChange={(e) => setFilter("search", e.target.value)}
            className="w-full pl-8 pr-3 py-2 rounded-[var(--radius-md)] border border-[var(--color-border)] text-[13px] outline-none focus:border-[var(--color-primary)]"
            style={{ background: "var(--color-bg)", color: "var(--color-text)" }} />
        </div>
        <select value={filters.subject} onChange={(e) => setFilter("subject", e.target.value)}
          className="px-3 py-2 rounded-[var(--radius-md)] border border-[var(--color-border)] text-[13px] outline-none cursor-pointer"
          style={{ background: "var(--color-bg)", color: "var(--color-text)" }}>
          <option value="">All Subjects</option>
          {SUBJECTS.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
        </select>
        <select value={filters.difficulty} onChange={(e) => setFilter("difficulty", e.target.value)}
          className="px-3 py-2 rounded-[var(--radius-md)] border border-[var(--color-border)] text-[13px] outline-none cursor-pointer"
          style={{ background: "var(--color-bg)", color: "var(--color-text)" }}>
          <option value="">All Difficulties</option>
          {DIFFICULTIES.map((d) => <option key={d} value={d}>{d.charAt(0).toUpperCase() + d.slice(1)}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] overflow-hidden"
        style={{ background: "var(--color-surface)" }}>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr style={{ background: "var(--color-bg)", borderBottom: "1px solid var(--color-border)" }}>
              {["Question","Subject","Difficulty","Usage","Actions"].map((h) => (
                <th key={h} className="px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.5px]"
                  style={{ color: "var(--color-muted)" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              [...Array(6)].map((_, i) => (
                <tr key={i} className="border-b border-[var(--color-border)]">
                  {[...Array(5)].map((__, j) => (
                    <td key={j} className="px-4 py-3">
                      <div className="h-3 rounded animate-pulse" style={{ background: "var(--color-border)", width: j === 0 ? "80%" : "60%" }} />
                    </td>
                  ))}
                </tr>
              ))
            ) : questions.length === 0 ? (
              <tr><td colSpan={5} className="px-4 py-12 text-center">
                <i className="ti ti-database-off text-[32px] block mb-2" style={{ color: "var(--color-border)" }} />
                <p className="text-[13px]" style={{ color: "var(--color-muted)" }}>No questions found</p>
              </td></tr>
            ) : (
              questions.map((q) => {
                const diff = DIFF_STYLE[q.difficulty] || {};
                const correctRate = q.timesUsed
                  ? Math.round((q.timesCorrect / q.timesUsed) * 100) : null;
                return (
                  <tr key={q._id} className="border-b border-[var(--color-border)] hover:bg-[var(--color-bg)] transition-colors">
                    <td className="px-4 py-3 max-w-[320px]">
                      <p className="text-[13px] font-medium line-clamp-2" style={{ color: "var(--color-text)" }}>
                        {q.question}
                      </p>
                      {q.isStatic && (
                        <span className="text-[10px] font-semibold" style={{ color: "var(--color-muted)" }}>
                          Seeded
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-[12px]" style={{ color: "var(--color-muted)" }}>
                      {SUBJECTS.find((s) => s.id === q.subject)?.label || q.subject}
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-[11px] font-semibold uppercase px-2 py-0.5 rounded-full"
                        style={{ background: diff.bg, color: diff.color }}>
                        {q.difficulty}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[12px]" style={{ color: "var(--color-muted)" }}>
                      {q.timesUsed > 0
                        ? <span>{q.timesUsed}× · <span style={{ color: correctRate >= 60 ? "var(--color-primary)" : "var(--color-accent)" }}>{correctRate}%</span></span>
                        : <span>Unused</span>}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button onClick={() => { setSaveError(""); setModal({ mode: "edit", data: q }); }}
                          className="w-7 h-7 rounded-[var(--radius-sm)] flex items-center justify-center text-[14px] cursor-pointer border-none hover:bg-[var(--color-primary-bg)] transition-colors"
                          style={{ background: "transparent", color: "var(--color-primary)" }}
                          title="Edit">
                          <i className="ti ti-pencil" />
                        </button>
                        {!q.isStatic && (
                          <button onClick={() => setDeleteId(q._id)}
                            className="w-7 h-7 rounded-[var(--radius-sm)] flex items-center justify-center text-[14px] cursor-pointer border-none hover:bg-[var(--color-accent-bg)] transition-colors"
                            style={{ background: "transparent", color: "var(--color-accent)" }}
                            title="Delete">
                            <i className="ti ti-trash" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-[var(--color-border)]">
            <button onClick={() => setFilter("page", Math.max(filters.page - 1, 1))}
              disabled={filters.page === 1}
              className="flex items-center gap-1 px-3 py-1.5 rounded-[var(--radius-md)] border border-[var(--color-border)] text-[12px] font-semibold cursor-pointer disabled:opacity-40"
              style={{ background: "transparent", color: "var(--color-muted)" }}>
              <i className="ti ti-chevron-left" /> Prev
            </button>
            <span className="text-[12px]" style={{ color: "var(--color-muted)" }}>
              Page {filters.page} of {pagination.pages}
            </span>
            <button onClick={() => setFilter("page", Math.min(filters.page + 1, pagination.pages))}
              disabled={filters.page === pagination.pages}
              className="flex items-center gap-1 px-3 py-1.5 rounded-[var(--radius-md)] border border-[var(--color-border)] text-[12px] font-semibold cursor-pointer disabled:opacity-40"
              style={{ background: "transparent", color: "var(--color-muted)" }}>
              Next <i className="ti ti-chevron-right" />
            </button>
          </div>
        )}
      </div>

      {/* Add / Edit modal */}
      {modal && (
        <QuestionModal
          initial={modal.data}
          onSave={handleSave}
          onClose={() => setModal(null)}
          saving={saving}
          saveError={saveError}
        />
      )}

      {/* Delete confirm */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[200] p-4">
          <div className="rounded-[var(--radius-xl)] p-6 max-w-[340px] w-full border border-[var(--color-border)]"
            style={{ background: "var(--color-surface)" }}>
            <h3 className="text-[17px] font-bold mb-2"
              style={{ fontFamily: "var(--font-display)", color: "var(--color-text)" }}>
              Delete Question?
            </h3>
            <p className="text-[13px] mb-5" style={{ color: "var(--color-muted)" }}>
              This question will be permanently removed from the bank.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)}
                className="flex-1 py-2 rounded-[var(--radius-md)] border border-[var(--color-border)] text-[13px] font-semibold cursor-pointer hover:bg-[var(--color-bg)]"
                style={{ background: "transparent", color: "var(--color-muted)" }}>
                Cancel
              </button>
              <button onClick={() => handleDelete(deleteId)}
                className="flex-1 py-2 rounded-[var(--radius-md)] text-white text-[13px] font-semibold cursor-pointer border-none"
                style={{ background: "var(--color-accent)" }}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 flex items-center gap-2 px-4 py-3 rounded-[var(--radius-lg)] text-white text-[13px] font-semibold shadow-lg z-[300]"
          style={{ background: "var(--color-primary)" }}>
          <i className="ti ti-check" /> {toast}
        </div>
      )}
    </div>
  );
}