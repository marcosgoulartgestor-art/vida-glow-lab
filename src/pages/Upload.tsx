import { useState, useRef, DragEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { FileUp, FileText, Loader2 } from 'lucide-react'
import { AppLayout } from '@/components/layout/AppLayout'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/context/AuthContext'
import { supabase } from '@/integrations/supabase/client'
import { biomarkersData } from '@/data/biomarkers'
import { toast } from 'sonner'
import { ExamResultCards, type ExtractedMarker } from '@/components/upload/ExamResultCards'

type UploadState = 'idle' | 'dragging' | 'analyzing' | 'success'

const labs = ['Fleury', 'Delboni', 'Hermes Pardini', 'DASA', 'Sabin']

const ACCEPTED_TYPES = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg']

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result as string
      resolve(result.split(',')[1]) // strip data:...;base64, prefix
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

const UploadPage = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const inputRef = useRef<HTMLInputElement>(null)
  const [state, setState] = useState<UploadState>('idle')
  const [fileName, setFileName] = useState('')
  const [markers, setMarkers] = useState<ExtractedMarker[]>([])

  const isDemoUser = user?.id === 'mock-1'

  const analyzeFile = async (file: File) => {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      toast.error('Formato não suportado. Envie PDF, JPG ou PNG.')
      return
    }
    if (file.size > 20 * 1024 * 1024) {
      toast.error('Arquivo muito grande. Máximo 20MB.')
      return
    }

    setFileName(file.name)
    setState('analyzing')

    // Demo mode: simulate results
    if (isDemoUser) {
      await new Promise(r => setTimeout(r, 2000))
      const demoMarkers: ExtractedMarker[] = biomarkersData.map(b => ({
        name: b.name,
        value: b.value,
        unit: b.unit,
        reference_min: b.referenceMin,
        reference_max: b.referenceMax,
        status: b.status === 'green' ? 'Normal' : b.status === 'red' ? 'Alto' : 'Baixo',
      }))
      setMarkers(demoMarkers)
      setState('success')
      toast.success(`Exame analisado! ${demoMarkers.length} biomarcadores encontrados.`)
      return
    }

    try {
      const base64 = await fileToBase64(file)

      const { data, error } = await supabase.functions.invoke('analyze-exam-gemini', {
        body: {
          file_base64: base64,
          mime_type: file.type,
          lab_name: 'Upload Manual',
        },
      })

      if (error) {
        console.error('Edge function error:', error)
        toast.error('Erro ao analisar exame. Tente novamente.')
        setState('idle')
        return
      }

      if (data?.error) {
        toast.error(data.error)
        setState('idle')
        return
      }

      const extracted: ExtractedMarker[] = data.markers ?? []
      setMarkers(extracted)
      setState('success')
      toast.success(`Exame analisado! ${extracted.length} biomarcadores encontrados.`)
    } catch (err) {
      console.error('Upload error:', err)
      toast.error('Erro inesperado. Tente novamente.')
      setState('idle')
    }
  }

  const handleDrop = (e: DragEvent) => {
    e.preventDefault()
    setState('idle')
    const file = e.dataTransfer.files?.[0]
    if (file) analyzeFile(file)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) analyzeFile(file)
  }

  const reset = () => {
    setState('idle')
    setFileName('')
    setMarkers([])
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <AppLayout title="Enviar Exame">
      <div className="max-w-3xl mx-auto py-12 px-4 md:px-8">
        <h2 className="font-serif text-3xl text-foreground">Enviar Novo Exame</h2>
        <p className="text-muted-foreground mt-2">
          Faça upload do seu laudo (PDF ou imagem) para análise inteligente com IA.
        </p>

        <div className="mt-8">
          {/* IDLE / DRAGGING */}
          {(state === 'idle' || state === 'dragging') && (
            <>
              <div
                onDragOver={(e) => { e.preventDefault(); setState('dragging') }}
                onDragLeave={() => setState('idle')}
                onDrop={handleDrop}
                onClick={() => inputRef.current?.click()}
                className={`border-2 border-dashed rounded-3xl p-16 text-center cursor-pointer transition-all ${
                  state === 'dragging'
                    ? 'border-primary bg-primary/5 scale-[1.02]'
                    : 'border-border bg-secondary'
                }`}
              >
                <input
                  ref={inputRef}
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="hidden"
                  onChange={handleFileChange}
                />
                <FileUp size={56} className="text-primary mx-auto mb-4" />
                <p className="font-serif text-xl text-foreground">
                  Arraste seu laudo aqui
                </p>
                <p className="text-muted-foreground text-sm mt-1">
                  PDF, JPG ou PNG · até 20MB
                </p>

                <div className="my-6 flex items-center gap-4">
                  <div className="flex-1 h-px bg-border" />
                  <span className="text-xs text-muted-foreground">Compatível com</span>
                  <div className="flex-1 h-px bg-border" />
                </div>

                <div className="flex flex-wrap justify-center gap-2">
                  {labs.map((lab) => (
                    <span
                      key={lab}
                      className="bg-background border border-border rounded-full px-3 py-1 text-xs text-foreground"
                    >
                      {lab}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  '🔒 Seus dados são privados e criptografados',
                  '🤖 Análise por IA com Google Gemini',
                  '🏥 Compatível com qualquer laboratório',
                ].map((text) => (
                  <div
                    key={text}
                    className="bg-secondary rounded-xl p-4 border border-border text-center"
                  >
                    <p className="text-xs text-muted-foreground">{text}</p>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* ANALYZING */}
          {state === 'analyzing' && (
            <div className="border border-border rounded-3xl p-16 text-center bg-card">
              <div className="relative mx-auto w-16 h-16 mb-4">
                <Loader2 size={64} className="text-primary animate-spin" />
              </div>
              <FileText size={20} className="text-muted-foreground mx-auto mb-2" />
              <p className="text-sm font-medium text-foreground">{fileName}</p>
              <p className="text-sm text-muted-foreground mt-3">
                IA está analisando seu exame...
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Isso pode levar alguns segundos
              </p>
            </div>
          )}

          {/* SUCCESS */}
          {state === 'success' && (
            <div className="space-y-6">
              <ExamResultCards markers={markers} />

              <div className="flex flex-col sm:flex-row items-center gap-3 pt-4">
                <Button
                  onClick={() => navigate('/dashboard')}
                  className="bg-primary text-primary-foreground rounded-full px-8 py-3 hover:opacity-90 h-auto"
                >
                  Ver meu Dashboard →
                </Button>
                <Button
                  variant="outline"
                  onClick={reset}
                  className="rounded-full px-8 py-3 h-auto"
                >
                  Enviar outro exame
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  )
}

export default UploadPage
