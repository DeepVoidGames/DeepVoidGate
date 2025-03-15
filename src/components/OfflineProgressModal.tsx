// components/OfflineProgressModal.tsx
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { OfflineReport } from "@/store/types";
import { ResourcesIcon } from "@/config";

const formatTime = (milliseconds: number): string => {
  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  const parts = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours % 24 > 0) parts.push(`${hours % 24}h`);
  if (minutes % 60 > 0) parts.push(`${minutes % 60}m`);
  if (seconds % 60 > 0) parts.push(`${seconds % 60}s`);

  return parts.join(" ") || "less than a second";
};

export const OfflineProgressModal = ({
  report,
  onClose,
}: {
  report: OfflineReport;
  onClose: () => void;
}) => {
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [onClose]);

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Offline Progress</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="text-center">
            <span className="text-muted-foreground">You were away for:</span>
            <div className="text-2xl font-bold text-primary">
              {formatTime(report.elapsedTime)}
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold">Resource Changes:</h3>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(report.resourceChanges).map(
                ([resource, change]) => (
                  <div
                    key={resource}
                    className="flex items-center justify-between p-2 bg-muted/50 rounded"
                  >
                    {ResourcesIcon({ resource })}
                    <span className="capitalize text-xs">{resource}</span>
                    <span
                      className={`font-mono text-xs ${
                        change >= 0 ? "text-green-500" : "text-red-500"
                      }`}
                    >
                      {change >= 0 ? "+" : ""}
                      {change.toFixed(2)}
                    </span>
                  </div>
                )
              )}
            </div>
          </div>

          <Button className="w-full mt-4" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
