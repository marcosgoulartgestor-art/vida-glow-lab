import { useState } from 'react'
import { Info } from 'lucide-react'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Biomarker, BiomarkerCategory } from '@/types/biomarker'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { BiomarkerBar } from './BiomarkerBar'

interface BiomarkerTableProps {
  biomarkers: Biomarker[]
  selectedCategory: string | null
  onSelectBiomarker: (b: Biomarker) => void
}

const categoryMap: Record<BiomarkerCategory, { emoji: string; label: string }> = {
  hormones: { emoji: '🧬', label: 'Hormônios' },
  metabolic: { emoji: '❤️', label: 'Metabólico' },
  nutrition: { emoji: '💊', label: 'Nutrição' },
  inflammation: { emoji: '🔥', label: 'Inflamação' },
  aging: { emoji: '🧠', label: 'Envelhecimento' },
}

const statusOrder = { red: 0, yellow: 1, green: 2 }

export function BiomarkerTable({
  biomarkers,
  selectedCategory,
  onSelectBiomarker,
}: BiomarkerTableProps) {
  const [statusFilter, setStatusFilter] = useState('all')

  const filtered = biomarkers
    .filter(
      (b) =>
        !selectedCategory || selectedCategory === 'all' || b.category === selectedCategory
    )
    .filter((b) => {
      if (statusFilter === 'all') return true
      return b.status === statusFilter
    })
    .sort((a, b) => statusOrder[a.status] - statusOrder[b.status])

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <h3 className="font-serif text-2xl text-brand-brown">Seus Biomarcadores</h3>
        <Tabs value={statusFilter} onValueChange={setStatusFilter}>
          <TabsList className="bg-brand-section">
            <TabsTrigger value="all" className="text-xs">Todos</TabsTrigger>
            <TabsTrigger value="green" className="text-xs">🟢 Otimizados</TabsTrigger>
            <TabsTrigger value="yellow" className="text-xs">🟡 Atenção</TabsTrigger>
            <TabsTrigger value="red" className="text-xs">🔴 Alertas</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Rows */}
      <div className="space-y-2">
        {filtered.map((b) => {
          const cat = categoryMap[b.category]
          return (
            <div
              key={b.id}
              onClick={() => onSelectBiomarker(b)}
              className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-gray-border/50 hover:border-brand-terracota/40 hover:shadow-sm hover:translate-x-1 transition-all cursor-pointer"
            >
              {/* Emoji */}
              <span className="text-2xl w-10 text-center shrink-0">{cat.emoji}</span>

              {/* Name */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-brand-brown truncate">{b.name}</p>
                <p className="text-xs text-gray-text">{cat.label}</p>
              </div>

              {/* Value */}
              <div className="w-24 text-right shrink-0">
                <p className="text-sm font-bold text-brand-brown">{b.value}</p>
                <p className="text-xs text-gray-text">{b.unit}</p>
              </div>

              {/* Bar */}
              <div className="flex-1 min-w-0 px-4 hidden md:block">
                <BiomarkerBar
                  value={b.value}
                  referenceMin={b.referenceMin}
                  referenceMax={b.referenceMax}
                  optimalMin={b.optimalMin}
                  optimalMax={b.optimalMax}
                  unit={b.unit}
                />
              </div>

              {/* Badge */}
              <div className="w-24 shrink-0">
                <StatusBadge status={b.status} label={b.statusLabel} />
              </div>

              {/* Info */}
              <button
                className="w-8 shrink-0 text-gray-muted hover:text-brand-terracota transition-colors"
                onClick={(e) => {
                  e.stopPropagation()
                  onSelectBiomarker(b)
                }}
              >
                <Info size={18} />
              </button>
            </div>
          )
        })}

        {filtered.length === 0 && (
          <div className="text-center py-8 text-gray-text">
            Nenhum biomarcador encontrado para este filtro.
          </div>
        )}
      </div>
    </div>
  )
}
