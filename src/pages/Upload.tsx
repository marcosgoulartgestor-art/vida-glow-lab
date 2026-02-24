import { useState, useRef, useEffect, DragEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { FileUp, FileText, CheckCircle2 } from 'lucide-react'
import { AppLayout } from '@/components/layout/AppLayout'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'

type UploadState = 'idle' | 'dragging' | 'uploading' | 'success'

const labs = ['Fleury', 'Delboni', 'Hermes Pardini', 'DASA', 'Sabin']

const UploadPage = () => {
  const navigate = useNavigate()
  const inputRef = useRef<HTMLInputElement>(null)
  const [state, setState] = useState<UploadState>('idle')
  const [progress, setProgress] = useState(0)
  const [fileName, setFileName] = useState('')

  const startUpload = (name: string) => {
    setFileName(name)
    setProgress(0)
    setState('uploading')
  }

  useEffect(() => {
    if (state !== 'uploading') return
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval)
          return 100
        }
        return p + 2
      })
    }, 50)
    return () => clearInterval(interval)
  }, [state])

  useEffect(() => {
    if (progress >= 100 && state === 'uploading') {
      const t = setTimeout(() => setState('success'), 500)
      return () => clearTimeout(t)
    }
  }, [progress, state])

  const handleDrop = (e: DragEvent) => {
    e.preventDefault()
    setState('idle')
    const file = e.dataTransfer.files?.[0]
    if (file) startUpload(file.name)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) startUpload(file.name)
  }

  const reset = () => {
    setState('idle')
    setProgress(0)
    setFileName('')
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <AppLayout title="Enviar Exame">
      <div className="max-w-2xl mx-auto py-12 px-4 md:px-8">
        <h2 className="font-serif text-3xl text-brand-brown">Enviar Novo Exame</h2>
        <p className="text-gray-text mt-2">
          Faça upload do PDF do seu laudo para visualizar seus biomarcadores.
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
                    ? 'border-brand-terracota bg-brand-terracota/5 scale-[1.02]'
                    : 'border-gray-border bg-brand-cream-light'
                }`}
              >
                <input
                  ref={inputRef}
                  type="file"
                  accept=".pdf"
                  className="hidden"
                  onChange={handleFileChange}
                />
                <FileUp size={56} className="text-brand-terracota mx-auto mb-4" />
                <p className="font-serif text-xl text-brand-brown">
                  Arraste o PDF do seu laudo aqui
                </p>
                <p className="text-gray-text text-sm mt-1">ou clique para selecionar o arquivo</p>

                <div className="my-6 flex items-center gap-4">
                  <div className="flex-1 h-px bg-gray-border" />
                  <span className="text-xs text-gray-muted">Compatível com</span>
                  <div className="flex-1 h-px bg-gray-border" />
                </div>

                <div className="flex flex-wrap justify-center gap-2">
                  {labs.map((lab) => (
                    <span
                      key={lab}
                      className="bg-brand-cream border border-gray-border rounded-full px-3 py-1 text-xs text-brand-brown"
                    >
                      {lab}
                    </span>
                  ))}
                </div>
              </div>

              {/* Info cards */}
              <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  '🔒 Seus dados são privados e criptografados',
                  '⚡ Análise em segundos',
                  '🏥 Compatível com qualquer laboratório',
                ].map((text) => (
                  <div
                    key={text}
                    className="bg-brand-cream-light rounded-xl p-4 border border-gray-border text-center"
                  >
                    <p className="text-xs text-gray-text">{text}</p>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* UPLOADING */}
          {state === 'uploading' && (
            <div className="border border-gray-border rounded-3xl p-16 text-center bg-white">
              <FileText size={40} className="text-brand-terracota mx-auto mb-3" />
              <p className="text-sm font-medium text-brand-brown">{fileName}</p>
              <Progress
                value={progress}
                className="w-full h-2 mt-4 bg-brand-cream [&>div]:bg-brand-terracota"
              />
              <p className="text-sm text-gray-text mt-3">
                Analisando seus biomarcadores... {progress}%
              </p>
            </div>
          )}

          {/* SUCCESS */}
          {state === 'success' && (
            <div className="border border-gray-border rounded-3xl p-16 text-center bg-white">
              <CheckCircle2 size={72} className="text-status-green mx-auto animate-bounce" />
              <h3 className="font-serif text-2xl text-brand-brown mt-4">
                Exame processado com sucesso!
              </h3>
              <p className="text-gray-text mt-2">
                Encontramos 10 biomarcadores no seu laudo.
              </p>
              <Button
                onClick={() => navigate('/dashboard')}
                className="bg-brand-terracota text-white rounded-full px-8 py-3 mt-8 hover:bg-brand-brown-mid h-auto"
              >
                Ver meu Dashboard →
              </Button>
              <p
                className="text-brand-terracota text-sm mt-4 cursor-pointer hover:underline"
                onClick={reset}
              >
                Enviar outro exame
              </p>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  )
}

export default UploadPage
