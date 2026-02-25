

## Plano: Vídeo de fundo na HeroSection

### Objetivo
Adicionar o vídeo `Video_Bio.mp4` como background da HeroSection em loop contínuo, otimizado para performance.

### Alterações

**1. Copiar o vídeo para o projeto**
- Copiar `user-uploads://Video_Bio.mp4` para `public/videos/hero-bg.mp4`
- Usar a pasta `public/` pois vídeos de background são referenciados via URL direta (não importados como módulo ES6)

**2. Atualizar `src/components/landing/HeroSection.tsx`**
- Adicionar um elemento `<video>` posicionado absolutamente atrás de todo o conteúdo com as seguintes otimizações:
  - `autoPlay`, `loop`, `muted`, `playsInline` — reprodução automática silenciosa em todos os navegadores
  - `preload="none"` — não carrega o vídeo até que o browser esteja pronto (evita bloquear o carregamento inicial)
  - `loading="lazy"` via estado React — carrega o vídeo somente após a montagem do componente
  - `poster` opcional com a cor de fundo atual para evitar flash branco
  - CSS: `object-fit: cover`, `position: absolute`, `inset: 0`, `z-index: 0`
- Manter o gradiente escuro como overlay semi-transparente sobre o vídeo (`bg-black/50` ou similar) para garantir legibilidade do texto
- Elevar o z-index do conteúdo textual e da metrics bar para ficarem acima do vídeo
- Remover o `background: linear-gradient(...)` inline e substituir pelo overlay

### Otimizações de performance
- `preload="none"` evita download antecipado
- `muted` + `playsInline` garante autoplay em mobile sem interação
- Overlay escuro mantém contraste e legibilidade
- Vídeo carregado de `/videos/hero-bg.mp4` (servido como arquivo estático, não bundled)

### Estrutura resultante
```text
<section (relative, overflow-hidden)>
  <video (absolute, inset-0, z-0, loop, muted, autoplay)/>
  <div (absolute, inset-0, z-[1], gradient overlay)/>
  <motion.div (relative, z-[2], conteúdo textual)/>
  <motion.div (z-[2], metrics bar)/>
</section>
```

