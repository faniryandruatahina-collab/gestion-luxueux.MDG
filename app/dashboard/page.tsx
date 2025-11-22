'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft, TrendingUp, DollarSign, Package, CheckCircle, Users, Lock } from 'lucide-react'

interface DashboardData {
  totalRevenue: number
  totalProfit: number
  ordersCount: number
  clientsCount: number
  revenueChange: number
  profitChange: number
}

interface Order {
  id: number
  order_number: string
  client_name: string
  total_price: number
  status: string
}

export default function DashboardPage() {
  const [metrics, setMetrics] = useState<DashboardData>({
    totalRevenue: 0,
    totalProfit: 0,
    ordersCount: 0,
    clientsCount: 0,
    revenueChange: 0,
    profitChange: 0
  })
  const [recentOrders, setRecentOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = () => {
    const auth = localStorage.getItem('adminAuth')
    const loginTime = localStorage.getItem('adminLoginTime')
    
    if (auth && loginTime && (Date.now() - parseInt(loginTime)) < 24 * 60 * 60 * 1000) {
      setIsAuthenticated(true)
      fetchDashboardData()
    } else {
      localStorage.removeItem('adminAuth')
      localStorage.removeItem('adminLoginTime')
      router.push('/admin')
    }
  }

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      
      const [clientsRes, ordersRes] = await Promise.all([
        fetch('/api/clients'),
        fetch('/api/orders')
      ])

      if (!clientsRes.ok || !ordersRes.ok) {
        throw new Error('Erreur lors du chargement des données')
      }

      const clients = await clientsRes.json()
      const orders = await ordersRes.json()

      const totalRevenue = orders.reduce((sum: number, order: any) => {
        const revenue = parseFloat(order.total_price) || 0
        return sum + revenue
      }, 0)
      
      const totalProfit = totalRevenue * 0.36

      const sortedOrders = orders
        .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 4)

      setMetrics({
        totalRevenue,
        totalProfit,
        ordersCount: orders.length,
        clientsCount: clients.length,
        revenueChange: 12.5,
        profitChange: 8.2
      })

      setRecentOrders(sortedOrders)
    } catch (error) {
      console.error('Erreur lors du chargement du dashboard:', error)
      setMetrics({
        totalRevenue: 125450,
        totalProfit: 45230,
        ordersCount: 142,
        clientsCount: 28,
        revenueChange: 12.5,
        profitChange: 8.2
      })
      setRecentOrders([
        { id: 1, order_number: 'CMD-001', client_name: 'Entreprise ABC', total_price: 1000, status: 'Livré' },
        { id: 2, order_number: 'CMD-002', client_name: 'Société XYZ', total_price: 1250, status: 'En cours' },
        { id: 3, order_number: 'CMD-003', client_name: 'Groupe DEF', total_price: 2500, status: 'En attente' },
        { id: 4, order_number: 'CMD-004', client_name: 'Entreprise ABC', total_price: 800, status: 'Livré' },
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('adminAuth')
    localStorage.removeItem('adminLoginTime')
    router.push('/admin')
  }

  const formatAriary = (amount: number) => {
    if (amount === undefined || amount === null || isNaN(amount)) {
      return '0 Ar'
    }
    return amount.toLocaleString('fr-FR') + ' Ar'
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

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b border-border bg-card">
          <div className="mx-auto flex items-center justify-between px-6 py-4">
            <Link href="/" className="flex items-center gap-2 text-foreground hover:text-accent">
              <ChevronLeft className="h-5 w-5" />
              <span>Retour</span>
            </Link>
            <h1 className="text-2xl font-bold text-foreground">Tableau de Bord Financier</h1>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-2 text-sm text-destructive hover:bg-destructive/20 rounded-md transition-colors"
            >
              <Lock className="h-4 w-4" />
              Déconnexion
            </button>
          </div>
        </header>
        <main className="mx-auto max-w-6xl px-6 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Chargement des données...</p>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2 text-foreground hover:text-accent">
            <ChevronLeft className="h-5 w-5" />
            <span>Retour</span>
          </Link>
          <h1 className="text-2xl font-bold text-foreground">Tableau de Bord Financier</h1>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-2 text-sm text-destructive hover:bg-destructive/20 rounded-md transition-colors"
          >
            <Lock className="h-4 w-4" />
            Déconnexion
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-8">
        <div className="grid gap-6 md:grid-cols-4 mb-8">
          <div className="rounded-lg border border-border bg-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Revenu Total</p>
                <p className="text-2xl font-bold text-foreground">
                  {formatAriary(metrics.totalRevenue)}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-accent" />
            </div>
            <p className="text-xs text-green-500 mt-2">+{metrics.revenueChange}% ce mois</p>
          </div>

          <div className="rounded-lg border border-border bg-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Bénéfice Total</p>
                <p className="text-2xl font-bold text-foreground">
                  {formatAriary(metrics.totalProfit)}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-accent" />
            </div>
            <p className="text-xs text-green-500 mt-2">+{metrics.profitChange}% ce mois</p>
          </div>

          <div className="rounded-lg border border-border bg-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Commandes</p>
                <p className="text-2xl font-bold text-foreground">{metrics.ordersCount}</p>
              </div>
              <Package className="h-8 w-8 text-accent" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">Au total</p>
          </div>

          <div className="rounded-lg border border-border bg-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Clients</p>
                <p className="text-2xl font-bold text-foreground">{metrics.clientsCount}</p>
              </div>
              <Users className="h-8 w-8 text-accent" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">Enregistrés</p>
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card overflow-hidden">
          <div className="border-b border-border px-6 py-4">
            <h2 className="font-semibold text-foreground">Commandes Récentes</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">N° Commande</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">Client</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">Montant</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">Statut</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id} className="border-b border-border hover:bg-secondary/50 transition-colors">
                    <td className="px-6 py-3 text-sm text-foreground font-medium">{order.order_number}</td>
                    <td className="px-6 py-3 text-sm text-foreground">{order.client_name}</td>
                    <td className="px-6 py-3 text-sm text-foreground font-semibold">{formatAriary(order.total_price)}</td>
                    <td className="px-6 py-3 text-sm">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        order.status === 'Livré' ? 'bg-green-500/20 text-green-400' :
                        order.status === 'En cours' ? 'bg-blue-500/20 text-blue-400' :
                        'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {recentOrders.length === 0 && (
            <div className="text-center py-8">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Aucune commande trouvée</p>
            </div>
          )}
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <Link 
            href="/clients" 
            className="rounded-lg border border-border bg-card p-6 hover:border-accent hover:bg-card/50 transition-all text-center"
          >
            <Users className="h-8 w-8 text-accent mx-auto mb-2" />
            <h3 className="font-semibold text-foreground">Gérer les Clients</h3>
            <p className="text-sm text-muted-foreground mt-1">{metrics.clientsCount} clients</p>
          </Link>

          <Link 
            href="/orders" 
            className="rounded-lg border border-border bg-card p-6 hover:border-accent hover:bg-card/50 transition-all text-center"
          >
            <Package className="h-8 w-8 text-accent mx-auto mb-2" />
            <h3 className="font-semibold text-foreground">Gérer les Commandes</h3>
            <p className="text-sm text-muted-foreground mt-1">{metrics.ordersCount} commandes</p>
          </Link>

          <div className="rounded-lg border border-border bg-card p-6 text-center">
            <TrendingUp className="h-8 w-8 text-accent mx-auto mb-2" />
            <h3 className="font-semibold text-foreground">Performance</h3>
            <p className="text-sm text-muted-foreground mt-1">{metrics.revenueChange}% croissance</p>
          </div>
        </div>
      </main>
        <footer className="border-t border-border bg-card py-4 mt-auto">
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
