type Props = {
  label: string;

  value: string;

  onChange: (value: string) => void;

  error?: string;

  type?: string;
};

export default function FlightInput({
  label,
  value,
  onChange,
  error,
  type = "text",
}: Props) {
  return (
    <div>
      <label className="mb-2 block text-sm font-bold tracking-wide text-gray-600 uppercase">
        {label}
      </label>

      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`h-[64px] w-full rounded-2xl border bg-gray-50 px-5 text-lg outline-none ${
          error ? "border-red-500" : "border-gray-200"
        }`}
      />

      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
    </div>
  );
}
