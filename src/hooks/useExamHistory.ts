import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from '@/context/AuthContext'
import { examHistory, HistoricalExam, HistoricalMarker } from '@/data/history'
import { BiomarkerStatus } from '@/types/biomarker'

function mapCategory(name: string): string {
  const lower = name.toLowerCase()
  if (/hemoglobina(?! glicada)|hematócrito|eritróci|hemácia|vcm|chcm|rdw|plaqueta|leucócit|neutrófil|linfócit|monócit|eosinófil|basófil/i.test(lower)) return 'blood'
  if (/ast|tgo|alt|tgp|ggt|fosfatase alcalina|bilirrubina|albumina|proteínas totais|ureia|creatinina|tfg|cistatina|sódio|potássio|ldh|lipase|amilase/i.test(lower)) return 'organ'
  if (/urina|urinária|proteinúria|glicosúria|microalbum/i.test(lower)) return 'urine'
  if (/testoster|estrad|progest|tsh|t3|t4|lh|fsh|cortisol|dhea|prolact|shbg|igf|amh|pth|aldoster|anti-tpo|anti-tireo/i.test(lower)) return 'hormones'
  if (/glicos|hba1c|hemoglobina glicada|insulina|homa|ldl|hdl|vldl|colesterol|triglic|apolipoprote|lipoproteína|ômega|omega|ácido úrico/i.test(lower)) return 'metabolic'
  if (/vitamina|ferrit|ferro|b12|ácido fólico|folato|zinco|magnés|cálcio|selên|cobre|fósforo|transferrin|ctlf|tibc|metilmalôn/i.test(lower)) return 'nutrition'
  if (/pcr|proteína c|homociste|vhs|interleucina|fibrinog|fator reumat/i.test(lower)) return 'inflammation'
  if (/coenzima|coq10|glutationa|nad/i.test(lower)) return 'aging'
  return 'metabolic'
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
  const [exams, setExams] = useState<HistoricalExam[]>([])
  const [loading, setLoading] = useState(true)
  const [hasRealData, setHasRealData] = useState(false)

  const fetchExams = useCallback(async () => {
    if (!user || user.id === 'mock-1') {
      setExams(examHistory)
      setHasRealData(false)
      setLoading(false)
      return
    }

    try {
      const { data: examRows, error: examError } = await supabase
        .from('exams')
        .select('*')
        .order('uploaded_at', { ascending: false })

      if (examError || !examRows || examRows.length === 0) {
        setExams([])
        setHasRealData(false)
        setLoading(false)
        return
      }

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
        setExams([])
        setHasRealData(false)
      }
    } catch (err) {
      console.error('useExamHistory error:', err)
      setExams([])
      setHasRealData(false)
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    fetchExams()
  }, [fetchExams])

  const deleteExam = useCallback(async (examId: string) => {
    if (!user || user.id === 'mock-1') {
      setExams(prev => prev.filter(e => e.id !== examId))
      return true
    }

    try {
      // Delete markers first (foreign key)
      await supabase.from('health_markers').delete().eq('exam_id', examId)
      const { error } = await supabase.from('exams').delete().eq('id', examId)
      if (error) throw error
      setExams(prev => prev.filter(e => e.id !== examId))
      return true
    } catch (err) {
      console.error('deleteExam error:', err)
      return false
    }
  }, [user])

  const deleteAllExams = useCallback(async () => {
    if (!user || user.id === 'mock-1') {
      setExams([])
      return true
    }

    try {
      await supabase.from('health_markers').delete().neq('id', '00000000-0000-0000-0000-000000000000')
      const { error } = await supabase.from('exams').delete().neq('id', '00000000-0000-0000-0000-000000000000')
      if (error) throw error
      setExams([])
      return true
    } catch (err) {
      console.error('deleteAllExams error:', err)
      return false
    }
  }, [user])

  return { exams, loading, hasRealData, deleteExam, deleteAllExams, refetch: fetchExams }
}
