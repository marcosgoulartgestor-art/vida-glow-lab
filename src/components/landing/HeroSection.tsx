import { Button } from '@/components/ui/button'

const metrics = [
  { value: '80+', label: 'biomarcadores', sub: 'analisados por ciclo' },
  { value: '2x', label: 'por ano', sub: 'corpo inteiro analisado' },
  { value: 'R$1', label: 'por dia', sub: 'R$ 365/ano' },
]

export function HeroSection() {
  return (
    <section
      className="min-h-[100svh] relative flex flex-col justify-end pb-28 sm:pb-20 pt-24 sm:pt-32 px-5 sm:px-8 md:px-16"
      style={{
        background: 'linear-gradient(135deg, #2C1A0E 0%, #6B3D2E 50%, #1a0f07 100%)',
      }}
    >
      <div className="max-w-2xl">
        <span className="bg-white/15 backdrop-blur text-white/90 text-[11px] sm:text-xs font-semibold px-3 sm:px-4 py-1.5 sm:py-2 rounded-full mb-4 sm:mb-6 inline-flex">
          Tecnologia de Longevidade
        </span>

        <h1 className="font-serif text-4xl sm:text-5xl md:text-7xl font-bold text-white leading-[1.1] mb-3 sm:mb-4">
          Conheça sua
          <br />
          <span className="italic text-brand-terracota">saúde.</span>
        </h1>

        <p className="text-base sm:text-lg text-white/80 max-w-lg mb-6 sm:mb-8 leading-relaxed">
          Todo ano. Começando com mais de 80 biomarcadores que revelam sua biologia com
          profundidade. Sem depender do plano de saúde.
        </p>

        <Button className="bg-brand-terracota text-white rounded-full px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base font-semibold hover:bg-brand-brown-mid transition-all h-auto w-full sm:w-auto">
          Começar os Testes →
        </Button>
      </div>

      {/* Metrics bar */}
      <div className="absolute bottom-0 left-0 right-0 bg-black/20 backdrop-blur-sm py-4 sm:py-6 px-5 sm:px-8 md:px-16">
        <div className="grid grid-cols-3 divide-x divide-white/20">
          {metrics.map((m) => (
            <div key={m.value} className="text-center px-1 sm:px-4">
              <p className="font-serif text-xl sm:text-3xl font-bold text-brand-terracota">{m.value}</p>
              <p className="text-xs sm:text-sm text-white/70">{m.label}</p>
              <p className="text-[10px] sm:text-xs text-white/50 hidden sm:block">{m.sub}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
