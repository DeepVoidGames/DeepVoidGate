// SaveLoadSection.jsx
import React from "react";
import { SettingsSection } from "./SettingsSection";

type SaveLoadSectionProps = {
  onCopySave: () => void;
  onLoadSave: () => void;
};

export const SaveLoadSection = ({
  onCopySave,
  onLoadSave,
}: SaveLoadSectionProps): React.ReactElement => {
  return (
    <SettingsSection
      title="Game Save Data"
      description="Manage your game save data"
    >
      <div className="flex flex-wrap gap-3">
        <button
          onClick={onCopySave}
          className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
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
              d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
            />
          </svg>
          Copy Save
        </button>
        <button
          onClick={onLoadSave}
          className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
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
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
            />
          </svg>
          Load Save
        </button>
      </div>
    </SettingsSection>
  );
};
