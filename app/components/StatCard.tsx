import { cn } from "@/lib/utils";

type Props = {
  title: string;
  value: string | number;
  color?: string;
  icon?: React.ReactNode;
};

export default function StatCard({ title, value, color = "text-white", icon }: Props) {
  return (
    <div className="group relative rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-md transition-all duration-300 hover:bg-white/[0.08] hover:border-white/20 hover:shadow-xl hover:shadow-black/20">
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/[0.08] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="relative">
        <div className="flex items-center justify-between">
          <p className="text-sm text-zinc-400">{title}</p>
          {icon && <div className="text-zinc-500">{icon}</div>}
        </div>
        <h2 className={cn("text-3xl font-bold mt-3", color)}>
          {value}
        </h2>
      </div>
    </div>
  );
}
