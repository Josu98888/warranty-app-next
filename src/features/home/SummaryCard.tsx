import type { LucideIcon } from "lucide-react";

interface SummaryCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
}

export default function SummaryCard({
  title,
  value,
  icon: Icon,
  iconBg,
  iconColor,
}: SummaryCardProps) {
  return (
    <article className="rounded-2xl bg-white p-4 sm:p-6 shadow-sm border border-slate-200">
      <div className="flex justify-between items-start gap-3">
        <div className="min-w-0">
          <h2 className="text-xs sm:text-sm text-slate-500">{title}</h2>

          <p className="mt-2 sm:mt-3 text-3xl sm:text-4xl font-bold text-slate-900">
            {value}
          </p>
        </div>

        <div
          className={`flex h-10 sm:h-14 w-10 sm:w-14 items-center justify-center rounded-xl flex-shrink-0 ${iconBg}`}
        >
          <Icon size={20} className={`sm:w-7 sm:h-7 ${iconColor}`} />
        </div>
      </div>
    </article>
  );
}
