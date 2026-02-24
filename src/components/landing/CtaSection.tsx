import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'

export function CtaSection() {
  return (
    <section className="bg-brand-brown py-20 sm:py-32 px-5 sm:px-8 text-center">
      <h2 className="font-serif text-4xl sm:text-6xl">
        <span className="text-white">A vida é </span>
        <span className="text-brand-terracota italic">curta?</span>
      </h2>
      <p className="text-white text-xl sm:text-2xl font-serif mt-3 sm:mt-4">Discordamos.</p>

      <div className="mt-8 sm:mt-12 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
        <Link to="/cadastro">
          <Button className="bg-brand-terracota text-white rounded-full px-8 sm:px-10 py-3 sm:py-4 text-base sm:text-lg hover:bg-brand-brown-mid h-auto w-full sm:w-auto">
            Começar os Testes
          </Button>
        </Link>
        <a href="/#biomarcadores">
          <Button
            variant="outline"
            className="border-2 border-white !text-white bg-transparent rounded-full px-8 sm:px-10 py-3 sm:py-4 text-base sm:text-lg hover:bg-white/10 h-auto w-full sm:w-auto"
          >
            O Que Analisamos
          </Button>
        </a>
      </div>
    </section>
  )
}
