import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/90 flex items-center justify-center p-4">
      <div className="glass-panel p-8 max-w-md text-center animate-scale-in">
        <span className="text-6xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/70">
          404
        </span>
        <p className="text-xl text-muted-foreground mb-6">
          Signal lost. This sector of space is uncharted.
        </p>
        <Button asChild className="button-primary">
          <Link to="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Return to Colony
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
