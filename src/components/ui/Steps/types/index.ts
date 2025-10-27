export interface Step {
  number: number;
  label: string;
}

export interface StepsProps {
  steps: Step[];
  currentStep: number;
  onGoBack?: () => void;
}
