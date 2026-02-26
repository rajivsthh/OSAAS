import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { ArrowRight, Lock, ShieldCheck, Sparkles } from "lucide-react";
import { type FormEvent, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";
import { toast } from "sonner";

export default function LoginPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [googleLoading, setGoogleLoading] = useState(false);
  const [authPhase, setAuthPhase] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    setAuthPhase("Redirecting to Google...");
    
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      setAuthPhase("Authenticating...");
      
      const result = await signInWithPopup(auth, googleProvider);
      
      await new Promise(resolve => setTimeout(resolve, 800));
      setAuthPhase("Verifying credentials...");
      
      await new Promise(resolve => setTimeout(resolve, 600));
      navigate("/dashboard");
    } catch (error: any) {
      toast.error(error.message || "Google login failed");
      setGoogleLoading(false);
      setAuthPhase("");
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const name = email.split("@")[0].replace(/[._]/g, " ").replace(/\b\w/g, l => l.toUpperCase());
    
    setEmailLoading(true);
    
    try {
      if (isSignUp) {
        // Create new account
        const result = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(result.user, { displayName: name });
        toast.success("Account created successfully!");
      } else {
        // Sign in with existing account
        await signInWithEmailAndPassword(auth, email, password);
        toast.success("Signed in successfully!");
      }
      navigate("/dashboard");
    } catch (error: any) {
      toast.error(error.message || "Authentication failed");
      setEmailLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,#f7f8fb_0%,#f6f3ee_55%,#f7eee0_100%)] text-slate-900">
      <div className="absolute inset-0 bg-[linear-gradient(110deg,rgba(15,23,42,0.05)_0%,rgba(15,23,42,0.01)_40%,rgba(251,191,36,0.05)_100%)]" />
      <div className="absolute -top-28 -right-10 h-56 w-56 rounded-full bg-sky-200/60 blur-3xl animate-float motion-reduce:animate-none" />

      <div className="relative z-10 mx-auto flex w-full max-w-md flex-col gap-6 px-6 py-16 font-serif">
        <div className="space-y-3 text-center">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1 text-[11px] font-medium text-slate-500 shadow-sm animate-fade-in motion-reduce:animate-none">
            <Sparkles className="h-3 w-3 text-emerald-500" />
            Secure access
          </div>
          <h1 className="text-3xl font-semibold leading-tight text-slate-900">Sign in to Apricity</h1>
          <p className="text-sm text-slate-600">Access your security workspace and reports.</p>
        </div>

        <div className="animate-fade-up motion-reduce:animate-none">
          <div className="rounded-2xl border border-white/70 bg-white/80 p-6 shadow-[0_26px_60px_-40px_rgba(15,23,42,0.3)] backdrop-blur">
            <div className="mb-5 space-y-1">
              <h2 className="text-lg font-semibold text-slate-900">Sign in</h2>
              <p className="text-xs text-slate-500">Use your company account to continue.</p>
            </div>

            <Button
              type="button"
              variant="outline"
              className="h-9 w-full justify-center border-slate-200 bg-white text-[13px] text-slate-900 hover:bg-white hover:border-slate-300 transition-colors disabled:opacity-70"
              onClick={handleGoogleLogin}
              disabled={googleLoading || emailLoading}
            >
              {googleLoading ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-slate-900" />
                  {authPhase}
                </>
              ) : (
                <>
                  <svg className="h-5 w-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  Continue with Google
                </>
              )}
            </Button>

            <div className="my-5 flex items-center gap-4 text-[11px] text-slate-400">
              <Separator className="bg-slate-200" />
              or
              <Separator className="bg-slate-200" />
            </div>

            <form className="space-y-3" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-600">
                  Work email
                </label>
                <Input
                  type="email"
                  name="email"
                  placeholder="you@company.com"
                  className="h-10 border-slate-200 bg-white text-sm text-slate-900 placeholder:text-slate-400 focus-visible:ring-slate-300"
                  required
                  disabled={emailLoading || googleLoading}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-600">
                  Password
                </label>
                <Input
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                  className="h-10 border-slate-200 bg-white text-sm text-slate-900 placeholder:text-slate-400 focus-visible:ring-slate-300"
                  required
                  disabled={emailLoading || googleLoading}
                />
              </div>

              <Button type="submit" className="h-10 w-full justify-center text-sm" disabled={emailLoading || googleLoading}>
                {emailLoading ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Signing in...
                  </>
                ) : (
                  <>
                    {isSignUp ? "Create Account" : "Continue"}
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </form>
            
            <p className="mt-4 text-xs text-slate-500 text-center">
              {isSignUp ? "Already have an account?" : "Don't have an account?"}
              <button
                type="button"
                className="ml-1 text-slate-700 underline underline-offset-2 hover:text-slate-900"
                onClick={() => setIsSignUp(!isSignUp)}
                disabled={emailLoading || googleLoading}
              >
                {isSignUp ? "Sign in" : "Create one"}
              </button>
            </p>

            <p className="mt-5 text-[11px] text-slate-500">
              By continuing, you agree to the
              <a className="ml-1 text-slate-700 underline underline-offset-4" href="/terms">
                Terms and Conditions
              </a>
              <span className="mx-1">and</span>
              <a className="text-slate-700 underline underline-offset-4" href="/privacy">
                Privacy Policy
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
