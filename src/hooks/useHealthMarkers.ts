import { useEffect, useState } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from '@/context/AuthContext'
import { Biomarker, BiomarkerCategory, BiomarkerStatus } from '@/types/biomarker'
import { biomarkersData } from '@/data/biomarkers'

function mapToCategory(name: string): BiomarkerCategory {
  const lower = name.toLowerCase()
  // Blood / Hemograma
  if (/hemoglobina(?! glicada)|hematócrito|eritróci|hemácia|vcm|chcm|rdw|plaqueta|leucócit|neutrófil|linfócit|monócit|eosinófil|basófil/i.test(lower)) return 'blood'
  // Organ function
  if (/ast|tgo|alt|tgp|ggt|fosfatase alcalina|bilirrubina|albumina|proteínas totais|ureia|creatinina|tfg|cistatina|sódio|potássio|ldh|lipase|amilase/i.test(lower)) return 'organ'
  // Urine
  if (/urina|urinária|proteinúria|glicosúria|microalbum/i.test(lower)) return 'urine'
  // Hormones
  if (/testoster|estrad|progest|tsh|t3|t4|lh|fsh|cortisol|dhea|prolact|shbg|igf|amh|pth|aldoster|anti-tpo|anti-tireo/i.test(lower)) return 'hormones'
  // Metabolic
  if (/glicos|hba1c|hemoglobina glicada|insulina|homa|ldl|hdl|vldl|colesterol|triglic|apolipoprote|lipoproteína|ômega|omega|ácido úrico/i.test(lower)) return 'metabolic'
  // Nutrition
  if (/vitamina|ferrit|ferro|b12|ácido fólico|folato|zinco|magnés|cálcio|selên|cobre|fósforo|transferrin|ctlf|tibc|metilmalôn/i.test(lower)) return 'nutrition'
  // Inflammation
  if (/pcr|proteína c|homociste|vhs|interleucina|fibrinog|fator reumat/i.test(lower)) return 'inflammation'
  // Aging
  if (/coenzima|coq10|glutationa|nad/i.test(lower)) return 'aging'
  return 'metabolic'
}

function statusToColor(status: string): BiomarkerStatus {
  if (status === 'Alto' || status === 'Alerta') return 'red'
  if (status === 'Baixo' || status === 'Atenção') return 'yellow'
  return 'green'
}

function statusToLabel(status: string): string {
  if (status === 'Alto' || status === 'Alerta') return 'Alerta'
  if (status === 'Baixo' || status === 'Atenção') return 'Atenção'
  return 'Normal'
}

interface DbMarker {
  id: string
  marker_name: string
  marker_id: string | null
  value: number
  unit: string
  reference_min: number | null
  reference_max: number | null
  optimal_min: number | null
  optimal_max: number | null
  status: string
  exam_id: string | null
  created_at: string
  what_is: string | null
  why_matters: string | null
  what_to_do: string[] | null
}

function dbToBiomarker(row: DbMarker): Biomarker {
  const refMin = row.reference_min ?? 0
  const refMax = row.reference_max ?? row.value * 2
  const range = refMax - refMin
  const optMin = row.optimal_min ?? (refMin + range * 0.2)
  const optMax = row.optimal_max ?? (refMax - range * 0.2)
  return {
    id: row.marker_id || row.id,
    name: row.marker_name,
    category: mapToCategory(row.marker_name),
    value: row.value,
    unit: row.unit,
    referenceMin: refMin,
    referenceMax: refMax,
    optimalMin: optMin,
    optimalMax: optMax,
    status: statusToColor(row.status),
    statusLabel: statusToLabel(row.status),
    whatIs: row.what_is ?? '',
    whyMatters: row.why_matters ?? '',
    whatToDo: row.what_to_do ?? [],
  }
}

export function useHealthMarkers() {
  const { user } = useAuth()
  const [biomarkers, setBiomarkers] = useState<Biomarker[]>([])
  const [loading, setLoading] = useState(true)
  const [hasRealData, setHasRealData] = useState(false)

  useEffect(() => {
    async function fetch() {
      if (!user || user.id === 'mock-1') {
        setBiomarkers(biomarkersData)
        setHasRealData(false)
        setLoading(false)
        return
      }

      try {
        const { data: markers, error } = await supabase
          .from('health_markers')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(200)

        if (error) {
          console.error('Error fetching health_markers:', error)
          setBiomarkers([])
          setHasRealData(false)
          setLoading(false)
          return
        }

        if (!markers || markers.length === 0) {
          setBiomarkers([])
          setHasRealData(false)
          setLoading(false)
          return
        }

        // Deduplicate by marker name (keep latest)
        const seen = new Map<string, DbMarker>()
        for (const m of markers as unknown as DbMarker[]) {
          const key = (m.marker_id || m.marker_name).toLowerCase()
          if (!seen.has(key)) seen.set(key, m)
        }

        const mapped = Array.from(seen.values()).map(dbToBiomarker)

        // Enrich with mock data descriptions only as fallback
        const enriched = mapped.map(m => {
          const mock = biomarkersData.find(
            b => b.name.toLowerCase() === m.name.toLowerCase() || b.id === m.id
          )
          if (mock) {
            return {
              ...m,
              whatIs: m.whatIs || mock.whatIs,
              whyMatters: m.whyMatters || mock.whyMatters,
              whatToDo: m.whatToDo.length > 0 ? m.whatToDo : mock.whatToDo,
            }
          }
          return m
        })

        setBiomarkers(enriched)
        setHasRealData(true)
      } catch (err) {
        console.error('useHealthMarkers error:', err)
        setBiomarkers([])
        setHasRealData(false)
      } finally {
        setLoading(false)
      }
    }

    fetch()
  }, [user])

  return { biomarkers, loading, hasRealData }
}
