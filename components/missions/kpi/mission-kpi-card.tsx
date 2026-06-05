type Props = {
  title: string;

  value: string | number;

  subtitle: string;

  icon?: React.ReactNode;
};

export default function MissionKpiCard({
  title,
  value,
  subtitle,
  icon,
}: Props) {
  return (
    <div className="rounded-[24px] border bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-bold tracking-[0.25em] text-gray-400 uppercase">
            {title}
          </p>

          <h1 className="mt-3 text-4xl font-bold tracking-tight">{value}</h1>

          <p className="mt-3 text-sm text-gray-500">{subtitle}</p>
        </div>

        {icon && (
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-100">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
