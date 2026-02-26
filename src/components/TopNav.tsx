import { NavLink as RouterNavLink } from "react-router-dom";
import { Shield } from "lucide-react";
import SelfDestructTimer from "./SelfDestructTimer";

const links = [
  { label: "Home", to: "/" },
  { label: "Scanner", to: "/scanner" },
  { label: "Dashboard", to: "/dashboard" },
  { label: "Reports", to: "/reports" },
  { label: "Exploits", to: "/exploits" },
];

export default function TopNav() {
  return (
    <header className="sticky top-0 z-50 flex h-14 items-center justify-between border-b border-border bg-background/80 backdrop-blur-md px-6">
      <div className="flex items-center gap-8">
        <RouterNavLink to="/" className="flex items-center gap-2 text-foreground">
          <Shield className="h-5 w-5 text-primary" />
          <span className="text-sm font-semibold tracking-tight">Bounty</span>
        </RouterNavLink>

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
      </div>

      <SelfDestructTimer />
    </header>
  );
}
