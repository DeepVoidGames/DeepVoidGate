import React, { useEffect, useState } from "react";
import { Lock } from "lucide-react";
import { useGame } from "@/context/GameContext";
import { MobileTopNav } from "@/components/Navbar";
import { Link } from "react-router-dom";
import { IMAGE_PATH } from "@/config";
import { getDominantFaction } from "@/store/reducers/factionsReducer";

type Feature = {
  id: string;
  name: string;
  description?: string; // Opis funkcji
  image: string;
  to: string; // Link do podstrony
  requiredTechnologies?: string[]; // Lista wymaganych technologii do odblokowania
};

const Hub = () => {
  const [unlockedFeatures, setUnlockedFeatures] = useState<string[]>([]);
  const { state } = useGame();

  // Przykładowe funkcje - można pobierać z API lub localStorage
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
      name: "3-1-5-2-4-6",
      description: "1⋆2≋1⋆4≋6⋆3≋5⋆2⊛≋2⋆2≋5⋆1≋6⋆1≋6⋆6",
      image: `${IMAGE_PATH}315246.png`,
      to: "#",
      requiredTechnologies: [],
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
  ];

  useEffect(() => {
    if (state.technologies) {
      // Technoloige to tablica z {} gdzie sa id
      const unlockedTechs = state.technologies
        .filter((tech) => tech.isResearched)
        .map((tech) => tech.id);
      const unlocked = features.filter((feature) =>
        feature.requiredTechnologies?.every((reqTech) =>
          unlockedTechs.includes(reqTech)
        )
      );
      const unlockedIds = unlocked.map((feature) => feature.id);
      setUnlockedFeatures(unlockedIds);
    }
  }, [state.technologies]);

  const isFeatureUnlocked = (featureId: string) => {
    return unlockedFeatures.includes(featureId);
  };

  return (
    <>
      <MobileTopNav />
      <div className="min-h-screen bg-gradient-to-b from-background to-background/90 flex items-center justify-center p-4">
        <div
          className={`glass-panel p-8 max-w-[800px] w-full animate-fade-in ${getDominantFaction(
            state
          )}`}
        >
          <div className="flex items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-100">Hub</h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {features.map((feature) => (
              <div
                key={feature.id}
                className="relative aspect-video rounded-lg overflow-hidden"
              >
                <Link to={feature.to}>
                  <div
                    className={`absolute inset-0 bg-cover bg-center transition-all duration-300 ${
                      !isFeatureUnlocked(feature.id)
                        ? "blur-sm"
                        : "hover:scale-105"
                    }`}
                    style={{ backgroundImage: `url(${feature.image})` }}
                  >
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center p-4">
                      <span className="text-2xl font-bold text-center text-gray-100">
                        <Link to={feature.to}>{feature.name}</Link>
                      </span>
                    </div>
                    {feature.description && (
                      <div className="absolute bottom-0 left-0 right-0 p-2 bg-black/50 text-gray-300 text-sm">
                        {feature.description}
                      </div>
                    )}
                  </div>

                  {!isFeatureUnlocked(feature.id) && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 backdrop-blur-sm">
                      <Lock className="text-gray-300" size={28} />
                      <span className="text-gray-300 text-sm">
                        Locked - Complete more missions to unlock
                      </span>
                    </div>
                  )}
                </Link>
              </div>
            ))}
          </div>

          <div className="mt-6 text-center text-gray-400 text-sm">
            <p>More features coming soon...</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Hub;
