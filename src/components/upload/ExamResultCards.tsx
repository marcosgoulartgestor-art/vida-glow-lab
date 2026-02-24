import { CheckCircle2, AlertTriangle, AlertCircle } from 'lucide-react'

export interface ExtractedMarker {
  name: string
  value: number
  unit: string
  reference_min?: number | null
  reference_max?: number | null
  status: 'Alto' | 'Baixo' | 'Normal'
}

interface ExamResultCardsProps {
  markers: ExtractedMarker[]
}

const statusConfig = {
  Normal: {
    icon: CheckCircle2,
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    text: 'text-emerald-700',
    badge: 'bg-emerald-100 text-emerald-800',
    bar: 'bg-emerald-500',
  },
  Alto: {
    icon: AlertCircle,
    bg: 'bg-red-50',
    border: 'border-red-200',
    text: 'text-red-700',
    badge: 'bg-red-100 text-red-800',
    bar: 'bg-red-500',
  },
  Baixo: {
    icon: AlertTriangle,
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    text: 'text-amber-700',
    badge: 'bg-amber-100 text-amber-800',
    bar: 'bg-amber-500',
  },
}

function ReferenceBar({ value, min, max, barColor }: { value: number; min?: number | null; max?: number | null; barColor: string }) {
  if (min == null || max == null) return null
  const range = max - min
  const padding = range * 0.3
  const displayMin = min - padding
  const displayMax = max + padding
  const totalRange = displayMax - displayMin
  const clampedValue = Math.max(displayMin, Math.min(displayMax, value))
  const position = ((clampedValue - displayMin) / totalRange) * 100
  const refStart = ((min - displayMin) / totalRange) * 100
  const refWidth = (range / totalRange) * 100

  return (
    <div className="mt-2">
      <div className="relative h-2 w-full rounded-full bg-muted">
        <div
          className="absolute top-0 h-full rounded-full bg-emerald-200/60"
          style={{ left: `${refStart}%`, width: `${refWidth}%` }}
        />
        <div
          className={`absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2 border-white shadow ${barColor}`}
          style={{ left: `${position}%`, transform: `translate(-50%, -50%)` }}
        />
      </div>
      <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
        <span>{min} {''}</span>
        <span>{max}</span>
      </div>
    </div>
  )
}

export function ExamResultCards({ markers }: ExamResultCardsProps) {
  const normalCount = markers.filter(m => m.status === 'Normal').length
  const alertCount = markers.length - normalCount

  return (
    <div>
      {/* Summary header */}
      <div className="flex items-center gap-6 mb-6">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
            <CheckCircle2 size={20} className="text-emerald-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">{normalCount}</p>
            <p className="text-xs text-muted-foreground">Normais</p>
          </div>
        </div>
        {alertCount > 0 && (
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
              <AlertTriangle size={20} className="text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{alertCount}</p>
              <p className="text-xs text-muted-foreground">Atenção</p>
            </div>
          </div>
        )}
      </div>

      {/* Cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {markers.map((marker, i) => {
          const config = statusConfig[marker.status]
          const Icon = config.icon

          return (
            <div
              key={`${marker.name}-${i}`}
              className={`rounded-2xl border p-4 ${config.bg} ${config.border} animate-fadeIn`}
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <Icon size={18} className={config.text} />
                  <h4 className="font-medium text-sm text-foreground">{marker.name}</h4>
                </div>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${config.badge}`}>
                  {marker.status}
                </span>
              </div>

              <p className="mt-3 text-2xl font-bold text-foreground">
                {marker.value}
                <span className="text-sm font-normal text-muted-foreground ml-1">{marker.unit}</span>
              </p>

              <ReferenceBar
                value={marker.value}
                min={marker.reference_min}
                max={marker.reference_max}
                barColor={config.bar}
              />

              {(marker.reference_min != null || marker.reference_max != null) && (
                <p className="text-[10px] text-muted-foreground mt-1">
                  Ref: {marker.reference_min ?? '—'} – {marker.reference_max ?? '—'} {marker.unit}
                </p>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
