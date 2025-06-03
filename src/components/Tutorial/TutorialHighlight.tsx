import React from "react";

interface TutorialHighlightProps {
  children: React.ReactNode;
  tutorialId?: string;
  stepId?: string;
  className?: string;
  targetSelector?: string;
}

export const TutorialHighlight: React.FC<TutorialHighlightProps> = ({
  children,
  tutorialId,
  stepId,
  className = "",
  targetSelector,
}) => {
  const stepClass = stepId
    ? stepId.replace(/([A-Z])/g, "-$1").toLowerCase()
    : "";

  return (
    <div
      className={`tutorial-target ${stepClass} ${className}`}
      data-tutorial-id={tutorialId}
      data-step-id={stepId}
      data-tutorial-target={stepClass}
    >
      {children}
    </div>
  );
};
