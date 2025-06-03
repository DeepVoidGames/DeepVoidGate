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
  const [isMobile, setIsMobile] = useState(false);
  const [highlightedElement, setHighlightedElement] = useState<Element | null>(
    null
  );
  const overlayRef = useRef<HTMLDivElement>(null);

  const step = tutorial.steps[currentStep];
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === tutorial.steps.length - 1;

  // Detect mobile devices
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || "ontouchstart" in window);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (!step?.target || !isVisible) return;

    const targetElement = document.querySelector(step.target);
    if (!targetElement) return;

    const overlayElement = overlayRef.current;
    if (!overlayElement) return;

    // Mobile-first positioning
    if (isMobile) {
      // On mobile, use CSS positioning instead of JavaScript calculations
      setPosition({ x: 0, y: 0 }); // Reset position for CSS to take over
      return;
    }

    // Desktop positioning logic (existing)
    const targetRect = targetElement.getBoundingClientRect();
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
  }, [step, currentStep, isVisible, isMobile]);

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

      // Mobile-optimized scrolling
      if (isMobile) {
        targetElement.scrollIntoView({
          behavior: "smooth",
          block: "start",
          inline: "nearest",
        });

        // Add extra delay to ensure element is visible above the overlay
        setTimeout(() => {
          const rect = targetElement.getBoundingClientRect();
          if (rect.bottom > window.innerHeight - 200) {
            window.scrollBy({
              top: rect.bottom - (window.innerHeight - 220),
              behavior: "smooth",
            });
          }
        }, 300);
      } else {
        targetElement.scrollIntoView({
          behavior: "smooth",
          block: "center",
          inline: "center",
        });
      }
    }

    return () => {
      if (targetElement) {
        targetElement.classList.remove("tutorial-highlight");
      }
    };
  }, [step, currentStep, isVisible, isMobile]);

  const handleNext = () => {
    if (step?.nextCondition && !step.nextCondition()) return;
    onNext();
  };

  // Prevent body scroll on mobile when overlay is visible
  useEffect(() => {
    if (isMobile && isVisible) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [isMobile, isVisible]);

  if (!isVisible || !step) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black bg-opacity-40 z-40"
        style={{
          // Ensure overlay covers safe areas on mobile
          paddingTop: isMobile ? "env(safe-area-inset-top)" : "0",
          paddingBottom: isMobile ? "env(safe-area-inset-bottom)" : "0",
        }}
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
        className={`fixed z-50 bg-gray-900 text-gray-100 border border-gray-700 rounded-lg shadow-2xl transition-all duration-300 ${
          isMobile
            ? "inset-x-4 bottom-4 max-w-none w-auto"
            : "max-w-sm w-full m-2"
        }`}
        style={
          !isMobile
            ? {
                left: `${position.x}px`,
                top: `${position.y}px`,
              }
            : {
                marginBottom: "env(safe-area-inset-bottom, 0px)",
              }
        }
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-blue-400 flex-shrink-0" />
            <h3 className="font-semibold text-sm truncate">{step.title}</h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-300 transition-colors p-1 flex-shrink-0"
            aria-label="Close tutorial"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          <div
            className={`text-sm text-gray-300 mb-4 leading-relaxed ${
              isMobile ? "max-h-32 overflow-y-auto" : ""
            }`}
          >
            {step.content}
          </div>

          {/* Progress bar */}
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
        <div
          className={`flex items-center p-4 border-t border-gray-700 ${
            isMobile ? "flex-col gap-3" : "justify-between flex-row-reverse"
          }`}
        >
          {/* Main Next/Finish button - always visible and prominent */}
          <button
            onClick={handleNext}
            disabled={step.allowNext === false && !step.nextCondition?.()}
            className={`flex items-center justify-center gap-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white text-sm rounded-md transition-colors disabled:cursor-not-allowed font-medium ${
              isMobile ? "w-full min-h-[48px] order-1" : ""
            }`}
          >
            {isLastStep ? "Finish Tutorial" : "Next"}
            {!isLastStep && <ChevronRight className="h-4 w-4" />}
          </button>

          {/* Secondary buttons */}
          <div className={`flex gap-2 ${isMobile ? "w-full order-2" : ""}`}>
            <button
              onClick={onPrevious}
              disabled={isFirstStep}
              className={`flex items-center justify-center gap-1 px-3 py-2 text-sm text-gray-400 hover:text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${
                isMobile ? "flex-1 min-h-[44px]" : ""
              }`}
            >
              <ChevronLeft className="h-3 w-3" />
              {isMobile ? "Back" : "Previous"}
            </button>

            {tutorial.canSkip && !isLastStep && (
              <button
                onClick={onSkip}
                className={`flex items-center justify-center gap-1 px-3 py-2 text-sm text-gray-400 hover:text-gray-200 transition-colors ${
                  isMobile ? "flex-1 min-h-[44px]" : ""
                }`}
              >
                <SkipForward className="h-3 w-3" />
                Skip
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
