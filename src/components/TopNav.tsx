import { NavLink as RouterNavLink, useNavigate } from "react-router-dom";
import { LogIn, LogOut, Shield, Menu } from "lucide-react";
import SelfDestructTimer from "./SelfDestructTimer";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { useAuth } from "@/contexts/AuthContext";

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

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
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
        <SelfDestructTimer />
        {isAuthenticated ? (
          <Button onClick={handleLogout} size="sm" variant="outline" className="rounded-full">
            <LogOut className="h-4 w-4" />
            Sign out
          </Button>
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
  );
}
