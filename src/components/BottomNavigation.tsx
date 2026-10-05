import { Link } from "@tanstack/react-router";
import { Heart, Home, Search, User } from "lucide-react";

const items = [
  { to: "/inicio", label: "Inicio", icon: Home },
  { to: "/biblioteca", label: "Buscar", icon: Search },
  { to: "/mis-planecitos", label: "Mis planecitos", icon: Heart },
  { to: "/cuenta", label: "Perfil", icon: User },
] as const;

export function BottomNavigation() {
  return (
    <nav aria-label="Navegación principal" className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-light/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden">
      <ul className="grid grid-cols-4">
        {items.map(({ to, label, icon: Icon }) => (
          <li key={to}>
            <Link
              to={to}
              className="flex min-h-16 flex-col items-center justify-center gap-1 text-xs font-medium text-muted-foreground"
              activeProps={{ className: "text-ink [&_svg]:text-spark", "aria-current": "page" }}
            >
              <Icon className="h-6 w-6" />
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export const appNavItems = items;
