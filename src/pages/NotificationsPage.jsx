import { useState, useCallback } from "react";
import { useApi } from "../hooks/useApi";
import { notifAPI } from "../api/services";
import { getErrorMessage } from "../api/client";

const ICONS = ["ti-flame","ti-brain","ti-chart-line","ti-calendar","ti-bell"];

export default function NotificationsPage() {
  const fetcher = useCallback(() => notifAPI.getAll(), []);
  const { data, loading, error, refetch } = useApi(fetcher);

  const [filter, setFilter]     = useState("all");
  const [actionErr, setActionErr] = useState("");

  const rawList = data?.data || [];

  async function handleMarkRead(id) {
    try {
      await notifAPI.markRead(id);
      refetch();
    } catch (e) { setActionErr(getErrorMessage(e)); }
  }

  async function handleMarkAll() {
    try {
      await notifAPI.markAllRead();
      refetch();
    } catch (e) { setActionErr(getErrorMessage(e)); }
  }

  const notifs   = rawList.map((n) => ({ ...n, id: n._id || n.id }));
  const filtered = notifs.filter((n) => {
    if (filter === "unread") return !n.isRead;
    if (filter === "read")   return  n.isRead;
    return true;
  });
  const unreadCount = notifs.filter((n) => !n.isRead).length;

  return (
    <div className="max-w-[680px] flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[22px] font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--color-text)" }}>
            Notifications
          </h1>
          <p className="text-[13px] mt-1" style={{ color: "var(--color-muted)" }}>
            {loading ? "Loading…" : unreadCount > 0 ? `${unreadCount} unread` : "All caught up ✓"}
          </p>
        </div>
        {unreadCount > 0 && (
          <button onClick={handleMarkAll}
            className="text-[13px] font-semibold cursor-pointer bg-transparent border-none hover:underline"
            style={{ color: "var(--color-primary)" }}>
            Mark all as read
          </button>
        )}
      </div>

      {actionErr && (
        <p className="text-[12px] font-medium" style={{ color: "var(--color-accent)" }}>{actionErr}</p>
      )}

      {/* Filter tabs */}
      <div className="flex gap-2 p-1 rounded-[var(--radius-md)]" style={{ background: "var(--color-bg)" }}>
        {["all","unread","read"].map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className="flex-1 py-2 rounded-[var(--radius-sm)] text-[13px] font-semibold capitalize cursor-pointer transition-all border-none"
            style={{ background: filter===f ? "var(--color-surface)" : "transparent", color: filter===f ? "var(--color-primary)" : "var(--color-muted)", boxShadow: filter===f ? "0 1px 4px rgba(0,0,0,0.08)" : "none" }}>
            {f}
            {f==="unread" && unreadCount>0 && (
              <span className="ml-1 text-[10px] font-bold px-[5px] py-[1px] rounded-full text-white" style={{ background: "var(--color-accent)" }}>
                {unreadCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="flex flex-col gap-3">
        {loading ? (
          [...Array(4)].map((_, i) => (
            <div key={i} className="flex items-start gap-4 p-4 rounded-[var(--radius-lg)] border border-[var(--color-border)] animate-pulse"
              style={{ background: "var(--color-surface)" }}>
              <div className="w-10 h-10 rounded-[var(--radius-md)]" style={{ background: "var(--color-border)" }} />
              <div className="flex-1">
                <div className="h-3 rounded w-3/4 mb-2" style={{ background: "var(--color-border)" }} />
                <div className="h-2 rounded w-1/4" style={{ background: "var(--color-border)" }} />
              </div>
            </div>
          ))
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-[14px]" style={{ color: "var(--color-muted)" }}>{error}</p>
            <button onClick={refetch} className="mt-2 text-[13px] font-semibold" style={{ color: "var(--color-primary)" }}>Retry</button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <i className="ti ti-bell-off text-[40px]" style={{ color: "var(--color-border)" }} />
            <p className="text-[14px]" style={{ color: "var(--color-muted)" }}>No {filter !== "all" ? filter : ""} notifications</p>
          </div>
        ) : (
          filtered.map((n, i) => (
            <div key={n.id}
              className="flex items-start gap-4 p-4 rounded-[var(--radius-lg)] border border-[var(--color-border)] cursor-pointer transition-all hover:border-[var(--color-primary-lt)]"
              style={{ background: n.isRead ? "var(--color-surface)" : "var(--color-primary-bg)" }}
              onClick={() => !n.isRead && handleMarkRead(n.id)}>
              <div className="w-10 h-10 rounded-[var(--radius-md)] flex items-center justify-center text-[18px] flex-shrink-0"
                style={{ background: n.isRead ? "var(--color-bg)" : "var(--color-primary-bg)", color: "var(--color-primary)" }}>
                <i className={`ti ${ICONS[i % ICONS.length]}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-medium leading-snug" style={{ color: "var(--color-text)" }}>
                  {n.message}
                </p>
                <p className="text-[11px] mt-1" style={{ color: "var(--color-muted)" }}>
                  {n.createdAt ? new Date(n.createdAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }) : ""}
                </p>
              </div>
              {!n.isRead && <div className="w-2 h-2 rounded-full mt-2 flex-shrink-0" style={{ background: "var(--color-primary)" }} />}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
