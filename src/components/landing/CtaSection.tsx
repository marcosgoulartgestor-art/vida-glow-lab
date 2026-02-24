import { Button } from '@/components/ui/button'

export function CtaSection() {
  return (
    <section className="bg-brand-brown py-32 px-8 text-center">
      <h2 className="font-serif text-6xl">
        <span className="text-white">A vida é </span>
        <span className="text-brand-terracota italic">curta?</span>
      </h2>
      <p className="text-white text-2xl font-serif mt-4">Discordamos.</p>

      <div className="mt-12 flex gap-4 justify-center flex-wrap">
        <Button className="bg-brand-terracota text-white rounded-full px-10 py-4 text-lg hover:bg-brand-brown-mid h-auto">
          Começar os Testes
        </Button>
        <Button
          variant="outline"
          className="border-2 border-white text-white rounded-full px-10 py-4 text-lg hover:bg-white/10 h-auto"
        >
          O Que Analisamos
        </Button>
      </div>
    </section>
  )
}
