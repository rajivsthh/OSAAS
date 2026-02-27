import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { CheckCircle, Copy, Shield, Clock } from "lucide-react";
import { toast } from "sonner";

export default function ScanTransparencyPanel() {
  const handleCopyHash = () => {
    navigator.clipboard.writeText("9f8a7c2b91fa38d2a7e6c1b4f9e3a8b2");
    toast.success("Hash copied to clipboard!");
  };

  return (
    <Card className="max-w-2xl mx-auto shadow-lg border-border">
      <CardHeader className="border-b bg-gradient-to-r from-green-50/50 to-emerald-50/50 dark:from-green-950/20 dark:to-emerald-950/20">
        <div className="flex items-center justify-between">
          <Badge className="bg-green-600 hover:bg-green-700 text-white px-3 py-1">
            <Shield className="h-3 w-3 mr-1.5" />
            🤖 Automated Security Bot Verified
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6 pt-6">
        {/* Scan Details Section */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-primary" />
            Scan Details
          </h3>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex justify-between p-3 rounded-lg bg-muted/30">
              <span className="text-muted-foreground">Scan ID:</span>
              <span className="font-semibold">48291</span>
            </div>
            <div className="flex justify-between p-3 rounded-lg bg-muted/30">
              <span className="text-muted-foreground">Status:</span>
              <Badge variant="outline" className="text-green-600 border-green-600">
                Completed
              </Badge>
            </div>
            <div className="flex justify-between p-3 rounded-lg bg-muted/30">
              <span className="text-muted-foreground">Risk Score:</span>
              <span className="font-semibold text-orange-600">72 / 100</span>
            </div>
            <div className="flex justify-between p-3 rounded-lg bg-muted/30">
              <span className="text-muted-foreground">Timestamp:</span>
              <span className="font-mono text-xs">2026-02-27 10:42 AM</span>
            </div>
          </div>
        </div>

        {/* Privacy & Isolation Status */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Shield className="h-4 w-4 text-blue-600" />
            Privacy & Isolation Status
          </h3>
          <div className="border border-blue-200 dark:border-blue-900 rounded-lg p-4 bg-blue-50/30 dark:bg-blue-950/20 space-y-2.5">
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle className="h-4 w-4 text-green-600 shrink-0" />
              <span>Scan executed in isolated environment</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle className="h-4 w-4 text-green-600 shrink-0" />
              <span>No cross-user data sharing</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle className="h-4 w-4 text-green-600 shrink-0" />
              <span>Encrypted processing</span>
            </div>
            <div className="flex items-center gap-2 text-sm pt-2 border-t border-blue-200 dark:border-blue-800">
              <Clock className="h-4 w-4 text-amber-600 shrink-0" />
              <span className="text-muted-foreground">Auto-delete in:</span>
              <span className="font-semibold text-amber-600">18h 42m</span>
            </div>
          </div>
        </div>

        {/* Verification Section */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Shield className="h-4 w-4 text-purple-600" />
            Verification Hash
          </h3>
          <div className="flex items-center gap-2 p-3 rounded-lg border bg-muted/30">
            <code className="flex-1 text-xs font-mono break-all text-muted-foreground">
              9f8a7c2b91fa38d2a7e6c1b4f9e3a8b2
            </code>
            <Button
              variant="ghost"
              size="sm"
              className="shrink-0 h-8 w-8 p-0"
              onClick={handleCopyHash}
            >
              <Copy className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>

        {/* Access Log Section */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-foreground">Access Log</h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/20">
              <span className="text-muted-foreground">You viewed report</span>
              <span className="text-xs font-mono">10:32 AM</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/20">
              <span className="text-muted-foreground">PDF downloaded</span>
              <span className="text-xs font-mono">10:35 AM</span>
            </div>
          </div>
        </div>

        {/* Hashtags */}
        <div className="pt-4 border-t">
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="px-2 py-1 rounded-full bg-primary/10 text-primary font-medium">
              #ZeroTrust
            </span>
            <span className="px-2 py-1 rounded-full bg-primary/10 text-primary font-medium">
              #PrivacyFirst
            </span>
            <span className="px-2 py-1 rounded-full bg-primary/10 text-primary font-medium">
              #IsolatedScan
            </span>
            <span className="px-2 py-1 rounded-full bg-primary/10 text-primary font-medium">
              #NoDataSharing
            </span>
            <span className="px-2 py-1 rounded-full bg-primary/10 text-primary font-medium">
              #Encrypted
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
