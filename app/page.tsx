'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { BarChart3, Users, ShoppingCart, TrendingUp, Lock } from 'lucide-react'

export default function HomePage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = () => {
    const auth = localStorage.getItem('adminAuth')
    const loginTime = localStorage.getItem('adminLoginTime')
    
    if (auth && loginTime && (Date.now() - parseInt(loginTime)) < 24 * 60 * 60 * 1000) {
      setIsAuthenticated(true)
    } else {
      localStorage.removeItem('adminAuth')
      localStorage.removeItem('adminLoginTime')
      router.push('/admin')
    }
    setLoading(false)
  }

  const handleLogout = () => {
    localStorage.removeItem('adminAuth')
    localStorage.removeItem('adminLoginTime')
    router.push('/admin')
  }

  if (!isAuthenticated || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-foreground">{!isAuthenticated ? 'Redirection...' : 'Chargement...'}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-50">
        <div className="mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <img 
                src="/logo.jpg"
                alt="Luxueux.MDG Logo" 
                className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg object-cover"
              />
              <h1 className="text-xl sm:text-2xl font-bold text-foreground">Luxueux.MDG</h1>
            </div>
            
            <div className="flex items-center gap-4">
              <nav className="flex gap-4 sm:gap-6">
                <Link href="/clients" className="text-foreground hover:text-accent transition-colors text-sm sm:text-base">
                  Clients
                </Link>
                <Link href="/orders" className="text-foreground hover:text-accent transition-colors text-sm sm:text-base">
                  Commandes
                </Link>
                <Link href="/dashboard" className="text-foreground hover:text-accent transition-colors text-sm sm:text-base">
                  Dashboard
                </Link>
              </nav>
              
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-2 text-sm text-destructive hover:bg-destructive/20 rounded-md transition-colors"
              >
                <Lock className="h-4 w-4" />
                <span className="hidden sm:inline">Déconnexion</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 py-8 pb-28">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-4xl font-bold text-foreground mb-4">
            Gestion d'Entreprise de Luxueux.MDG
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground">
            Gérez vos clients, commandes et finances en un seul endroit
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link href="/clients" className="group">
            <div className="rounded-lg border border-border bg-card p-6 transition-all hover:border-accent hover:bg-card/50 h-full">
              <Users className="mb-4 h-10 w-10 sm:h-12 sm:w-12 text-accent mx-auto" />
              <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-2 text-center">Gestion des Clients</h3>
              <p className="text-sm text-muted-foreground text-center">
                Ajoutez, modifiez et gérez vos clients avec leurs coordonnées et adresses
              </p>
            </div>
          </Link>

          <Link href="/orders" className="group">
            <div className="rounded-lg border border-border bg-card p-6 transition-all hover:border-accent hover:bg-card/50 h-full">
              <ShoppingCart className="mb-4 h-10 w-10 sm:h-12 sm:w-12 text-accent mx-auto" />
              <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-2 text-center">Gestion des Commandes</h3>
              <p className="text-sm text-muted-foreground text-center">
                Créez et suivez vos commandes avec références produits, quantités et prix
              </p>
            </div>
          </Link>

          <Link href="/dashboard" className="group">
            <div className="rounded-lg border border-border bg-card p-6 transition-all hover:border-accent hover:bg-card/50 h-full">
              <TrendingUp className="mb-4 h-10 w-10 sm:h-12 sm:w-12 text-accent mx-auto" />
              <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-2 text-center">Tableau de Bord</h3>
              <p className="text-sm text-muted-foreground text-center">
                Visualisez vos revenus totaux, bénéfices et indicateurs clés
              </p>
            </div>
          </Link>
        </div>

        <div className="text-center mt-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/20 text-primary rounded-full">
            <Lock className="h-4 w-4" />
            <span className="text-sm font-medium">Mode Administrateur Activé</span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-4 fixed bottom-0 left-0 right-0 z-40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row justify-between items-center text-center sm:text-left">
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
