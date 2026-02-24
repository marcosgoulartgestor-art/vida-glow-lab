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
    <section id="o-que-analisamos" className="bg-brand-cream py-24 px-8 md:px-16">
      <div className="text-center">
        <h2 className="font-serif text-4xl text-brand-brown">
          80+ biomarcadores escolhidos
        </h2>
        <p className="font-serif text-4xl text-brand-terracota italic">para longevidade.</p>
      </div>

      <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-6">
        {categories.map((cat) => (
          <div
            key={cat.name}
            className="bg-brand-cream-light border border-gray-border rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-serif text-xl font-bold text-brand-brown">
                {cat.emoji} {cat.name}
              </h3>
              <span className="bg-brand-terracota/10 text-brand-terracota text-xs font-bold rounded-full px-3 py-1">
                {cat.count} Biomarcadores
              </span>
            </div>
            <p className="text-sm text-gray-text leading-relaxed">{cat.markers}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
