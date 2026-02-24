import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import {
  Activity,
  Upload,
  LayoutDashboard,
  BarChart3,
  ArrowRight,
  ArrowLeft,
  X,
} from 'lucide-react'

const steps = [
  {
    icon: Activity,
    title: 'Bem-vindo ao Bio Track Brasil!',
    description:
      'Sua plataforma inteligente de acompanhamento de saúde. Aqui você envia seus exames de sangue e recebe análises detalhadas dos seus biomarcadores.',
    tip: 'Vamos te guiar pelas principais funcionalidades do app.',
  },
  {
    icon: Upload,
    title: 'Envie seu Exame',
    description:
      'Basta enviar o PDF ou foto do seu exame de sangue. Nossa IA extrai automaticamente todos os biomarcadores e classifica cada um.',
    tip: 'Aceitamos exames dos principais laboratórios do Brasil.',
  },
  {
    icon: LayoutDashboard,
    title: 'Seu Painel de Saúde',
    description:
      'No Dashboard você vê seu BioScore (pontuação geral de saúde), biomarcadores organizados por categoria e insights personalizados.',
    tip: 'O BioScore é calculado com base na proporção de biomarcadores dentro da faixa ideal.',
  },
  {
    icon: BarChart3,
    title: 'Acompanhe sua Evolução',
    description:
      'No Histórico você compara exames ao longo do tempo, vê gráficos de evolução e identifica tendências nos seus biomarcadores.',
    tip: 'Quanto mais exames você enviar, mais completa será sua análise.',
  },
]

interface OnboardingGuideProps {
  open: boolean
  onClose: () => void
}

export function OnboardingGuide({ open, onClose }: OnboardingGuideProps) {
  const [step, setStep] = useState(0)
  const navigate = useNavigate()
  const current = steps[step]
  const isLast = step === steps.length - 1

  const handleNext = () => {
    if (isLast) {
      onClose()
      navigate('/upload')
    } else {
      setStep(step + 1)
    }
  }

  const handleBack = () => {
    if (step > 0) setStep(step - 1)
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-md p-0 gap-0 rounded-2xl overflow-hidden border-brand-terracota/20">
        {/* Header accent */}
        <div className="bg-brand-brown p-6 pb-8 relative">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-white/40 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
          <div className="w-14 h-14 rounded-2xl bg-brand-terracota/20 flex items-center justify-center mb-4">
            <current.icon className="text-brand-terracota" size={28} />
          </div>
          <h2 className="font-serif text-xl text-white">{current.title}</h2>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <p className="text-sm text-foreground/80 leading-relaxed">
            {current.description}
          </p>
          <div className="bg-brand-terracota/5 border border-brand-terracota/10 rounded-xl p-3">
            <p className="text-xs text-brand-terracota font-medium">
              💡 {current.tip}
            </p>
          </div>

          {/* Progress dots */}
          <div className="flex items-center justify-center gap-2 pt-2">
            {steps.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all ${
                  i === step
                    ? 'w-6 bg-brand-terracota'
                    : i < step
                    ? 'w-1.5 bg-brand-terracota/40'
                    : 'w-1.5 bg-border'
                }`}
              />
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBack}
              disabled={step === 0}
              className="gap-1 text-muted-foreground"
            >
              <ArrowLeft size={14} /> Voltar
            </Button>
            <Button
              size="sm"
              onClick={handleNext}
              className="gap-1 bg-brand-terracota hover:bg-brand-terracota/90 text-white rounded-full px-5"
            >
              {isLast ? 'Enviar Primeiro Exame' : 'Próximo'}
              <ArrowRight size={14} />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
