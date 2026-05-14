import { useState, useCallback } from "react";
import { useAuth }    from "../context/AuthContext";
import { authAPI }    from "../api/services";
import { getErrorMessage } from "../api/client";
import { useApi }     from "../hooks/useApi";
import { quizAPI }    from "../api/services";

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

function scoreColor(s) {
  if (s >= 80) return "var(--color-primary)";
  if (s >= 60) return "var(--color-medium)";
  return "var(--color-hard)";
}

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

export default function ProfilePage() {
  const { user, updateUser } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [saved,     setSaved]     = useState(false);

  const [form, setForm] = useState({
    name:             user?.name             || "",
    email:            user?.email            || "",
    bio:              user?.bio              || "",
    institution:      user?.institution      || "",
    course:           user?.course           || "",
    semester:         String(user?.semester  || ""),
    batch:            user?.batch            || "",
    enrollmentNumber: user?.enrollmentNumber || "",
  });

  // Live quiz history — last 5
  const historyFetcher = useCallback(() => quizAPI.history({ page: 1, limit: 5 }), []);
  const { data: historyData } = useApi(historyFetcher);
  const recentAttempts = historyData?.scores || [];

  const initials = user?.name
    ? user.name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase()
    : "??";

  function set(field, val) {
    setForm((p) => ({ ...p, [field]: val }));
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

  // Stats from real AuthContext user (populated by /auth/me after grading)
  const stats = {
    quizzesTaken: user?.totalQuizzesTaken ?? 0,
    avgScore:     user?.averageScore      ?? 0,
    streak:       user?.currentStreak     ?? 0,
    accuracy:     user?.totalAnswered
      ? Math.round((user.totalCorrect / user.totalAnswered) * 100)
      : 0,
  };

  // Subject progress from user doc
  const subjectProgress = user?.subjectProgress || [];

  return (
    <div className="flex flex-col gap-6 max-w-[860px]">

      {/* ── Header card ── */}
      <div className="rounded-[var(--radius-xl)] border border-[var(--color-border)] overflow-hidden"
        style={{ background: "var(--color-surface)" }}>

        {/* Banner */}
        <div className="h-[100px] w-full relative"
          style={{ background: "linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-lt) 100%)" }}>
          <div className="absolute inset-0 opacity-10"
            style={{ backgroundImage: "radial-gradient(circle at 20% 50%, #fff 1px, transparent 1px), radial-gradient(circle at 80% 20%, #fff 1px, transparent 1px)", backgroundSize: "30px 30px" }} />
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

            {/* Edit / Save buttons */}
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
              {form.bio && (
                <p className="text-[13px] mt-2 leading-relaxed" style={{ color: "var(--color-muted)" }}>
                  {form.bio}
                </p>
              )}
              <div className="flex flex-wrap gap-2 mt-3">
                {[
                  form.course,
                  form.semester ? `Sem ${form.semester}` : null,
                  form.batch,
                  form.institution,
                ].filter(Boolean).map((tag) => (
                  <span key={tag} className="text-[11px] font-semibold px-2 py-1 rounded-full"
                    style={{ background: "var(--color-primary-bg)", color: "var(--color-primary)" }}>
                    {tag}
                  </span>
                ))}
              </div>
            </>
          ) : (
            /* Edit mode — student fields only */
            <div className="flex flex-col gap-3 mt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  ["name",             "Full Name",       "ti-user",     "text"],
                  ["email",            "Email",           "ti-mail",     "email"],
                  ["institution",      "Institution",     "ti-building", "text"],
                  ["course",           "Course",          "ti-book",     "text"],
                  ["semester",         "Semester",        "ti-hash",     "number"],
                  ["batch",            "Batch",           "ti-calendar", "text"],
                  ["enrollmentNumber", "Enrollment No.",  "ti-id",       "text"],
                ].map(([field, label, icon, type]) => (
                  <Field key={field} label={label} icon={icon}>
                    <input type={type} value={form[field]}
                      onChange={(e) => set(field, e.target.value)}
                      className="w-full px-3 py-2 rounded-[var(--radius-md)] border border-[var(--color-border)] text-[13px] outline-none focus:border-[var(--color-primary)]"
                      style={{ background: "var(--color-bg)", color: "var(--color-text)" }} />
                  </Field>
                ))}
              </div>
              <Field label="Bio" icon="ti-quote">
                <textarea rows={3} value={form.bio}
                  onChange={(e) => set("bio", e.target.value)}
                  placeholder="Tell us about yourself…"
                  className="w-full px-3 py-2 rounded-[var(--radius-md)] border border-[var(--color-border)] text-[13px] outline-none resize-none focus:border-[var(--color-primary)]"
                  style={{ background: "var(--color-bg)", color: "var(--color-text)" }} />
              </Field>
            </div>
          )}
        </div>
      </div>

      {/* ── Stats + Sidebar ── */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-5">

        <div className="flex flex-col gap-5">

          {/* Stat cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: "Quizzes",   value: stats.quizzesTaken,   icon: "ti-file-check", color: "var(--color-primary)" },
              { label: "Avg Score", value: `${stats.avgScore}%`, icon: "ti-chart-bar",  color: "#2563EB" },
              { label: "Streak",    value: `${stats.streak} 🔥`, icon: "ti-flame",      color: "#D97706" },
              { label: "Accuracy",  value: `${stats.accuracy}%`, icon: "ti-target",     color: "var(--color-accent)" },
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

          {/* Subject mastery — from real subjectProgress on user doc */}
          <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] p-5"
            style={{ background: "var(--color-surface)" }}>
            <h3 className="text-[15px] font-bold mb-4"
              style={{ fontFamily: "var(--font-display)", color: "var(--color-text)" }}>
              Subject Mastery
            </h3>
            {subjectProgress.length === 0 ? (
              <p className="text-[13px]" style={{ color: "var(--color-muted)" }}>
                No quizzes attempted yet. Take a quiz to see your progress!
              </p>
            ) : (
              <div className="flex flex-col gap-[10px]">
                {subjectProgress.map((sp) => {
                  const pct   = sp.avgScore || 0;
                  const color = pct >= 75 ? "var(--color-primary)"
                              : pct >= 50 ? "var(--color-primary-lt)"
                              : pct >= 30 ? "var(--color-medium)"
                              : "var(--color-hard)";
                  return (
                    <div key={sp.subjectId}>
                      <div className="flex items-center justify-between text-[12px] mb-1">
                        <div className="flex items-center gap-2">
                          <i className={`ti ${SUBJECT_ICONS[sp.subjectId] || "ti-brain"} text-[14px]`}
                            style={{ color: "var(--color-primary)" }} />
                          <span style={{ color: "var(--color-muted)" }}>
                            {SUBJECT_LABELS[sp.subjectId] || sp.subjectId}
                          </span>
                        </div>
                        <span className="font-semibold" style={{ color }}>
                          {pct}% avg
                        </span>
                      </div>
                      <div className="h-[6px] rounded-full overflow-hidden"
                        style={{ background: "var(--color-bg)" }}>
                        <div className="h-full rounded-full transition-all duration-500"
                          style={{ width: `${pct}%`, background: color }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Recent quiz attempts — live from API */}
          <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] p-5"
            style={{ background: "var(--color-surface)" }}>
            <h3 className="text-[15px] font-bold mb-4"
              style={{ fontFamily: "var(--font-display)", color: "var(--color-text)" }}>
              Recent Activity
            </h3>
            {recentAttempts.length === 0 ? (
              <p className="text-[13px]" style={{ color: "var(--color-muted)" }}>
                No attempts yet.
              </p>
            ) : (
              <div className="flex flex-col gap-3">
                {recentAttempts.map((sc) => (
                  <div key={sc._id}
                    className="flex items-center gap-3 py-2 border-b border-[var(--color-border)] last:border-0">
                    <div className="w-8 h-8 rounded-[var(--radius-md)] flex items-center justify-center text-[16px] flex-shrink-0"
                      style={{ background: "var(--color-primary-bg)", color: "var(--color-primary)" }}>
                      <i className={`ti ${SUBJECT_ICONS[sc.quiz?.subject] || "ti-brain"}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-semibold truncate"
                        style={{ color: "var(--color-text)" }}>
                        {sc.quiz?.title || SUBJECT_LABELS[sc.quiz?.subject] || "Quiz"}
                      </p>
                      <p className="text-[11px]" style={{ color: "var(--color-muted)" }}>
                        {sc.quiz?.difficulty} · {sc.correctCount}/{sc.totalQuestions} correct
                      </p>
                    </div>
                    <span className="text-[15px] font-bold flex-shrink-0"
                      style={{ fontFamily: "var(--font-display)", color: scoreColor(sc.scorePercent) }}>
                      {sc.scorePercent}%
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: Academic info */}
        <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] p-5 self-start"
          style={{ background: "var(--color-surface)" }}>
          <h3 className="text-[15px] font-bold mb-3"
            style={{ fontFamily: "var(--font-display)", color: "var(--color-text)" }}>
            Academic Info
          </h3>
          <InfoRow label="Institution"    value={form.institution}                     icon="ti-building" />
          <InfoRow label="Course"         value={form.course}                          icon="ti-book" />
          <InfoRow label="Semester"       value={form.semester ? `Semester ${form.semester}` : ""} icon="ti-hash" />
          <InfoRow label="Batch"          value={form.batch}                           icon="ti-calendar" />
          <InfoRow label="Enrollment No." value={form.enrollmentNumber}               icon="ti-id" />
          <InfoRow label="Project"        value="BrainGauge · Pinsout"                icon="ti-briefcase" />
          <InfoRow label="Difficulty"     value={user?.currentDifficulty ? `${user.currentDifficulty.charAt(0).toUpperCase()}${user.currentDifficulty.slice(1)}` : "Easy"} icon="ti-adjustments-horizontal" />
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