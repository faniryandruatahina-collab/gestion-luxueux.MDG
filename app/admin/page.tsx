'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Lock } from 'lucide-react'

export default function AdminLogin() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (username === 'admin' && password === 'luxueux2025') {
      localStorage.setItem('adminAuth', 'true')
      localStorage.setItem('adminLoginTime', Date.now().toString())
      router.push('/')
    } else {
      setError('Identifiants incorrects')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Main content */}
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-primary rounded-full flex items-center justify-center">
              <Lock className="h-8 w-8 text-primary-foreground" />
            </div>
            <h2 className="mt-6 text-3xl font-bold text-foreground">
              Accès Administrateur
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Connectez-vous pour accéder à l'application
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleLogin}>
            {/* ... formulaire de connexion ... */}
          </form>
        </div>
      </div>

      {/* Footer signature pour la page de connexion */}
      <footer className="border-t border-border bg-card py-4">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <div className="text-sm text-muted-foreground">
              © 2025 Luxueux.MDG. Tous droits réservés.
            </div>
            <div className="text-sm text-muted-foreground mt-2 sm:mt-0">
              Développé par <span className="text-accent font-medium">ANDRIATAHINA Fanirintsoa</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
