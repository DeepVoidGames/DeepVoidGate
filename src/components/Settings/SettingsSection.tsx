import React from "react";

type SettingsSectionProps = {
  title: string;
  description: string;
  children: React.ReactNode;
};

export const SettingsSection: React.FC<SettingsSectionProps> = ({
  title,
  description,
  children,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex flex-col">
        <h2 className="text-xl font-semibold text-gray-100">{title}</h2>
        {description && <p className="text-sm text-gray-400">{description}</p>}
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  );
};
