import { useState, useEffect } from "react";
import { NavLink as RouterNavLink, useNavigate } from "react-router-dom";
import { LogIn, LogOut, Shield, Menu } from "lucide-react";
import SelfDestructTimer from "./SelfDestructTimer";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const links = [
  { label: "Home", to: "/" },
  { label: "Scanner", to: "/scanner" },
  { label: "Dashboard", to: "/dashboard" },
  { label: "Reports", to: "/reports" },
  { label: "Exploits", to: "/exploits" },
];

export default function TopNav() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [timerActive, setTimerActive] = useState(false);
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const [currency, setCurrency] = useState<"USD" | "NPR">("USD");

  // Listen for report generation to activate timer
  useEffect(() => {
    const handleReportGenerated = () => {
      setTimerActive(true);
    };

    const handleCodeRemoved = () => {
      setTimerActive(false);
    };

    window.addEventListener("scanReportGenerated", handleReportGenerated);
    window.addEventListener("codeRemovedFromServer", handleCodeRemoved);

    return () => {
      window.removeEventListener("scanReportGenerated", handleReportGenerated);
      window.removeEventListener("codeRemovedFromServer", handleCodeRemoved);
    };
  }, []);

  useEffect(() => {
    if (!upgradeOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setUpgradeOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [upgradeOpen]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleUpgradeAction = (plan: "free" | "pro" | "team") => {
    if (plan === "free") {
      setUpgradeOpen(false);
      navigate("/scanner");
      return;
    }
    toast.info("Coming soon");
  };

  const handlePaymentComingSoon = () => {
    toast.info("Coming soon");
  };

  return (
    <>
      <header className="sticky top-0 z-50 flex h-14 items-center justify-between border-b border-border bg-background/80 backdrop-blur-md px-6">
        <div className="flex items-center gap-8">
        <RouterNavLink to="/" className="flex items-center gap-2 text-foreground">
          <Shield className="h-5 w-5 text-primary" />
          <span className="text-sm font-semibold tracking-tight">Bounty</span>
        </RouterNavLink>

        {/* desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <RouterNavLink
              key={l.to}
              to={l.to}
              end={l.to === "/"}
              className={({ isActive }) =>
                `px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`
              }
            >
              {l.label}
            </RouterNavLink>
          ))}
        </nav>

        {/* mobile menu trigger */}
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <button className="md:hidden p-2 rounded-md hover:bg-muted/20">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Open menu</span>
            </button>
          </SheetTrigger>
          <SheetContent side="right">
            <div className="flex flex-col gap-4">
              {links.map((l) => (
                <RouterNavLink
                  key={l.to}
                  to={l.to}
                  end={l.to === "/"}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `block px-4 py-2 rounded-md text-base font-medium transition-colors ${
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-foreground hover:bg-muted/50"
                    }`
                  }
                >
                  {l.label}
                </RouterNavLink>
              ))}
              <div className="mt-4 border-t border-border pt-4">
                {isAuthenticated ? (
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileOpen(false);
                    }}
                    className="flex w-full items-center gap-2 px-4 py-2 rounded-md text-base text-foreground hover:bg-muted/50"
                  >
                    <LogOut className="h-5 w-5" />
                    Sign out
                  </button>
                ) : (
                  <RouterNavLink
                    to="/login"
                    onClick={() => setMobileOpen(false)}
                    className="flex w-full items-center gap-2 px-4 py-2 rounded-md text-base text-foreground hover:bg-muted/50"
                  >
                    <LogIn className="h-5 w-5" />
                    Sign in
                  </RouterNavLink>
                )}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>

        <div className="flex items-center gap-3">
          <SelfDestructTimer isActive={timerActive} />
          {isAuthenticated ? (
            <>
              <Button
                onClick={() => setUpgradeOpen(true)}
                size="sm"
                className="rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600"
              >
                Upgrade
              </Button>
              <Button onClick={handleLogout} size="sm" variant="outline" className="rounded-full">
                <LogOut className="h-4 w-4" />
                Sign out
              </Button>
            </>
          ) : (
            <Button asChild size="sm" className="rounded-full">
              <RouterNavLink to="/login">
                <LogIn className="h-4 w-4" />
                Sign in
              </RouterNavLink>
            </Button>
          )}
        </div>
      </header>

      {upgradeOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4"
          onClick={() => setUpgradeOpen(false)}
        >
          <div
            className="w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl border border-border bg-background p-6 shadow-xl animate-in fade-in-0 zoom-in-95"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Pricing</p>
                <h2 className="text-2xl font-semibold">Upgrade your security scans</h2>
              </div>
              <Button size="sm" variant="outline" onClick={() => setUpgradeOpen(false)}>
                Close
              </Button>
            </div>

            <div className="mt-4 flex items-center gap-2 rounded-full border border-border bg-muted/40 p-1 w-fit">
              <button
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  currency === "USD"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                onClick={() => setCurrency("USD")}
                type="button"
              >
                USD
              </button>
              <button
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  currency === "NPR"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                onClick={() => setCurrency("NPR")}
                type="button"
              >
                NPR
              </button>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="surface-card rounded-xl border border-border p-5 flex flex-col gap-4">
                <div>
                  <h3 className="text-lg font-semibold">Free</h3>
                  <p className="text-xs text-muted-foreground">For quick checks</p>
                </div>
                <div className="text-xs text-muted-foreground space-y-2">
                  <p>5 scans/month</p>
                  <p>Basic detection</p>
                  <p>JSON export</p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleUpgradeAction("free")}
                  className="mt-auto"
                >
                  Get Started
                </Button>
              </div>

              <div className="surface-card rounded-xl border-2 border-blue-500 p-5 flex flex-col gap-4 relative shadow-lg shadow-blue-500/20">
                <span className="absolute -top-3 right-4 rounded-full bg-blue-500 px-3 py-1 text-[10px] font-semibold text-white">
                  Most Popular
                </span>
                <div>
                  <h3 className="text-lg font-semibold">Pro</h3>
                  <p className="text-xs text-muted-foreground">
                    {currency === "USD" ? "$9/month" : "Rs. 999/month"}
                  </p>
                  {currency === "NPR" && (
                    <p className="text-[11px] text-muted-foreground mt-1">
                      Prices in Nepalese Rupees • Local payment supported
                    </p>
                  )}
                </div>
                <div className="text-xs text-muted-foreground space-y-2">
                  <p>Unlimited scans</p>
                  <p>GitHub integration</p>
                  <p>PDF reports</p>
                  <p>Full OWASP coverage</p>
                </div>
                {currency === "USD" ? (
                  <Button
                    size="sm"
                    onClick={() => handleUpgradeAction("pro")}
                    className="mt-auto bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Get Started
                  </Button>
                ) : (
                  <div className="mt-auto grid grid-cols-2 gap-2">
                    <Button
                      size="sm"
                      onClick={handlePaymentComingSoon}
                      className="bg-[#60BB46] hover:bg-[#4ea43c] text-white px-3 py-2"
                    >
                      <img
                        src="https://esewa.com.np/common/images/esewa_logo.png"
                        alt="Esewa"
                        className="h-6 w-auto"
                        onError={(event) => {
                          (event.currentTarget as HTMLImageElement).style.display = "none";
                        }}
                      />
                    </Button>
                    <Button
                      size="sm"
                      onClick={handlePaymentComingSoon}
                      className="bg-[#5C2D91] hover:bg-[#4b2375] text-white px-3 py-2"
                    >
                      <span className="text-white text-xs font-semibold">Khalti</span>
                    </Button>
                  </div>
                )}
              </div>

              <div className="surface-card rounded-xl border border-border p-5 flex flex-col gap-4">
                <div>
                  <h3 className="text-lg font-semibold">Team</h3>
                  <p className="text-xs text-muted-foreground">
                    {currency === "USD" ? "$29/month" : "Rs. 2,999/month"}
                  </p>
                  {currency === "NPR" && (
                    <p className="text-[11px] text-muted-foreground mt-1">
                      Prices in Nepalese Rupees • Local payment supported
                    </p>
                  )}
                </div>
                <div className="text-xs text-muted-foreground space-y-2">
                  <p>Everything in Pro</p>
                  <p>Dashboard analytics</p>
                  <p>Priority support</p>
                </div>
                {currency === "USD" ? (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleUpgradeAction("team")}
                    className="mt-auto"
                  >
                    Get Started
                  </Button>
                ) : (
                  <div className="mt-auto grid grid-cols-2 gap-2">
                    <Button
                      size="sm"
                      onClick={handlePaymentComingSoon}
                      className="bg-[#60BB46] hover:bg-[#4ea43c] text-white px-3 py-2"
                    >
                      <img
                        src="https://esewa.com.np/common/images/esewa_logo.png"
                        alt="Esewa"
                        className="h-6 w-auto"
                        onError={(event) => {
                          (event.currentTarget as HTMLImageElement).style.display = "none";
                        }}
                      />
                    </Button>
                    <Button
                      size="sm"
                      onClick={handlePaymentComingSoon}
                      className="bg-[#5C2D91] hover:bg-[#4b2375] text-white px-3 py-2"
                    >
                      <span className="text-white text-xs font-semibold">Khalti</span>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
