import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { BookOpen, TrendingUp, Lightbulb, AlertCircle, Heart, CheckCircle2 } from 'lucide-react'
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
  blood: '🩸',
  organ: '🫀',
  aging: '🧠',
  urine: '💧',
}

export function InsightPanel({ biomarker, onClose }: InsightPanelProps) {
  if (!biomarker) return null

  const emoji = categoryEmoji[biomarker.category]

  return (
    <Sheet open={!!biomarker} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="sm:max-w-md w-full overflow-y-auto p-0">
        {/* Hero header with gradient */}
        <div className="bg-gradient-to-br from-brand-cream-light to-brand-section px-6 pt-6 pb-5">
          <SheetHeader>
            <div className="flex items-center gap-3">
              <span className="text-4xl">{emoji}</span>
              <div className="flex-1">
                <SheetTitle className="font-serif text-2xl text-brand-brown text-left leading-tight">
                  {biomarker.name}
                </SheetTitle>
                <div className="mt-1.5">
                  <StatusBadge status={biomarker.status} label={biomarker.statusLabel} />
                </div>
              </div>
            </div>
          </SheetHeader>

          {/* Current value */}
          <div className="mt-5 bg-white/70 backdrop-blur-sm rounded-2xl p-5 shadow-sm border border-white/50">
            <p className="text-xs text-gray-muted uppercase tracking-widest mb-1 font-medium">Seu valor atual</p>
            <p className="font-serif text-4xl font-bold text-brand-brown">
              {biomarker.value}
              <span className="text-base text-gray-text ml-2 font-normal">{biomarker.unit}</span>
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
        </div>

        <div className="px-6 pb-6">
          {/* Reference ranges */}
          <div className="mt-5 rounded-xl border border-gray-border divide-y divide-gray-border text-sm">
            <div className="flex justify-between px-4 py-3">
              <span className="text-gray-text">Referência clínica</span>
              <span className="text-brand-brown font-medium">
                {biomarker.referenceMin}–{biomarker.referenceMax} {biomarker.unit}
              </span>
            </div>
            <div className="flex justify-between px-4 py-3">
              <div className="flex items-center gap-1.5">
                <Heart size={13} className="text-brand-terracota" />
                <span className="text-brand-terracota font-semibold">Ideal para longevidade</span>
              </div>
              <span className="text-brand-terracota font-semibold">
                {biomarker.optimalMin}–{biomarker.optimalMax} {biomarker.unit}
              </span>
            </div>
          </div>

          {/* Educational cards */}
          <div className="mt-6 space-y-4">
            {/* What is */}
            {biomarker.whatIs && (
              <div className="rounded-2xl border border-blue-100 bg-blue-50/50 p-4">
                <div className="flex items-center gap-2.5 mb-2.5">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                    <BookOpen size={16} className="text-blue-600" />
                  </div>
                  <h4 className="font-serif text-base font-bold text-brand-brown">O que é</h4>
                </div>
                <p className="text-sm text-gray-text leading-relaxed pl-[42px]">{biomarker.whatIs}</p>
              </div>
            )}

            {/* Why it matters */}
            {biomarker.whyMatters && (
              <div className="rounded-2xl border border-amber-100 bg-amber-50/50 p-4">
                <div className="flex items-center gap-2.5 mb-2.5">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
                    <TrendingUp size={16} className="text-amber-600" />
                  </div>
                  <h4 className="font-serif text-base font-bold text-brand-brown">Por que importa</h4>
                </div>
                <p className="text-sm text-gray-text leading-relaxed pl-[42px]">{biomarker.whyMatters}</p>
              </div>
            )}

            {/* What to do */}
            {biomarker.whatToDo.length > 0 && (
              <div className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-4">
                <div className="flex items-center gap-2.5 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                    <Lightbulb size={16} className="text-emerald-600" />
                  </div>
                  <h4 className="font-serif text-base font-bold text-brand-brown">O que fazer</h4>
                </div>
                <div className="space-y-2.5 pl-[42px]">
                  {biomarker.whatToDo.map((item, i) => (
                    <div key={i} className="flex items-start gap-2.5">
                      <CheckCircle2 size={15} className="text-emerald-500 mt-0.5 shrink-0" />
                      <p className="text-sm text-gray-text leading-relaxed">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Disclaimer */}
          <div className="mt-6 p-4 bg-brand-section rounded-xl">
            <div className="flex items-start gap-2">
              <AlertCircle size={14} className="text-gray-muted mt-0.5 shrink-0" />
              <p className="text-xs text-gray-muted leading-relaxed">
                Este insight é educacional e não substitui orientação médica profissional.
                Consulte sempre um médico.
              </p>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
