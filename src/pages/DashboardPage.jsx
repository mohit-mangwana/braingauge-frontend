import { useCallback } from "react";
import StatCard      from "../components/dashboard/StatCard";
import ActivityChart from "../components/dashboard/ActivityChart";
import RecentQuizzes from "../components/dashboard/RecentQuizzes";
import RightPanel    from "../components/dashboard/RightPanel";
import { useApi }    from "../hooks/useApi";
import { dashboardAPI } from "../api/services";

function Skeleton({ className = "" }) {
  return (
    <div className={`rounded-[var(--radius-md)] animate-pulse ${className}`}
      style={{ background: "var(--color-border)" }} />
  );
}

function StatsSkeleton() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="p-5 rounded-[var(--radius-lg)] border border-[var(--color-border)]"
          style={{ background: "var(--color-surface)" }}>
          <Skeleton className="h-3 w-24 mb-4" />
          <Skeleton className="h-8 w-16 mb-3" />
          <Skeleton className="h-3 w-20" />
        </div>
      ))}
    </div>
  );
}

export default function DashboardPage() {
  const fetcher = useCallback(() => dashboardAPI.getData(), []);
  const { data, loading, error, refetch } = useApi(fetcher);
  const d = data?.data;

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <i className="ti ti-wifi-off text-[40px]" style={{ color: "var(--color-border)" }} />
        <p className="text-[15px] font-semibold" style={{ color: "var(--color-text)" }}>Could not load dashboard</p>
        <p className="text-[13px]" style={{ color: "var(--color-muted)" }}>{error}</p>
        <button onClick={refetch}
          className="px-5 py-2 rounded-[var(--radius-md)] text-white text-[13px] font-semibold cursor-pointer"
          style={{ background: "var(--color-primary)" }}>
          Try again
        </button>
      </div>
    );
  }

  const stats = d?.stats || {};
  console.log(d)

  const STAT_CARDS = [
    { label: "Quizzes Taken", value: loading ? "—" : stats.quizzesTaken ?? 0, delta: "this week",                deltaType: "up",   icon: "ti-file-check", iconBg: "var(--color-primary-bg)", iconColor: "var(--color-primary)" },
    { label: "Avg. Score",    value: loading ? "—" : `${stats.avgScore ?? 0}%`, delta: "overall",               deltaType: "up",   icon: "ti-chart-bar",  iconBg: "#E8F4FF",                  iconColor: "#2563EB" },
    { label: "Day Streak",    value: loading ? "—" : `${stats.streak ?? 0} 🔥`, delta: `Best: ${stats.bestStreak ?? 0} days`, deltaType: "up", icon: "ti-flame", iconBg: "#FEF3C7", iconColor: "#D97706" },
    { label: "Accuracy",      value: loading ? "—" : `${stats.accuracy ?? 0}%`, delta: "all time",              deltaType: (stats.accuracy ?? 0) >= 70 ? "up" : "down", icon: "ti-target", iconBg: "var(--color-accent-bg)", iconColor: "var(--color-accent)" },
  ];

  return (
    <div className="flex flex-col gap-6">
      {loading ? <StatsSkeleton /> : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {STAT_CARDS.map((card) => <StatCard key={card.label} {...card} />)}
        </div>
      )}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_340px] gap-5">
        <div className="flex flex-col gap-5">
          <ActivityChart data={d?.weeklyActivity} difficultyBreakdown={d?.difficultyBreakdown} loading={loading} />
          <RecentQuizzes quizzes={d?.recentQuizzes} loading={loading} />
        </div>
        <RightPanel stats={stats} topicProgress={d?.topicProgress} overallProgress={d?.overallProgress} loading={loading} />
      </div>
    </div>
  );
}
