import { useState, useCallback } from "react";
import { useAuth }      from "../../context/AuthContext";
import { authAPI, teacherAPI } from "../../api/services";
import { getErrorMessage }     from "../../api/client";
import { useApi }       from "../../hooks/useApi";

const ALL_SUBJECTS = [
  { id: "algorithms",      label: "Algorithms"        },
  { id: "databases",       label: "Databases"         },
  { id: "os",              label: "Operating Systems" },
  { id: "networks",        label: "Computer Networks" },
  { id: "data_structures", label: "Data Structures"   },
  { id: "web",             label: "Web Technologies"  },
];

function InfoRow({ label, value, icon }) {
  if (!value) return null;
  return (
    <div className="flex items-center gap-3 py-3 border-b border-[var(--color-border)] last:border-0">
      <div className="w-8 h-8 rounded-[var(--radius-md)] flex items-center justify-center text-[16px] flex-shrink-0"
        style={{ background: "var(--color-primary-bg)", color: "var(--color-primary)" }}>
        <i className={`ti ${icon}`} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[11px] font-semibold uppercase tracking-[0.5px]"
          style={{ color: "var(--color-muted)" }}>{label}</p>
        <p className="text-[14px] font-medium truncate"
          style={{ color: "var(--color-text)" }}>{value}</p>
      </div>
    </div>
  );
}

function Field({ label, icon, children }) {
  return (
    <div>
      <label className="text-[12px] font-semibold block mb-1"
        style={{ color: "var(--color-muted)" }}>
        {icon && <i className={`ti ${icon} mr-1`} />}{label}
      </label>
      {children}
    </div>
  );
}

export default function TeacherProfilePage() {
  const { user, updateUser } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [saved,     setSaved]     = useState(false);

  const [form, setForm] = useState({
    name:        user?.name        || "",
    email:       user?.email       || "",
    bio:         user?.bio         || "",
    institution: user?.institution || "",
    department:  user?.department  || "",
    designation: user?.designation || "",
    phone:       user?.phone       || "",
    employeeId:  user?.employeeId  || "",
    // subjects is a multi-select array
    subjects:    user?.subjects    || [],
  });

  // Question bank analytics for this teacher
  const analyticsFetcher = useCallback(() => teacherAPI.getQuestionAnalytics(), []);
  const { data: analyticsData } = useApi(analyticsFetcher);
  const myQuestions = analyticsData?.data || [];

  const initials = user?.name
    ? user.name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase()
    : "T";

  function set(field, val) {
    setForm((p) => ({ ...p, [field]: val }));
  }

  function toggleSubject(id) {
    setForm((p) => ({
      ...p,
      subjects: p.subjects.includes(id)
        ? p.subjects.filter((s) => s !== id)
        : [...p.subjects, id],
    }));
  }

  async function handleSave() {
    setSaveError("");
    try {
      const res = await authAPI.updateProfile(form);
      updateUser(res.user || res);
      setIsEditing(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      setSaveError(getErrorMessage(err));
    }
  }

  // Stats derived from user doc + analytics
  const totalMyQ     = myQuestions.length;
  const avgCorrectRate = totalMyQ
    ? Math.round(myQuestions.filter((q) => q.correctRate !== null)
        .reduce((s, q) => s + Number(q.correctRate), 0) /
        Math.max(myQuestions.filter((q) => q.correctRate !== null).length, 1))
    : 0;
  const totalUsed = myQuestions.filter((q) => q.timesUsed > 0).length;

  return (
    <div className="flex flex-col gap-6 max-w-[860px]">

      {/* ── Header card ── */}
      <div className="rounded-[var(--radius-xl)] border border-[var(--color-border)] overflow-hidden"
        style={{ background: "var(--color-surface)" }}>

        {/* Banner — slightly different gradient for teacher */}
        <div className="h-[100px] w-full relative"
          style={{ background: "linear-gradient(135deg, #1A1A2E 0%, var(--color-primary) 100%)" }}>
          <div className="absolute inset-0 opacity-10"
            style={{ backgroundImage: "radial-gradient(circle at 30% 50%, #fff 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
          {/* Teacher badge on banner */}
          <div className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1.5 rounded-full"
            style={{ background: "rgba(255,255,255,0.15)" }}>
            <i className="ti ti-chalkboard text-white text-[13px]" />
            <span className="text-white text-[11px] font-semibold">Teacher</span>
          </div>
        </div>

        <div className="px-6 pb-6">
          <div className="flex items-end justify-between -mt-[40px] mb-4">
            {/* Avatar */}
            <div className="relative">
              <div className="w-20 h-20 rounded-full flex items-center justify-center text-[26px] font-bold border-4 border-[var(--color-surface)]"
                style={{ background: "var(--color-primary-bg)", color: "var(--color-primary)", fontFamily: "var(--font-display)" }}>
                {initials}
              </div>
              <div className="absolute bottom-[5px] right-[5px] w-4 h-4 rounded-full border-2 border-[var(--color-surface)]"
                style={{ background: "#10B981" }} />
            </div>

            {/* Edit / Save */}
            <div className="flex flex-col items-end gap-1 mt-2">
              <div className="flex gap-2">
                {!isEditing ? (
                  <button onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2 px-4 py-2 rounded-[var(--radius-md)] border border-[var(--color-border)] text-[13px] font-semibold cursor-pointer hover:border-[var(--color-primary)] hover:bg-[var(--color-primary-bg)]"
                    style={{ background: "transparent", color: "var(--color-text)" }}>
                    <i className="ti ti-pencil text-[15px]" /> Edit Profile
                  </button>
                ) : (
                  <>
                    <button onClick={() => { setIsEditing(false); setSaveError(""); }}
                      className="px-4 py-2 rounded-[var(--radius-md)] border border-[var(--color-border)] text-[13px] font-semibold cursor-pointer"
                      style={{ background: "transparent", color: "var(--color-muted)" }}>
                      Cancel
                    </button>
                    <button onClick={handleSave}
                      className="flex items-center gap-1 px-4 py-2 rounded-[var(--radius-md)] text-white text-[13px] font-semibold cursor-pointer border-none"
                      style={{ background: "var(--color-primary)" }}>
                      <i className="ti ti-check" /> Save
                    </button>
                  </>
                )}
              </div>
              {saveError && (
                <p className="text-[12px]" style={{ color: "var(--color-accent)" }}>{saveError}</p>
              )}
            </div>
          </div>

          {/* View mode */}
          {!isEditing ? (
            <>
              <h2 className="text-[20px] font-bold"
                style={{ fontFamily: "var(--font-display)", color: "var(--color-text)" }}>
                {form.name}
              </h2>
              <p className="text-[13px] mt-[2px]" style={{ color: "var(--color-muted)" }}>
                {form.email}
              </p>
              {(form.designation || form.department) && (
                <p className="text-[13px] mt-1 font-medium" style={{ color: "var(--color-primary)" }}>
                  {[form.designation, form.department].filter(Boolean).join(" · ")}
                </p>
              )}
              {form.bio && (
                <p className="text-[13px] mt-2 leading-relaxed" style={{ color: "var(--color-muted)" }}>
                  {form.bio}
                </p>
              )}
              {/* Subject chips */}
              {form.subjects.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {form.subjects.map((s) => {
                    const subj = ALL_SUBJECTS.find((x) => x.id === s);
                    return subj ? (
                      <span key={s} className="text-[11px] font-semibold px-2 py-1 rounded-full"
                        style={{ background: "var(--color-primary-bg)", color: "var(--color-primary)" }}>
                        {subj.label}
                      </span>
                    ) : null;
                  })}
                </div>
              )}
            </>
          ) : (
            /* Edit mode — teacher-specific fields */
            <div className="flex flex-col gap-3 mt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  ["name",        "Full Name",    "ti-user",     "text"],
                  ["email",       "Email",         "ti-mail",     "email"],
                  ["institution", "Institution",   "ti-building", "text"],
                  ["department",  "Department",    "ti-school",   "text"],
                  ["designation", "Designation",   "ti-badge",    "text"],
                  ["employeeId",  "Employee ID",   "ti-id",       "text"],
                  ["phone",       "Phone",         "ti-phone",    "tel"],
                ].map(([field, label, icon, type]) => (
                  <Field key={field} label={label} icon={icon}>
                    <input type={type} value={form[field]}
                      onChange={(e) => set(field, e.target.value)}
                      className="w-full px-3 py-2 rounded-[var(--radius-md)] border border-[var(--color-border)] text-[13px] outline-none focus:border-[var(--color-primary)]"
                      style={{ background: "var(--color-bg)", color: "var(--color-text)" }} />
                  </Field>
                ))}
              </div>

              {/* Subjects multi-select */}
              <Field label="Subjects You Teach" icon="ti-books">
                <div className="flex flex-wrap gap-2 mt-1">
                  {ALL_SUBJECTS.map((s) => {
                    const selected = form.subjects.includes(s.id);
                    return (
                      <button key={s.id} type="button" onClick={() => toggleSubject(s.id)}
                        className="text-[12px] font-semibold px-3 py-1.5 rounded-full cursor-pointer transition-all border"
                        style={{
                          background:  selected ? "var(--color-primary)"    : "var(--color-bg)",
                          color:       selected ? "#fff"                     : "var(--color-muted)",
                          borderColor: selected ? "var(--color-primary)"    : "var(--color-border)",
                        }}>
                        {s.label}
                      </button>
                    );
                  })}
                </div>
              </Field>

              <Field label="Bio" icon="ti-quote">
                <textarea rows={3} value={form.bio}
                  onChange={(e) => set("bio", e.target.value)}
                  placeholder="Brief introduction about yourself…"
                  className="w-full px-3 py-2 rounded-[var(--radius-md)] border border-[var(--color-border)] text-[13px] outline-none resize-none focus:border-[var(--color-primary)]"
                  style={{ background: "var(--color-bg)", color: "var(--color-text)" }} />
              </Field>
            </div>
          )}
        </div>
      </div>

      {/* ── Stats + Professional info ── */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-5">

        <div className="flex flex-col gap-5">

          {/* Question bank stats */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "My Questions", value: totalMyQ,          icon: "ti-pencil",      color: "var(--color-primary)" },
              { label: "In Active Use", value: totalUsed,         icon: "ti-chart-bar",   color: "#2563EB"              },
              { label: "Avg Correct Rate", value: totalUsed > 0 ? `${avgCorrectRate}%` : "—", icon: "ti-target", color: avgCorrectRate >= 60 ? "var(--color-primary)" : "var(--color-accent)" },
            ].map(({ label, value, icon, color }) => (
              <div key={label}
                className="p-4 rounded-[var(--radius-lg)] border border-[var(--color-border)] text-center"
                style={{ background: "var(--color-surface)" }}>
                <i className={`ti ${icon} text-[22px] block mb-1`} style={{ color }} />
                <p className="text-[20px] font-bold"
                  style={{ fontFamily: "var(--font-display)", color: "var(--color-text)" }}>
                  {value}
                </p>
                <p className="text-[11px] font-semibold uppercase tracking-[0.4px]"
                  style={{ color: "var(--color-muted)" }}>
                  {label}
                </p>
              </div>
            ))}
          </div>

          {/* My questions list */}
          <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] p-5"
            style={{ background: "var(--color-surface)" }}>
            <h3 className="text-[15px] font-bold mb-4"
              style={{ fontFamily: "var(--font-display)", color: "var(--color-text)" }}>
              My Questions
            </h3>
            {myQuestions.length === 0 ? (
              <p className="text-[13px]" style={{ color: "var(--color-muted)" }}>
                You haven't added any questions yet. Go to Question Bank to add some.
              </p>
            ) : (
              <div className="flex flex-col gap-2">
                {myQuestions.slice(0, 8).map((q) => {
                  const diff = { easy: { bg: "var(--color-primary-bg)", color: "var(--color-easy)" }, medium: { bg: "#FEF3C7", color: "#D97706" }, hard: { bg: "var(--color-accent-bg)", color: "var(--color-hard)" } }[q.difficulty] || {};
                  return (
                    <div key={q._id}
                      className="flex items-start gap-3 p-3 rounded-[var(--radius-md)] border border-[var(--color-border)]">
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-medium line-clamp-1"
                          style={{ color: "var(--color-text)" }}>
                          {q.question}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded-full"
                            style={{ background: diff.bg, color: diff.color }}>
                            {q.difficulty}
                          </span>
                          <span className="text-[11px]" style={{ color: "var(--color-muted)" }}>
                            Used {q.timesUsed || 0}×
                          </span>
                          {q.correctRate !== null && (
                            <span className="text-[11px] font-semibold"
                              style={{ color: q.correctRate >= 60 ? "var(--color-primary)" : "var(--color-accent)" }}>
                              {q.correctRate}% correct
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
                {myQuestions.length > 8 && (
                  <p className="text-[12px] text-center pt-1" style={{ color: "var(--color-muted)" }}>
                    +{myQuestions.length - 8} more — view in Question Bank
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right: Professional info */}
        <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] p-5 self-start"
          style={{ background: "var(--color-surface)" }}>
          <h3 className="text-[15px] font-bold mb-3"
            style={{ fontFamily: "var(--font-display)", color: "var(--color-text)" }}>
            Professional Info
          </h3>
          <InfoRow label="Institution"  value={form.institution} icon="ti-building" />
          <InfoRow label="Department"   value={form.department}  icon="ti-school"   />
          <InfoRow label="Designation"  value={form.designation} icon="ti-badge"    />
          <InfoRow label="Employee ID"  value={form.employeeId}  icon="ti-id"       />
          <InfoRow label="Phone"        value={form.phone}       icon="ti-phone"    />
          <InfoRow label="Platform"     value="BrainGauge · Pinsout" icon="ti-briefcase" />
        </div>
      </div>

      {/* Toast */}
      {saved && (
        <div className="fixed bottom-6 right-6 flex items-center gap-2 px-4 py-3 rounded-[var(--radius-lg)] text-white text-[13px] font-semibold shadow-lg z-[300]"
          style={{ background: "var(--color-primary)" }}>
          <i className="ti ti-check" /> Profile saved!
        </div>
      )}
    </div>
  );
}