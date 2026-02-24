import { Activity, Menu } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'

const navLinks = [
  { label: 'Como Funciona', href: '/#como-funciona' },
  { label: 'O Que Analisamos', href: '/#biomarcadores' },
  { label: 'Preços', href: '/#precos' },
]

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <nav className="fixed top-0 z-50 w-full bg-brand-cream shadow-sm">
      <div className="h-[72px] flex items-center justify-between px-8">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2">
          <Activity className="text-brand-terracota" size={22} />
          <span className="font-serif font-bold text-xl">
            <span className="text-brand-terracota">Bio Track</span>{' '}
            <span className="text-brand-brown">Brasil</span>
          </span>
        </a>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-brand-brown hover:text-brand-terracota transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Desktop CTAs */}
        <div className="hidden md:flex items-center gap-3">
          <Link to="/login">
            <Button
              variant="outline"
              className="border-brand-terracota text-brand-terracota rounded-full px-5 hover:bg-brand-terracota/10"
            >
              Entrar
            </Button>
          </Link>
          <Link to="/cadastro">
            <Button className="bg-brand-terracota text-white rounded-full px-5 hover:bg-brand-brown-mid">
              Começar Agora
            </Button>
          </Link>
        </div>

        {/* Mobile menu toggle */}
        <button
          className="md:hidden text-brand-brown"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          <Menu size={24} />
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-brand-cream border-t border-gray-border px-8 pb-6 pt-4 flex flex-col gap-4">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-brand-brown hover:text-brand-terracota transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <div className="flex flex-col gap-3 pt-2">
            <Link to="/login">
              <Button
                variant="outline"
                className="w-full border-brand-terracota text-brand-terracota rounded-full px-5 hover:bg-brand-terracota/10"
              >
                Entrar
              </Button>
            </Link>
            <Link to="/cadastro">
              <Button className="w-full bg-brand-terracota text-white rounded-full px-5 hover:bg-brand-brown-mid">
                Começar Agora
              </Button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}
