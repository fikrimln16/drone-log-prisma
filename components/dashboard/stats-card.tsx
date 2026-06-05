type Props = {
  title: string;

  value: string | number;

  trend: string;

  subtitle: string;

  icon: React.ReactNode;

  iconBg: string;
};

export default function StatsCard({
  title,
  value,
  trend,
  subtitle,
  icon,
  iconBg,
}: Props) {
  const positive = Number(trend.replace("%", "")) >= 0;

  return (
    <div className="rounded-[28px] border bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold tracking-wide text-gray-500 uppercase">
            {title}
          </p>

          <h1 className="mt-4 text-5xl font-bold">{value}</h1>

          <div className="mt-4 flex items-center gap-2">
            <span
              className={`text-sm font-semibold ${
                positive ? "text-green-600" : "text-red-600"
              }`}
            >
              {trend}
            </span>

            <span className="text-sm text-gray-500">{subtitle}</span>
          </div>
        </div>

        <div className={`rounded-2xl p-5 ${iconBg}`}>{icon}</div>
      </div>
    </div>
  );
}
