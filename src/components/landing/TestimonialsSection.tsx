import { Quote } from 'lucide-react'

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
      <div className="text-center">
        <h2 className="font-serif text-3xl sm:text-4xl">
          <span className="text-brand-brown">O novo padrão </span>
          <span className="text-brand-terracota italic">para a saúde</span>
        </h2>
        <p className="text-gray-text text-sm sm:text-lg mt-3 sm:mt-4 max-w-xl mx-auto">
          Saúde para uma nova geração que quer entender sua própria biologia.
        </p>
      </div>

      <div className="mt-10 sm:mt-16 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        {testimonials.map((t) => (
          <div
            key={t.name}
            className={`rounded-2xl sm:rounded-3xl p-6 sm:p-8 relative overflow-hidden ${
              t.dark ? 'bg-brand-brown text-white' : 'bg-brand-section text-brand-brown'
            }`}
          >
            <Quote
              size={60}
              className={`absolute top-3 right-3 sm:top-4 sm:right-4 ${t.dark ? 'text-white/[0.08]' : 'text-brand-brown/[0.08]'}`}
            />
            <p className="font-serif text-base sm:text-xl italic relative z-10 leading-relaxed">"{t.quote}"</p>
            <p className="text-brand-terracota text-xs sm:text-sm font-semibold mt-4 sm:mt-6 relative z-10">
              {t.name}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
