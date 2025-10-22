import { Step } from "../components/ui/Steps/Steps";

export const REGISTRATION_STEPS: Step[] = [
  { number: 1, label: 'Planes y coberturas' },
  { number: 2, label: 'Resumen' }
];

export const STEP_NUMBERS = {
  PLANS: 1,
  SUMMARY: 2
} as const;