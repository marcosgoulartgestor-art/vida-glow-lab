

## Plano: Nova seção "Mecanismo Único" na Landing Page

### Resumo
Criar o componente `MechanismSection.tsx` e inseri-lo no `Landing.tsx` entre HeroSection e HowItWorks. Nenhum componente existente será alterado.

### Mudanças

**1. Novo arquivo: `src/components/landing/MechanismSection.tsx`**
- Componente com 6 blocos conforme especificado: headline com badge, grid comparativo (Exame Tradicional vs Bio Track Brasil), headline de transição, 4 pilares, benefício central com pills, e CTA final
- Usa cores do design system existente (`brand-cream`, `brand-terracota`, `brand-brown`, `status-*`, etc.)
- Ícone `ArrowRight` do lucide-react
- Link do CTA aponta para `/cadastro`

**2. Edição: `src/pages/Landing.tsx`**
- Adicionar import do `MechanismSection`
- Inserir `<MechanismSection />` entre `<HeroSection />` e o div `#como-funciona` (HowItWorks)

### Notas técnicas
- Todas as classes Tailwind referenciadas (`brand-cream`, `brand-cream-light`, `brand-terracota`, `brand-brown`, `brand-brown-mid`, `brand-gray-text`, `brand-gray-muted`, `brand-gray-border`, `brand-section`, `status-green`, `status-yellow`, `status-red`, `status-green-bg`) já existem no `tailwind.config.ts`
- Nenhuma dependência nova necessária

