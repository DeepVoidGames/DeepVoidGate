import React, { useEffect, useState } from "react";
import { Lock } from "lucide-react";
import { useGame } from "@/context/GameContext";
import { MobileTopNav } from "@/components/Navbar";
import { Link } from "react-router-dom";
import { IMAGE_PATH } from "@/config";
import { getDominantFactionTheme } from "@/store/reducers/factionsReducer";
import { TutorialButton } from "@/components/Tutorial/TutorialButton";
import { TutorialHighlight } from "@/components/Tutorial/TutorialHighlight";
import { useTutorialIntegration } from "@/hooks/useTutorialIntegration";

type Feature = {
  id: string;
  name: string;
  description?: string;
  image: string;
  to: string;
  requiredTechnologies?: string[];
  requiredGalacticUpgrades?: string[];
};

const Hub = () => {
  const [unlockedFeatures, setUnlockedFeatures] = useState<string[]>([]);
  const { state } = useGame();
  const { isInTutorial, currentTutorial } = useTutorialIntegration();

  const features: Feature[] = [
    {
      id: "expedition",
      name: "Expedition",
      image: `${IMAGE_PATH}expeditionIcon.png`,
      to: "/expedition",
      requiredTechnologies: ["intra_planetary_expeditions_enablement"],
    },
    {
      id: "315246",
      name: "Logs",
      image: `${IMAGE_PATH}logs.png`,
      to: "/logs",
      requiredTechnologies: [],
      requiredGalacticUpgrades: [],
    },
    {
      id: "642513",
      name: "Artifacts",
      description: "",
      image: `${IMAGE_PATH}642513.png`,
      to: "/artifacts",
      requiredTechnologies: ["intra_planetary_expeditions_enablement"],
    },
    {
      id: "factions",
      name: "Factions",
      description: "",
      image: `${IMAGE_PATH}factions.png`,
      to: "/factions",
      requiredTechnologies: [],
    },
    {
      id: "colonization",
      name: "Colonization",
      description: "",
      image: `${IMAGE_PATH}colonization.png`,
      to: "/colonization",
      requiredTechnologies: [],
    },
    {
      id: "black_hole",
      name: "Black Hole",
      description: "",
      image: `${IMAGE_PATH}black_hole.png`,
      to: "/blackHole",
      requiredTechnologies: [],
      requiredGalacticUpgrades: ["black_hole_unknow"],
    },
  ];

  useEffect(() => {
    features.forEach((feature) => {
      if (
        feature.requiredTechnologies &&
        feature.requiredTechnologies.length > 0
      ) {
        const unlockedTechs = state.technologies
          .filter((tech) => tech.isResearched)
          .map((tech) => tech.id);

        if (
          feature.requiredTechnologies.every((reqTech) =>
            unlockedTechs.includes(reqTech)
          )
        ) {
          setUnlockedFeatures((prev) => [...prev, feature.id]);
        }
      }
      if (
        feature.requiredGalacticUpgrades &&
        feature.requiredGalacticUpgrades.length > 0
      ) {
        if (
          state.galacticUpgrades?.includes(feature.requiredGalacticUpgrades[0])
        ) {
          setUnlockedFeatures((prev) => [...prev, feature.id]);
        }
      } else {
        setUnlockedFeatures((prev) => [...prev, feature.id]);
      }
    });
  }, [state.technologies]);

  const isFeatureUnlocked = (featureId: string) => {
    return unlockedFeatures.includes(featureId);
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-background to-background/90 flex items-center justify-center p-4 mt-12">
        <div
          className={`glass-panel p-8 max-w-[800px] w-full animate-fade-in ${getDominantFactionTheme(
            state,
            {
              styleType: "border",
              opacity: 0.8,
            }
          )}`}
        >
          <div className="flex items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-100">Hub</h1>
            <TutorialButton tutorialId={"hub-basics"} />
          </div>

          <TutorialHighlight stepId="hub-grid" tutorialId="hub-basics">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {features.map((feature) => (
                <TutorialHighlight
                  stepId={
                    isFeatureUnlocked(feature.id)
                      ? "feature-card"
                      : "locked-feature"
                  }
                  tutorialId="hub-basics"
                >
                  <div
                    key={feature.id}
                    className="relative aspect-video rounded-lg overflow-hidden"
                  >
                    {isFeatureUnlocked(feature.id) ? (
                      <Link to={feature.to}>
                        <div
                          className={`absolute inset-0 bg-cover bg-center transition-all duration-300 hover:scale-105`}
                          style={{ backgroundImage: `url(${feature.image})` }}
                        >
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center p-4">
                            <span className="text-2xl font-bold text-center text-gray-100">
                              {feature.name}
                            </span>
                          </div>
                          {feature.description && (
                            <div className="absolute bottom-0 left-0 right-0 p-2 bg-black/50 text-gray-300 text-sm">
                              {feature.description}
                            </div>
                          )}
                        </div>
                      </Link>
                    ) : (
                      <div
                        className="absolute inset-0 bg-cover bg-center transition-all duration-300 blur-sm"
                        style={{ backgroundImage: `url(${feature.image})` }}
                      >
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center p-4">
                          <span className="text-2xl font-bold text-center text-gray-100">
                            {feature.name}
                          </span>
                        </div>
                        {feature.description && (
                          <div className="absolute bottom-0 left-0 right-0 p-2 bg-black/50 text-gray-300 text-sm">
                            {feature.description}
                          </div>
                        )}
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 backdrop-blur-sm">
                          <Lock className="text-gray-300" size={28} />
                          <span className="text-gray-300 text-sm">Locked</span>
                        </div>
                      </div>
                    )}
                  </div>
                </TutorialHighlight>
              ))}
            </div>
          </TutorialHighlight>
          <div className="mt-6 text-center text-gray-400 text-sm">
            <p>More features coming soon...</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Hub;
