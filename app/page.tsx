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

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-foreground">Vérification...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-foreground">Redirection...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b border-border bg-card sticky top-0 z-50">
        <div className="mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <img 
              src="/logo.jpg"
              alt="Luxueux.MDG Logo" 
              className="h-10 w-10 rounded-lg object-cover"
            />
            <h1 className="text-2xl font-bold text-foreground">Luxueux.MDG</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <nav className="flex gap-6">
              <Link href="/clients" className="text-foreground hover:text-accent transition-colors">
                Clients
              </Link>
              <Link href="/orders" className="text-foreground hover:text-accent transition-colors">
                Commandes
              </Link>
              <Link href="/dashboard" className="text-foreground hover:text-accent transition-colors">
                Tableau de bord
              </Link>
            </nav>
            
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-2 text-sm text-destructive hover:bg-destructive/20 rounded-md transition-colors"
            >
              <Lock className="h-4 w-4" />
              Déconnexion
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 mx-auto max-w-7xl w-full px-6 py-16 pb-24">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-4xl font-bold text-foreground">Gestion d'Entreprise de Luxueux.MDG</h2>
          <p className="text-lg text-muted-foreground">
            Gérez vos clients, commandes et finances en un seul endroit
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Link href="/clients" className="group">
            <div className="rounded-lg border border-border bg-card p-6 transition-all hover:border-accent hover:bg-card/50">
              <Users className="mb-4 h-12 w-12 text-accent" />
              <h3 className="mb-2 text-xl font-semibold text-foreground">Gestion des Clients</h3>
              <p className="text-muted-foreground">Ajoutez, modifiez et gérez vos clients avec leurs coordonnées et adresses de livraison</p>
            </div>
          </Link>

          <Link href="/orders" className="group">
            <div className="rounded-lg border border-border bg-card p-6 transition-all hover:border-accent hover:bg-card/50">
              <ShoppingCart className="mb-4 h-12 w-12 text-accent" />
              <h3 className="mb-2 text-xl font-semibold text-foreground">Gestion des Commandes</h3>
              <p className="text-muted-foreground">Créez et suivez vos commandes avec références produits, quantités et prix</p>
            </div>
          </Link>

          <Link href="/dashboard" className="group">
            <div className="rounded-lg border border-border bg-card p-6 transition-all hover:border-accent hover:bg-card/50">
              <TrendingUp className="mb-4 h-12 w-12 text-accent" />
              <h3 className="mb-2 text-xl font-semibold text-foreground">Tableau de Bord Financier</h3>
              <p className="text-muted-foreground">Visualisez vos revenus totaux, bénéfices et indicateurs clés</p>
            </div>
          </Link>
        </div>

        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/20 text-primary rounded-full">
            <Lock className="h-4 w-4" />
            <span className="text-sm font-medium">Mode Administrateur Activé</span>
          </div>
        </div>
      </main>

      <footer className="border-t border-border bg-card py-4 fixed bottom-0 left-0 right-0 z-40">
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
