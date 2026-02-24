import { Button } from '@/components/ui/button'

const metrics = [
  { value: '80+', label: 'biomarcadores', sub: 'analisados por ciclo' },
  { value: '2x', label: 'por ano', sub: 'corpo inteiro analisado' },
  { value: 'R$1', label: 'por dia', sub: 'R$ 365/ano' },
]

export function HeroSection() {
  return (
    <section
      className="min-h-screen relative flex flex-col justify-end pb-20 pt-32 px-8 md:px-16"
      style={{
        background: 'linear-gradient(135deg, #2C1A0E 0%, #6B3D2E 50%, #1a0f07 100%)',
      }}
    >
      {/* Content */}
      <div className="max-w-2xl">
        {/* Badge */}
        <span className="bg-white/15 backdrop-blur text-white/90 text-xs font-semibold px-4 py-2 rounded-full mb-6 inline-flex">
          Tecnologia de Longevidade
        </span>

        {/* Headline */}
        <h1 className="font-serif text-5xl md:text-7xl font-bold text-white leading-tight mb-4">
          Conheça sua
          <br />
          <span className="italic text-brand-terracota">saúde.</span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg text-white/80 max-w-lg mb-8">
          Todo ano. Começando com mais de 80 biomarcadores que revelam sua biologia com
          profundidade. Sem depender do plano de saúde.
        </p>

        {/* CTA */}
        <Button className="bg-brand-terracota text-white rounded-full px-8 py-4 text-base font-semibold hover:bg-brand-brown-mid transition-all h-auto">
          Começar os Testes →
        </Button>
      </div>

      {/* Metrics bar */}
      <div className="absolute bottom-0 left-0 right-0 bg-black/20 backdrop-blur-sm py-6 px-8 md:px-16">
        <div className="grid grid-cols-3 divide-x divide-white/20">
          {metrics.map((m) => (
            <div key={m.value} className="text-center px-4">
              <p className="font-serif text-3xl font-bold text-brand-terracota">{m.value}</p>
              <p className="text-sm text-white/70">{m.label}</p>
              <p className="text-xs text-white/50">{m.sub}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
