import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  Activity,
  LayoutDashboard,
  Upload,
  BarChart3,
  Settings,
  LogOut,
} from 'lucide-react'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { useAuth } from '@/context/AuthContext'
import { cn } from '@/lib/utils'

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', to: '/dashboard' },
  { icon: Upload, label: 'Enviar Exame', to: '/upload' },
  { icon: BarChart3, label: 'Histórico', to: '/historico', soon: true },
  { icon: Settings, label: 'Configurações', to: '/configuracoes', soon: true },
]

export function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, signOut } = useAuth()

  const initials = (user?.user_metadata?.full_name || user?.email || '?')[0].toUpperCase()
  const displayName = user?.user_metadata?.full_name || 'Usuário'

  const handleLogout = async () => {
    await signOut()
    navigate('/login')
  }

  return (
    <div className="w-64 bg-brand-brown h-full flex flex-col py-6 px-4 shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-2 px-2 mb-10">
        <Activity className="text-brand-terracota" size={22} />
        <span className="font-serif font-bold text-lg">
          <span className="text-brand-terracota">Bio Track</span>{' '}
          <span className="text-white">Brasil</span>
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 flex flex-col gap-1">
        {navItems.map((item) => {
          const active = location.pathname === item.to
          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={onNavigate}
              className={cn(
                'flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all',
                active
                  ? 'bg-brand-terracota text-white'
                  : 'text-white/60 hover:text-white hover:bg-white/10'
              )}
            >
              <item.icon size={18} />
              <span>{item.label}</span>
              {item.soon && (
                <span className="text-xs bg-white/10 text-white/40 rounded-full px-2 ml-auto">
                  Em breve
                </span>
              )}
            </Link>
          )
        })}
      </nav>

      <Separator className="bg-white/10 my-4" />

      {/* BioScore */}
      <div className="px-3 mb-4">
        <p className="text-white/40 text-xs uppercase tracking-wider mb-1">BioScore</p>
        <p className="font-serif text-3xl font-bold text-brand-terracota">72</p>
        <Progress value={72} className="h-1.5 mt-1 bg-white/10 [&>div]:bg-brand-terracota" />
        <p className="text-white/40 text-xs mt-1">Última análise: hoje</p>
      </div>

      {/* Footer */}
      <div className="mt-auto flex items-center gap-3 px-2 pt-4 border-t border-white/10">
        <div className="bg-brand-terracota text-white w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm shrink-0">
          {initials}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-white text-sm font-medium truncate">{displayName}</p>
          <p className="text-white/40 text-xs truncate">{user?.email}</p>
        </div>
        <button
          onClick={handleLogout}
          className="text-white/40 hover:text-brand-terracota transition-colors ml-auto shrink-0"
          title="Sair"
        >
          <LogOut size={18} />
        </button>
      </div>
    </div>
  )
}
