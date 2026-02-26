import { useState } from "react";
import { Github, AlertCircle, CheckCircle2, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface GitHubConnectProps {
  isOpen: boolean;
  onClose: () => void;
  onConnect: (repoUrl: string) => void;
  scanning?: boolean;
}

export default function GitHubConnect({ isOpen, onClose, onConnect, scanning = false }: GitHubConnectProps) {
  const [method, setMethod] = useState<"oauth" | "url" | null>(null);
  const [repoUrl, setRepoUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [oauthCode, setOauthCode] = useState("");

  const GITHUB_CLIENT_ID = "your-github-client-id"; // Replace with actual ID from GitHub
  const REDIRECT_URI = `${window.location.origin}/github-callback`;

  const handleGitHubOAuth = () => {
    const authUrl = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=repo`;
    window.location.href = authUrl;
  };

  const handleUrlSubmit = async () => {
    if (!repoUrl.trim()) {
      toast.error("Please enter a GitHub repository URL");
      return;
    }

    // Validate GitHub URL format
    const githubUrlPattern = /^https:\/\/github\.com\/[\w-]+\/[\w-]+$/;
    if (!githubUrlPattern.test(repoUrl)) {
      toast.error("Invalid GitHub URL. Use: https://github.com/username/repo");
      return;
    }

    setIsLoading(true);
    try {
      // Attempt to fetch repo info to validate it exists
      const owner = repoUrl.split("/")[3];
      const repo = repoUrl.split("/")[4];
      
      const response = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
        headers: { Accept: "application/vnd.github.v3+json" },
      });

      if (!response.ok) {
        throw new Error("Repository not found or is private");
      }

      onConnect(repoUrl);
      toast.success(`Connected to ${owner}/${repo}`);
      setRepoUrl("");
      setMethod(null);
      onClose();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to connect to repository");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Github className="h-5 w-5" />
            Connect GitHub Repository
          </DialogTitle>
          <DialogDescription>
            Choose how you want to connect your GitHub repository for scanning
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {!method ? (
            <div className="grid grid-cols-2 gap-3">
              {/* Option 1: GitHub OAuth */}
              <button
                onClick={() => setMethod("oauth")}
                className="p-4 rounded-lg border-2 border-slate-200 dark:border-slate-700 hover:border-primary/50 transition-colors text-left space-y-2"
              >
                <div className="flex items-center gap-2">
                  <Github className="h-5 w-5" />
                  <span className="font-semibold text-sm">Connect Account</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Authenticate with GitHub and browse your repositories
                </p>
              </button>

              {/* Option 2: Repository URL */}
              <button
                onClick={() => setMethod("url")}
                className="p-4 rounded-lg border-2 border-slate-200 dark:border-slate-700 hover:border-primary/50 transition-colors text-left space-y-2"
              >
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5" />
                  <span className="font-semibold text-sm">Paste URL</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Enter a public GitHub repository URL directly
                </p>
              </button>
            </div>
          ) : method === "oauth" ? (
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800">
                <p className="text-sm text-blue-900 dark:text-blue-100 mb-3">
                  You'll be redirected to GitHub to authorize access to your repositories.
                </p>
                <Button
                  onClick={handleGitHubOAuth}
                  className="w-full gap-2 bg-black hover:bg-slate-900 text-white"
                  disabled={scanning}
                >
                  <Github className="h-4 w-4" />
                  Sign in with GitHub
                </Button>
              </div>
              <Button
                variant="outline"
                onClick={() => setMethod(null)}
                className="w-full"
              >
                Back
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Repository URL</label>
                <Input
                  placeholder="https://github.com/username/repository"
                  value={repoUrl}
                  onChange={(e) => setRepoUrl(e.target.value)}
                  disabled={scanning}
                />
                <p className="text-xs text-muted-foreground">
                  Enter the URL of your GitHub repository (public or private if authenticated)
                </p>
              </div>

              <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 flex gap-2">
                <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <p className="text-xs text-amber-700 dark:text-amber-200">
                  Format: <code className="bg-black/10 px-1 rounded">https://github.com/owner/repo-name</code>
                </p>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={handleUrlSubmit}
                  disabled={!repoUrl.trim() || scanning || isLoading}
                  className="flex-1"
                >
                  {isLoading ? "Connecting..." : "Connect Repository"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setMethod(null)}
                  disabled={scanning}
                >
                  Back
                </Button>
              </div>
            </div>
          )}
        </div>

        <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-lg text-xs space-y-2">
          <div className="flex items-start gap-2">
            <CheckCircle2 className="h-3.5 w-3.5 text-green-600 dark:text-green-400 mt-0.5 shrink-0" />
            <span className="text-muted-foreground">
              Scans are performed in a secure sandbox environment
            </span>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle2 className="h-3.5 w-3.5 text-green-600 dark:text-green-400 mt-0.5 shrink-0" />
            <span className="text-muted-foreground">
              Code is automatically removed after 15 seconds
            </span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
