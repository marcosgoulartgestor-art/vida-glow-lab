import { CheckCircle2 } from 'lucide-react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ReferenceArea,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'

const checks = [
  'Estabeleça sua linha de base de longo prazo.',
  'Acompanhado por toda a vida.',
  'Observe como seu corpo muda.',
]

const conditions = [
  'Resistência à insulina',
  'Hipotireoidismo',
  'Hashimoto',
  'Diabetes',
  'Aterosclerose',
  'Anemia',
  'Deficiência de Vitamina D',
  'Síndrome Metabólica',
  'Esteatose Hepática',
  'Gota',
  'Artrite Reumatoide',
  'Doença Renal Crônica',
  'PCOS',
  'Hipogonadismo',
  'Alzheimer',
]

const chartData = [
  { date: 'Mai/25', value: 22 },
  { date: 'Out/25', value: 28 },
  { date: 'Mai/26', value: 32 },
]

export function MonitorSection() {
  const doubled = [...conditions, ...conditions]

  return (
    <section className="bg-brand-section py-24 px-8 md:px-16">
      {/* Title */}
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="font-serif text-4xl text-brand-brown">
          Monitorar indicadores precoces de
        </h2>
        <p className="font-serif text-4xl text-brand-terracota italic">
          doenças crônicas silenciosas
        </p>
      </div>

      {/* Checks */}
      <div className="mt-8 flex flex-wrap justify-center gap-8">
        {checks.map((text) => (
          <div key={text} className="flex items-center gap-2">
            <CheckCircle2 size={18} className="text-status-green shrink-0" />
            <span className="text-brand-brown text-sm">{text}</span>
          </div>
        ))}
      </div>

      {/* Ticker */}
      <div className="mt-12 overflow-hidden">
        <div className="flex animate-marquee whitespace-nowrap">
          {doubled.map((c, i) => (
            <span
              key={i}
              className="bg-brand-cream rounded-full px-4 py-2 text-sm text-brand-brown border border-gray-border mx-2 shrink-0"
            >
              {c}
            </span>
          ))}
        </div>
      </div>

      {/* Recharts */}
      <div className="mt-12 max-w-md mx-auto bg-white rounded-2xl border border-gray-border p-6">
        <p className="text-sm font-semibold text-brand-brown mb-4">Evolução do Biomarcador</p>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={chartData} margin={{ top: 5, right: 10, bottom: 5, left: 0 }}>
            <ReferenceArea y1={0} y2={20} fill="#FCE8E8" fillOpacity={0.8} label={{ value: 'BELOW RANGE', position: 'insideLeft', fontSize: 9, fill: '#C43A3A' }} />
            <ReferenceArea y1={20} y2={50} fill="#E8F4ED" fillOpacity={0.8} label={{ value: 'IN RANGE', position: 'insideLeft', fontSize: 9, fill: '#4A7C59' }} />
            <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#6B6B6B' }} axisLine={false} tickLine={false} />
            <YAxis domain={[0, 50]} hide />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#C4613A"
              strokeWidth={2}
              dot={{ r: 5, fill: '#C4613A', stroke: '#fff', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  )
}
