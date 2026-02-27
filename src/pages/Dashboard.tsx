import { useAuth } from "@/contexts/AuthContext";
import ScanTransparencyPanel from "@/components/ScanTransparencyPanel";

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="max-w-6xl mx-auto py-8 px-6 space-y-8">
      {/* Header */}
      <div className="surface-card p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Welcome back</p>
            <p className="text-3xl font-display mt-2">{user?.name}</p>
            <p className="text-xs text-muted-foreground mt-2">Here's your security overview</p>
          </div>
          <div className="flex items-center gap-2 text-sm text-emerald-500">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
            Online
          </div>
        </div>
      </div>

      {/* Scan Transparency Panel */}
      <div>
        <h3 className="font-semibold text-foreground mb-4">Scan Transparency & Verification</h3>
        <ScanTransparencyPanel />
      </div>
    </div>
  );
}
