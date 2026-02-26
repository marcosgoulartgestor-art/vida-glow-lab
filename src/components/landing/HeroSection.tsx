import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
}

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
}

const metrics = [
  { value: '80+', label: 'biomarcadores', sub: 'analisados por ciclo' },
  { value: '2x', label: 'por ano', sub: 'corpo inteiro analisado' },
  { value: 'R$1', label: 'por dia', sub: 'R$ 365/ano' },
]

export function HeroSection() {
  const [showVideo, setShowVideo] = useState(false)

  useEffect(() => {
    // Delay video load so text renders as LCP first, improving Lighthouse score
    const timer = setTimeout(() => setShowVideo(true), 3000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <section className="min-h-[100svh] relative flex flex-col justify-end pb-36 sm:pb-28 pt-24 sm:pt-32 px-5 sm:px-8 md:px-16 overflow-hidden bg-[#1a0f07]">
      {/* Background video */}
      {showVideo && (
        <video
          className="absolute inset-0 w-full h-full object-cover z-0"
          autoPlay
          loop
          muted
          playsInline
          preload="none"
        >
          <source src="/videos/hero-bg.mp4" type="video/mp4" />
        </video>
      )}

      {/* Dark overlay */}
      <div className="absolute inset-0 z-[1] bg-black/50" />

      <motion.div
        className="max-w-2xl relative z-[2]"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        <motion.span
          className="bg-white/15 backdrop-blur text-white/90 text-[11px] sm:text-xs font-semibold px-3 sm:px-4 py-1.5 sm:py-2 rounded-full mb-4 sm:mb-6 inline-flex"
          variants={fadeUp}
          transition={{ duration: 0.5 }}
        >
          Tecnologia de Longevidade
        </motion.span>

        <motion.h1
          className="font-serif text-4xl sm:text-5xl md:text-7xl font-bold text-white leading-[1.1] mb-3 sm:mb-4"
          variants={fadeUp}
          transition={{ duration: 0.5 }}
        >
          Conheça sua
          <br />
          <span className="italic text-brand-terracota">saúde.</span>
        </motion.h1>

        <motion.p
          className="text-base sm:text-lg text-white/80 max-w-lg mb-6 sm:mb-8 leading-relaxed"
          variants={fadeUp}
          transition={{ duration: 0.5 }}
        >
          Todo ano. Começando com mais de 80 biomarcadores que revelam sua biologia com
          profundidade. Sem depender do plano de saúde.
        </motion.p>

        <motion.div variants={fadeUp} transition={{ duration: 0.5 }}>
          <Link to="/cadastro">
            <Button className="bg-brand-terracota text-white rounded-full px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base font-semibold hover:bg-brand-brown-mid transition-all h-auto w-full sm:w-auto">
              Começar os Testes →
            </Button>
          </Link>
        </motion.div>
      </motion.div>

      {/* Metrics bar */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 bg-black/20 backdrop-blur-sm py-4 sm:py-6 px-5 sm:px-8 md:px-16 z-[2]"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
      >
        <div className="grid grid-cols-3 divide-x divide-white/20">
          {metrics.map((m) => (
            <div key={m.value} className="text-center px-1 sm:px-4">
              <p className="font-serif text-xl sm:text-3xl font-bold text-brand-terracota">{m.value}</p>
              <p className="text-xs sm:text-sm text-white/70">{m.label}</p>
              <p className="text-[10px] sm:text-xs text-white/50 hidden sm:block">{m.sub}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}
