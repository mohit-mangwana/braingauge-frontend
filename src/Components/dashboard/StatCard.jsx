export default function StatCard({ label, value, delta, deltaType = "up", icon, iconBg, iconColor }) {
  const isUp = deltaType === "up";

  return (
    <div
      className="flex flex-col gap-3 p-5 rounded-[var(--radius-lg)] border border-[var(--color-border)] cursor-default transition-shadow duration-150 hover:shadow-[0_4px_16px_rgba(15,155,119,0.08)]"
      style={{ background: "var(--color-surface)" }}
    >
      <div className="flex items-center justify-between">
        <span
          className="text-[11px] font-semibold uppercase tracking-[0.5px]"
          style={{ color: "var(--color-muted)" }}
        >
          {label}
        </span>
        <div
          className="w-9 h-9 rounded-[var(--radius-md)] flex items-center justify-center text-[18px]"
          style={{ background: iconBg, color: iconColor }}
        >
          <i className={`ti ${icon}`} aria-hidden="true" />
        </div>
      </div>

      <div
        className="text-[28px] font-bold leading-none"
        style={{ fontFamily: "var(--font-display)", color: "var(--color-text)" }}
      >
        {value}
      </div>

      {delta && (
        <div className="flex items-center gap-1 text-[12px]" style={{ color: "var(--color-muted)" }}>
          <span
            className="font-semibold"
            style={{ color: isUp ? "var(--color-primary)" : "var(--color-accent)" }}
          >
            {isUp ? "↑" : "↓"} {delta}
          </span>
        </div>
      )}
    </div>
  );
}
