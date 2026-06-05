type Props = {
  title: string;

  children: React.ReactNode;
};

export default function FlightFormSection({ title, children }: Props) {
  return (
    <div>
      <h2 className="mb-6 border-b pb-3 text-2xl font-bold tracking-wider text-blue-600 uppercase">
        {title}
      </h2>

      {children}
    </div>
  );
}
