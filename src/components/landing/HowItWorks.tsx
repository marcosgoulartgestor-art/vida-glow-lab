import { Upload, BarChart2, CheckCircle2 } from 'lucide-react'

const steps = [
  {
    number: '01',
    icon: Upload,
    title: 'Envie seus exames',
    description:
      'Faça upload do PDF do seu laudo de qualquer laboratório brasileiro — Fleury, Delboni, Hermes Pardini, DASA, Sabin e outros.',
    visual: 'calendar',
  },
  {
    number: '02',
    icon: BarChart2,
    title: 'Resultados explicados',
    description:
      'Cada biomarcador é exibido com sua Zona de Otimização em linguagem acessível, não apenas os valores de referência clínica.',
    visual: 'chart',
  },
  {
    number: '03',
    icon: CheckCircle2,
    title: 'Siga seu protocolo',
    description:
      'Receba sugestões personalizadas de ação: alimentação, suplementação, estilo de vida. Teste novamente em 6 meses.',
    visual: 'list',
  },
]

function MiniCalendar() {
  const days = Array.from({ length: 28 }, (_, i) => i + 1)
  return (
    <div className="mt-4 grid grid-cols-7 gap-1 text-[10px] text-brand-brown/50">
      {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((d, i) => (
        <span key={i} className="text-center font-semibold text-brand-brown/30">{d}</span>
      ))}
      {days.map((d) => (
        <span
          key={d}
          className={`text-center rounded-md py-0.5 ${d === 15 ? 'bg-brand-terracota text-white font-bold' : ''}`}
        >
          {d}
        </span>
      ))}
    </div>
  )
}

function MiniChart() {
  const points = [
    { x: 10, y: 50 },
    { x: 50, y: 25 },
    { x: 90, y: 30 },
  ]
  return (
    <svg viewBox="0 0 100 60" className="mt-4 w-full h-16">
      <rect x="0" y="35" width="100" height="25" fill="#FCE8E8" rx="2" />
      <rect x="0" y="10" width="100" height="25" fill="#E8F4ED" rx="2" />
      <polyline
        points={points.map((p) => `${p.x},${p.y}`).join(' ')}
        fill="none"
        stroke="#C4613A"
        strokeWidth="2"
      />
      {points.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="3" fill="#C4613A" />
      ))}
    </svg>
  )
}

function MiniList() {
  const items = ['Foods', 'Supplements', 'Daily health']
  return (
    <div className="mt-4 space-y-2">
      {items.map((item) => (
        <div key={item} className="flex items-center gap-2">
          <CheckCircle2 size={14} className="text-status-green" />
          <span className="text-xs text-brand-brown/60">{item}</span>
        </div>
      ))}
    </div>
  )
}

const visuals: Record<string, () => JSX.Element> = {
  calendar: MiniCalendar,
  chart: MiniChart,
  list: MiniList,
}

export function HowItWorks() {
  return (
    <section id="como-funciona" className="bg-brand-cream-light py-24 px-8 md:px-16">
      <div className="text-center">
        <h2 className="font-serif text-4xl md:text-5xl text-brand-brown">
          Testar é <span className="text-brand-terracota italic">fácil.</span>
        </h2>
        <p className="text-gray-text text-lg mt-4 max-w-xl mx-auto">
          Em 3 passos simples, você transforma seus exames em um plano de longevidade.
        </p>
      </div>

      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
        {steps.map((step) => {
          const Visual = visuals[step.visual]
          return (
            <div
              key={step.number}
              className="border border-gray-border rounded-2xl bg-brand-cream p-8"
            >
              <span className="text-brand-terracota font-bold text-sm">{step.number}</span>
              <div className="w-[60px] h-[60px] bg-brand-terracota/10 rounded-2xl flex items-center justify-center my-4">
                <step.icon size={28} className="text-brand-terracota" />
              </div>
              <h3 className="font-serif text-2xl text-brand-brown mb-3">{step.title}</h3>
              <p className="text-gray-text text-sm leading-relaxed">{step.description}</p>
              <Visual />
            </div>
          )
        })}
      </div>
    </section>
  )
}
