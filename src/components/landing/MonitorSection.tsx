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
import { motion } from 'framer-motion'

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
}

const checks = [
  'Estabeleça sua linha de base.',
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
    <section className="bg-brand-section py-16 sm:py-24 px-5 sm:px-8 md:px-16">
      <motion.div
        className="max-w-3xl mx-auto text-center"
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="font-serif text-2xl sm:text-4xl text-brand-brown leading-tight">
          Monitorar indicadores precoces de
        </h2>
        <p className="font-serif text-2xl sm:text-4xl text-brand-terracota italic">
          doenças crônicas silenciosas
        </p>
      </motion.div>

      <motion.div
        className="mt-6 sm:mt-8 flex flex-col sm:flex-row sm:flex-wrap justify-center gap-3 sm:gap-8"
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.15 }}
      >
        {checks.map((text) => (
          <div key={text} className="flex items-center gap-2">
            <CheckCircle2 size={16} className="text-status-green shrink-0" />
            <span className="text-brand-brown text-xs sm:text-sm">{text}</span>
          </div>
        ))}
      </motion.div>

      <div className="mt-8 sm:mt-12 overflow-hidden">
        <div className="flex animate-marquee whitespace-nowrap">
          {doubled.map((c, i) => (
            <span
              key={i}
              className="bg-brand-cream rounded-full px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm text-brand-brown border border-gray-border mx-1.5 sm:mx-2 shrink-0"
            >
              {c}
            </span>
          ))}
        </div>
      </div>

      <motion.div
        className="mt-8 sm:mt-12 max-w-md mx-auto bg-white rounded-2xl border border-gray-border p-4 sm:p-6"
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <p className="text-xs sm:text-sm font-semibold text-brand-brown mb-3 sm:mb-4">Evolução do Biomarcador</p>
        <ResponsiveContainer width="100%" height={160}>
          <LineChart data={chartData} margin={{ top: 5, right: 10, bottom: 5, left: 0 }}>
            <ReferenceArea y1={0} y2={20} fill="#FCE8E8" fillOpacity={0.8} label={{ value: 'ABAIXO', position: 'insideLeft', fontSize: 8, fill: '#C43A3A' }} />
            <ReferenceArea y1={20} y2={50} fill="#E8F4ED" fillOpacity={0.8} label={{ value: 'NORMAL', position: 'insideLeft', fontSize: 8, fill: '#4A7C59' }} />
            <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#6B6B6B' }} axisLine={false} tickLine={false} />
            <YAxis domain={[0, 50]} hide />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#C4613A"
              strokeWidth={2}
              dot={{ r: 4, fill: '#C4613A', stroke: '#fff', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>
    </section>
  )
}
