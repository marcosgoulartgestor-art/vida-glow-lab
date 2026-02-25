import { Quote } from 'lucide-react'
import { motion } from 'framer-motion'

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
}

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
}

const testimonials = [
  {
    quote: 'Finalmente entendo o que está acontecendo dentro do meu corpo. Os alertas de PCR me fizeram agir antes que fosse tarde.',
    name: 'Rodrigo M., 38 anos — Empresário',
    dark: true,
  },
  {
    quote: 'Descubri que minha Vitamina D estava extremamente baixa. Não teria descoberto em um hemograma comum.',
    name: 'Ana P., 34 anos — Médica',
    dark: false,
  },
  {
    quote: 'O BioScore me dá uma visão geral imediata. É viciante acompanhar minha evolução a cada ciclo.',
    name: 'Carlos H., 45 anos — Atleta amador',
    dark: false,
  },
  {
    quote: 'Me ajudou a identificar resistência insulínica antes de me tornarem pré-diabética. A linguagem é simples e direta.',
    name: 'Fernanda L., 41 anos — Nutricionista',
    dark: true,
  },
]

export function TestimonialsSection() {
  return (
    <section className="bg-brand-cream-light py-16 sm:py-24 px-5 sm:px-8 md:px-16">
      <motion.div
        className="text-center"
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="font-serif text-3xl sm:text-4xl">
          <span className="text-brand-brown">O novo padrão </span>
          <span className="text-brand-terracota italic">para a saúde</span>
        </h2>
        <p className="text-gray-text text-sm sm:text-lg mt-3 sm:mt-4 max-w-xl mx-auto">
          Saúde para uma nova geração que quer entender sua própria biologia.
        </p>
      </motion.div>

      <motion.div
        className="mt-10 sm:mt-16 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        {testimonials.map((t) => (
          <motion.div
            key={t.name}
            className={`rounded-2xl sm:rounded-3xl p-6 sm:p-8 relative overflow-hidden ${
              t.dark ? 'bg-brand-brown text-white' : 'bg-brand-section text-brand-brown'
            }`}
            variants={fadeUp}
            transition={{ duration: 0.5 }}
          >
            <Quote
              size={60}
              className={`absolute top-3 right-3 sm:top-4 sm:right-4 ${t.dark ? 'text-white/[0.08]' : 'text-brand-brown/[0.08]'}`}
            />
            <p className="font-serif text-base sm:text-xl italic relative z-10 leading-relaxed">"{t.quote}"</p>
            <p className="text-brand-terracota text-xs sm:text-sm font-semibold mt-4 sm:mt-6 relative z-10">
              {t.name}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}
