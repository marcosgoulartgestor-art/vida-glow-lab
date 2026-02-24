import { ReactNode, useState } from 'react'
import { useLocation, Link } from 'react-router-dom'
import { LayoutDashboard, Upload, BarChart3, Settings } from 'lucide-react'
import { Sheet, SheetContent } from '@/components/ui/sheet'
import { SidebarContent } from './Sidebar'
import { AppHeader } from './AppHeader'
import { cn } from '@/lib/utils'

const bottomNavItems = [
  { icon: LayoutDashboard, to: '/dashboard' },
  { icon: Upload, to: '/upload' },
  { icon: BarChart3, to: '/historico' },
  { icon: Settings, to: '/configuracoes' },
]

interface AppLayoutProps {
  children: ReactNode
  title: string
}

export function AppLayout({ children, title }: AppLayoutProps) {
  const [sheetOpen, setSheetOpen] = useState(false)
  const location = useLocation()

  return (
    <div className="flex h-screen overflow-hidden bg-brand-cream">
      {/* Desktop sidebar */}
      <div className="hidden md:block">
        <SidebarContent />
      </div>

      {/* Mobile sheet sidebar */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent side="left" className="p-0 w-64 border-none">
          <SidebarContent onNavigate={() => setSheetOpen(false)} />
        </SheetContent>
      </Sheet>

      {/* Main area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <AppHeader title={title} onMenuClick={() => setSheetOpen(true)} />

        <main className="flex-1 overflow-y-auto p-8 pb-24 md:pb-8">
          {children}
        </main>
      </div>

      {/* Mobile bottom nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-brand-brown border-t border-white/10 flex justify-around py-3 z-40">
        {bottomNavItems.map((item) => {
          const active = location.pathname === item.to
          return (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                'p-2 rounded-xl transition-colors',
                active ? 'text-brand-terracota' : 'text-white/40'
              )}
            >
              <item.icon size={22} />
            </Link>
          )
        })}
      </div>
    </div>
  )
}
