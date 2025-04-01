import * as React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  Microscope,
  Settings,
  Menu,
  X,
  Gem,
  Zap,
  Coins,
  Icon,
  Milestone,
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile"; // Zaimportuj hook z odpowiedniej ścieżki
import { ResourceData, ResourceType } from "@/store/types";
import { useGame } from "@/context/GameContext";
import { ResourcesIcon } from "@/config";
import { formatNumber } from "@/lib/utils";
import { getSettings } from "@/pages/Settings";

const links = [
  { path: "/", label: "Home", icon: <Home className="h-5 w-5" /> },
  {
    path: "/tech",
    label: "Tech",
    icon: <Microscope className="h-5 w-5" />,
  },
  {
    path: "/milestones",
    label: "Milestones",
    icon: <Milestone className="h-5 w-5" />,
  },
];

const MobileNav = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

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
        <Link to="/settings">
          <button
            // onClick={() => setIsMenuOpen(true)}
            className={`flex flex-col items-center gap-1 p-2 text-xs font-medium transition-colors ${
              location.pathname === "/settings"
                ? "text-blue-400"
                : "text-foreground/60 hover:text-foreground"
            }`}
          >
            <Settings className="h-5 w-5" />
            <span>Settings</span>
          </button>
        </Link>
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
                    ? "bg-blue-100/20 text-blue-400"
                    : "text-foreground/80 hover:bg-accent/10"
                }`}
              >
                {link.icon}
                <span>{link.label}</span>
              </Link>
            ))}
          </div>

          <div className="flex items-center justify-center content-center gap-4">
            <Link
              to="/settings"
              className={`h-10 w-10 flex items-center justify-center content-center rounded-md transition-colors ${
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
  const settings = getSettings();

  if (isMobile === undefined) return null; // Możesz dodać placeholder ładowania
  return isMobile || settings.compactUIOptions?.alwaysMobileNavbar ? (
    <MobileNav />
  ) : (
    <DesktopNav />
  );
};

export const MobileTopNav = () => {
  const isMobile = useIsMobile();
  const { state } = useGame();
  const { resources } = state;
  const settings = getSettings();

  if (!isMobile && !settings?.compactUIOptions?.alwaysMobileNavbar) return null;

  return (
    <nav className="fixed top-0 left-0 z-50 w-full border-b bg-background/95 min-[700px]:p-2">
      <div className="grid grid-cols-1 h-12 items-center justify-between px-4">
        {/* Lewa strona - surowce z animacjami */}
        <div className="grid grid-flow-col gap-[1vw] min-[400px]:gap-[3vw] items-center justify-center content-center w-full">
          {Object.values(resources).map((resource, key) => (
            <div
              key={key}
              className="flex items-center  group relative min-[750px]:w-[100px] max-[750px]:w-[80px] max-[600px]:w-[60px] max-[435px]:w-[58px]"
              title={`${key}: ${formatNumber(resource.amount)} (${
                resource.production
              }/${resource.consumption})`}
            >
              {/* Wartość z animacją zmian */}
              <div className="flex flex-col max-[400px]:min-w-[20px] min-w-[30px]">
                <div className="flex items-center justify-start">
                  <div className="max-[400px]:mr-1 mr-3 min-[400px]:w-3 min-[400px]:h-3 flex items-center justify-center transition-transform duration-200">
                    <span className="max-[700px]:text-[10px] text-[1rem]">
                      {resource.icon}
                    </span>
                  </div>
                  <span
                    className={`max-[400px]:text-xs max-[700px]:text-sm min-[700px]:text-[1.1rem]  font-medium transition-colors ${
                      resource.production > resource.consumption
                        ? "text-green-400/90"
                        : "text-red-400/90"
                    }`}
                  >
                    {" "}
                    {formatNumber(Number(resource.amount.toFixed(0)))}
                  </span>
                </div>

                {/* Mini-wskaźnik produkcji */}
                <div className="flex items-center max-[400px]:gap-[5px] gap-1 max-[700px]:text-[10px] text-[1rem] text-xs min-[700px]:mb-1">
                  <span className="text-green-400/80">
                    +{formatNumber(resource.production)}
                  </span>
                  <span className="text-red-400/80">
                    -{formatNumber(Number(resource.consumption.toFixed(2)))}
                  </span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-700 ">
                <div
                  className="h-full bg-current transition-all duration-500"
                  style={{
                    width: `${Math.min(
                      (resource.amount / resource.capacity) * 100,
                      100
                    )}%`,
                    backgroundColor:
                      resource.production > resource.consumption
                        ? "#4ade80"
                        : "#f87171",
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
