import { useState, useCallback } from "react";
import { useAuth } from "../../context/AuthContext";
import { useApi } from "../../hooks/useApi";
import { notifAPI } from "../../api/services";

export default function Topbar({ onMenuClick }) {
  const { user } = useAuth();
  const [showNotifs, setShowNotifs] = useState(false);

  const fetcher  = useCallback(() => notifAPI.getAll(), []);
  const { data } = useApi(fetcher);
  const notifs   = data?.data || [];
  const unread   = notifs.filter((n) => !n.isRead).length;

  const firstName = user?.name?.split(" ")[0] || "Student";
  const initials  = user?.name
    ? user.name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase()
    : "??";

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const today = new Date().toLocaleDateString("en-IN", { weekday: "long", month: "long", year: "numeric" });

  return (
    <header className="sticky top-0 z-[50] flex items-center justify-between px-7 py-4 border-b border-[var(--color-border)]"
      style={{ background: "var(--color-surface)" }}>

      {/* Left */}
      <div className="flex items-center gap-3">
        {/* Hamburger — mobile only */}
        <button
          onClick={onMenuClick}
          className="lg:hidden w-[38px] h-[38px] flex items-center justify-center rounded-[var(--radius-md)] border border-[var(--color-border)] bg-transparent cursor-pointer text-[18px] transition-colors hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
          style={{ color: "var(--color-text)" }}
          aria-label="Open menu"
        >
          <i className="ti ti-menu-2" aria-hidden="true" />
        </button>

        <div>
          <h1
            className="text-[20px] font-bold leading-none"
            style={{ fontFamily: "var(--font-display)", color: "var(--color-text)" }}
          >
            {greeting}, {firstName} 👋
          </h1>
          <p className="text-[13px] mt-[3px]" style={{ color: "var(--color-muted)" }}>
            Track your progress · {today}
          </p>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-3 relative">
        {/* Search */}
        {/* <button
          className="w-[38px] h-[38px] flex items-center justify-center rounded-[var(--radius-md)] border border-[var(--color-border)] bg-transparent cursor-pointer text-[18px] transition-all hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] hover:bg-[var(--color-primary-bg)]"
          style={{ color: "var(--color-muted)" }}
          aria-label="Search"
        >
          <i className="ti ti-search" aria-hidden="true" />
        </button> */}

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifs((v) => !v)}
            className="w-[38px] h-[38px] flex items-center justify-center rounded-[var(--radius-md)] border border-[var(--color-border)] bg-transparent cursor-pointer text-[18px] transition-all hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] hover:bg-[var(--color-primary-bg)]"
            style={{ color: "var(--color-muted)" }}
            aria-label={`Notifications (${unread} unread)`}
          >
            <i className="ti ti-bell" aria-hidden="true" />
            {unread > 0 && (
              <span className="absolute top-[6px] right-[6px] w-[7px] h-[7px] rounded-full border-[1.5px] border-[var(--color-surface)]"
                style={{ background: "var(--color-accent)" }} />
            )}
          </button>

          {/* Dropdown */}
          {showNotifs && (
            <div
              className="absolute right-0 top-[46px] w-[300px] rounded-[var(--radius-lg)] border border-[var(--color-border)] shadow-lg z-[200] overflow-hidden"
              style={{ background: "var(--color-surface)" }}
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--color-border)]">
                <p className="text-[14px] font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--color-text)" }}>
                  Notifications
                </p>
                <span className="text-[11px] font-semibold px-2 py-[2px] rounded-full text-white"
                  style={{ background: "var(--color-accent)" }}>
                  {unread} new
                </span>
              </div>

              <div className="flex flex-col">
                {notifs.slice(0, 5).map((n) => (
                  <div
                    key={n._id || n.id}
                    className="flex items-start gap-3 px-4 py-3 border-b border-[var(--color-border)] last:border-0 cursor-pointer hover:bg-[var(--color-bg)] transition-colors"
                  >
                    <div
                      className="w-2 h-2 rounded-full mt-[6px] flex-shrink-0"
                      style={{ background: n.isRead ? "var(--color-border)" : "var(--color-primary)" }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-medium leading-snug" style={{ color: "var(--color-text)" }}>
                        {n.message}
                      </p>
                      <p className="text-[11px] mt-1" style={{ color: "var(--color-muted)" }}>
                        {n.createdAt ? new Date(n.createdAt).toLocaleString("en-IN", { dateStyle: "short", timeStyle: "short" }) : ""}
                      </p>
                    </div>
                  </div>
                ))}
                {notifs.length === 0 && (
                  <p className="text-center text-[12px] py-4" style={{ color: "var(--color-muted)" }}>No notifications</p>
                )}
              </div>

              <div className="px-4 py-3 text-center">
                <button className="text-[12px] font-semibold" style={{ color: "var(--color-primary)" }}>
                  Mark all as read
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Avatar */}
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center text-[13px] font-bold cursor-pointer flex-shrink-0"
          style={{
            background: "var(--color-primary-bg)",
            color: "var(--color-primary)",
            fontFamily: "var(--font-display)",
            border: "2px solid var(--color-primary-lt)",
          }}
        >
          {initials}
        </div>
      </div>
    </header>
  );
}
