import { motion } from 'framer-motion'

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
}

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
}

const categories = [
  {
    emoji: '🧬',
    name: 'Hormônios & Tireoide',
    count: 16,
    markers:
      'Testosterona Total, TSH, T4 Livre, T3, DHEA-S, Estradiol, LH, FSH, AMH, SHBG, Prolactina, Cortisol, IGF-1, Progesterona, Androstenediona, 17-OH Progesterona',
  },
  {
    emoji: '❤️',
    name: 'Coração & Metabolismo',
    count: 18,
    markers:
      'Glicose, Insulina, HbA1c, Colesterol Total, HDL, LDL, ApoB, Triglicerídeos, Lipoproteína(a), Omega-3, Homocisteína, PCR-us, Fibrinogênio, Ureia, Creatinina, VLDL, Ômega-6, TFG',
  },
  {
    emoji: '💊',
    name: 'Nutrição & Vitaminas',
    count: 14,
    markers:
      'Vitamina D, Vitamina B12, Vitamina B9 (Folato), Vitamina A, Vitamina E, Zinco, Magnésio, Ferro, Ferritina, Transferrina, Saturação de Transferrina, Selênio, Cobre, Iodo',
  },
  {
    emoji: '🔥',
    name: 'Inflamação & Imunidade',
    count: 12,
    markers:
      'PCR, PCR-ultrassensível, IL-6, TNF-alfa, Leucócitos, Hemograma completo, VHS, Ácido Úrico, Fator Reumatoide, ANA, Anti-TPO, Anti-Tireoglobulina',
  },
  {
    emoji: '🧠',
    name: 'Envelhecimento & Cérebro',
    count: 10,
    markers:
      'DHEA-S, Melatonina, Homocisteína, APOE, Vitamina B12, Ácido Metilmalônico, Glutationa, Coenzima Q10, NAD+, Telômeros',
  },
  {
    emoji: '🫁',
    name: 'Fígado, Rim & Função Orgânica',
    count: 16,
    markers:
      'TGO, TGP, GGT, Fosfatase Alcalina, Bilirrubinas, Albumina, Globulina, Proteínas Totais, Ureia, Creatinina, TFG, Ácido Úrico, Sódio, Potássio, Cálcio, Fósforo',
  },
]

export function BiomarkersSection() {
  return (
    <section id="o-que-analisamos" className="bg-brand-cream py-16 sm:py-24 px-5 sm:px-8 md:px-16">
      <div className="text-center">
        <h2 className="font-serif text-3xl sm:text-4xl text-brand-brown">
          80+ biomarcadores escolhidos
        </h2>
        <p className="font-serif text-3xl sm:text-4xl text-brand-terracota italic">para longevidade.</p>
      </div>

      <motion.div
        className="mt-10 sm:mt-16 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        {categories.map((cat) => (
          <motion.div
            key={cat.name}
            className="bg-brand-cream-light border border-gray-border rounded-2xl p-5 sm:p-6"
            variants={fadeUp}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-start sm:items-center justify-between gap-2 mb-3">
              <h3 className="font-serif text-lg sm:text-xl font-bold text-brand-brown">
                {cat.emoji} {cat.name}
              </h3>
              <span className="bg-brand-terracota/10 text-brand-terracota text-[10px] sm:text-xs font-bold rounded-full px-2.5 sm:px-3 py-1 whitespace-nowrap shrink-0">
                {cat.count}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-gray-text leading-relaxed">{cat.markers}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}
