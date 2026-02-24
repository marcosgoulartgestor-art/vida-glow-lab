import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Activity, Eye, EyeOff, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/context/AuthContext'
import { lovable } from '@/integrations/lovable/index'

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
            onClick={async () => {
              const { error } = await lovable.auth.signInWithOAuth('google', {
                redirect_uri: window.location.origin,
              })
              if (error) setError('Erro ao entrar com Google.')
            }}
            className="w-full border-gray-border text-brand-brown rounded-full py-3 hover:bg-brand-cream-light h-auto flex items-center justify-center gap-3"
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Entrar com Google
          </Button>

          <div className="mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/cadastro')}
              className="w-full border-brand-terracota text-brand-terracota rounded-full py-3 hover:bg-brand-terracota/10 h-auto"
            >
              Criar conta gratuita
            </Button>
          </div>

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
