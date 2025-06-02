import React from "react";

interface TutorialHighlightProps {
  children: React.ReactNode;
  tutorialId?: string;
  stepId?: string;
  className?: string;
}

export const TutorialHighlight: React.FC<TutorialHighlightProps> = ({
  children,
  tutorialId,
  stepId,
  className = "",
}) => {
  return (
    <div
      className={`tutorial-target ${className}`}
      data-tutorial-id={tutorialId}
      data-step-id={stepId}
    >
      {children}
    </div>
  );
};
