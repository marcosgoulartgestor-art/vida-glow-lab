import { useEffect, useState } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from '@/context/AuthContext'
import { Biomarker, BiomarkerCategory, BiomarkerStatus } from '@/types/biomarker'
import { biomarkersData } from '@/data/biomarkers'

/** Map a health_markers DB row into the rich Biomarker shape used by the dashboard. */
function mapToCategory(name: string): BiomarkerCategory {
  const lower = name.toLowerCase()
  if (/testoster|estrad|progest|tsh|t3|t4|lh|fsh|cortisol|dhea|prolact/i.test(lower)) return 'hormones'
  if (/glicos|hba1c|hemoglobina glicada|insulina|ldl|hdl|colesterol|triglic/i.test(lower)) return 'metabolic'
  if (/vitamina|ferrit|ferro|b12|ácido fólico|folato|zinco|magnés|cálcio|selên/i.test(lower)) return 'nutrition'
  if (/pcr|proteína c|homociste|vhs|interleucina|fibrinog/i.test(lower)) return 'inflammation'
  return 'aging'
}

function statusToColor(status: string): BiomarkerStatus {
  if (status === 'Alto') return 'red'
  if (status === 'Baixo') return 'yellow'
  return 'green'
}

function statusToLabel(status: string): string {
  if (status === 'Alto') return 'Alerta'
  if (status === 'Baixo') return 'Atenção'
  return 'Normal'
}

interface DbMarker {
  id: string
  marker_name: string
  value: number
  unit: string
  reference_min: number | null
  reference_max: number | null
  status: string
  exam_id: string | null
  created_at: string
}

function dbToBiomarker(row: DbMarker): Biomarker {
  const refMin = row.reference_min ?? 0
  const refMax = row.reference_max ?? row.value * 2
  const range = refMax - refMin
  return {
    id: row.id,
    name: row.marker_name,
    category: mapToCategory(row.marker_name),
    value: row.value,
    unit: row.unit,
    referenceMin: refMin,
    referenceMax: refMax,
    optimalMin: refMin + range * 0.2,
    optimalMax: refMax - range * 0.2,
    status: statusToColor(row.status),
    statusLabel: statusToLabel(row.status),
    whatIs: '',
    whyMatters: '',
    whatToDo: [],
  }
}

export function useHealthMarkers() {
  const { user } = useAuth()
  const [biomarkers, setBiomarkers] = useState<Biomarker[]>(biomarkersData)
  const [loading, setLoading] = useState(true)
  const [hasRealData, setHasRealData] = useState(false)

  useEffect(() => {
    async function fetch() {
      // Demo user always gets mock data
      if (!user || user.id === 'mock-1') {
        setBiomarkers(biomarkersData)
        setHasRealData(false)
        setLoading(false)
        return
      }

      try {
        // Get the latest exam's markers
        const { data: markers, error } = await supabase
          .from('health_markers')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(50)

        if (error) {
          console.error('Error fetching health_markers:', error)
          setBiomarkers(biomarkersData)
          setHasRealData(false)
          setLoading(false)
          return
        }

        if (!markers || markers.length === 0) {
          setBiomarkers(biomarkersData)
          setHasRealData(false)
          setLoading(false)
          return
        }

        // Deduplicate by marker name (keep latest)
        const seen = new Map<string, DbMarker>()
        for (const m of markers as unknown as DbMarker[]) {
          const key = m.marker_name.toLowerCase()
          if (!seen.has(key)) seen.set(key, m)
        }

        const mapped = Array.from(seen.values()).map(dbToBiomarker)

        // Enrich with mock data descriptions if name matches
        const enriched = mapped.map(m => {
          const mock = biomarkersData.find(
            b => b.name.toLowerCase() === m.name.toLowerCase()
          )
          if (mock) {
            return {
              ...m,
              category: mock.category,
              optimalMin: mock.optimalMin,
              optimalMax: mock.optimalMax,
              whatIs: mock.whatIs,
              whyMatters: mock.whyMatters,
              whatToDo: mock.whatToDo,
            }
          }
          return m
        })

        setBiomarkers(enriched)
        setHasRealData(true)
      } catch (err) {
        console.error('useHealthMarkers error:', err)
        setBiomarkers(biomarkersData)
        setHasRealData(false)
      } finally {
        setLoading(false)
      }
    }

    fetch()
  }, [user])

  return { biomarkers, loading, hasRealData }
}
