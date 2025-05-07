// ToggleSwitch.jsx
import React from "react";

type ToggleSwitchProp = {
  title: string;
  description: string;
  isEnabled: boolean;
  onToggle: () => void;
};

export const ToggleSwitch: React.FC<ToggleSwitchProp> = ({
  title,
  description,
  isEnabled,
  onToggle,
}) => {
  return (
    <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors duration-200">
      <div className="flex flex-col">
        <span className="text-gray-200 font-medium">{title}</span>
        {description && (
          <span className="text-sm text-gray-400">{description}</span>
        )}
      </div>
      <div>
        <button
          onClick={onToggle}
          className={`w-12 h-6 rounded-full p-1 transition-colors duration-200 ${
            isEnabled ? "bg-blue-500" : "bg-gray-600"
          }`}
          aria-pressed={isEnabled}
          role="switch"
        >
          <div
            className={`bg-white w-4 h-4 rounded-full transform transition-transform duration-200 ${
              isEnabled ? "translate-x-6" : "translate-x-0"
            }`}
          />
        </button>
      </div>
    </div>
  );
};
