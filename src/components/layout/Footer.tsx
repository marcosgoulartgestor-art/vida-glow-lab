import { Activity } from 'lucide-react'

const cols = [
  {
    title: 'Empresa',
    links: ['Entrar', 'Cadastrar', 'Sobre', 'Contato'],
  },
  {
    title: 'Explorar',
    links: ['Como Funciona', 'O Que Analisamos', 'Perguntas', 'Preços'],
  },
  {
    title: 'Legal',
    links: ['Política de Privacidade', 'Termos de Uso', 'Aviso Médico'],
  },
]

export function Footer() {
  return (
    <footer className="bg-brand-cream border-t-4 border-brand-terracota py-16 px-8 md:px-16">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        {/* Logo col */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Activity className="text-brand-terracota" size={20} />
            <span className="font-serif font-bold text-lg">
              <span className="text-brand-terracota">Bio Track</span>{' '}
              <span className="text-brand-brown">Brasil</span>
            </span>
          </div>
          <p className="text-sm text-gray-text">
            Plataforma de longevidade para o mercado brasileiro.
          </p>
        </div>

        {cols.map((col) => (
          <div key={col.title}>
            <p className="font-bold text-brand-brown text-sm mb-3">{col.title}</p>
            <ul className="space-y-2">
              {col.links.map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-sm text-gray-text hover:text-brand-terracota transition-colors"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-gray-border mt-12 pt-8 flex flex-col md:flex-row justify-between gap-4">
        <p className="text-sm text-gray-text">
          © 2026 Bio Track Brasil. Todos os direitos reservados.
        </p>
        <p className="text-xs text-gray-text">
          Esta plataforma não substitui orientação médica profissional.
        </p>
      </div>
    </footer>
  )
}
