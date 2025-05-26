// Settings.jsx
import React, { useEffect, useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/server/AuthContext";
import { SettingsSection } from "@/components/Settings/SettingsSection";
import { ToggleSwitch } from "@/components/Settings/ToggleSwitch";
import { ModalSetting } from "@/components/Settings/ModalSetting";
import { SaveLoadSection } from "@/components/Settings/SaveLoadSection";
import { CloudSaveSection } from "@/components/Settings/CloudSaveSection";
import { UserProfileSection } from "@/components/Settings/UserProfileSection";
import { BUILDID, IMAGE_PATH } from "@/config";
import { cloudSaveGameState } from "@/server/cloudSaveGameState";
import { useGame } from "@/context/GameContext";
import { cloudLoadGameState } from "@/server/cloudLoadGameState";

// Settings type definition
export const defaultSettings = {
  compactUI: false,
  compactUIOptions: {
    showPlanetaryView: false,
    compactResourcesView: false,
    alwaysMobileNavbar: false,
    doubleNavbar: false,
    isScientificNotation: false,
  },
  analyticsConsent: true,
};

// Helper function to get settings from localStorage
export const getSettings = () => {
  try {
    const settings = JSON.parse(localStorage.getItem("settings"));
    return settings || defaultSettings;
  } catch (error) {
    console.error("Failed to parse settings:", error);
    return defaultSettings;
  }
};

function Settings() {
  const { session, loading } = useAuth();
  const { state } = useGame();
  const [settings, setSettings] = useState(defaultSettings);
  const [isLoadSaveModalOpen, setIsLoadSaveModalOpen] = useState(false);
  const [saveData, setSaveData] = useState("");
  const [isCloudLoadModalOpen, setIsCloudLoadModalOpen] = useState(false);
  const [cloudLoadKey, setCloudLoadKey] = useState(
    localStorage.getItem("custom_id") ?? ""
  );

  // Load settings on component mount
  useEffect(() => {
    setSettings(getSettings());
  }, []);

  // Update individual setting
  const updateSetting = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  // Update compact UI option
  const updateCompactUIOption = (key, value) => {
    setSettings((prev) => ({
      ...prev,
      compactUIOptions: {
        ...prev.compactUIOptions,
        [key]: value,
      },
    }));
  };

  // Save settings to localStorage
  const handleSaveSettings = () => {
    try {
      localStorage.setItem("settings", JSON.stringify(settings));
      toast({
        title: "Settings Saved",
        description: "Your settings have been saved successfully.",
        variant: "default",
      });
      setTimeout(() => window.location.reload(), 1000);
    } catch (error) {
      console.error("Failed to save settings:", error);
      toast({
        title: "Save Failed",
        description: "Could not save settings. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Handle cloud save
  const handleCloudSave = async () => {
    try {
      if (!session) {
        console.warn("User not authenticated");
        return;
      }

      await cloudSaveGameState(session, state);

      toast({
        title: "Game Saved to Cloud",
        description: `Your game has been saved`,
        variant: "default",
      });
    } catch (error) {
      console.error("Cloud save failed:", error);
      toast({
        title: "Cloud Save Failed",
        description: "Could not save game to cloud. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Handle cloud load
  const handleCloudLoadButton = async () => {
    if (!session) {
      console.warn("User not authenticated");
      return;
    }

    try {
      await cloudLoadGameState(state, cloudLoadKey);
      // Give a brief moment before reload
      setTimeout(() => window.location.reload(), 1000);
    } catch (error) {
      console.error("Load save failed:", error);
    }
  };

  // Load save data from paste
  const handleLoadSave = () => {
    if (!saveData.trim()) {
      toast({
        title: "Error",
        description: "Please paste save data first.",
        variant: "destructive",
      });
      return;
    }

    try {
      localStorage.setItem("deepvoidgate_save", saveData);
      toast({
        title: "Save Loaded",
        description: "Your game save has been loaded successfully.",
        variant: "default",
      });
      setIsLoadSaveModalOpen(false);
      setSaveData("");

      // Give a brief moment before reload
      setTimeout(() => window.location.reload(), 1000);
    } catch (error) {
      console.error("Load save failed:", error);
      toast({
        title: "Load Failed",
        description:
          "Could not load game save. Please check the format and try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/90 flex items-center justify-center p-4 mb-10 mt-20">
      <div className="glass-panel p-6 md:p-8 max-w-3xl w-full animate-fade-in rounded-xl shadow-lg">
        <div className="flex items-center mb-8 border-b border-gray-700 pb-4">
          <h1 className="text-3xl font-bold text-gray-100">Game Settings</h1>
        </div>

        <div className="space-y-8">
          {/* UI Settings Section */}
          <SettingsSection
            title="Interface"
            description="Customize how the game interface appears"
          >
            {/* Main Compact UI Toggle */}
            <ToggleSwitch
              title="Compact UI"
              description="Simplify interface elements for a cleaner look"
              isEnabled={settings.compactUI}
              onToggle={() => updateSetting("compactUI", !settings.compactUI)}
            />

            {/* Additional Compact UI Options */}
            {settings.compactUI && (
              <div className="ml-4 space-y-3 border-l-2 border-gray-700 pl-4 mt-4">
                <ToggleSwitch
                  title="Hide Planetary View"
                  description="Hide planetary view on the right (mobile bottom)"
                  isEnabled={settings.compactUIOptions.showPlanetaryView}
                  onToggle={() =>
                    updateCompactUIOption(
                      "showPlanetaryView",
                      !settings.compactUIOptions.showPlanetaryView
                    )
                  }
                />

                <ToggleSwitch
                  title="Compact Resources View"
                  description="Display resources in a compact view (desktop only)"
                  isEnabled={settings.compactUIOptions.compactResourcesView}
                  onToggle={() =>
                    updateCompactUIOption(
                      "compactResourcesView",
                      !settings.compactUIOptions.compactResourcesView
                    )
                  }
                />

                <ToggleSwitch
                  title="Always Mobile Navbar"
                  description="Display resources at the top and menu at the bottom"
                  isEnabled={settings.compactUIOptions.alwaysMobileNavbar}
                  onToggle={() =>
                    updateCompactUIOption(
                      "alwaysMobileNavbar",
                      !settings.compactUIOptions.alwaysMobileNavbar
                    )
                  }
                />

                <ToggleSwitch
                  title="Double Navbar"
                  description="Display second navbar with resources data"
                  isEnabled={settings.compactUIOptions.doubleNavbar}
                  onToggle={() =>
                    updateCompactUIOption(
                      "doubleNavbar",
                      !settings.compactUIOptions.doubleNavbar
                    )
                  }
                />

                <ToggleSwitch
                  title="Scientific Notation"
                  description="Display numbers in scientific notation (e.g., 1500 → '1.5K' or '1.5e3')"
                  isEnabled={settings.compactUIOptions.isScientificNotation}
                  onToggle={() =>
                    updateCompactUIOption(
                      "isScientificNotation",
                      !settings.compactUIOptions.isScientificNotation
                    )
                  }
                />
              </div>
            )}

            {/* Save Settings Button */}
            <button
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              onClick={handleSaveSettings}
            >
              Save Settings
            </button>
          </SettingsSection>

          {/* User Profile Section (conditional) */}
          {session && <UserProfileSection session={session} />}

          {/* Cloud Save Management */}
          <CloudSaveSection
            onCloudSave={() => handleCloudSave()}
            onCloudLoad={() => setIsCloudLoadModalOpen(true)}
          />

          {/* Game Save Management */}
          <SaveLoadSection
            onCopySave={() => {
              navigator.clipboard.writeText(
                localStorage.getItem("deepvoidgate_save") || ""
              );
              toast({
                title: "Save Copied",
                description: "Save data has been copied to clipboard.",
                variant: "default",
              });
            }}
            onLoadSave={() => setIsLoadSaveModalOpen(true)}
          />

          {/* Community Section */}
          <SettingsSection
            title="Community"
            description="Connect with other players"
          >
            <div className="flex flex-wrap gap-4 p-3 bg-white/5 rounded-lg">
              <div className="max-[415px]:w-full">
                <a
                  href="https://discord.gg/JEbcXgaWzB"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 bg-indigo-600/60 hover:bg-indigo-700 px-4 py-2 rounded-lg transition-all duration-200"
                >
                  <img
                    src={`${IMAGE_PATH}discord.svg`}
                    className="w-5 h-5"
                    alt="Discord"
                  />
                  <span className="text-white">Join Discord</span>
                </a>
              </div>

              <div className="max-[415px]:w-full">
                <a
                  href="https://www.buymeacoffee.com/mrjacob"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center bg-yellow-600 hover:bg-yellow-700 px-4 py-2 rounded-lg transition-all duration-200"
                >
                  <img src={`${IMAGE_PATH}bmc.png`} alt="" className="h-5" />
                  <span className="pl-2">Buy Me a Coffee</span>
                </a>
              </div>
            </div>

            <div className="flex mt-4 w-full items-center content-between  border-t-[2px] border-gray-700 pt-4">
              <div className="text-xs text-gray-400 text-right w-full">
                BuildID: {BUILDID}
              </div>
            </div>
          </SettingsSection>
        </div>

        {/* Load Save Modal */}
        <ModalSetting
          isOpen={isLoadSaveModalOpen}
          title="Load Game Save"
          onClose={() => {
            setIsLoadSaveModalOpen(false);
            setSaveData("");
          }}
        >
          <p className="text-gray-300 mb-4">
            Paste your save data below. Warning: This will overwrite your
            current game!
          </p>
          <textarea
            value={saveData}
            onChange={(e) => setSaveData(e.target.value)}
            className="w-full h-64 bg-gray-700 text-gray-200 px-3 py-2 rounded-lg font-mono text-sm mb-4"
            placeholder="Paste your save data here..."
          />
          <div className="flex gap-2 justify-end">
            <button
              onClick={() => {
                setIsLoadSaveModalOpen(false);
                setSaveData("");
              }}
              className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleLoadSave}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
            >
              Load Save
            </button>
          </div>
        </ModalSetting>

        {/* Cloud Load Modal */}
        <ModalSetting
          isOpen={isCloudLoadModalOpen}
          title="Load Game from Cloud"
          onClose={() => {
            setIsCloudLoadModalOpen(false);
            setCloudLoadKey("");
          }}
        >
          <p className="text-gray-300 mb-4">
            Enter the key you used when saving your game to the cloud.
          </p>
          <input
            type="text"
            value={cloudLoadKey}
            onChange={(e) => setCloudLoadKey(e.target.value)}
            className="w-full bg-gray-700 text-gray-200 px-3 py-2 rounded-lg mb-4"
            placeholder="Your save key"
          />
          <div className="flex gap-2 justify-end">
            <button
              onClick={() => {
                setIsCloudLoadModalOpen(false);
                setCloudLoadKey("");
              }}
              className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleCloudLoadButton}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              disabled={loading}
            >
              Load from Cloud
            </button>
          </div>
        </ModalSetting>
      </div>
    </div>
  );
}

export default Settings;
