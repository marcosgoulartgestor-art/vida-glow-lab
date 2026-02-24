import { Circle } from 'lucide-react'
import { cn } from '@/lib/cn'
import { BiomarkerStatus } from '@/types/biomarker'

interface StatusBadgeProps {
  status: BiomarkerStatus
  label: string
  className?: string
}

const statusStyles: Record<BiomarkerStatus, string> = {
  green: 'bg-status-green-bg text-status-green',
  yellow: 'bg-status-yellow-bg text-status-yellow',
  red: 'bg-status-red-bg text-status-red',
}

export function StatusBadge({ status, label, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        'rounded-full px-3 py-1 text-xs font-semibold inline-flex items-center gap-1.5',
        statusStyles[status],
        className
      )}
    >
      <Circle className="h-2 w-2 fill-current" />
      {label}
    </span>
  )
}
