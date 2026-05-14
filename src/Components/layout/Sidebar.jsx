import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const NAV_ITEMS = [
  { to: "/dashboard",      label: "Dashboard",     icon: "ti-layout-dashboard" },
  { to: "/quiz",           label: "Quiz",           icon: "ti-brain" },
  { to: "/quiz/history",   label: "Quiz History",   icon: "ti-history" },
  { to: "/notifications",  label: "Notifications",  icon: "ti-bell", badge: 3 },
  { to: "/profile",        label: "My Profile",     icon: "ti-user-circle" },
];

export default function Sidebar({ isOpen, onClose }) {
  const navigate    = useNavigate();
  const { user, logout } = useAuth();

  const initials = user?.name
    ? user.name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase()
    : "??";

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-[90] lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={[
          "fixed top-0 left-0 bottom-0 z-[100] flex flex-col",
          "w-[240px] bg-[var(--color-surface)] border-r border-[var(--color-border)]",
          "transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full",
          "lg:translate-x-0",
        ].join(" ")}
      >
        {/* ── Logo ── */}
        <div className="flex items-center gap-[10px] px-5 py-6 border-b border-[var(--color-border)]">
          <div
            className="w-9 h-9 rounded-[var(--radius-md)] flex items-center justify-center flex-shrink-0"
            style={{ background: "var(--color-primary)" }}
          >
            {/* Brain + gauge SVG mark */}
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
              stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 12h6M9 16h6M9 8h6M5 4h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" />
              <path d="M12 4v4M10 6h4" />
            </svg>
          </div>
          <span
            className="text-[17px] font-bold tracking-[-0.3px]"
            style={{ fontFamily: "var(--font-display)", color: "var(--color-text)" }}
          >
            Brain<span style={{ color: "var(--color-primary)" }}>Gauge</span>
          </span>
        </div>

        {/* ── Nav ── */}
        <nav className="flex-1 flex flex-col gap-1 px-3 py-4 overflow-y-auto">
          <p className="text-[10px] font-semibold tracking-[0.8px] uppercase px-2 py-1 mb-1"
            style={{ color: "var(--color-muted)" }}>
            Menu
          </p>

          {NAV_ITEMS.map(({ to, label, icon, badge }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) =>
                [
                  "flex items-center gap-[10px] px-3 py-[10px] rounded-[var(--radius-md)]",
                  "text-sm font-medium transition-all duration-150 no-underline",
                  isActive
                    ? "bg-[var(--color-primary-bg)] text-[var(--color-primary)]"
                    : "text-[var(--color-muted)] hover:bg-[var(--color-bg)] hover:text-[var(--color-text)]",
                ].join(" ")
              }
            >
              <span className="w-5 flex items-center justify-center flex-shrink-0 text-[18px]">
                <i className={`ti ${icon}`} aria-hidden="true" />
              </span>
              <span className="flex-1">{label}</span>
              {badge && (
                <span className="text-[10px] font-semibold px-[6px] py-[2px] rounded-full min-w-[18px] text-center text-white"
                  style={{ background: "var(--color-accent)" }}>
                  {badge}
                </span>
              )}
            </NavLink>
          ))}

          <p className="text-[10px] font-semibold tracking-[0.8px] uppercase px-2 py-1 mt-4 mb-1"
            style={{ color: "var(--color-muted)" }}>
            Account
          </p>

          <NavLink
            to="/settings"
            onClick={onClose}
            className={({ isActive }) =>
              [
                "flex items-center gap-[10px] px-3 py-[10px] rounded-[var(--radius-md)]",
                "text-sm font-medium transition-all duration-150 no-underline",
                isActive
                  ? "bg-[var(--color-primary-bg)] text-[var(--color-primary)]"
                  : "text-[var(--color-muted)] hover:bg-[var(--color-bg)] hover:text-[var(--color-text)]",
              ].join(" ")
            }
          >
            <span className="w-5 flex items-center justify-center flex-shrink-0 text-[18px]">
              <i className="ti ti-settings" aria-hidden="true" />
            </span>
            Settings
          </NavLink>

          {/* Logout — pushed to bottom */}
          <div className="mt-auto pt-2">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-[10px] px-3 py-[10px] rounded-[var(--radius-md)] text-sm font-medium transition-all duration-150 hover:bg-[var(--color-accent-bg)] cursor-pointer border-none bg-transparent"
              style={{ color: "var(--color-accent)" }}
            >
              <span className="w-5 flex items-center justify-center flex-shrink-0 text-[18px]">
                <i className="ti ti-logout" aria-hidden="true" />
              </span>
              Logout
            </button>
          </div>
        </nav>

        {/* ── User Card ── */}
        <div className="px-3 py-4 border-t border-[var(--color-border)]">
          <div className="flex items-center gap-[10px] p-2 rounded-[var(--radius-md)] cursor-pointer hover:bg-[var(--color-bg)] transition-colors">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-[13px] font-bold"
              style={{
                background: "var(--color-primary-bg)",
                color: "var(--color-primary)",
                fontFamily: "var(--font-display)",
              }}
            >
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-semibold truncate" style={{ color: "var(--color-text)" }}>
                {user?.name || "Student"}
              </p>
              <p className="text-[11px]" style={{ color: "var(--color-muted)" }}>
                {user?.role === "teacher" ? "Teacher" : `Student · ${user?.course || "MCA"}`}
              </p>
            </div>
            <i className="ti ti-dots-vertical text-[16px]" style={{ color: "var(--color-muted)" }} />
          </div>
        </div>
      </aside>
    </>
  );
}