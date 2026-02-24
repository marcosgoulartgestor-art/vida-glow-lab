import { CheckCircle2, XCircle } from 'lucide-react'

const features = [
  'Biomarcadores por ciclo',
  'Zonas de Otimização (não só referência)',
  'Upload de laudo de qualquer laboratório',
  'Histórico evolutivo de biomarcadores',
  'Insights em linguagem acessível',
  'Protocolo personalizado de ação',
  'Sem depender de plano de saúde',
  'Análise de hormônios e fertilidade',
  'Análise de metais pesados e toxinas',
  'Testes metabólicos e pancreáticos',
  'Exames cardíacos além do colesterol',
  'Testes de autoimunidade',
]

const biotrackValues = ['80+', '✓', '✓', '✓', '✓', '✓', '✓', '✓', '✓', '✓', '✓', '✓']
const routineValues = ['~20', '✗', '✗', '✗', '✗', '✗', '✗', '✗', '✗', '✗', '✗', '✗']

function CellIcon({ val }: { val: string }) {
  if (val === '✓') return <CheckCircle2 size={18} className="text-status-green mx-auto" />
  if (val === '✗') return <XCircle size={18} className="text-status-red opacity-50 mx-auto" />
  return <span className="font-semibold text-brand-brown">{val}</span>
}

export function ComparisonSection() {
  return (
    <section className="bg-brand-cream py-24 px-8 md:px-16">
      <div className="text-center">
        <h2 className="font-serif text-4xl">
          <span className="text-brand-brown">Não é </span>
          <span className="text-brand-terracota italic">um exame de rotina.</span>
        </h2>
      </div>

      <div className="mt-16 max-w-3xl mx-auto rounded-2xl overflow-hidden border border-gray-border">
        {/* Header */}
        <div className="grid grid-cols-[1fr_160px_160px] text-sm font-semibold">
          <div className="p-4 bg-brand-cream-light text-brand-brown" />
          <div className="p-4 bg-brand-terracota text-white text-center">Bio Track Brasil</div>
          <div className="p-4 bg-brand-cream-light text-brand-brown text-center">Rotineiro</div>
        </div>
        {/* Rows */}
        {features.map((f, i) => (
          <div
            key={f}
            className={`grid grid-cols-[1fr_160px_160px] text-sm ${i % 2 === 0 ? 'bg-white' : 'bg-brand-cream-light'}`}
          >
            <div className="p-4 text-brand-brown">{f}</div>
            <div className="p-4 text-center"><CellIcon val={biotrackValues[i]} /></div>
            <div className="p-4 text-center"><CellIcon val={routineValues[i]} /></div>
          </div>
        ))}
      </div>
    </section>
  )
}
