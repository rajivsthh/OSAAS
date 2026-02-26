import { cn } from "@/lib/utils";

type Severity = "critical" | "high" | "medium" | "low";

const styles: Record<Severity, string> = {
  critical: "bg-severity-critical/15 text-severity-critical border-severity-critical/30",
  high: "bg-severity-high/15 text-severity-high border-severity-high/30",
  medium: "bg-severity-medium/15 text-severity-medium border-severity-medium/30",
  low: "bg-severity-low/15 text-severity-low border-severity-low/30",
};

export default function SeverityBadge({ severity }: { severity: Severity }) {
  return (
    <span className={cn("inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider", styles[severity])}>
      {severity}
    </span>
  );
}
