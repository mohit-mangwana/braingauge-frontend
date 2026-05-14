import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";

// ── Custom Tooltip ─────────────────────────────
function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;

  return (
    <div
      className="rounded-[var(--radius-md)] border border-[var(--color-border)] px-3 py-2 text-[12px]"
      style={{ background: "var(--color-surface)" }}
    >
      <p
        className="font-semibold mb-1"
        style={{ color: "var(--color-text)" }}
      >
        {label}
      </p>

      {payload.map((p) => (
        <p key={p.dataKey} style={{ color: p.color }}>
          {p.name}:{" "}
          <strong>
            {p.value}
            {p.dataKey === "accuracy" ? "%" : ""}
          </strong>
        </p>
      ))}
    </div>
  );
}

export default function ActivityChart({
  data = [],
  difficultyBreakdown = [],
  loading = false,
}) {
  console.log(data, difficultyBreakdown)
  if (loading) {
    return (
      <div
        className="rounded-[var(--radius-lg)] border border-[var(--color-border)] p-6"
        style={{ background: "var(--color-surface)" }}
      >
        <p style={{ color: "var(--color-muted)" }}>
          Loading activity...
        </p>
      </div>
    );
  }

  return (
    <div
      className="rounded-[var(--radius-lg)] border border-[var(--color-border)] p-6"
      style={{ background: "var(--color-surface)" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h2
          className="text-[15px] font-bold"
          style={{
            fontFamily: "var(--font-display)",
            color: "var(--color-text)",
          }}
        >
          Weekly Activity
        </h2>

        <select
          className="text-[12px] border border-[var(--color-border)] rounded-[var(--radius-sm)] px-2 py-1 outline-none cursor-pointer"
          style={{
            background: "var(--color-surface)",
            color: "var(--color-muted)",
          }}
        >
          <option>Last 7 days</option>
          <option>Last 30 days</option>
        </select>
      </div>

      {/* Empty State */}
      {data?.length === 0 ? (
        <div className="h-[180px] flex items-center justify-center">
          <p style={{ color: "var(--color-muted)" }}>
            No activity data available
          </p>
        </div>
      ) : (
        <div className="h-[180px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              barGap={4}
              barCategoryGap="30%"
            >
              <CartesianGrid
                vertical={false}
                stroke="var(--color-border)"
                strokeDasharray="3 3"
              />

              <XAxis
                dataKey="day"
                axisLine={false}
                tickLine={false}
                tick={{
                  fontSize: 11,
                  fill: "var(--color-muted)",
                }}
              />

              <YAxis
                yAxisId="quizzes"
                orientation="left"
                axisLine={false}
                tickLine={false}
                tick={{
                  fontSize: 11,
                  fill: "var(--color-muted)",
                }}
                width={24}
              />

              <YAxis
                yAxisId="accuracy"
                orientation="right"
                domain={[0, 100]}
                axisLine={false}
                tickLine={false}
                tick={{
                  fontSize: 11,
                  fill: "var(--color-muted)",
                }}
                width={28}
                tickFormatter={(v) => `${v}%`}
              />

              <Tooltip
                content={<CustomTooltip />}
                cursor={{
                  fill: "var(--color-bg)",
                  radius: 4,
                }}
              />

              <Legend
                iconSize={10}
                iconType="square"
                wrapperStyle={{
                  fontSize: 11,
                  paddingTop: 8,
                }}
              />

              <Bar
                yAxisId="quizzes"
                dataKey="quizzes"
                name="Quizzes"
                fill="var(--color-primary)"
                radius={[4, 4, 0, 0]}
              />

              <Bar
                yAxisId="accuracy"
                dataKey="accuracy"
                name="Accuracy %"
                fill="var(--color-primary-lt)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Difficulty Breakdown */}
      <div className="mt-5 pt-5 border-t border-[var(--color-border)]">
        <p
          className="text-[11px] font-semibold uppercase tracking-[0.5px] mb-3"
          style={{ color: "var(--color-muted)" }}
        >
          Difficulty Breakdown
        </p>

        {difficultyBreakdown?.length === 0 ? (
          <p
            className="text-[12px]"
            style={{ color: "var(--color-muted)" }}
          >
            No difficulty data available
          </p>
        ) : (
          <div className="flex flex-col gap-[10px]">
            {difficultyBreakdown.map((item, index) => (
              <div
                key={item?.label || index}
                className="flex items-center gap-[10px]"
              >
                <span
                  className="text-[12px] font-semibold w-[52px] flex-shrink-0"
                  style={{
                    color:
                      item?.color || "var(--color-primary)",
                  }}
                >
                  {item?.label}
                </span>

                <div
                  className="flex-1 h-2 rounded-full overflow-hidden"
                  style={{ background: "var(--color-bg)" }}
                >
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${item?.pct || 0}%`,
                      background:
                        item?.color || "var(--color-primary)",
                    }}
                  />
                </div>

                <span
                  className="text-[12px] font-semibold w-8 text-right flex-shrink-0"
                  style={{
                    color:
                      item?.color || "var(--color-primary)",
                  }}
                >
                  {item?.pct || 0}%
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}