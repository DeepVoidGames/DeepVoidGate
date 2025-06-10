import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Hacking from "./VoidDimensionMiniGames/Hacking";
import { useGame } from "@/context/GameContext";
import { Button } from "./ui/button";

type VoidDimensionInterfaceProps = {
  onReturn: () => void;
};

function VoidDimensionInterface({ onReturn }: VoidDimensionInterfaceProps) {
  // const { state } = useGame();
  const [isGameActive, setIsGameActive] = useState(false);

  const onHackSuccess = (score: number) => {
    console.log(score);
  };

  const handleGameStart = () => {
    setIsGameActive(true);
  };

  return (
    <div className="bg-black fixed inset-0 z-50 flex items-center justify-center">
      {!isGameActive ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className=""
        >
          <div className="text-center text-purple-400 p-5">
            <h1 className="text-5xl mb-6 font-bold">VOID DIMENSION</h1>
            <p className="text-xl mb-8">
              You&apos;ve breached the dimensional barrier
            </p>

            <Button
              onClick={handleGameStart}
              className="px-6 py-3 m-4 bg-purple-900 hover:bg-purple-700 rounded-lg"
            >
              Start Void Dive
            </Button>
            <Button
              onClick={onReturn}
              className="px-6 py-3 m-4 bg-red-900 hover:bg-red-700 rounded-lg"
            >
              Return to Reality
            </Button>
          </div>
        </motion.div>
      ) : (
        <Hacking onReturn={onReturn} onHackSuccess={onHackSuccess} />
      )}
    </div>
  );
}
{
  /*  */
}

export default VoidDimensionInterface;
