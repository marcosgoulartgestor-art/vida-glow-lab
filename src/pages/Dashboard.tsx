import { useState, useEffect } from 'react'
import { Calendar } from 'lucide-react'
import { AppLayout } from '@/components/layout/AppLayout'
import { useAuth } from '@/context/AuthContext'
import { biomarkersData } from '@/data/biomarkers'
import { BiomarkerCategory, BiomarkerStatus } from '@/types/biomarker'
import { cn } from '@/lib/utils'

// Animated counter hook
function useCountUp(target: number, duration = 1400) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    let current = 0
    const step = Math.ceil(target / (duration / 20))
    const interval = setInterval(() => {
      current += step
      if (current >= target) {
        current = target
        clearInterval(interval)
      }
      setCount(current)
    }, 20)
    return () => clearInterval(interval)
  }, [target, duration])
  return count
}

type CategoryId = BiomarkerCategory | 'all'

const categoryConfig: { id: CategoryId; label: string; icon: string }[] = [
  { id: 'all', label: 'Todos', icon: '📊' },
  { id: 'hormones', label: 'Hormônios', icon: '🧬' },
  { id: 'metabolic', label: 'Metabólico', icon: '❤️' },
  { id: 'nutrition', label: 'Nutrição', icon: '💊' },
  { id: 'inflammation', label: 'Inflamação', icon: '🔥' },
  { id: 'aging', label: 'Cérebro', icon: '🧠' },
]

function getCategoryStats(categoryId: CategoryId) {
  const markers =
    categoryId === 'all'
      ? biomarkersData
      : biomarkersData.filter((b) => b.category === categoryId)
  const greenCount = markers.filter((b) => b.status === 'green').length
  const yellowCount = markers.filter((b) => b.status === 'yellow').length
  const redCount = markers.filter((b) => b.status === 'red').length
  const total = markers.length
  const overallStatus: BiomarkerStatus =
    redCount > 0 ? 'red' : yellowCount > 0 ? 'yellow' : 'green'
  return { greenCount, yellowCount, redCount, total, overallStatus }
}

const borderLeftColor: Record<BiomarkerStatus, string> = {
  green: 'border-l-status-green',
  yellow: 'border-l-status-yellow',
  red: 'border-l-status-red',
}

const Dashboard = () => {
  const { user } = useAuth()
  const name = user?.user_metadata?.full_name || 'Usuário'
  const bioScore = useCountUp(72)
  const [selectedCategory, setSelectedCategory] = useState<CategoryId | null>(null)

  return (
    <AppLayout title="Meu Painel de Saúde">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-start justify-between flex-wrap gap-6">
          {/* Left */}
          <div>
            <h2 className="font-serif text-3xl text-brand-brown">
              Olá, {name} 👋
            </h2>
            <p className="text-gray-text mt-1">Aqui está o panorama da sua saúde.</p>
            <div className="flex items-center gap-2 mt-2">
              <Calendar size={14} className="text-brand-terracota" />
              <span className="text-sm text-gray-text">Última análise: hoje</span>
            </div>
          </div>

          {/* BioScore */}
          <div
            className="relative w-36 h-36 shrink-0"
            title="Pontuação calculada com base nos seus biomarcadores"
          >
            <div className="w-full h-full rounded-full border-8 border-brand-terracota/20">
              <div className="absolute inset-0 rounded-full border-8 border-brand-terracota"
                style={{
                  clipPath: `polygon(0 0, 100% 0, 100% 100%, 0 100%)`,
                  opacity: bioScore / 72,
                }}
              />
            </div>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-serif text-4xl font-bold text-brand-terracota">
                {bioScore}
              </span>
              <span className="text-sm text-gray-muted">/100</span>
              <span className="text-xs text-gray-muted uppercase tracking-wide">BioScore</span>
            </div>
          </div>
        </div>

        {/* Category Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {categoryConfig.map((cat) => {
            const stats = getCategoryStats(cat.id)
            const active = selectedCategory === cat.id
            return (
              <button
                key={cat.id}
                onClick={() =>
                  setSelectedCategory(cat.id === selectedCategory ? null : cat.id)
                }
                className={cn(
                  'border rounded-2xl p-4 text-left cursor-pointer transition-all hover:shadow-md border-l-4',
                  borderLeftColor[stats.overallStatus],
                  active
                    ? 'border-brand-terracota shadow-md bg-white'
                    : 'border-gray-border bg-white/60'
                )}
              >
                <span className="text-2xl">{cat.icon}</span>
                <p className="text-xs font-semibold text-brand-brown mt-1 truncate">
                  {cat.label}
                </p>
                <p className="text-xs text-gray-text">{stats.total} marcadores</p>
                <div className="mt-2 flex gap-1 flex-wrap">
                  {stats.greenCount > 0 && (
                    <span className="text-[10px] font-bold text-status-green bg-status-green-bg rounded-full px-1.5">
                      {stats.greenCount}
                    </span>
                  )}
                  {stats.yellowCount > 0 && (
                    <span className="text-[10px] font-bold text-status-yellow bg-status-yellow-bg rounded-full px-1.5">
                      {stats.yellowCount}
                    </span>
                  )}
                  {stats.redCount > 0 && (
                    <span className="text-[10px] font-bold text-status-red bg-status-red-bg rounded-full px-1.5">
                      {stats.redCount}
                    </span>
                  )}
                </div>
              </button>
            )
          })}
        </div>

        {/* Placeholder for biomarker table */}
        <div className="bg-white rounded-2xl border border-gray-border p-8 text-center text-gray-text">
          Tabela de biomarcadores será adicionada no próximo passo.
        </div>
      </div>
    </AppLayout>
  )
}

export default Dashboard
