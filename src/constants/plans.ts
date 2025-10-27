export const PLAN_CONFIG = {
  DISCOUNT_PERCENTAGE: 0.05,
  COVERAGE_TYPES: {
    FOR_ME: 'forMe',
    FOR_SOMEONE_ELSE: 'forSomeoneElse',
  },
} as const;

export const PLAN_NAMES = {
  HOME: 'Plan en Casa',
  HOME_AND_CLINIC: 'Plan en Casa y Clínica',
  HOME_WITH_CHECKUP: 'Plan en Casa + Chequeo',
} as const;

export const PLAN_BOLD_CONFIG: Record<string, string[]> = {
  [PLAN_NAMES.HOME]: [
    'Médico general a domicilio',
    'Videoconsulta',
    'Indemnización',
  ],
  [PLAN_NAMES.HOME_AND_CLINIC]: [
    'Consultas en clínica',
    'Medicinas y exámenes',
    'más de 200 clínicas del país.',
  ],
  [PLAN_NAMES.HOME_WITH_CHECKUP]: [
    'Un Chequeo preventivo general',
    'Vacunas',
    'Incluye todos los beneficios del Plan en Casa.',
  ],
};
