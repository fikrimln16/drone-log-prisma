type Props = {
  filters: any;
};

export default function ExportFilter({ filters }: Props) {
  return (
    <div className="border-b bg-gray-50 px-8 py-6">
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search flight..."
          value={filters.search}
          onChange={(e) => filters.setSearch(e.target.value)}
          className="h-[54px] w-full rounded-2xl border bg-white px-5 outline-none"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-7">
        <Select
          label="Mission"
          value={filters.mission}
          onChange={filters.setMission}
          options={filters.missions}
        />

        <Select
          label="AMA"
          value={filters.ama}
          onChange={filters.setAma}
          options={filters.amas}
        />

        <Select
          label="Estate"
          value={filters.estate}
          onChange={filters.setEstate}
          options={filters.estates}
        />

        <Select
          label="Battery"
          value={filters.battery}
          onChange={filters.setBattery}
          options={filters.batteries}
        />

        <Select
          label="Pilot"
          value={filters.pilot}
          onChange={filters.setPilot}
          options={filters.pilots}
        />

        <DateInput
          label="Start Date"
          value={filters.startDate}
          onChange={filters.setStartDate}
        />

        <DateInput
          label="End Date"
          value={filters.endDate}
          onChange={filters.setEndDate}
        />
      </div>

      <div className="mt-5">
        <button
          onClick={filters.resetFilters}
          className="rounded-2xl border bg-white px-5 py-3 font-medium hover:bg-gray-100"
        >
          Reset Filters
        </button>
      </div>
    </div>
  );
}

function Select({ label, value, onChange, options }: any) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-gray-600">
        {label}
      </label>

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-[54px] w-full rounded-2xl border bg-white px-4 outline-none"
      >
        <option value="">All {label}</option>

        {options.map((item: string) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>
    </div>
  );
}

function DateInput({ label, value, onChange }: any) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-gray-600">
        {label}
      </label>

      <input
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-[54px] w-full rounded-2xl border bg-white px-4 outline-none"
      />
    </div>
  );
}
