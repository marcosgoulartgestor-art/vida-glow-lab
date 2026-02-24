import { Bell, Menu } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'

interface AppHeaderProps {
  title: string
  onMenuClick?: () => void
}

export function AppHeader({ title, onMenuClick }: AppHeaderProps) {
  const { user } = useAuth()
  const initials = (user?.user_metadata?.full_name || user?.email || '?')[0].toUpperCase()
  const displayName = user?.user_metadata?.full_name || 'Usuário'

  return (
    <div className="flex items-center justify-between px-8 py-5 border-b border-gray-border bg-brand-cream shrink-0">
      <div className="flex items-center gap-3">
        <button
          className="md:hidden text-brand-brown"
          onClick={onMenuClick}
        >
          <Menu size={22} />
        </button>
        <h1 className="font-serif text-2xl text-brand-brown">{title}</h1>
      </div>

      <div className="flex items-center gap-3">
        <button className="text-gray-muted cursor-not-allowed" disabled title="Em breve">
          <Bell size={20} />
        </button>
        <div className="hidden sm:flex items-center gap-2">
          <div className="bg-brand-terracota text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs">
            {initials}
          </div>
          <span className="text-sm text-brand-brown font-medium">{displayName}</span>
        </div>
      </div>
    </div>
  )
}
