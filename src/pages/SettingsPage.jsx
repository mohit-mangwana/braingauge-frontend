import { useState } from "react";
import { authAPI } from "../api/services";
import { getErrorMessage } from "../api/client";

function Section({ title, children }) {
  return (
    <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] overflow-hidden"
      style={{ background: "var(--color-surface)" }}>
      <div className="px-5 py-4 border-b border-[var(--color-border)]">
        <h2 className="text-[15px] font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--color-text)" }}>
          {title}
        </h2>
      </div>
      <div className="p-5 flex flex-col gap-4">{children}</div>
    </div>
  );
}

function Toggle({ label, description, value, onChange }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="text-[14px] font-medium" style={{ color: "var(--color-text)" }}>{label}</p>
        {description && <p className="text-[12px] mt-[2px]" style={{ color: "var(--color-muted)" }}>{description}</p>}
      </div>
      <button
        onClick={() => onChange(!value)}
        className="relative w-11 h-6 rounded-full transition-colors duration-200 flex-shrink-0 cursor-pointer border-none"
        style={{ background: value ? "var(--color-primary)" : "var(--color-border)" }}
        role="switch" aria-checked={value}>
        <span
          className="absolute top-[3px] w-[18px] h-[18px] rounded-full bg-white shadow transition-all duration-200"
          style={{ left: value ? "calc(100% - 21px)" : "3px" }} />
      </button>
    </div>
  );
}

function SelectRow({ label, description, value, onChange, options }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="text-[14px] font-medium" style={{ color: "var(--color-text)" }}>{label}</p>
        {description && <p className="text-[12px] mt-[2px]" style={{ color: "var(--color-muted)" }}>{description}</p>}
      </div>
      <select
        value={value} onChange={(e) => onChange(e.target.value)}
        className="text-[13px] border border-[var(--color-border)] rounded-[var(--radius-md)] px-3 py-2 outline-none cursor-pointer"
        style={{ background: "var(--color-bg)", color: "var(--color-text)", minWidth: 120 }}>
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}

export default function SettingsPage() {
  const [saved, setSaved] = useState(false);

  // Quiz preferences
  const [shuffleQ,     setShuffleQ]     = useState(true);
  const [showExp,      setShowExp]      = useState(true);
  const [adaptive,     setAdaptive]     = useState(true);
  const [defaultDiff,  setDefaultDiff]  = useState("easy");
  const [qCount,       setQCount]       = useState("10");

  // Notification preferences
  const [emailNotifs,  setEmailNotifs]  = useState(true);
  const [streakAlerts, setStreakAlerts] = useState(true);
  const [quizReminders,setQuizReminders]= useState(true);
  const [scoreAlerts,  setScoreAlerts]  = useState(false);

  // Account
  const [currentPw,   setCurrentPw]   = useState("");
  const [newPw,       setNewPw]       = useState("");
  const [confirmPw,   setConfirmPw]   = useState("");
  const [pwError,     setPwError]     = useState("");

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  async function handleChangePw() {
    if (!currentPw || !newPw || !confirmPw) { setPwError("All fields required"); return; }
    if (newPw.length < 6)  { setPwError("Password must be at least 6 characters"); return; }
    if (newPw !== confirmPw) { setPwError("Passwords don't match"); return; }
    setPwError("");
    try {
      await authAPI.changePassword(currentPw, newPw);
      setCurrentPw(""); setNewPw(""); setConfirmPw("");
      handleSave();
    } catch (err) {
      setPwError(getErrorMessage(err));
    }
  }

  return (
    <div className="max-w-[640px] flex flex-col gap-5">

      <div>
        <h1 className="text-[22px] font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--color-text)" }}>
          Settings
        </h1>
        <p className="text-[13px] mt-1" style={{ color: "var(--color-muted)" }}>
          Manage your quiz preferences and account
        </p>
      </div>

      {/* ── Quiz Preferences ── */}
      <Section title="Quiz Preferences">
        <Toggle label="Shuffle Questions" description="Randomise question order every attempt"
          value={shuffleQ} onChange={setShuffleQ} />
        <div className="border-t border-[var(--color-border)]" />
        <Toggle label="Show Explanations" description="Display answer explanation after each question"
          value={showExp} onChange={setShowExp} />
        <div className="border-t border-[var(--color-border)]" />
        <Toggle label="Adaptive Difficulty" description="Automatically adjust difficulty based on your performance"
          value={adaptive} onChange={setAdaptive} />
        <div className="border-t border-[var(--color-border)]" />
        <SelectRow label="Default Difficulty" description="Starting difficulty for new quizzes"
          value={defaultDiff} onChange={setDefaultDiff}
          options={[{ value: "easy", label: "Easy" }, { value: "medium", label: "Medium" }, { value: "hard", label: "Hard" }]} />
        <div className="border-t border-[var(--color-border)]" />
        <SelectRow label="Questions per Quiz"
          value={qCount} onChange={setQCount}
          options={[{ value: "5", label: "5" }, { value: "10", label: "10" }, { value: "15", label: "15" }, { value: "20", label: "20" }]} />
      </Section>

      {/* ── Notifications ── */}
      <Section title="Notifications">
        <Toggle label="Email Notifications" description="Receive quiz results and updates via email"
          value={emailNotifs} onChange={setEmailNotifs} />
        <div className="border-t border-[var(--color-border)]" />
        <Toggle label="Streak Alerts" description="Remind me when my streak is at risk"
          value={streakAlerts} onChange={setStreakAlerts} />
        <div className="border-t border-[var(--color-border)]" />
        <Toggle label="Quiz Reminders" description="Notify about upcoming scheduled quizzes"
          value={quizReminders} onChange={setQuizReminders} />
        <div className="border-t border-[var(--color-border)]" />
        <Toggle label="Score Drop Alerts" description="Alert when accuracy drops below 60%"
          value={scoreAlerts} onChange={setScoreAlerts} />
      </Section>

      {/* ── Change Password ── */}
      {/* <Section title="Change Password">
        {["Current Password", "New Password", "Confirm New Password"].map((label, i) => {
          const val     = [currentPw, newPw, confirmPw][i];
          const setVal  = [setCurrentPw, setNewPw, setConfirmPw][i];
          return (
            <div key={label}>
              <label className="block text-[13px] font-semibold mb-1" style={{ color: "var(--color-text)" }}>
                {label}
              </label>
              <input type="password" value={val} onChange={(e) => setVal(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-[var(--radius-md)] border border-[var(--color-border)] text-[14px] outline-none transition-colors focus:border-[var(--color-primary)]"
                style={{ background: "var(--color-bg)", color: "var(--color-text)" }} />
            </div>
          );
        })}
        {pwError && (
          <p className="text-[12px] font-medium" style={{ color: "var(--color-accent)" }}>{pwError}</p>
        )}
        <button onClick={handleChangePw}
          className="py-3 rounded-[var(--radius-md)] text-white text-[14px] font-semibold cursor-pointer transition-all hover:opacity-90"
          style={{ background: "var(--color-primary)" }}>
          Update Password
        </button>
      </Section> */}

      {/* ── Danger Zone ── */}
      <Section title="Danger Zone">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-[14px] font-medium" style={{ color: "var(--color-text)" }}>Reset Progress</p>
            <p className="text-[12px] mt-[2px]" style={{ color: "var(--color-muted)" }}>
              Clear all quiz history and stats. This cannot be undone.
            </p>
          </div>
          <button
            className="px-4 py-2 rounded-[var(--radius-md)] text-[13px] font-semibold cursor-pointer transition-all hover:opacity-90 flex-shrink-0"
            style={{ background: "var(--color-accent-bg)", color: "var(--color-accent)", border: "1px solid var(--color-accent)" }}>
            Reset
          </button>
        </div>
        <div className="border-t border-[var(--color-border)]" />
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-[14px] font-medium" style={{ color: "var(--color-accent)" }}>Delete Account</p>
            <p className="text-[12px] mt-[2px]" style={{ color: "var(--color-muted)" }}>
              Permanently delete your BrainGauge account and all data.
            </p>
          </div>
          <button
            className="px-4 py-2 rounded-[var(--radius-md)] text-white text-[13px] font-semibold cursor-pointer transition-all hover:opacity-90 flex-shrink-0"
            style={{ background: "var(--color-accent)" }}>
            Delete
          </button>
        </div>
      </Section>

      {/* Save button */}
      <button onClick={handleSave}
        className="py-3 rounded-[var(--radius-lg)] text-white text-[15px] font-semibold cursor-pointer transition-all hover:opacity-90 flex items-center justify-center gap-2"
        style={{ background: saved ? "#10B981" : "var(--color-primary)" }}>
        {saved ? <><i className="ti ti-check" /> Saved!</> : "Save Changes"}
      </button>
    </div>
  );
}
