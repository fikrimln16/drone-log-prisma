export default function DashboardPageSkeleton() {
  return (
    <div className="space-y-6">
      {/* KPI */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
        {[
          "Loading total flights...",
          "Loading duration...",
          "Loading battery status...",
          "Loading mission stats...",
        ].map((text, index) => (
          <div
            key={index}
            className="flex h-[170px] animate-pulse flex-col justify-between rounded-[28px] border bg-white p-6"
          >
            {/* TOP */}
            <div className="space-y-4">
              <div className="h-4 w-[120px] rounded-full bg-gray-200" />

              <div className="h-10 w-[80px] rounded-full bg-gray-200" />
            </div>

            {/* LOADING */}
            <div className="flex items-center gap-2">
              <div className="h-2.5 w-2.5 rounded-full bg-blue-500" />

              <p className="text-sm text-gray-400">{text}</p>
            </div>
          </div>
        ))}
      </div>

      {/* OPERATION */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
        {[
          "Loading active flights...",
          "Loading battery alerts...",
          "Loading latest upload...",
          "Loading pilot analytics...",
        ].map((text, index) => (
          <div
            key={index}
            className="flex h-[220px] animate-pulse flex-col justify-between rounded-[28px] border bg-white p-6"
          >
            {/* CONTENT */}
            <div className="space-y-4">
              <div className="h-4 w-[140px] rounded-full bg-gray-200" />

              <div className="h-10 w-[90px] rounded-full bg-gray-200" />

              <div className="h-3 w-[180px] rounded-full bg-gray-200" />
            </div>

            {/* LOADING */}
            <div className="flex items-center gap-2">
              <div className="h-2.5 w-2.5 rounded-full bg-green-500" />

              <p className="text-sm text-gray-400">{text}</p>
            </div>
          </div>
        ))}
      </div>

      {/* CHART */}
      <div className="flex h-[420px] animate-pulse flex-col justify-between rounded-[32px] border bg-white p-6">
        {/* TOP */}
        <div className="space-y-4">
          <div className="h-5 w-[180px] rounded-full bg-gray-200" />

          <div className="h-[280px] rounded-[24px] bg-gray-100" />
        </div>

        {/* LOADING */}
        <div className="flex items-center gap-2">
          <div className="h-2.5 w-2.5 rounded-full bg-purple-500" />

          <p className="text-sm text-gray-400">Loading analytics charts...</p>
        </div>
      </div>

      {/* TABLE */}
      <div className="flex h-[500px] animate-pulse flex-col rounded-[32px] border bg-white p-6">
        {/* HEADER */}
        <div className="mb-6 flex items-center justify-between">
          <div className="h-5 w-[180px] rounded-full bg-gray-200" />

          <div className="h-10 w-[140px] rounded-2xl bg-gray-200" />
        </div>

        {/* ROWS */}
        <div className="space-y-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="h-[54px] rounded-2xl bg-gray-100" />
          ))}
        </div>

        {/* FOOTER */}
        <div className="mt-auto flex items-center gap-2 pt-6">
          <div className="h-2.5 w-2.5 rounded-full bg-orange-500" />

          <p className="text-sm text-gray-400">Loading mission table...</p>
        </div>
      </div>
    </div>
  );
}
