import { useEffect, useState } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from '@/context/AuthContext'
import { examHistory, HistoricalExam, HistoricalMarker } from '@/data/history'
import { BiomarkerStatus } from '@/types/biomarker'

function mapCategory(name: string): string {
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

function formatDate(iso: string): string {
  const d = new Date(iso)
  const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
  return `${months[d.getMonth()]} ${d.getFullYear()}`
}

export function useExamHistory() {
  const { user } = useAuth()
  const [exams, setExams] = useState<HistoricalExam[]>(examHistory)
  const [loading, setLoading] = useState(true)
  const [hasRealData, setHasRealData] = useState(false)

  useEffect(() => {
    async function fetch() {
      if (!user || user.id === 'mock-1') {
        setExams(examHistory)
        setHasRealData(false)
        setLoading(false)
        return
      }

      try {
        // Get all exams for this user
        const { data: examRows, error: examError } = await supabase
          .from('exams')
          .select('*')
          .order('uploaded_at', { ascending: false })

        if (examError || !examRows || examRows.length === 0) {
          setExams(examHistory)
          setHasRealData(false)
          setLoading(false)
          return
        }

        // Get all markers for this user
        const { data: markerRows, error: markerError } = await supabase
          .from('health_markers')
          .select('*')
          .order('created_at', { ascending: false })

        const markersMap = new Map<string, any[]>()
        if (!markerError && markerRows) {
          for (const m of markerRows) {
            const examId = (m as any).exam_id
            if (!examId) continue
            if (!markersMap.has(examId)) markersMap.set(examId, [])
            markersMap.get(examId)!.push(m)
          }
        }

        const mapped: HistoricalExam[] = examRows.map((exam: any) => {
          const examMarkers = markersMap.get(exam.id) || []

          // Build HistoricalMarker from health_markers or from exam.biomarkers JSON
          let markers: HistoricalMarker[] = []

          if (examMarkers.length > 0) {
            markers = examMarkers.map((m: any) => {
              const refMin = m.reference_min ?? 0
              const refMax = m.reference_max ?? m.value * 2
              const range = refMax - refMin
              return {
                id: m.id,
                name: m.marker_name,
                category: mapCategory(m.marker_name),
                value: Number(m.value),
                unit: m.unit,
                status: statusToColor(m.status),
                optimalMin: refMin + range * 0.2,
                optimalMax: refMax - range * 0.2,
                referenceMin: refMin,
                referenceMax: refMax,
              }
            })
          } else if (exam.biomarkers && Array.isArray(exam.biomarkers)) {
            markers = exam.biomarkers.map((b: any, i: number) => ({
              id: `${exam.id}-${i}`,
              name: b.name,
              category: mapCategory(b.name),
              value: Number(b.value),
              unit: b.unit || '',
              status: b.status === 'green' ? 'green' as const : b.status === 'red' ? 'red' as const : 'yellow' as const,
              optimalMin: 0,
              optimalMax: 0,
              referenceMin: 0,
              referenceMax: 0,
            }))
          }

          const greenCount = markers.filter(m => m.status === 'green').length
          const bioScore = markers.length > 0 ? Math.round((greenCount / markers.length) * 100) : 0

          return {
            id: exam.id,
            date: exam.uploaded_at || new Date().toISOString(),
            label: formatDate(exam.uploaded_at || new Date().toISOString()),
            bioScore,
            markers,
          }
        })

        if (mapped.length > 0 && mapped.some(e => e.markers.length > 0)) {
          setExams(mapped)
          setHasRealData(true)
        } else {
          setExams(examHistory)
          setHasRealData(false)
        }
      } catch (err) {
        console.error('useExamHistory error:', err)
        setExams(examHistory)
        setHasRealData(false)
      } finally {
        setLoading(false)
      }
    }

    fetch()
  }, [user])

  return { exams, loading, hasRealData }
}
