import { BiomarkerStatus } from '@/types/biomarker'

export interface HistoricalExam {
  id: string
  date: string // ISO date
  label: string
  bioScore: number
  markers: HistoricalMarker[]
}

export interface HistoricalMarker {
  id: string
  name: string
  category: string
  value: number
  unit: string
  status: BiomarkerStatus
  optimalMin: number
  optimalMax: number
  referenceMin: number
  referenceMax: number
}

export const examHistory: HistoricalExam[] = [
  {
    id: 'exam_4',
    date: '2026-02-20',
    label: 'Fev 2026',
    bioScore: 72,
    markers: [
      { id: 'vitamin_d', name: 'Vitamina D (25-OH)', category: 'nutrition', value: 32, unit: 'ng/mL', status: 'yellow', optimalMin: 50, optimalMax: 80, referenceMin: 20, referenceMax: 100 },
      { id: 'glucose', name: 'Glicose em Jejum', category: 'metabolic', value: 85, unit: 'mg/dL', status: 'green', optimalMin: 72, optimalMax: 90, referenceMin: 70, referenceMax: 99 },
      { id: 'testosterone', name: 'Testosterona Total', category: 'hormones', value: 400, unit: 'ng/dL', status: 'yellow', optimalMin: 600, optimalMax: 900, referenceMin: 270, referenceMax: 1070 },
      { id: 'crp', name: 'PCR (Proteína C Reativa)', category: 'inflammation', value: 3.0, unit: 'mg/L', status: 'red', optimalMin: 0, optimalMax: 1, referenceMin: 0, referenceMax: 5 },
      { id: 'ldl', name: 'Colesterol LDL', category: 'metabolic', value: 110, unit: 'mg/dL', status: 'yellow', optimalMin: 0, optimalMax: 90, referenceMin: 0, referenceMax: 130 },
      { id: 'ferritin', name: 'Ferritina', category: 'nutrition', value: 18, unit: 'ng/mL', status: 'yellow', optimalMin: 50, optimalMax: 120, referenceMin: 13, referenceMax: 150 },
      { id: 'hba1c', name: 'Hemoglobina Glicada', category: 'metabolic', value: 5.3, unit: '%', status: 'green', optimalMin: 4.6, optimalMax: 5.3, referenceMin: 4.0, referenceMax: 5.6 },
      { id: 'tsh', name: 'TSH (Tireoide)', category: 'hormones', value: 0.4, unit: 'µUI/mL', status: 'red', optimalMin: 1.0, optimalMax: 2.5, referenceMin: 0.4, referenceMax: 4.0 },
      { id: 'vitamin_b12', name: 'Vitamina B12', category: 'nutrition', value: 420, unit: 'pg/mL', status: 'yellow', optimalMin: 500, optimalMax: 900, referenceMin: 200, referenceMax: 900 },
      { id: 'homocysteine', name: 'Homocisteína', category: 'inflammation', value: 12, unit: 'µmol/L', status: 'yellow', optimalMin: 0, optimalMax: 9, referenceMin: 0, referenceMax: 15 },
    ],
  },
  {
    id: 'exam_3',
    date: '2025-11-10',
    label: 'Nov 2025',
    bioScore: 65,
    markers: [
      { id: 'vitamin_d', name: 'Vitamina D (25-OH)', category: 'nutrition', value: 25, unit: 'ng/mL', status: 'yellow', optimalMin: 50, optimalMax: 80, referenceMin: 20, referenceMax: 100 },
      { id: 'glucose', name: 'Glicose em Jejum', category: 'metabolic', value: 92, unit: 'mg/dL', status: 'yellow', optimalMin: 72, optimalMax: 90, referenceMin: 70, referenceMax: 99 },
      { id: 'testosterone', name: 'Testosterona Total', category: 'hormones', value: 350, unit: 'ng/dL', status: 'yellow', optimalMin: 600, optimalMax: 900, referenceMin: 270, referenceMax: 1070 },
      { id: 'crp', name: 'PCR (Proteína C Reativa)', category: 'inflammation', value: 4.5, unit: 'mg/L', status: 'red', optimalMin: 0, optimalMax: 1, referenceMin: 0, referenceMax: 5 },
      { id: 'ldl', name: 'Colesterol LDL', category: 'metabolic', value: 125, unit: 'mg/dL', status: 'yellow', optimalMin: 0, optimalMax: 90, referenceMin: 0, referenceMax: 130 },
      { id: 'ferritin', name: 'Ferritina', category: 'nutrition', value: 15, unit: 'ng/mL', status: 'yellow', optimalMin: 50, optimalMax: 120, referenceMin: 13, referenceMax: 150 },
      { id: 'hba1c', name: 'Hemoglobina Glicada', category: 'metabolic', value: 5.5, unit: '%', status: 'yellow', optimalMin: 4.6, optimalMax: 5.3, referenceMin: 4.0, referenceMax: 5.6 },
      { id: 'tsh', name: 'TSH (Tireoide)', category: 'hormones', value: 0.5, unit: 'µUI/mL', status: 'red', optimalMin: 1.0, optimalMax: 2.5, referenceMin: 0.4, referenceMax: 4.0 },
      { id: 'vitamin_b12', name: 'Vitamina B12', category: 'nutrition', value: 380, unit: 'pg/mL', status: 'yellow', optimalMin: 500, optimalMax: 900, referenceMin: 200, referenceMax: 900 },
      { id: 'homocysteine', name: 'Homocisteína', category: 'inflammation', value: 14, unit: 'µmol/L', status: 'yellow', optimalMin: 0, optimalMax: 9, referenceMin: 0, referenceMax: 15 },
    ],
  },
  {
    id: 'exam_2',
    date: '2025-08-05',
    label: 'Ago 2025',
    bioScore: 58,
    markers: [
      { id: 'vitamin_d', name: 'Vitamina D (25-OH)', category: 'nutrition', value: 18, unit: 'ng/mL', status: 'red', optimalMin: 50, optimalMax: 80, referenceMin: 20, referenceMax: 100 },
      { id: 'glucose', name: 'Glicose em Jejum', category: 'metabolic', value: 98, unit: 'mg/dL', status: 'yellow', optimalMin: 72, optimalMax: 90, referenceMin: 70, referenceMax: 99 },
      { id: 'testosterone', name: 'Testosterona Total', category: 'hormones', value: 310, unit: 'ng/dL', status: 'yellow', optimalMin: 600, optimalMax: 900, referenceMin: 270, referenceMax: 1070 },
      { id: 'crp', name: 'PCR (Proteína C Reativa)', category: 'inflammation', value: 5.2, unit: 'mg/L', status: 'red', optimalMin: 0, optimalMax: 1, referenceMin: 0, referenceMax: 5 },
      { id: 'ldl', name: 'Colesterol LDL', category: 'metabolic', value: 140, unit: 'mg/dL', status: 'red', optimalMin: 0, optimalMax: 90, referenceMin: 0, referenceMax: 130 },
      { id: 'ferritin', name: 'Ferritina', category: 'nutrition', value: 12, unit: 'ng/mL', status: 'red', optimalMin: 50, optimalMax: 120, referenceMin: 13, referenceMax: 150 },
      { id: 'hba1c', name: 'Hemoglobina Glicada', category: 'metabolic', value: 5.7, unit: '%', status: 'red', optimalMin: 4.6, optimalMax: 5.3, referenceMin: 4.0, referenceMax: 5.6 },
      { id: 'tsh', name: 'TSH (Tireoide)', category: 'hormones', value: 0.3, unit: 'µUI/mL', status: 'red', optimalMin: 1.0, optimalMax: 2.5, referenceMin: 0.4, referenceMax: 4.0 },
      { id: 'vitamin_b12', name: 'Vitamina B12', category: 'nutrition', value: 310, unit: 'pg/mL', status: 'yellow', optimalMin: 500, optimalMax: 900, referenceMin: 200, referenceMax: 900 },
      { id: 'homocysteine', name: 'Homocisteína', category: 'inflammation', value: 16, unit: 'µmol/L', status: 'red', optimalMin: 0, optimalMax: 9, referenceMin: 0, referenceMax: 15 },
    ],
  },
  {
    id: 'exam_1',
    date: '2025-05-12',
    label: 'Mai 2025',
    bioScore: 50,
    markers: [
      { id: 'vitamin_d', name: 'Vitamina D (25-OH)', category: 'nutrition', value: 15, unit: 'ng/mL', status: 'red', optimalMin: 50, optimalMax: 80, referenceMin: 20, referenceMax: 100 },
      { id: 'glucose', name: 'Glicose em Jejum', category: 'metabolic', value: 102, unit: 'mg/dL', status: 'red', optimalMin: 72, optimalMax: 90, referenceMin: 70, referenceMax: 99 },
      { id: 'testosterone', name: 'Testosterona Total', category: 'hormones', value: 280, unit: 'ng/dL', status: 'yellow', optimalMin: 600, optimalMax: 900, referenceMin: 270, referenceMax: 1070 },
      { id: 'crp', name: 'PCR (Proteína C Reativa)', category: 'inflammation', value: 6.8, unit: 'mg/L', status: 'red', optimalMin: 0, optimalMax: 1, referenceMin: 0, referenceMax: 5 },
      { id: 'ldl', name: 'Colesterol LDL', category: 'metabolic', value: 155, unit: 'mg/dL', status: 'red', optimalMin: 0, optimalMax: 90, referenceMin: 0, referenceMax: 130 },
      { id: 'ferritin', name: 'Ferritina', category: 'nutrition', value: 10, unit: 'ng/mL', status: 'red', optimalMin: 50, optimalMax: 120, referenceMin: 13, referenceMax: 150 },
      { id: 'hba1c', name: 'Hemoglobina Glicada', category: 'metabolic', value: 6.0, unit: '%', status: 'red', optimalMin: 4.6, optimalMax: 5.3, referenceMin: 4.0, referenceMax: 5.6 },
      { id: 'tsh', name: 'TSH (Tireoide)', category: 'hormones', value: 0.2, unit: 'µUI/mL', status: 'red', optimalMin: 1.0, optimalMax: 2.5, referenceMin: 0.4, referenceMax: 4.0 },
      { id: 'vitamin_b12', name: 'Vitamina B12', category: 'nutrition', value: 250, unit: 'pg/mL', status: 'yellow', optimalMin: 500, optimalMax: 900, referenceMin: 200, referenceMax: 900 },
      { id: 'homocysteine', name: 'Homocisteína', category: 'inflammation', value: 18, unit: 'µmol/L', status: 'red', optimalMin: 0, optimalMax: 9, referenceMin: 0, referenceMax: 15 },
    ],
  },
]
