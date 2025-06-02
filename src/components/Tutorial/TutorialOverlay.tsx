import React, { useEffect, useState, useRef } from "react";
import {
  X,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  SkipForward,
} from "lucide-react";
import { Tutorial } from "@/types/tutorials";

interface TutorialOverlayProps {
  tutorial: Tutorial;
  currentStep: number;
  onNext: () => void;
  onPrevious: () => void;
  onClose: () => void;
  onSkip: () => void;
  isVisible: boolean;
}

export const TutorialOverlay: React.FC<TutorialOverlayProps> = ({
  tutorial,
  currentStep,
  onNext,
  onPrevious,
  onClose,
  onSkip,
  isVisible,
}) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [highlightedElement, setHighlightedElement] = useState<Element | null>(
    null
  );
  const overlayRef = useRef<HTMLDivElement>(null);

  const step = tutorial.steps[currentStep];
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === tutorial.steps.length - 1;

  useEffect(() => {
    if (!step?.target || !isVisible) return;

    const targetElement = document.querySelector(step.target);
    if (!targetElement) return;

    const targetRect = targetElement.getBoundingClientRect();
    const overlayElement = overlayRef.current;
    if (!overlayElement) return;

    const overlayRect = overlayElement.getBoundingClientRect();
    const padding = 16;

    let x = 0,
      y = 0;

    switch (step.position) {
      case "top":
        x = targetRect.left + targetRect.width / 2 - overlayRect.width / 2;
        y = targetRect.top - overlayRect.height - padding;
        break;
      case "bottom":
        x = targetRect.left + targetRect.width / 2 - overlayRect.width / 2;
        y = targetRect.bottom + padding;
        break;
      case "left":
        x = targetRect.left - overlayRect.width - padding;
        y = targetRect.top + targetRect.height / 2 - overlayRect.height / 2;
        break;
      case "right":
        x = targetRect.right + padding;
        y = targetRect.top + targetRect.height / 2 - overlayRect.height / 2;
        break;
      default:
        x = window.innerWidth / 2 - overlayRect.width / 2;
        y = window.innerHeight / 2 - overlayRect.height / 2;
    }

    x = Math.max(
      padding,
      Math.min(x, window.innerWidth - overlayRect.width - padding)
    );
    y = Math.max(
      padding,
      Math.min(y, window.innerHeight - overlayRect.height - padding)
    );

    setPosition({ x, y });
  }, [step, currentStep, isVisible]);

  useEffect(() => {
    if (highlightedElement) {
      highlightedElement.classList.remove("tutorial-highlight");
    }

    if (!step?.target || !isVisible) {
      setHighlightedElement(null);
      return;
    }

    const targetElement = document.querySelector(step.target);
    if (targetElement) {
      targetElement.classList.add("tutorial-highlight");
      setHighlightedElement(targetElement);

      targetElement.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "center",
      });
    }

    return () => {
      if (targetElement) {
        targetElement.classList.remove("tutorial-highlight");
      }
    };
  }, [step, currentStep, isVisible]);

  const handleNext = () => {
    if (step?.nextCondition && !step.nextCondition()) return;
    onNext();
  };

  if (!isVisible || !step) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black bg-opacity-30 z-40"
        onClick={(e) => {
          if (step.target) {
            const targetElement = document.querySelector(step.target);
            if (targetElement) {
              e.preventDefault();
              return;
            }
          }
        }}
      />

      <div
        ref={overlayRef}
        className="fixed z-50 bg-gray-900 text-gray-100 border border-gray-700 rounded-lg shadow-2xl max-w-sm w-full m-2"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-blue-400" />
            <h3 className="font-semibold text-sm">{step.title}</h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-300 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          <p className="text-sm text-gray-300 mb-4 leading-relaxed">
            {step.content}
          </p>

          <div className="flex items-center gap-1 mb-4">
            {tutorial.steps.map((_, index) => (
              <div
                key={index}
                className={`h-2 flex-1 rounded-full transition-colors ${
                  index === currentStep
                    ? "bg-blue-500"
                    : index < currentStep
                    ? "bg-green-500"
                    : "bg-gray-700"
                }`}
              />
            ))}
          </div>

          <div className="text-xs text-gray-400 text-center mb-4">
            Step {currentStep + 1} of {tutorial.steps.length}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t border-gray-700">
          <div className="flex gap-2">
            <button
              onClick={onPrevious}
              disabled={isFirstStep}
              className="flex items-center gap-1 px-3 py-2 text-sm text-gray-400 hover:text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="h-3 w-3" />
              Previous
            </button>

            {tutorial.canSkip && !isLastStep && (
              <button
                onClick={onSkip}
                className="flex items-center gap-1 px-3 py-2 text-sm text-gray-400 hover:text-gray-200 transition-colors"
              >
                <SkipForward className="h-3 w-3" />
                Skip
              </button>
            )}
          </div>

          <button
            onClick={handleNext}
            disabled={step.allowNext === false && !step.nextCondition?.()}
            className="flex items-center gap-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white text-sm rounded-md transition-colors disabled:cursor-not-allowed"
          >
            {isLastStep ? "Finish" : "Next"}
            {!isLastStep && <ChevronRight className="h-3 w-3" />}
          </button>
        </div>
      </div>
    </>
  );
};
