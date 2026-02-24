import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { toast } from 'sonner'

interface AuthUser {
  id: string
  email: string
  user_metadata: { full_name?: string }
}

interface AuthContextType {
  user: AuthUser | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error?: string }>
  signUp: (email: string, password: string, fullName: string) => Promise<{ error?: string }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const DEMO_EMAIL = 'demo@biotrack.com.br'
const DEMO_PASS = 'demo123'
const DEMO_USER: AuthUser = {
  id: 'mock-1',
  email: DEMO_EMAIL,
  user_metadata: { full_name: 'Carlos Silva' },
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email ?? '',
          user_metadata: session.user.user_metadata,
        })
      } else {
        setUser((prev) => (prev?.id === 'mock-1' ? prev : null))
      }
      setLoading(false)
    })

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email ?? '',
          user_metadata: session.user.user_metadata,
        })
      }
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    if (email === DEMO_EMAIL && password === DEMO_PASS) {
      setUser(DEMO_USER)
      toast.success('Bem-vindo de volta, Carlos Silva! 🎉')
      return {}
    }
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      toast.error('E-mail ou senha incorretos.')
      return { error: error.message }
    }
    const name = data.user?.user_metadata?.full_name || 'Usuário'
    toast.success(`Bem-vindo de volta, ${name}! 🎉`)
    return {}
  }

  const signUp = async (email: string, password: string, fullName: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
        emailRedirectTo: window.location.origin,
      },
    })
    if (error) {
      toast.error(error.message)
      return { error: error.message }
    }
    toast.success('Conta criada! Verifique seu e-mail.')
    return {}
  }

  const signOut = async () => {
    setUser(null)
    await supabase.auth.signOut()
    toast('Até logo! 👋')
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
