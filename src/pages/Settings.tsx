import React, { useEffect } from "react";
import { toast } from "@/components/ui/use-toast";

type SettingsType = {
  compactUI: boolean;
  compactUIOptions: {
    showPlanetaryView: boolean;
    compactResourcesView: boolean;
    alwaysMobileNavbar: boolean;
    doubleNavbar: boolean;
  };
  analyticsConsent: boolean;
};

export const getSettings = (): SettingsType => {
  const settings = JSON.parse(localStorage.getItem("settings"));
  return (
    settings || {
      compactUI: false,
      compactUIOptions: {},
      analyticsConsent: false,
      doubleNavbar: false,
    }
  );
};

function Settings() {
  const [compactUI, setCompactUI] = React.useState(false);
  const [compactUIOptions, setCompactUIOptions] = React.useState({
    showPlanetaryView: false,
    compactResourcesView: false,
    alwaysMobileNavbar: false,
    doubleNavbar: false,
  });
  const [analyticsConsent, setAnalyticsConsent] = React.useState(true);
  const [isVerificationModalOpen, setIsVerificationModalOpen] =
    React.useState(false);
  const [email, setEmail] = React.useState("");
  const [verificationCode, setVerificationCode] = React.useState("");
  const [isLoadSaveModalOpen, setIsLoadSaveModalOpen] = React.useState(false);
  const [saveData, setSaveData] = React.useState("");

  useEffect(() => {
    handleLoadSettings();
  }, []);

  const handleCloudSaveEnable = () => {
    // Tutaj będzie logika weryfikacji kodu
    setIsVerificationModalOpen(false);
    // Wyczyść pola po zamknięciu
    setVerificationCode("");
  };

  const handleSaveSettings = () => {
    localStorage.setItem(
      "settings",
      JSON.stringify({
        compactUI,
        compactUIOptions,
        analyticsConsent,
      })
    );
    toast({
      title: "Settings Saved",
      description: "Your settings have been saved successfully.",
      variant: "default",
    });
    window.location.reload();
  };

  const handleLoadSettings = () => {
    const settings = JSON.parse(localStorage.getItem("settings"));
    if (settings) {
      setCompactUI(settings.compactUI);
      setAnalyticsConsent(settings.analyticsConsent);
      setCompactUIOptions({
        showPlanetaryView:
          settings.compactUIOptions?.showPlanetaryView || false,
        compactResourcesView:
          settings.compactUIOptions?.compactResourcesView || false,
        alwaysMobileNavbar:
          settings.compactUIOptions?.alwaysMobileNavbar || false,
        doubleNavbar: settings.compactUIOptions?.doubleNavbar || false,
      });
    }
  };

  const devSection = (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-100 mb-2">
        Game save data
      </h2>

      <div className="flex">
        <button
          onClick={() => {
            navigator.clipboard.writeText(
              localStorage.getItem("deepvoidgate_save")
            );
            toast({
              title: "Save Copied",
              description: "Save has been copied to clipboard.",
              variant: "default",
            });
          }}
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 p-2 m-1"
        >
          Copy Save
        </button>
        <button
          onClick={() => setIsLoadSaveModalOpen(true)}
          className="w-full py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200 p-2 m-1"
        >
          Load Save
        </button>
      </div>
    </div>
  );

  // Dodajemy nowy modal
  const loadSaveModal = (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="glass-panel p-6 max-w-xl w-full space-y-4">
        <h3 className="text-xl font-bold text-gray-100">Load Game Save</h3>
        <p className="text-gray-300">
          Paste your save data below. Warning: This will overwrite your current
          game!
        </p>
        <textarea
          value={saveData}
          onChange={(e) => setSaveData(e.target.value)}
          className="w-full h-64 bg-gray-700 text-gray-200 px-3 py-2 rounded-lg font-mono text-sm"
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
            onClick={() => {
              if (saveData) {
                localStorage.setItem("deepvoidgate_save", saveData);
                window.location.reload();
              }
            }}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
          >
            Load Save
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/90 flex items-center justify-center p-4 mb-10">
      <div className="glass-panel p-8 max-w-[800px] w-full animate-fade-in">
        <div className="flex items-center mb-6">
          <h1 className="text-3xl  font-bold text-gray-100">Game Settings</h1>
        </div>

        <div className="space-y-6">
          {/* Sekcja Interfejsu */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-100 mb-2">
              Interface
            </h2>

            {/* Główny przełącznik Compact UI */}
            <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
              <div className="flex flex-col">
                <span className="text-gray-200">Compact UI</span>
                <span className="text-sm text-gray-400">
                  Simplify interface elements
                </span>
              </div>
              <div>
                <button
                  onClick={() => setCompactUI(!compactUI)}
                  className={`w-12 h-6 rounded-full p-1 transition-colors duration-200 ${
                    compactUI ? "bg-blue-500" : "bg-gray-600"
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full transform transition-transform duration-200 ${
                      compactUI ? "translate-x-6" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Dodatkowe opcje widoczne tylko gdy Compact UI jest włączone */}
            {compactUI && (
              <div className="ml-4 space-y-3 border-l-2 border-gray-700 pl-4">
                <div className="flex justify-between items-center p-2 bg-white/5 rounded-lg">
                  <div className="flex flex-col">
                    <span className="text-gray-200">Hide Planetary View</span>
                    <span className="text-xs text-gray-400 ">
                      Hide display planetary view on the right (mobile bottom).
                    </span>
                  </div>
                  <div>
                    <button
                      onClick={() =>
                        setCompactUIOptions({
                          showPlanetaryView:
                            !compactUIOptions.showPlanetaryView,
                          compactResourcesView:
                            compactUIOptions.compactResourcesView,
                          alwaysMobileNavbar:
                            compactUIOptions.alwaysMobileNavbar,
                          doubleNavbar: compactUIOptions.doubleNavbar,
                        })
                      }
                      className={`w-12 h-6 rounded-full p-1 transition-colors duration-200 ${
                        compactUIOptions?.showPlanetaryView
                          ? "bg-blue-500"
                          : "bg-gray-600"
                      }`}
                    >
                      <div
                        className={`bg-white w-4 h-4 rounded-full transform transition-transform duration-200 ${
                          compactUIOptions?.showPlanetaryView
                            ? "translate-x-6"
                            : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>
                </div>

                <div className="flex justify-between items-center p-2 bg-white/5 rounded-lg">
                  <div className="flex flex-col">
                    <span className="text-gray-200">
                      Compact Resources View
                    </span>
                    <span className="text-xs text-gray-400 ">
                      Display resources in a compact view. Desktop only.
                    </span>
                  </div>
                  <div>
                    <button
                      onClick={() =>
                        setCompactUIOptions({
                          showPlanetaryView: compactUIOptions.showPlanetaryView,
                          compactResourcesView:
                            !compactUIOptions.compactResourcesView,
                          alwaysMobileNavbar:
                            compactUIOptions.alwaysMobileNavbar,
                          doubleNavbar: compactUIOptions.doubleNavbar,
                        })
                      }
                      className={`w-12 h-6 rounded-full p-1 transition-colors duration-200 ${
                        compactUIOptions.compactResourcesView
                          ? "bg-blue-500"
                          : "bg-gray-600"
                      }`}
                    >
                      <div
                        className={`bg-white w-4 h-4 rounded-full transform transition-transform duration-200 ${
                          compactUIOptions.compactResourcesView
                            ? "translate-x-6"
                            : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>
                </div>

                <div className="flex justify-between items-center p-2 bg-white/5 rounded-lg">
                  <div className="flex flex-col">
                    <span className="text-gray-200">Always Mobile Navbar</span>
                    <span className="text-xs text-gray-400 ">
                      Display resources at the top and the menu at the bottom.
                    </span>
                  </div>
                  <div>
                    <button
                      onClick={() =>
                        setCompactUIOptions({
                          showPlanetaryView:
                            compactUIOptions?.showPlanetaryView,
                          compactResourcesView:
                            compactUIOptions?.compactResourcesView,
                          alwaysMobileNavbar:
                            !compactUIOptions?.alwaysMobileNavbar,
                          doubleNavbar: compactUIOptions.doubleNavbar,
                        })
                      }
                      className={`w-12 h-6 rounded-full p-1 transition-colors duration-200 ${
                        compactUIOptions?.alwaysMobileNavbar
                          ? "bg-blue-500"
                          : "bg-gray-600"
                      }`}
                    >
                      <div
                        className={`bg-white w-4 h-4 rounded-full transform transition-transform duration-200 ${
                          compactUIOptions?.alwaysMobileNavbar
                            ? "translate-x-6"
                            : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>
                </div>

                <div className="flex justify-between items-center p-2 bg-white/5 rounded-lg">
                  <div className="flex flex-col">
                    <span className="text-gray-200">Double Navbar</span>
                    <span className="text-xs text-gray-400 ">
                      Display second navbar with resources data.
                    </span>
                  </div>
                  <div>
                    <button
                      onClick={() =>
                        setCompactUIOptions({
                          showPlanetaryView:
                            compactUIOptions?.showPlanetaryView,
                          compactResourcesView:
                            compactUIOptions?.compactResourcesView,
                          alwaysMobileNavbar:
                            compactUIOptions?.alwaysMobileNavbar,
                          doubleNavbar: !compactUIOptions.doubleNavbar,
                        })
                      }
                      className={`w-12 h-6 rounded-full p-1 transition-colors duration-200 ${
                        compactUIOptions?.doubleNavbar
                          ? "bg-blue-500"
                          : "bg-gray-600"
                      }`}
                    >
                      <div
                        className={`bg-white w-4 h-4 rounded-full transform transition-transform duration-200 ${
                          compactUIOptions?.doubleNavbar
                            ? "translate-x-6"
                            : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sekcja Cloud Save z emailem */}
          <div className="space-y-4">
            {/* <h2 className="text-xl font-semibold text-gray-100 mb-2">
              Cloud Save (Not Implemented)
            </h2>
            <div className="p-3 bg-white/5 rounded-lg space-y-4">
              <div className="flex flex-col gap-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-gray-700 text-gray-200 px-3 py-2 rounded-lg"
                />
                <button
                  onClick={() => setIsVerificationModalOpen(true)}
                  className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
                  disabled={true}
                >
                  Enable Cloud Save
                </button>
              </div>
            </div> */}
          </div>

          {/* Sekcja Analityki */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-100 mb-2">
              Privacy
            </h2>
            <div className="p-3 bg-white/5 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-gray-200">Analytics Consent</span>
                <button
                  onClick={() => setAnalyticsConsent(!analyticsConsent)}
                  className={`w-12 h-6 rounded-full p-1 transition-colors duration-200 ${
                    analyticsConsent ? "bg-green-500" : "bg-gray-600"
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full transform transition-transform duration-200 ${
                      analyticsConsent ? "translate-x-6" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Sekcja Społeczności */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-100 mb-2">
              Community
            </h2>
            <div className="p-3 bg-white/5 rounded-lg">
              <a href="https://discord.gg/JEbcXgaWzB" target="_blank">
                <img
                  src={`${"/deepvoidgate/demo/"}/discord.svg`}
                  className="w-8"
                />
              </a>
            </div>
          </div>

          {/* Dev */}
          {devSection}

          {/* Przycisk zapisywania */}
          <button
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
            onClick={handleSaveSettings}
          >
            Save Settings
          </button>
        </div>

        {isLoadSaveModalOpen && loadSaveModal}

        {/* Modal weryfikacyjny */}
        {isVerificationModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="glass-panel p-6 max-w-sm w-full space-y-4">
              <h3 className="text-xl font-bold text-gray-100">
                Verification Required
              </h3>
              <p className="text-gray-300">
                We've sent a verification code to your email. Please check your
                inbox.
              </p>
              <input
                type="text"
                placeholder="Enter verification code"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                className="w-full bg-gray-700 text-gray-200 px-3 py-2 rounded-lg"
              />
              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => setIsVerificationModalOpen(false)}
                  className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCloudSaveEnable}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Settings;
