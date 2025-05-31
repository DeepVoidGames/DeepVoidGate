import { pageview } from "@/server/analytics";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const Analytics = () => {
  const location = useLocation();

  useEffect(() => {
    if (typeof window !== "undefined" && typeof window.gtag === "function") {
      pageview(location.pathname + location.search);
    }
  }, [location]);

  return null;
};

export default Analytics;
