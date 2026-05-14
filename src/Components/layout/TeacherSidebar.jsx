import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const NAV_ITEMS = [
  { to: "/teacher/dashboard",  label: "Dashboard",      icon: "ti-layout-dashboard" },
  { to: "/teacher/questions",  label: "Question Bank",  icon: "ti-pencil-plus"      },
  { to: "/teacher/students",   label: "Students",       icon: "ti-users"             },
  { to: "/teacher/profile",    label: "My Profile",     icon: "ti-user-circle"       },
];

export default function TeacherSidebar({ isOpen, onClose }) {
  const navigate         = useNavigate();
  const { user, logout } = useAuth();

  const initials = user?.name
    ? user.name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase()
    : "T";

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/40 z-[90] lg:hidden" onClick={onClose} />
      )}

      <aside className={[
        "fixed top-0 left-0 bottom-0 z-[100] flex flex-col",
        "w-[240px] border-r border-[var(--color-border)]",
        "transition-transform duration-300 ease-in-out",
        isOpen ? "translate-x-0" : "-translate-x-full",
        "lg:translate-x-0",
      ].join(" ")}
      style={{ background: "var(--color-surface)" }}>

        {/* Logo */}
        <div className="flex items-center gap-[10px] px-5 py-6 border-b border-[var(--color-border)]">
          <div className="w-9 h-9 rounded-[var(--radius-md)] flex items-center justify-center flex-shrink-0"
            style={{ background: "var(--color-primary)" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
              stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 12h6M9 16h6M9 8h6M5 4h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z"/>
              <path d="M12 4v4M10 6h4"/>
            </svg>
          </div>
          <div>
            <span className="text-[17px] font-bold tracking-[-0.3px] block"
              style={{ fontFamily: "var(--font-display)", color: "var(--color-text)" }}>
              Brain<span style={{ color: "var(--color-primary)" }}>Gauge</span>
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-[0.6px]"
              style={{ color: "var(--color-primary)" }}>
              Teacher Portal
            </span>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 flex flex-col gap-1 px-3 py-4 overflow-y-auto">
          <p className="text-[10px] font-semibold tracking-[0.8px] uppercase px-2 py-1 mb-1"
            style={{ color: "var(--color-muted)" }}>
            Menu
          </p>

          {NAV_ITEMS.map(({ to, label, icon }) => (
            <NavLink key={to} to={to} onClick={onClose}
              className={({ isActive }) => [
                "flex items-center gap-[10px] px-3 py-[10px] rounded-[var(--radius-md)]",
                "text-sm font-medium transition-all duration-150 no-underline",
                isActive
                  ? "bg-[var(--color-primary-bg)] text-[var(--color-primary)]"
                  : "text-[var(--color-muted)] hover:bg-[var(--color-bg)] hover:text-[var(--color-text)]",
              ].join(" ")}>
              <span className="w-5 flex items-center justify-center flex-shrink-0 text-[18px]">
                <i className={`ti ${icon}`} />
              </span>
              {label}
            </NavLink>
          ))}

          <div className="mt-auto pt-2">
            <button onClick={handleLogout}
              className="w-full flex items-center gap-[10px] px-3 py-[10px] rounded-[var(--radius-md)] text-sm font-medium transition-all hover:bg-[var(--color-accent-bg)] cursor-pointer border-none bg-transparent"
              style={{ color: "var(--color-accent)" }}>
              <span className="w-5 flex items-center justify-center flex-shrink-0 text-[18px]">
                <i className="ti ti-logout" />
              </span>
              Logout
            </button>
          </div>
        </nav>

        {/* User card */}
        <div className="px-3 py-4 border-t border-[var(--color-border)]">
          <div className="flex items-center gap-[10px] p-2 rounded-[var(--radius-md)] hover:bg-[var(--color-bg)] transition-colors">
            <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-[13px] font-bold"
              style={{ background: "var(--color-primary-bg)", color: "var(--color-primary)", fontFamily: "var(--font-display)" }}>
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-semibold truncate" style={{ color: "var(--color-text)" }}>
                {user?.name || "Teacher"}
              </p>
              <p className="text-[11px]" style={{ color: "var(--color-muted)" }}>
                {user?.designation || "Teacher"} · {user?.department || "Faculty"}
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}