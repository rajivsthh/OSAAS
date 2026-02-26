import { useAuth } from "@/contexts/AuthContext";

const activeNow = {
  page: "/dashboard",
  time: "Just now",
  scans: 0,
  lastScan: "No scans yet",
};

export default function DashboardPage() {
  const { user } = useAuth();
  return (
    <div className="max-w-4xl mx-auto py-16 px-6">
      <div className="surface-card p-8">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Active now</p>
            <p className="text-3xl font-display mt-2">1 user online</p>
            <p className="text-xs text-muted-foreground mt-2">Signed in as {user?.name}</p>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
            Online
          </div>
        </div>

        <div className="mt-6">
          <div className="flex items-center justify-between text-sm">
            <div>
              <p className="font-medium text-foreground">{user?.name}</p>
              <p className="text-xs text-muted-foreground">
                {activeNow.scans} scans • Last scan {activeNow.lastScan}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">{activeNow.page}</p>
              <p className="text-xs text-muted-foreground">{activeNow.time}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
