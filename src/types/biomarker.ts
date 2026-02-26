export type BiomarkerStatus = 'green' | 'yellow' | 'red'
export type BiomarkerCategory = 'hormones' | 'metabolic' | 'nutrition' | 'inflammation' | 'aging' | 'blood' | 'organ' | 'urine'

export interface Biomarker {
  id: string
  name: string
  category: BiomarkerCategory
  value: number
  unit: string
  referenceMin: number
  referenceMax: number
  optimalMin: number
  optimalMax: number
  status: BiomarkerStatus
  statusLabel: string
  whatIs: string
  whyMatters: string
  whatToDo: string[]
}
