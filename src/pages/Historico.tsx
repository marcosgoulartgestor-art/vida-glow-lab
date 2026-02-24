import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppLayout } from '@/components/layout/AppLayout'
import { useExamHistory } from '@/hooks/useExamHistory'
import { useAuth } from '@/context/AuthContext'
import { StatusBadge } from '@/components/ui/StatusBadge'
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { TrendingUp, TrendingDown, Minus, Calendar, ArrowUpRight, ArrowDownRight, Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const categoryEmoji: Record<string, string> = {
  hormones: '🧬',
  metabolic: '❤️',
  nutrition: '💊',
  inflammation: '🔥',
  aging: '🧠',
}

const lowerIsBetter = ['crp', 'ldl', 'homocysteine', 'hba1c']

const Historico = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { exams, loading, hasRealData } = useExamHistory()
  const [selectedMarkerId, setSelectedMarkerId] = useState<string>('')

  if (loading) {
    return (
      <AppLayout title="Histórico">
        <div className="p-6 md:p-8 space-y-8 max-w-6xl animate-pulse">
          <div className="space-y-3">
            <div className="h-8 w-64 bg-secondary rounded-xl" />
            <div className="h-4 w-48 bg-secondary rounded-lg" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-24 bg-secondary rounded-2xl" />
            ))}
          </div>
          <div className="h-64 bg-secondary rounded-2xl" />
          <div className="h-64 bg-secondary rounded-2xl" />
        </div>
      </AppLayout>
    )
  }

  // No exams at all
  if (exams.length === 0 || exams[0].markers.length === 0) {
    return (
      <AppLayout title="Histórico">
        <div className="p-6 md:p-8 max-w-6xl">
          <h1 className="font-serif text-3xl text-foreground">Histórico de Exames</h1>
          <div className="mt-12 text-center">
            <p className="text-6xl mb-4">📋</p>
            <h3 className="font-serif text-xl text-foreground">Nenhum exame encontrado</h3>
            <p className="text-muted-foreground mt-2">Envie seu primeiro exame para começar a acompanhar sua evolução.</p>
            <Button onClick={() => navigate('/upload')} className="mt-6 rounded-full gap-2">
              <Upload size={16} /> Enviar Exame
            </Button>
          </div>
        </div>
      </AppLayout>
    )
  }

  const latestExam = exams[0]

  // Get all unique marker names from latest exam
  const markerNames = latestExam.markers.map((m) => ({
    id: m.id,
    name: m.name,
    category: m.category,
  }))

  // Default selection
  const activeMarkerId = selectedMarkerId || markerNames[0]?.id || ''
  const selectedMarker = latestExam.markers.find((m) => m.id === activeMarkerId)

  // Build chart data (oldest → newest)
  const chartData = [...exams]
    .reverse()
    .map((exam) => {
      const marker = exam.markers.find((m) => m.id === activeMarkerId)
      return {
        label: exam.label,
        value: marker?.value ?? 0,
        bioScore: exam.bioScore,
      }
    })

  // BioScore chart data
  const bioScoreData = [...exams].reverse().map((exam) => ({
    label: exam.label,
    score: exam.bioScore,
  }))

  // Delta
  const current = latestExam.markers.find((m) => m.id === activeMarkerId)
  const previous = exams[1]?.markers.find((m) => m.id === activeMarkerId)
  const delta = current && previous ? current.value - previous.value : 0
  const deltaPercent =
    current && previous && previous.value !== 0
      ? ((delta / previous.value) * 100).toFixed(1)
      : '0'

  const isLowerBetter = lowerIsBetter.some(id => activeMarkerId.toLowerCase().includes(id) || selectedMarker?.name?.toLowerCase().includes(id))
  const isImprovement = isLowerBetter ? delta < 0 : delta > 0

  // Summary
  const greenCount = latestExam.markers.filter((m) => m.status === 'green').length
  const yellowCount = latestExam.markers.filter((m) => m.status === 'yellow').length
  const redCount = latestExam.markers.filter((m) => m.status === 'red').length
  const bioScoreDelta = latestExam.bioScore - (exams[1]?.bioScore ?? latestExam.bioScore)

  return (
    <AppLayout title="Histórico">
      <div className="p-6 md:p-8 space-y-8 max-w-6xl">
        {/* Header */}
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="font-serif text-3xl text-foreground">Histórico de Exames</h1>
            <p className="text-muted-foreground mt-1">
              {hasRealData ? 'Dados reais dos seus exames' : 'Dados demonstrativos — envie um exame para ver seus resultados'}
            </p>
          </div>
          <Button onClick={() => navigate('/upload')} variant="outline" className="rounded-full gap-2">
            <Upload size={14} /> Novo Exame
          </Button>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <SummaryCard label="Exames realizados" value={String(exams.length)} icon="📋" />
          <SummaryCard label="BioScore atual" value={String(latestExam.bioScore)} delta={bioScoreDelta} icon="🎯" />
          <SummaryCard label="Otimizados" value={String(greenCount)} color="text-status-green" icon="🟢" />
          <SummaryCard label="Precisam atenção" value={String(yellowCount + redCount)} color="text-status-red" icon="⚠️" />
        </div>

        {/* BioScore evolution */}
        {exams.length > 1 && (
          <div className="bg-card rounded-2xl border border-border p-6">
            <h2 className="font-serif text-xl text-foreground mb-1">Evolução do BioScore</h2>
            <p className="text-sm text-muted-foreground mb-6">Sua pontuação geral de saúde ao longo do tempo</p>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={bioScoreData}>
                  <defs>
                    <linearGradient id="bioScoreGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(18, 54%, 50%)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(18, 54%, 50%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(30, 20%, 86%)" />
                  <XAxis dataKey="label" tick={{ fontSize: 12, fill: 'hsl(20, 38%, 30%)' }} axisLine={false} tickLine={false} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: 'hsl(20, 38%, 30%)' }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid hsl(30, 20%, 86%)', fontSize: 13, backgroundColor: 'hsl(36, 33%, 95%)' }} formatter={(value: number) => [`${value}/100`, 'BioScore']} />
                  <Area type="monotone" dataKey="score" stroke="hsl(18, 54%, 50%)" strokeWidth={3} fill="url(#bioScoreGradient)" dot={{ fill: 'hsl(18, 54%, 50%)', r: 5, strokeWidth: 2, stroke: 'hsl(36, 33%, 95%)' }} activeDot={{ r: 7 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Biomarker detail */}
        {selectedMarker && (
          <div className="bg-card rounded-2xl border border-border p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <div>
                <h2 className="font-serif text-xl text-foreground">Evolução por Biomarcador</h2>
                <p className="text-sm text-muted-foreground">Selecione um biomarcador para ver sua evolução</p>
              </div>
              <Select value={activeMarkerId} onValueChange={setSelectedMarkerId}>
                <SelectTrigger className="w-full md:w-72 rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {markerNames.map((m) => (
                    <SelectItem key={m.id} value={m.id}>
                      <span className="mr-2">{categoryEmoji[m.category] || '📊'}</span>
                      {m.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Delta cards */}
            <div className="flex flex-wrap gap-4 mb-6">
              <div className="flex items-center gap-3 bg-background rounded-xl px-5 py-3 border border-border">
                <span className="text-2xl">{categoryEmoji[selectedMarker.category] || '📊'}</span>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Valor atual</p>
                  <p className="font-serif text-2xl font-bold text-foreground">
                    {current?.value} <span className="text-sm font-normal text-muted-foreground">{current?.unit}</span>
                  </p>
                </div>
              </div>
              {previous && (
                <div className={cn(
                  'flex items-center gap-3 rounded-xl px-5 py-3 border',
                  isImprovement ? 'bg-status-green-bg border-status-green/20' : delta === 0 ? 'bg-background border-border' : 'bg-status-red-bg border-status-red/20'
                )}>
                  {delta > 0 ? <ArrowUpRight className={isImprovement ? 'text-status-green' : 'text-status-red'} size={20} /> : delta < 0 ? <ArrowDownRight className={isImprovement ? 'text-status-green' : 'text-status-red'} size={20} /> : <Minus className="text-muted-foreground" size={20} />}
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">Variação</p>
                    <p className={cn('font-serif text-lg font-bold', isImprovement ? 'text-status-green' : delta === 0 ? 'text-muted-foreground' : 'text-status-red')}>
                      {delta > 0 ? '+' : ''}{delta.toFixed(1)} ({delta > 0 ? '+' : ''}{deltaPercent}%)
                    </p>
                  </div>
                </div>
              )}
              {selectedMarker.optimalMin > 0 && (
                <div className="flex items-center gap-3 bg-background rounded-xl px-5 py-3 border border-border">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">Faixa ideal</p>
                    <p className="font-serif text-lg font-bold text-primary">
                      {selectedMarker.optimalMin}–{selectedMarker.optimalMax} {selectedMarker.unit}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Line chart */}
            {exams.length > 1 && (
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(30, 20%, 86%)" />
                    <XAxis dataKey="label" tick={{ fontSize: 12, fill: 'hsl(20, 38%, 30%)' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 12, fill: 'hsl(20, 38%, 30%)' }} axisLine={false} tickLine={false} domain={['auto', 'auto']} />
                    <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid hsl(30, 20%, 86%)', fontSize: 13, backgroundColor: 'hsl(36, 33%, 95%)' }} formatter={(value: number) => [`${value} ${selectedMarker.unit}`, selectedMarker.name]} />
                    {selectedMarker.optimalMin > 0 && (
                      <>
                        <ReferenceLine y={selectedMarker.optimalMin} stroke="hsl(140, 30%, 40%)" strokeDasharray="5 5" label={{ value: 'Ideal mín', fontSize: 10, fill: 'hsl(140, 30%, 40%)', position: 'left' }} />
                        <ReferenceLine y={selectedMarker.optimalMax} stroke="hsl(140, 30%, 40%)" strokeDasharray="5 5" label={{ value: 'Ideal máx', fontSize: 10, fill: 'hsl(140, 30%, 40%)', position: 'left' }} />
                      </>
                    )}
                    <Line type="monotone" dataKey="value" stroke="hsl(18, 54%, 50%)" strokeWidth={3} dot={{ fill: 'hsl(18, 54%, 50%)', r: 5, strokeWidth: 2, stroke: 'hsl(36, 33%, 95%)' }} activeDot={{ r: 7 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        )}

        {/* Comparison table */}
        <div className="bg-card rounded-2xl border border-border p-6">
          <h2 className="font-serif text-xl text-foreground mb-1">Comparação entre Exames</h2>
          <p className="text-sm text-muted-foreground mb-6">Todos os seus biomarcadores ao longo do tempo</p>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-3 text-foreground font-semibold">Biomarcador</th>
                  {exams.map((exam) => (
                    <th key={exam.id} className="text-center py-3 px-3 text-foreground font-semibold whitespace-nowrap">
                      <div className="flex items-center justify-center gap-1.5">
                        <Calendar size={12} className="text-primary" />
                        {exam.label}
                      </div>
                      {exam.markers.length > 0 && (
                        <span className="text-[10px] text-muted-foreground font-normal block mt-0.5">
                          {exam.markers.length} marcadores
                        </span>
                      )}
                    </th>
                  ))}
                  {exams.length > 1 && (
                    <th className="text-center py-3 px-3 text-foreground font-semibold">Tendência</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {markerNames.map((marker) => {
                  const values = exams.map((e) => e.markers.find((m) => m.id === marker.id || m.name === marker.name))
                  const first = values[values.length - 1]
                  const last = values[0]
                  const diff = last && first ? last.value - first.value : 0
                  const isLB = lowerIsBetter.some(id => marker.id.toLowerCase().includes(id) || marker.name.toLowerCase().includes(id))
                  const isBetter = isLB ? diff < 0 : diff > 0

                  return (
                    <tr key={marker.id} className="border-b border-border/50 hover:bg-background/50 transition-colors">
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          <span>{categoryEmoji[marker.category] || '📊'}</span>
                          <span className="font-medium text-foreground truncate max-w-[150px]">{marker.name}</span>
                        </div>
                      </td>
                      {values.map((v, i) => (
                        <td key={i} className="text-center py-3 px-3">
                          {v ? (
                            <span className={cn(
                              'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold',
                              v.status === 'green' && 'bg-status-green-bg text-status-green',
                              v.status === 'yellow' && 'bg-status-yellow-bg text-status-yellow',
                              v.status === 'red' && 'bg-status-red-bg text-status-red'
                            )}>
                              {v.value} {v.unit}
                            </span>
                          ) : (
                            <span className="text-xs text-muted-foreground">—</span>
                          )}
                        </td>
                      ))}
                      {exams.length > 1 && (
                        <td className="text-center py-3 px-3">
                          {isBetter ? (
                            <span className="inline-flex items-center gap-1 text-status-green text-xs font-bold">
                              <TrendingUp size={14} /> Melhorou
                            </span>
                          ) : diff === 0 ? (
                            <span className="inline-flex items-center gap-1 text-muted-foreground text-xs font-bold">
                              <Minus size={14} /> Estável
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-status-red text-xs font-bold">
                              <TrendingDown size={14} /> Piorou
                            </span>
                          )}
                        </td>
                      )}
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}

function SummaryCard({ label, value, delta, icon, color }: { label: string; value: string; delta?: number; icon: string; color?: string }) {
  return (
    <div className="bg-card rounded-2xl border border-border p-5 animate-fadeIn">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-lg">{icon}</span>
        <span className="text-xs text-muted-foreground uppercase tracking-wide">{label}</span>
      </div>
      <div className="flex items-end gap-2">
        <span className={cn('font-serif text-3xl font-bold', color || 'text-foreground')}>{value}</span>
        {delta !== undefined && delta !== 0 && (
          <span className={cn('text-xs font-bold mb-1 flex items-center gap-0.5', delta > 0 ? 'text-status-green' : 'text-status-red')}>
            {delta > 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {delta > 0 ? '+' : ''}{delta} pts
          </span>
        )}
      </div>
    </div>
  )
}

export default Historico
