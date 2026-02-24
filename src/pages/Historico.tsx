import { useState } from 'react'
import { AppLayout } from '@/components/layout/AppLayout'
import { examHistory, HistoricalExam } from '@/data/history'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { BiomarkerBar } from '@/components/dashboard/BiomarkerBar'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Area,
  AreaChart,
} from 'recharts'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { TrendingUp, TrendingDown, Minus, Calendar, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { cn } from '@/lib/utils'

const categoryEmoji: Record<string, string> = {
  hormones: '🧬',
  metabolic: '❤️',
  nutrition: '💊',
  inflammation: '🔥',
  aging: '🧠',
}

const Historico = () => {
  const [selectedMarkerId, setSelectedMarkerId] = useState('vitamin_d')

  const markerNames = examHistory[0].markers.map((m) => ({
    id: m.id,
    name: m.name,
    category: m.category,
  }))

  const selectedMarker = examHistory[0].markers.find(
    (m) => m.id === selectedMarkerId
  )!

  // Build chart data (oldest → newest)
  const chartData = [...examHistory]
    .reverse()
    .map((exam) => {
      const marker = exam.markers.find((m) => m.id === selectedMarkerId)
      return {
        label: exam.label,
        value: marker?.value ?? 0,
        bioScore: exam.bioScore,
      }
    })

  // BioScore chart data
  const bioScoreData = [...examHistory].reverse().map((exam) => ({
    label: exam.label,
    score: exam.bioScore,
  }))

  // Compute delta for selected marker between last two exams
  const current = examHistory[0].markers.find((m) => m.id === selectedMarkerId)
  const previous = examHistory[1]?.markers.find((m) => m.id === selectedMarkerId)
  const delta = current && previous ? current.value - previous.value : 0
  const deltaPercent =
    current && previous && previous.value !== 0
      ? ((delta / previous.value) * 100).toFixed(1)
      : '0'

  // Determine if delta is improvement
  // For markers where lower is better (crp, ldl, homocysteine, hba1c, glucose above optimal), negative delta = good
  const lowerIsBetter = ['crp', 'ldl', 'homocysteine', 'hba1c']
  const isImprovement = lowerIsBetter.includes(selectedMarkerId)
    ? delta < 0
    : delta > 0

  // Summary cards
  const latestExam = examHistory[0]
  const greenCount = latestExam.markers.filter((m) => m.status === 'green').length
  const yellowCount = latestExam.markers.filter((m) => m.status === 'yellow').length
  const redCount = latestExam.markers.filter((m) => m.status === 'red').length

  const bioScoreDelta = examHistory[0].bioScore - (examHistory[1]?.bioScore ?? examHistory[0].bioScore)

  return (
    <AppLayout title="Histórico">
      <div className="p-6 md:p-8 space-y-8 max-w-6xl">
        {/* Header */}
        <div>
          <h1 className="font-serif text-3xl text-brand-brown">
            Histórico de Exames
          </h1>
          <p className="text-gray-text mt-1">
            Acompanhe a evolução dos seus biomarcadores ao longo do tempo.
          </p>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <SummaryCard
            label="Exames realizados"
            value={String(examHistory.length)}
            icon="📋"
          />
          <SummaryCard
            label="BioScore atual"
            value={String(latestExam.bioScore)}
            delta={bioScoreDelta}
            icon="🎯"
          />
          <SummaryCard
            label="Otimizados"
            value={String(greenCount)}
            color="text-status-green"
            icon="🟢"
          />
          <SummaryCard
            label="Precisam atenção"
            value={String(yellowCount + redCount)}
            color="text-status-red"
            icon="⚠️"
          />
        </div>

        {/* BioScore evolution chart */}
        <div className="bg-card rounded-2xl border border-border p-6">
          <h2 className="font-serif text-xl text-brand-brown mb-1">
            Evolução do BioScore
          </h2>
          <p className="text-sm text-gray-text mb-6">
            Sua pontuação geral de saúde ao longo do tempo
          </p>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={bioScoreData}>
                <defs>
                  <linearGradient id="bioScoreGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#C4613A" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#C4613A" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E0D8CC" />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 12, fill: '#6B6B6B' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  domain={[0, 100]}
                  tick={{ fontSize: 12, fill: '#6B6B6B' }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: 12,
                    border: '1px solid #E0D8CC',
                    fontSize: 13,
                    backgroundColor: '#FAF7F2',
                  }}
                  formatter={(value: number) => [`${value}/100`, 'BioScore']}
                />
                <Area
                  type="monotone"
                  dataKey="score"
                  stroke="#C4613A"
                  strokeWidth={3}
                  fill="url(#bioScoreGradient)"
                  dot={{ fill: '#C4613A', r: 5, strokeWidth: 2, stroke: '#FAF7F2' }}
                  activeDot={{ r: 7 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Biomarker detail comparison */}
        <div className="bg-card rounded-2xl border border-border p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h2 className="font-serif text-xl text-brand-brown">
                Evolução por Biomarcador
              </h2>
              <p className="text-sm text-gray-text">
                Selecione um biomarcador para ver sua evolução
              </p>
            </div>
            <Select value={selectedMarkerId} onValueChange={setSelectedMarkerId}>
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

          {/* Delta card */}
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex items-center gap-3 bg-background rounded-xl px-5 py-3 border border-border">
              <span className="text-2xl">{categoryEmoji[selectedMarker.category] || '📊'}</span>
              <div>
                <p className="text-xs text-gray-muted uppercase tracking-wide">Valor atual</p>
                <p className="font-serif text-2xl font-bold text-brand-brown">
                  {current?.value} <span className="text-sm font-normal text-gray-text">{current?.unit}</span>
                </p>
              </div>
            </div>
            {previous && (
              <div className={cn(
                'flex items-center gap-3 rounded-xl px-5 py-3 border',
                isImprovement
                  ? 'bg-status-green-bg border-status-green/20'
                  : delta === 0
                    ? 'bg-background border-border'
                    : 'bg-status-red-bg border-status-red/20'
              )}>
                {delta > 0 ? (
                  <ArrowUpRight className={isImprovement ? 'text-status-green' : 'text-status-red'} size={20} />
                ) : delta < 0 ? (
                  <ArrowDownRight className={isImprovement ? 'text-status-green' : 'text-status-red'} size={20} />
                ) : (
                  <Minus className="text-gray-muted" size={20} />
                )}
                <div>
                  <p className="text-xs text-gray-muted uppercase tracking-wide">Variação</p>
                  <p className={cn(
                    'font-serif text-lg font-bold',
                    isImprovement ? 'text-status-green' : delta === 0 ? 'text-gray-text' : 'text-status-red'
                  )}>
                    {delta > 0 ? '+' : ''}{delta.toFixed(1)} ({delta > 0 ? '+' : ''}{deltaPercent}%)
                  </p>
                </div>
              </div>
            )}
            <div className="flex items-center gap-3 bg-background rounded-xl px-5 py-3 border border-border">
              <div>
                <p className="text-xs text-gray-muted uppercase tracking-wide">Faixa ideal</p>
                <p className="font-serif text-lg font-bold text-primary">
                  {selectedMarker.optimalMin}–{selectedMarker.optimalMax} {selectedMarker.unit}
                </p>
              </div>
            </div>
          </div>

          {/* Line chart */}
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E0D8CC" />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 12, fill: '#6B6B6B' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 12, fill: '#6B6B6B' }}
                  axisLine={false}
                  tickLine={false}
                  domain={['auto', 'auto']}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: 12,
                    border: '1px solid #E0D8CC',
                    fontSize: 13,
                    backgroundColor: '#FAF7F2',
                  }}
                  formatter={(value: number) => [
                    `${value} ${selectedMarker.unit}`,
                    selectedMarker.name,
                  ]}
                />
                <ReferenceLine
                  y={selectedMarker.optimalMin}
                  stroke="#4A7C59"
                  strokeDasharray="5 5"
                  label={{ value: 'Ideal mín', fontSize: 10, fill: '#4A7C59', position: 'left' }}
                />
                <ReferenceLine
                  y={selectedMarker.optimalMax}
                  stroke="#4A7C59"
                  strokeDasharray="5 5"
                  label={{ value: 'Ideal máx', fontSize: 10, fill: '#4A7C59', position: 'left' }}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#C4613A"
                  strokeWidth={3}
                  dot={{ fill: '#C4613A', r: 5, strokeWidth: 2, stroke: '#FAF7F2' }}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Timeline comparison table */}
        <div className="bg-card rounded-2xl border border-border p-6">
          <h2 className="font-serif text-xl text-brand-brown mb-1">
            Comparação entre Exames
          </h2>
          <p className="text-sm text-gray-text mb-6">
            Todos os seus biomarcadores ao longo do tempo
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-3 text-brand-brown font-semibold">
                    Biomarcador
                  </th>
                  {examHistory.map((exam) => (
                    <th
                      key={exam.id}
                      className="text-center py-3 px-3 text-brand-brown font-semibold whitespace-nowrap"
                    >
                      <div className="flex items-center justify-center gap-1.5">
                        <Calendar size={12} className="text-primary" />
                        {exam.label}
                      </div>
                    </th>
                  ))}
                  <th className="text-center py-3 px-3 text-brand-brown font-semibold">
                    Tendência
                  </th>
                </tr>
              </thead>
              <tbody>
                {markerNames.map((marker) => {
                  const values = examHistory.map(
                    (e) => e.markers.find((m) => m.id === marker.id)!
                  )
                  const first = values[values.length - 1]
                  const last = values[0]
                  const diff = last.value - first.value
                  const isBetter = lowerIsBetter.includes(marker.id)
                    ? diff < 0
                    : diff > 0

                  return (
                    <tr
                      key={marker.id}
                      className="border-b border-border/50 hover:bg-background/50 transition-colors"
                    >
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          <span>{categoryEmoji[marker.category] || '📊'}</span>
                          <span className="font-medium text-brand-brown truncate max-w-[150px]">
                            {marker.name}
                          </span>
                        </div>
                      </td>
                      {values.map((v, i) => (
                        <td key={i} className="text-center py-3 px-3">
                          <span
                            className={cn(
                              'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold',
                              v.status === 'green' && 'bg-status-green-bg text-status-green',
                              v.status === 'yellow' && 'bg-status-yellow-bg text-status-yellow',
                              v.status === 'red' && 'bg-status-red-bg text-status-red'
                            )}
                          >
                            {v.value} {v.unit}
                          </span>
                        </td>
                      ))}
                      <td className="text-center py-3 px-3">
                        {isBetter ? (
                          <span className="inline-flex items-center gap-1 text-status-green text-xs font-bold">
                            <TrendingUp size={14} /> Melhorou
                          </span>
                        ) : diff === 0 ? (
                          <span className="inline-flex items-center gap-1 text-gray-muted text-xs font-bold">
                            <Minus size={14} /> Estável
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-status-red text-xs font-bold">
                            <TrendingDown size={14} /> Piorou
                          </span>
                        )}
                      </td>
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

function SummaryCard({
  label,
  value,
  delta,
  icon,
  color,
}: {
  label: string
  value: string
  delta?: number
  icon: string
  color?: string
}) {
  return (
    <div className="bg-card rounded-2xl border border-border p-5">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-lg">{icon}</span>
        <span className="text-xs text-gray-muted uppercase tracking-wide">{label}</span>
      </div>
      <div className="flex items-end gap-2">
        <span className={cn('font-serif text-3xl font-bold', color || 'text-brand-brown')}>
          {value}
        </span>
        {delta !== undefined && delta !== 0 && (
          <span
            className={cn(
              'text-xs font-bold mb-1 flex items-center gap-0.5',
              delta > 0 ? 'text-status-green' : 'text-status-red'
            )}
          >
            {delta > 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {delta > 0 ? '+' : ''}
            {delta} pts
          </span>
        )}
      </div>
    </div>
  )
}

export default Historico
