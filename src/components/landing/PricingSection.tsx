import { CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

const benefits = [
  '80+ biomarcadores analisados por ciclo',
  'Análise 2x/ano + upload avulso',
  'Zonas de Otimização para longevidade',
  'Histórico evolutivo de todos os marcadores',
  'Insights em linguagem acessível (PT-BR)',
  'Protocolo personalizado de ação',
  'Sem depender de plano de saúde',
  'Upload de laudos de qualquer laboratório BR',
  'Ambiente seguro e criptografado',
]

export function PricingSection() {
  return (
    <section id="precos" className="bg-brand-cream py-24 px-8 md:px-16">
      <div className="text-center">
        <h2 className="font-serif text-4xl">
          <span className="text-brand-brown">O que custaria R$ 3.000, </span>
          <span className="text-brand-terracota italic">custa R$ 365.</span>
        </h2>
        <p className="text-gray-text text-lg mt-4">
          Sua saúde não deveria depender de plano de saúde.
        </p>
      </div>

      <div className="max-w-3xl mx-auto mt-16 rounded-3xl border border-gray-border overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left */}
          <div className="p-10 bg-brand-cream flex flex-col">
            <p className="font-serif text-2xl text-brand-brown">Assinatura Bio Track Brasil</p>
            <div className="mt-6">
              <span className="font-serif text-6xl font-bold text-brand-terracota">R$ 365</span>
              <span className="text-xl text-gray-text">/ano</span>
            </div>
            <p className="text-sm text-gray-muted mt-2">Ou ~R$ 1 por dia</p>
            <Button className="bg-brand-terracota text-white rounded-full w-full py-4 mt-8 text-base font-semibold hover:bg-brand-brown-mid h-auto">
              Começar Agora →
            </Button>
          </div>

          {/* Right */}
          <div className="p-10 bg-brand-cream-light flex flex-col gap-3">
            {benefits.map((b) => (
              <div key={b} className="flex items-center gap-3 text-sm text-brand-brown">
                <CheckCircle2 size={18} className="text-status-green shrink-0" />
                <span>{b}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
