import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { BookOpen, TrendingUp, Lightbulb, AlertCircle } from 'lucide-react'
import { Biomarker, BiomarkerCategory } from '@/types/biomarker'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { BiomarkerBar } from './BiomarkerBar'

interface InsightPanelProps {
  biomarker: Biomarker | null
  onClose: () => void
}

const categoryEmoji: Record<BiomarkerCategory, string> = {
  hormones: '🧬',
  metabolic: '❤️',
  nutrition: '💊',
  inflammation: '🔥',
  aging: '🧠',
}

export function InsightPanel({ biomarker, onClose }: InsightPanelProps) {
  if (!biomarker) return null

  const emoji = categoryEmoji[biomarker.category]

  return (
    <Sheet open={!!biomarker} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="sm:max-w-md w-full overflow-y-auto">
        <SheetHeader>
          <div className="text-5xl mb-3">{emoji}</div>
          <SheetTitle className="font-serif text-2xl text-brand-brown text-left">
            {biomarker.name}
          </SheetTitle>
          <div className="mt-1">
            <StatusBadge status={biomarker.status} label={biomarker.statusLabel} />
          </div>
        </SheetHeader>

        {/* Current value card */}
        <div className="bg-brand-cream-light rounded-2xl p-5 mt-6">
          <p className="text-xs text-gray-muted uppercase tracking-wide mb-1">Seu valor atual</p>
          <p className="font-serif text-5xl font-bold text-brand-brown">
            {biomarker.value}
            <span className="text-lg text-gray-text ml-2">{biomarker.unit}</span>
          </p>
          <div className="mt-3">
            <BiomarkerBar
              value={biomarker.value}
              referenceMin={biomarker.referenceMin}
              referenceMax={biomarker.referenceMax}
              optimalMin={biomarker.optimalMin}
              optimalMax={biomarker.optimalMax}
              unit={biomarker.unit}
            />
          </div>
        </div>

        {/* Reference ranges */}
        <div className="mt-4 rounded-xl border border-gray-border divide-y divide-gray-border text-sm">
          <div className="flex justify-between px-4 py-3">
            <span className="text-gray-text">Referência clínica</span>
            <span className="text-brand-brown font-medium">
              {biomarker.referenceMin}–{biomarker.referenceMax} {biomarker.unit}
            </span>
          </div>
          <div className="flex justify-between px-4 py-3">
            <span className="text-brand-terracota font-semibold">Ideal para longevidade</span>
            <span className="text-brand-terracota font-semibold">
              {biomarker.optimalMin}–{biomarker.optimalMax} {biomarker.unit}
            </span>
          </div>
        </div>

        {/* What is */}
        <div className="mt-6">
          <div className="flex items-center gap-2">
            <BookOpen size={16} className="text-brand-brown" />
            <h4 className="font-serif text-lg font-bold text-brand-brown">O que é</h4>
          </div>
          <p className="text-sm text-gray-text leading-relaxed mt-2">{biomarker.whatIs}</p>
        </div>

        {/* Why it matters */}
        <div className="mt-5">
          <div className="flex items-center gap-2">
            <TrendingUp size={16} className="text-brand-terracota" />
            <h4 className="font-serif text-lg font-bold text-brand-brown">Por que importa</h4>
          </div>
          <p className="text-sm text-gray-text leading-relaxed mt-2">{biomarker.whyMatters}</p>
        </div>

        {/* What to do */}
        <div className="mt-5">
          <div className="flex items-center gap-2">
            <Lightbulb size={16} className="text-status-green" />
            <h4 className="font-serif text-lg font-bold text-brand-brown">O que fazer</h4>
          </div>
          <div className="mt-2 space-y-2">
            {biomarker.whatToDo.map((item, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="text-brand-terracota font-bold">→</span>
                <p className="text-sm text-gray-text">{item}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-8 p-4 bg-brand-section rounded-xl">
          <div className="flex items-start gap-2">
            <AlertCircle size={14} className="text-gray-muted mt-0.5 shrink-0" />
            <p className="text-xs text-gray-muted leading-relaxed">
              Este insight é educacional e não substitui orientação médica profissional.
              Consulte sempre um médico.
            </p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
