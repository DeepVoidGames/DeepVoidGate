import * as React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Microscope, Settings, Menu, X } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile"; // Zaimportuj hook z odpowiedniej ścieżki

const MobileNav = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const links = [
    { path: "/", label: "Home", icon: <Home className="h-5 w-5" /> },
    {
      path: "/tech",
      label: "Tech",
      icon: <Microscope className="h-5 w-5" />,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 z-50 w-full border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-6">
        {links.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className={`flex flex-col items-center gap-1 p-2 text-xs font-medium transition-colors ${
              location.pathname === link.path
                ? "text-foreground"
                : "text-foreground/60 hover:text-foreground"
            }`}
          >
            {link.icon}
            <span>{link.label}</span>
          </Link>
        ))}

        <button
          onClick={() => setIsMenuOpen(true)}
          className={`flex flex-col items-center gap-1 p-2 text-xs font-medium transition-colors ${
            location.pathname === "/settings"
              ? "text-blue-400"
              : "text-foreground/60 hover:text-foreground"
          }`}
        >
          <Settings className="h-5 w-5" />
          <span>Settings</span>
        </button>
      </div>

      {isMenuOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/50"
          onClick={() => setIsMenuOpen(false)}
        >
          <div className="absolute bottom-20 left-4 right-4 rounded-lg border bg-background p-4 shadow-lg">
            <div className="flex flex-col gap-2">
              <Link
                to="/settings"
                onClick={() => setIsMenuOpen(false)}
                className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                  location.pathname === "/settings"
                    ? "bg-blue-100/20 text-blue-400"
                    : "text-foreground/80 hover:bg-accent/10"
                }`}
              >
                <Settings className="h-5 w-5" />
                <span>Advanced Settings</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

const DesktopNav = () => {
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
    <nav className="fixed top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link
              to="/"
              className="flex items-center gap-2 text-lg font-semibold text-foreground/90"
            >
              <span>Deepvoid Gate</span>
            </Link>
          </div>

          <div className="flex items-center gap-2">
            {links.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`flex h-10 w-36 items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors p-1 ${
                  location.pathname === link.path
                    ? "bg-accent/20 text-foreground"
                    : "text-foreground/80 hover:bg-accent/10 hover:text-foreground"
                }`}
              >
                {link.icon}
                <span>{link.label}</span>
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <Link
              to="/settings"
              className={`h-10 w-10 items-center justify-center rounded-md transition-colors ${
                location.pathname === "/settings"
                  ? "bg-blue-100/20 text-blue-400"
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

const Navbar = () => {
  const isMobile = useIsMobile();

  if (isMobile === undefined) return null; // Możesz dodać placeholder ładowania
  return isMobile ? <MobileNav /> : <DesktopNav />;
};

export default Navbar;
