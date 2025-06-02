export interface TutorialStep {
  id: string;
  title: string;
  content: string;
  target?: string; // CSS selector for highlighting
  position?: "top" | "bottom" | "left" | "right";
  action?: "click" | "hover" | "input" | "wait";
  waitCondition?: () => boolean;
  nextCondition?: () => boolean;
  highlightClass?: string;
  allowNext?: boolean;
}

export interface Tutorial {
  id: string;
  name: string;
  description: string;
  category: string;
  prerequisites?: string[];
  steps: TutorialStep[];
  isCompleted?: boolean;
  canSkip?: boolean;
}

export interface TutorialState {
  activeTutorial: string | null;
  currentStep: number;
  completedTutorials: string[];
  isVisible: boolean;
  position: { x: number; y: number };
}
