interface BiomarkerBarProps {
  value: number
  referenceMin: number
  referenceMax: number
  optimalMin: number
  optimalMax: number
  unit: string
}

export function BiomarkerBar({
  value,
  referenceMin,
  referenceMax,
  optimalMin,
  optimalMax,
  unit,
}: BiomarkerBarProps) {
  const vizMin = referenceMin * 0.7
  const vizMax = referenceMax * 1.3
  const total = vizMax - vizMin

  const toPercent = (v: number) => ((v - vizMin) / total) * 100

  const redLeftW = Math.max(0, toPercent(referenceMin))
  const yellow1W = Math.max(0, toPercent(optimalMin) - toPercent(referenceMin))
  const greenW = Math.max(0, toPercent(optimalMax) - toPercent(optimalMin))
  const yellow2W = Math.max(0, toPercent(referenceMax) - toPercent(optimalMax))
  const redRightW = Math.max(0, 100 - toPercent(referenceMax))

  const markerPos = Math.max(2, Math.min(98, toPercent(value)))

  return (
    <div className="relative h-4 w-full" style={{ overflow: 'visible' }}>
      {/* Zones */}
      <div className="h-4 rounded-full overflow-hidden flex w-full">
        <div className="bg-status-red/40 h-full" style={{ width: `${redLeftW}%` }} />
        <div className="bg-status-yellow/40 h-full" style={{ width: `${yellow1W}%` }} />
        <div className="bg-status-green/50 h-full" style={{ width: `${greenW}%` }} />
        <div className="bg-status-yellow/40 h-full" style={{ width: `${yellow2W}%` }} />
        <div className="bg-status-red/40 h-full" style={{ width: `${redRightW}%` }} />
      </div>

      {/* Marker */}
      <div
        className="absolute top-0 bottom-0"
        style={{ left: `${markerPos}%`, transform: 'translateX(-50%)' }}
      >
        <div className="w-0.5 h-full bg-brand-brown rounded-full" />
        <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-brand-brown text-white text-[10px] font-bold rounded-md px-1.5 py-0.5 whitespace-nowrap">
          {value} {unit}
        </div>
      </div>
    </div>
  )
}
