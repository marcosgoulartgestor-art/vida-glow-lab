

## Plano: Adicionar animações framer-motion nos cards de BiomarkersSection e HowItWorks

O objetivo é aplicar o mesmo padrão de animação `fadeUp` + `staggerContainer` já usado na `MechanismSection` aos cards dessas duas seções, sem alterar nada visual.

### Mudanças

**1. `src/components/landing/BiomarkersSection.tsx`**
- Importar `motion` do `framer-motion`
- Converter o grid container (`div` com `grid grid-cols-1 sm:grid-cols-2`) para `motion.div` com `staggerContainer`, `initial="hidden"`, `whileInView="visible"`, `viewport={{ once: true }}`
- Converter cada card de categoria para `motion.div` com variante `fadeUp` e `transition={{ duration: 0.5 }}`

**2. `src/components/landing/HowItWorks.tsx`**
- Importar `motion` do `framer-motion`
- Converter o grid container dos steps para `motion.div` com `staggerContainer`
- Converter cada step card para `motion.div` com variante `fadeUp`
- Adicionar `fadeUp` no bloco de headline da seção com `whileInView`

### Detalhes técnicos
- Variantes reutilizadas: `fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }` e `staggerContainer = { hidden: {}, visible: { transition: { staggerChildren: 0.15 } } }`
- `viewport={{ once: true }}` para animar apenas uma vez
- Nenhuma classe CSS, cor ou layout será alterada

