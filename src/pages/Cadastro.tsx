import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Activity, Eye, EyeOff, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/hooks/use-toast'

function getStrength(pw: string): { label: string; color: string; pct: number } {
  if (pw.length < 6) return { label: 'Fraca', color: 'bg-status-red', pct: 25 }
  if (pw.length < 8) return { label: 'Média', color: 'bg-status-yellow', pct: 50 }
  const hasUpper = /[A-Z]/.test(pw)
  const hasNumber = /\d/.test(pw)
  if (hasUpper && hasNumber && pw.length >= 10)
    return { label: 'Forte', color: 'bg-status-green', pct: 100 }
  return { label: 'Boa', color: 'bg-status-green', pct: 75 }
}

export default function Cadastro() {
  const navigate = useNavigate()
  const { signUp } = useAuth()
  const { toast } = useToast()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPw, setConfirmPw] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [agreed, setAgreed] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const strength = getStrength(password)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password.length < 8) {
      setError('A senha deve ter pelo menos 8 caracteres.')
      return
    }
    if (password !== confirmPw) {
      setError('As senhas não coincidem.')
      return
    }
    if (!agreed) {
      setError('Você precisa aceitar os termos.')
      return
    }

    setLoading(true)
    const result = await signUp(email, password, name)
    setLoading(false)

    if (result.error) {
      setError(result.error)
    } else {
      toast({
        title: 'Conta criada!',
        description: 'Verifique seu e-mail para confirmar.',
      })
      navigate('/login')
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div
        className="hidden md:flex w-2/5 bg-brand-brown flex-col justify-center items-center p-12 relative overflow-hidden"
        style={{
          backgroundImage:
            'radial-gradient(circle, rgba(196,97,58,0.15) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      >
        <div className="flex items-center gap-2 mb-8">
          <Activity className="text-brand-terracota" size={28} />
          <span className="font-serif font-bold text-2xl">
            <span className="text-brand-terracota">Bio Track</span>{' '}
            <span className="text-white">Brasil</span>
          </span>
        </div>
        <p className="font-serif italic text-white/80 max-w-xs text-center text-lg leading-relaxed">
          "Sua biologia é única. Seus dados deveriam ser também."
        </p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center px-8 py-16 bg-brand-cream">
        <form onSubmit={handleSubmit} className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex md:hidden items-center gap-2 mb-8 justify-center">
            <Activity className="text-brand-terracota" size={24} />
            <span className="font-serif font-bold text-xl">
              <span className="text-brand-terracota">Bio Track</span>{' '}
              <span className="text-brand-brown">Brasil</span>
            </span>
          </div>

          <h1 className="font-serif text-3xl text-brand-brown">Crie sua conta</h1>
          <p className="text-gray-text mt-2 mb-8">
            Comece a entender sua biologia hoje.
          </p>

          <div className="space-y-4">
            <div>
              <Label htmlFor="name" className="text-brand-brown">Nome completo</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Seu nome"
                required
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="email" className="text-brand-brown">E-mail</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                required
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="password" className="text-brand-brown">Senha</Label>
              <div className="relative mt-1">
                <Input
                  id="password"
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mínimo 8 caracteres"
                  required
                  minLength={8}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-muted"
                >
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {password && (
                <div className="mt-2">
                  <div className="h-1.5 bg-gray-border rounded-full overflow-hidden">
                    <div
                      className={`h-full ${strength.color} transition-all`}
                      style={{ width: `${strength.pct}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-muted mt-1">Força: {strength.label}</p>
                </div>
              )}
            </div>

            <div>
              <Label htmlFor="confirmPw" className="text-brand-brown">Confirmar senha</Label>
              <Input
                id="confirmPw"
                type="password"
                value={confirmPw}
                onChange={(e) => setConfirmPw(e.target.value)}
                placeholder="Repita a senha"
                required
                className="mt-1"
              />
            </div>

            <div className="flex items-start gap-2 pt-2">
              <Checkbox
                id="terms"
                checked={agreed}
                onCheckedChange={(v) => setAgreed(v === true)}
              />
              <label htmlFor="terms" className="text-sm text-gray-text leading-snug cursor-pointer">
                Concordo com os{' '}
                <span className="text-brand-terracota underline">Termos de Uso</span> e{' '}
                <span className="text-brand-terracota underline">Política de Privacidade</span>
              </label>
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-terracota text-white rounded-full py-3 mt-6 hover:bg-brand-brown-mid h-auto"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : 'Criar minha conta'}
          </Button>

          {error && <p className="text-status-red text-sm mt-2 text-center">{error}</p>}

          <p
            className="text-brand-terracota text-sm text-center mt-4 cursor-pointer hover:underline"
            onClick={() => navigate('/login')}
          >
            Já tenho conta. Entrar →
          </p>
        </form>
      </div>
    </div>
  )
}
