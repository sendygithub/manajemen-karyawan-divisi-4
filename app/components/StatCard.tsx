type Props = {
  title: string;
  value: string;
};

export default function StatCard({ title, value }: Props) {
  return (
    <div
      className="
        rounded-3xl
        border
        border-white/10
        bg-zinc-950
        p-6
      "
    >
      <p className="text-sm text-zinc-500">{title}</p>

      <h2 className="mt-3 text-3xl font-bold">{value}</h2>
    </div>
  );
}
