import { CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
}

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
    <section id="precos" className="bg-brand-cream py-16 sm:py-24 px-5 sm:px-8 md:px-16">
      <motion.div
        className="text-center"
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="font-serif text-2xl sm:text-4xl leading-tight">
          <span className="text-brand-brown">O que custaria R$ 3.000, </span>
          <span className="text-brand-terracota italic">custa R$ 365.</span>
        </h2>
        <p className="text-gray-text text-sm sm:text-lg mt-3 sm:mt-4">
          Sua saúde não deveria depender de plano de saúde.
        </p>
      </motion.div>

      <motion.div
        className="max-w-3xl mx-auto mt-10 sm:mt-16 rounded-2xl sm:rounded-3xl border border-gray-border overflow-hidden"
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.15 }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left */}
          <div className="p-6 sm:p-10 bg-brand-cream flex flex-col items-center md:items-start text-center md:text-left">
            <p className="font-serif text-xl sm:text-2xl text-brand-brown">Assinatura Bio Track Brasil</p>
            <div className="mt-4 sm:mt-6">
              <span className="font-serif text-5xl sm:text-6xl font-bold text-brand-terracota">R$ 1</span>
              <span className="text-lg sm:text-xl text-gray-text">/dia</span>
            </div>
            <p className="text-sm text-gray-muted mt-2">Cobrança anual de R$ 365</p>
            <Link to="/cadastro">
              <Button className="bg-brand-terracota text-white rounded-full w-full py-3 sm:py-4 mt-6 sm:mt-8 text-sm sm:text-base font-semibold hover:bg-brand-brown-mid h-auto">
                Começar Agora →
              </Button>
            </Link>
          </div>

          {/* Right */}
          <div className="p-6 sm:p-10 bg-brand-cream-light flex flex-col gap-2.5 sm:gap-3">
            {benefits.map((b) => (
              <div key={b} className="flex items-start gap-2.5 sm:gap-3 text-xs sm:text-sm text-brand-brown">
                <CheckCircle2 size={16} className="text-status-green shrink-0 mt-0.5" />
                <span>{b}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  )
}
