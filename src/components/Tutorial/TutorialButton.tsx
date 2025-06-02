import React from "react";
import { HelpCircle } from "lucide-react";
import { useTutorial } from "./TutorialManager";

interface TutorialButtonProps {
  tutorialId: string;
  size?: "sm" | "md" | "lg";
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
}

export const TutorialButton: React.FC<TutorialButtonProps> = ({
  tutorialId,
  size = "md",
  variant = "ghost",
  className = "",
}) => {
  const { startTutorial, isAvailable, state } = useTutorial();

  const canStart = isAvailable(tutorialId) && !state.activeTutorial;

  const sizeClasses = {
    sm: "p-1",
    md: "p-2",
    lg: "p-3",
  };

  const variantClasses = {
    primary: "bg-blue-500 hover:bg-blue-600 text-white",
    secondary: "",
    ghost: "hover:bg-primary/80 hover:text-black text-gray-500 ",
  };

  const iconSizes = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5",
  };

  if (!canStart) return null;

  return (
    <button
      onClick={() => startTutorial(tutorialId)}
      className={`rounded-md transition-colors ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      title="Start tutorial"
    >
      <HelpCircle className={iconSizes[size]} />
    </button>
  );
};
