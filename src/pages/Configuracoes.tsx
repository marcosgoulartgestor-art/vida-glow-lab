import { useState } from 'react'
import { AppLayout } from '@/components/layout/AppLayout'
import { useAuth } from '@/context/AuthContext'
import { supabase } from '@/integrations/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { Slider } from '@/components/ui/slider'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'
import { User, Bell, Target, Shield, Save, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

type Tab = 'perfil' | 'preferencias' | 'metas' | 'privacidade'

const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: 'perfil', label: 'Perfil', icon: User },
  { id: 'preferencias', label: 'Preferências', icon: Bell },
  { id: 'metas', label: 'Metas de Saúde', icon: Target },
  { id: 'privacidade', label: 'Privacidade', icon: Shield },
]

const Configuracoes = () => {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState<Tab>('perfil')
  const [saving, setSaving] = useState(false)

  // Profile state
  const [fullName, setFullName] = useState(user?.user_metadata?.full_name || '')
  const [birthYear, setBirthYear] = useState('1990')
  const [sex, setSex] = useState('masculino')

  // Preferences
  const [emailNotif, setEmailNotif] = useState(true)
  const [weeklyReport, setWeeklyReport] = useState(true)
  const [alertsOnly, setAlertsOnly] = useState(false)

  // Health goals
  const [bioScoreGoal, setBioScoreGoal] = useState([85])
  const [focusAreas, setFocusAreas] = useState<string[]>(['nutrition', 'inflammation'])

  // Privacy
  const [shareAnon, setShareAnon] = useState(false)
  const [showBioScore, setShowBioScore] = useState(true)

  const isDemo = user?.id === 'mock-1'

  const handleSave = async () => {
    setSaving(true)
    if (!isDemo && user) {
      await supabase
        .from('profiles')
        .update({ full_name: fullName } as any)
        .eq('id', user.id)
    }
    setTimeout(() => {
      setSaving(false)
      toast.success('Configurações salvas com sucesso!')
    }, 600)
  }

  const focusOptions = [
    { id: 'hormones', label: '🧬 Hormônios' },
    { id: 'metabolic', label: '❤️ Metabólico' },
    { id: 'nutrition', label: '💊 Nutrição' },
    { id: 'inflammation', label: '🔥 Inflamação' },
    { id: 'aging', label: '🧠 Cérebro' },
  ]

  const toggleFocus = (id: string) => {
    setFocusAreas((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    )
  }

  return (
    <AppLayout title="Configurações">
      <div className="max-w-3xl mx-auto py-8 px-4 md:px-8 space-y-8">
        <div>
          <h1 className="font-serif text-3xl text-brand-brown">Configurações</h1>
          <p className="text-gray-text mt-1">Gerencie seu perfil, preferências e metas.</p>
        </div>

        {/* Tab navigation */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap',
                activeTab === tab.id
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'bg-card text-muted-foreground hover:bg-secondary border border-border'
              )}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="bg-card rounded-2xl border border-border p-6 md:p-8 space-y-6 animate-fadeIn">
          {activeTab === 'perfil' && (
            <>
              <div className="flex items-center gap-4 mb-2">
                <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-serif text-2xl font-bold">
                  {(fullName || 'U')[0].toUpperCase()}
                </div>
                <div>
                  <p className="font-serif text-xl text-foreground font-bold">{fullName || 'Usuário'}</p>
                  <p className="text-sm text-muted-foreground">{user?.email}</p>
                </div>
              </div>

              <Separator />

              <div className="grid gap-5">
                <div>
                  <Label className="text-foreground">Nome completo</Label>
                  <Input
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="mt-1.5"
                    placeholder="Seu nome"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-foreground">Ano de nascimento</Label>
                    <Input
                      value={birthYear}
                      onChange={(e) => setBirthYear(e.target.value)}
                      className="mt-1.5"
                      type="number"
                      min="1930"
                      max="2010"
                    />
                  </div>
                  <div>
                    <Label className="text-foreground">Sexo biológico</Label>
                    <Select value={sex} onValueChange={setSex}>
                      <SelectTrigger className="mt-1.5">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="masculino">Masculino</SelectItem>
                        <SelectItem value="feminino">Feminino</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground">
                  O sexo biológico é usado para ajustar faixas de referência dos biomarcadores.
                </p>
              </div>
            </>
          )}

          {activeTab === 'preferencias' && (
            <div className="space-y-6">
              <SettingRow
                label="Notificações por e-mail"
                description="Receba alertas quando novos resultados estiverem disponíveis"
                checked={emailNotif}
                onChange={setEmailNotif}
              />
              <Separator />
              <SettingRow
                label="Relatório semanal"
                description="Resumo semanal da evolução dos seus biomarcadores"
                checked={weeklyReport}
                onChange={setWeeklyReport}
              />
              <Separator />
              <SettingRow
                label="Apenas alertas críticos"
                description="Receber notificações somente quando biomarcadores estiverem em zona vermelha"
                checked={alertsOnly}
                onChange={setAlertsOnly}
              />
            </div>
          )}

          {activeTab === 'metas' && (
            <div className="space-y-6">
              <div>
                <Label className="text-foreground font-semibold">Meta do BioScore</Label>
                <p className="text-sm text-muted-foreground mt-1">
                  Defina sua meta de pontuação geral de saúde
                </p>
                <div className="mt-4 flex items-center gap-4">
                  <Slider
                    value={bioScoreGoal}
                    onValueChange={setBioScoreGoal}
                    min={50}
                    max={100}
                    step={5}
                    className="flex-1"
                  />
                  <span className="font-serif text-2xl font-bold text-primary w-16 text-right">
                    {bioScoreGoal[0]}
                  </span>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>50</span>
                  <span>100</span>
                </div>
              </div>

              <Separator />

              <div>
                <Label className="text-foreground font-semibold">Áreas de foco</Label>
                <p className="text-sm text-muted-foreground mt-1">
                  Selecione as categorias que deseja priorizar
                </p>
                <div className="flex flex-wrap gap-2 mt-4">
                  {focusOptions.map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => toggleFocus(opt.id)}
                      className={cn(
                        'px-4 py-2 rounded-full text-sm font-medium transition-all border',
                        focusAreas.includes(opt.id)
                          ? 'bg-primary text-primary-foreground border-primary'
                          : 'bg-card text-muted-foreground border-border hover:border-primary/40'
                      )}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <Separator />

              <div className="bg-secondary rounded-xl p-4">
                <p className="text-sm text-muted-foreground">
                  💡 <span className="font-medium text-foreground">Dica:</span> Focar em 2-3 categorias por vez ajuda a acompanhar melhor sua evolução e manter consistência nos hábitos.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'privacidade' && (
            <div className="space-y-6">
              <SettingRow
                label="Compartilhar dados anonimizados"
                description="Contribua para pesquisas de saúde compartilhando dados sem identificação pessoal"
                checked={shareAnon}
                onChange={setShareAnon}
              />
              <Separator />
              <SettingRow
                label="Exibir BioScore no perfil"
                description="Permite que seu BioScore seja visível para profissionais de saúde conectados"
                checked={showBioScore}
                onChange={setShowBioScore}
              />
              <Separator />
              <div className="bg-secondary rounded-xl p-4">
                <p className="text-sm text-muted-foreground">
                  🔒 Seus dados são criptografados e protegidos. Nunca compartilhamos informações pessoais sem seu consentimento explícito.
                </p>
              </div>

              <div>
                <Button
                  variant="outline"
                  className="text-destructive border-destructive/30 hover:bg-destructive/10"
                >
                  Excluir minha conta
                </Button>
                <p className="text-xs text-muted-foreground mt-2">
                  Esta ação é irreversível e apagará todos os seus dados.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Save button */}
        <div className="flex justify-end">
          <Button
            onClick={handleSave}
            disabled={saving}
            className="bg-primary text-primary-foreground rounded-full px-8 h-auto py-3"
          >
            {saving ? (
              <Loader2 size={18} className="animate-spin mr-2" />
            ) : (
              <Save size={16} className="mr-2" />
            )}
            Salvar alterações
          </Button>
        </div>
      </div>
    </AppLayout>
  )
}

function SettingRow({
  label,
  description,
  checked,
  onChange,
}: {
  label: string
  description: string
  checked: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="text-sm font-medium text-foreground">{label}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  )
}

export default Configuracoes
