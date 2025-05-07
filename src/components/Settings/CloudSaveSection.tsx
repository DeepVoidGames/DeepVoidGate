// CloudSaveSection.jsx
import React from "react";
import { SettingsSection } from "./SettingsSection";
import { useAuth } from "@/server/AuthContext";
import { ServerOff } from "lucide-react";

type CloudSaveSectionProps = {
  onCloudSave: () => void;
  onCloudLoad: () => void;
};

export const CloudSaveSection = ({
  onCloudSave,
  onCloudLoad,
}: CloudSaveSectionProps) => {
  const { session } = useAuth();
  return (
    <SettingsSection
      title="Cloud Save"
      description="Save and load your game from the cloud"
    >
      {session ? (
        <>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={onCloudSave}
              className="flex-1 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all duration-200 flex items-center justify-center gap-2 max-[415px]:text-sm"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
              Cloud Save
            </button>
            <button
              onClick={onCloudLoad}
              className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-all duration-200 flex items-center justify-center gap-2 max-[415px]:text-sm"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"
                />
              </svg>
              Cloud Load
            </button>
          </div>
          <div className="mt-2 text-xs text-gray-400 italic">
            Offline save is stored in browser u can manually load save from
            cloud.
          </div>
          <div className="mt-2 text-xs text-gray-400 text-right">
            ID: {localStorage.getItem("custom_id") ?? ""}
          </div>
        </>
      ) : (
        <div className="flex flex-col">
          <div className="flex items-center p-2 gap-2">
            {/* Main Server Icon */}
            <ServerOff size={16} className="text-red-500/60" />
            <p className="text-xs text-red-500/60">Server Offline</p>
          </div>
        </div>
      )}
    </SettingsSection>
  );
};
