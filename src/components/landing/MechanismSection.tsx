import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

const pillars = [
  {
    emoji: '🎯',
    title: 'Zonas de Otimização, Não Só Referência',
    text: 'Os laboratórios usam faixas amplas para detectar doenças. Nós usamos ciência de longevidade para mostrar onde você performa no seu melhor — não apenas onde você "não está doente".',
  },
  {
    emoji: '📊',
    title: '80+ Biomarcadores vs 15-20 do Rotineiro',
    text: 'Não é só hemograma. Analisamos hormônios, vitaminas, inflamação, função mitocondrial e marcadores de envelhecimento que seus médicos raramente pedem.',
  },
  {
    emoji: '🧬',
    title: 'Linguagem Simples, Ação Clara',
    text: 'Nada de "valor dentro da faixa". Cada marcador vem com: O que é, por que importa para longevidade, e o que fazer agora — alimentação, suplementos, hábitos.',
  },
  {
    emoji: '📈',
    title: 'Histórico Evolutivo, Não Foto Única',
    text: 'Longevidade é monitoramento ao longo da vida. Veja como seus marcadores evoluem ciclo após ciclo, identifique tendências precoces e corrija antes que virem problemas.',
  },
]

const pills = [
  '✓ Detecte em estágio Zero',
  '✓ Corrija com estilo de vida',
  '✓ Otimize antes de degradar',
  '✓ Viva mais, melhor',
]

export function MechanismSection() {
  return (
    <section className="bg-brand-cream py-32 px-8 md:px-16">
      {/* BLOCO 1: HEADLINE */}
      <div className="text-center mb-20">
        <span className="inline-flex items-center gap-2 bg-brand-terracota/10 rounded-full px-5 py-2 mb-6 text-brand-terracota text-sm font-bold">
          O PROBLEMA
        </span>
        <h2 className="font-serif text-4xl md:text-6xl text-brand-brown leading-tight mb-6">
          Seus exames não foram feitos
          <br />
          <span className="text-brand-terracota italic">para você viver mais.</span>
        </h2>
        <p className="text-xl text-brand-gray-text max-w-3xl mx-auto leading-relaxed">
          Os valores de referência dos laboratórios detectam doenças. Nós revelamos as Zonas de Otimização — onde sua biologia performa no seu melhor.
        </p>
      </div>

      {/* BLOCO 2: GRID COMPARATIVO */}
      <div className="grid md:grid-cols-2 gap-8 mb-24 max-w-6xl mx-auto">
        {/* Card Esquerdo */}
        <div className="bg-white rounded-3xl p-8 border-2 border-brand-gray-border relative overflow-hidden">
          <span className="absolute top-4 right-4 bg-status-red/10 text-status-red text-xs font-bold px-3 py-1 rounded-full">
            EXAME TRADICIONAL
          </span>
          <div className="mt-8 space-y-6">
            <div className="border-l-4 border-brand-gray-border pl-4">
              <p className="text-sm text-brand-gray-muted mb-1">Colesterol LDL</p>
              <p className="text-2xl font-bold text-brand-brown">110 mg/dL</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs bg-status-green-bg text-status-green px-2 py-1 rounded">NORMAL</span>
                <span className="text-xs text-brand-gray-muted">Ref: 0-130 mg/dL</span>
              </div>
            </div>
            <div className="text-sm text-brand-gray-text leading-relaxed bg-brand-section p-4 rounded-xl space-y-2">
              <p>❌ Você está "normal"</p>
              <p>❌ Nenhuma orientação de ação</p>
              <p>❌ Zero contexto sobre longevidade</p>
              <p>❌ Aguarde ficar doente para agir</p>
            </div>
          </div>
        </div>

        {/* Card Direito */}
        <div className="bg-gradient-to-br from-brand-brown to-brand-brown-mid rounded-3xl p-8 border-2 border-brand-terracota relative overflow-hidden shadow-2xl">
          <span className="absolute top-4 right-4 bg-brand-terracota text-white text-xs font-bold px-3 py-1 rounded-full">
            BIO TRACK BRASIL
          </span>
          <div className="mt-8 space-y-6">
            <div className="border-l-4 border-brand-terracota pl-4">
              <p className="text-sm text-white/60 mb-1">Colesterol LDL</p>
              <p className="text-2xl font-bold text-white">110 mg/dL</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs bg-status-yellow/20 text-status-yellow px-2 py-1 rounded border border-status-yellow/40">ATENÇÃO</span>
                <span className="text-xs text-white/60">Ideal: 0-90 mg/dL</span>
              </div>
            </div>
            {/* Barra de zona */}
            <div className="mt-4">
              <div className="h-2 rounded-full overflow-hidden bg-white/10 flex">
                <div className="bg-status-green/40" style={{ width: '45%' }} />
                <div className="bg-status-yellow/40" style={{ width: '30%' }} />
                <div className="bg-status-red/40" style={{ width: '25%' }} />
              </div>
              <div className="relative -mt-2">
                <div className="absolute left-[61%] w-0.5 h-3 bg-white rounded-full" />
              </div>
            </div>
            <div className="text-sm text-white/90 leading-relaxed bg-white/10 backdrop-blur p-4 rounded-xl border border-white/20 space-y-2">
              <p>✅ Você está fora da zona ideal</p>
              <p>✅ Para longevidade, o alvo é &lt;90 mg/dL</p>
              <p>✅ Protocolo: ↑ fibras, ↓ gordura saturada</p>
              <p>✅ Previna décadas antes da doença</p>
            </div>
          </div>
        </div>
      </div>

      {/* BLOCO 3: HEADLINE TRANSIÇÃO */}
      <div className="text-center mb-16">
        <h2 className="font-serif text-3xl md:text-5xl text-brand-brown mb-4">
          Não é só um <span className="text-brand-terracota italic">número.</span>
          <br />
          É uma <span className="text-brand-terracota italic">estratégia.</span>
        </h2>
      </div>

      {/* BLOCO 4: 4 PILARES */}
      <div className="grid md:grid-cols-2 gap-6 mb-24 max-w-6xl mx-auto">
        {pillars.map((p) => (
          <div key={p.title} className="bg-brand-cream-light border-l-4 border-brand-terracota rounded-2xl p-8">
            <span className="text-4xl mb-4 block">{p.emoji}</span>
            <h3 className="font-serif text-xl font-bold text-brand-brown mb-3">{p.title}</h3>
            <p className="text-brand-gray-text leading-relaxed">{p.text}</p>
          </div>
        ))}
      </div>

      {/* BLOCO 5: BENEFÍCIO CENTRAL */}
      <div className="bg-gradient-to-br from-brand-brown to-brand-brown-mid rounded-3xl p-12 md:p-16 text-center text-white max-w-6xl mx-auto">
        <div className="max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-2 bg-brand-terracota/20 rounded-full px-5 py-2 mb-6 text-brand-terracota text-sm font-bold">
            O RESULTADO
          </span>
          <h2 className="font-serif text-4xl md:text-5xl font-bold mb-6 leading-tight">
            Você passa de <span className="text-brand-terracota italic">reativo</span>
            <br />
            para <span className="text-brand-terracota italic">preventivo.</span>
          </h2>
          <p className="text-lg text-white/80 leading-relaxed mb-8">
            Não espere sentir sintomas. Não dependa do plano de saúde limitar seus exames. Antecipe resistência insulínica, deficiências hormonais, inflamação crônica e declínio cognitivo — anos antes que se tornem doenças.
          </p>
          <div className="flex flex-wrap justify-center gap-3 text-sm">
            {pills.map((pill) => (
              <span key={pill} className="bg-white/10 backdrop-blur border border-white/20 rounded-full px-4 py-2">
                {pill}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* BLOCO 6: CTA FINAL */}
      <div className="text-center mt-16">
        <Link
          to="/cadastro"
          className="inline-flex items-center gap-2 bg-brand-terracota text-white font-semibold px-10 py-5 rounded-full text-lg hover:bg-brand-brown-mid transition-all shadow-xl hover:shadow-2xl hover:scale-[1.02]"
        >
          Ver Meu Painel Agora
          <ArrowRight className="w-5 h-5" />
        </Link>
        <p className="text-sm text-brand-gray-muted mt-4">
          Comece com o modo demo — sem cartão, sem compromisso
        </p>
      </div>
    </section>
  )
}
