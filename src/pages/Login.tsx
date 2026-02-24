import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Activity, Eye, EyeOff, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/context/AuthContext'

export default function Login() {
  const navigate = useNavigate()
  const { signIn } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const result = await signIn(email, password)
    setLoading(false)
    if (result.error) {
      setError(result.error)
    } else {
      navigate('/dashboard')
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

          <h1 className="font-serif text-3xl text-brand-brown">Bem-vindo de volta</h1>
          <p className="text-gray-text mt-2 mb-8">
            Entre para acessar seu painel de longevidade.
          </p>

          <div className="space-y-4">
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
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-muted"
                >
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-terracota text-white rounded-full py-3 mt-6 hover:bg-brand-brown-mid h-auto"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : 'Entrar'}
          </Button>

          {error && <p className="text-status-red text-sm mt-2 text-center">{error}</p>}

          {/* Divider */}
          <div className="my-6 flex items-center gap-4">
            <div className="flex-1 h-px bg-gray-border" />
            <span className="text-xs text-gray-muted">ou</span>
            <div className="flex-1 h-px bg-gray-border" />
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/cadastro')}
            className="w-full border-brand-terracota text-brand-terracota rounded-full py-3 hover:bg-brand-terracota/10 h-auto"
          >
            Criar conta gratuita
          </Button>

          <p className="text-sm text-gray-text text-center mt-4 cursor-pointer hover:underline">
            Esqueceu a senha?
          </p>

          <div className="text-xs text-gray-muted mt-8 text-center bg-brand-cream-light rounded-lg p-3">
            🧪 Demo: demo@biotrack.com.br / demo123
          </div>
        </form>
      </div>
    </div>
  )
}
