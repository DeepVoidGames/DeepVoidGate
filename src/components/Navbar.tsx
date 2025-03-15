import { Link, useLocation } from "react-router-dom";
import { Home, Microscope, Settings } from "lucide-react";

const Navbar = () => {
  const location = useLocation();

  const links = [
    { path: "/", label: "Home", icon: <Home className="h-5 w-5" /> },
    {
      path: "/tech",
      label: "Tech",
      icon: <Microscope className="h-5 w-5" />,
    },
  ];

  return (
    <nav className="fixed left-0 top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Lewa strona - logo */}
          <div className="flex items-center">
            <Link
              to="/"
              className="flex items-center gap-2 text-lg font-semibold text-foreground/90"
            >
              <span className="hidden sm:inline">Deepvoid Gate</span>
            </Link>
          </div>

          {/* Środkowe linki */}
          <div className="hidden md:block">
            <div className="flex items-center gap-2">
              {links.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex h-10 w-36 items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors p-1
                    ${
                      location.pathname === link.path
                        ? "bg-accent/20 text-foreground" // Zmniejszona intensywność koloru
                        : "text-foreground/80 hover:bg-accent/10 hover:text-foreground"
                    }`}
                >
                  {link.icon}
                  <span>{link.label}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Prawa strona - ustawienia */}
          <div className="flex items-center">
            <Link
              to="/settings"
              className={`flex h-10 w-10 items-center justify-center rounded-md transition-colors
                ${
                  location.pathname === "/settings"
                    ? "bg-blue-100/20 text-blue-400" // Zmieniony kolor dla ustawień
                    : "text-foreground/80 hover:bg-accent/10"
                }`}
            >
              <Settings className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
