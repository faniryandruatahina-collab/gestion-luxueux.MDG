'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Plus, ChevronLeft, DollarSign, Package, CheckCircle, Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import OrderForm from '@/components/order-form'
import OrderTable from '@/components/order-table'
import OrderDetails from '@/components/order-details'

interface Order {
  id: number
  order_number: string
  client_name: string
  product: string
  quantity: number
  unit_price: number
  total_price: number
  status: string
  order_date: string
  product_image?: string
  product_images?: string[]
}

interface Client {
  id: number
  name: string
  email: string
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [clients, setClients] = useState<Client[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [selectedOrder, setSelectedOrder] = useState<any>(null)
  const [showDetails, setShowDetails] = useState(false)
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
      loadData()
    } else {
      localStorage.removeItem('adminAuth')
      localStorage.removeItem('adminLoginTime')
      router.push('/admin')
    }
  }

  const loadData = async () => {
    try {
      const [ordersRes, clientsRes] = await Promise.all([
        fetch('/api/orders'),
        fetch('/api/clients')
      ])

      if (ordersRes.ok) {
        const ordersData = await ordersRes.json()
        console.log('📦 Données brutes de l\'API orders:', ordersData)
        if (ordersData.length > 0) {
          console.log('📋 Structure de la première commande:', ordersData[0])
          console.log('🖼️ Images de la première commande:', ordersData[0].product_images)
        }
        setOrders(ordersData)
      } else {
        console.error('❌ Erreur chargement orders')
      }

      if (clientsRes.ok) {
        const clientsData = await clientsRes.json()
        setClients(clientsData)
      } else {
        console.error('❌ Erreur chargement clients')
      }
    } catch (error) {
      console.error('❌ Erreur chargement données:', error)
    } finally {
      setLoading(false)
    }
  }

  const mapOrderToDetails = (order: any) => {
    console.log('🗺️ Mapping des données de la commande:', order)
    
    return {
      id: order.id,
      orderNumber: order.order_number || order.orderNumber,
      clientName: order.client_name || order.clientName,
      product: order.product,
      quantity: order.quantity,
      unitPrice: order.unit_price || order.unitPrice,
      totalPrice: order.total_price || order.totalPrice,
      status: order.status,
      date: order.order_date || order.date,
      productImage: order.product_image || order.productImage,
      productImages: order.product_images || order.productImages || []
    }
  }

  const handleAddOrder = async (data: any) => {
    try {
      const url = editingId ? `/api/orders?id=${editingId}` : '/api/orders'
      const method = editingId ? 'PUT' : 'POST'

      const quantity = parseFloat(data.quantity) || 0
      const unitPrice = parseFloat(data.unitPrice) || 0
      const totalPrice = quantity * unitPrice

      const orderData = {
        order_number: data.orderNumber,
        client_name: data.clientName,
        product: data.product,
        quantity: quantity,
        unit_price: unitPrice,
        total_price: totalPrice,
        status: data.status,
        order_date: data.date,
        product_images: data.productImages || []
      }

      console.log('📤 Données envoyées à l\'API:', orderData)
      console.log('🖼️ Images envoyées:', data.productImages)

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      })

      if (response.ok) {
        await fetchOrders()
        setShowForm(false)
        setEditingId(null)
        alert(editingId ? 'Commande modifiée avec succès' : 'Commande ajoutée avec succès')
      } else {
        const errorData = await response.json()
        console.error('❌ Erreur API:', errorData)
        alert(errorData.error || 'Une erreur est survenue')
      }
    } catch (error) {
      console.error('❌ Erreur:', error)
      alert('Erreur de connexion')
    }
  }

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/orders')
      if (response.ok) {
        const data = await response.json()
        setOrders(data)
      }
    } catch (error) {
      console.error('Erreur lors du chargement des commandes:', error)
    }
  }

  const handleDeleteOrder = async (id: number) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette commande ?')) {
      try {
        const response = await fetch(`/api/orders?id=${id}`, {
          method: 'DELETE',
        })

        if (response.ok) {
          await fetchOrders()
          alert('Commande supprimée avec succès')
        } else {
          const errorData = await response.json()
          alert(`Erreur: ${errorData.error}`)
        }
      } catch (error) {
        alert('Erreur de connexion au serveur')
      }
    }
  }

  const handleMarkAsDelivered = async (id: number) => {
    if (confirm('Êtes-vous sûr de vouloir marquer cette commande comme livrée ?')) {
      try {
        const currentOrder = orders.find(order => order.id === id)
        
        if (!currentOrder) {
          alert('Commande non trouvée')
          return
        }

        console.log('📦 Données actuelles de la commande:', currentOrder)

        const updateResponse = await fetch(`/api/orders?id=${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            order_number: currentOrder.order_number,
            client_name: currentOrder.client_name,
            product: currentOrder.product,
            quantity: currentOrder.quantity,
            unit_price: currentOrder.unit_price,
            total_price: currentOrder.total_price,
            status: 'Livré',
            order_date: currentOrder.order_date,
            product_images: currentOrder.product_images || []
          }),
        })

        if (updateResponse.ok) {
          await fetchOrders()
          alert('Commande marquée comme livrée avec succès')
        } else {
          const errorData = await updateResponse.json()
          console.error('❌ Erreur API:', errorData)
          alert(`Erreur: ${errorData.error}`)
        }
      } catch (error) {
        console.error('❌ Erreur:', error)
        alert('Erreur de connexion')
      }
    }
  }

  const handleEdit = (order: Order) => {
    console.log('✏️ Édition de la commande:', order)
    setEditingId(order.id)
    setShowForm(true)
  }

  const handleViewDetails = (order: any) => {
    console.log('🔍 COMMANDE SÉLECTIONNÉE POUR DÉTAILS (avant mapping):', order)
    const mappedOrder = mapOrderToDetails(order)
    console.log('🔍 COMMANDE SÉLECTIONNÉE POUR DÉTAILS (après mapping):', mappedOrder)
    setSelectedOrder(mappedOrder)
    setShowDetails(true)
  }

  const handleCloseDetails = () => {
    setShowDetails(false)
    setSelectedOrder(null)
  }

  const handleLogout = () => {
    localStorage.removeItem('adminAuth')
    localStorage.removeItem('adminLoginTime')
    router.push('/admin')
  }

  const formatAriary = (amount: any): string => {
    if (amount === undefined || amount === null) {
      return '0 Ar'
    }
    
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount
    
    if (isNaN(numAmount)) {
      return '0 Ar'
    }
    
    return new Intl.NumberFormat('fr-FR').format(numAmount) + ' Ar'
  }

  const calculateTotalRevenue = (): number => {
    const total = orders.reduce((sum, order) => {
      const revenue = parseFloat(order.total_price as any) || 0
      return sum + revenue
    }, 0)
    
    return total
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
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-foreground">Chargement des commandes...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex items-center justify-between px-6 py-4">
          <Link 
            href="/" 
            className="flex items-center gap-2 text-foreground hover:text-accent transition-colors"
          >
            <ChevronLeft className="h-5 w-5" />
            <span>Retour</span>
          </Link>
          <h1 className="text-2xl font-bold text-foreground">Gestion des Commandes</h1>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-2 text-sm text-destructive hover:bg-destructive/20 rounded-md transition-colors"
          >
            <Lock className="h-4 w-4" />
            Déconnexion
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-foreground">Liste des Commandes</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Total: {orders.length} commande{orders.length > 1 ? 's' : ''}
            </p>
          </div>
          <Button 
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-md transition-colors"
          >
            <Plus className="h-4 w-4" />
            {showForm ? 'Masquer le formulaire' : 'Ajouter une commande'}
          </Button>
        </div>

        {showForm && (
          <div className="mb-8 rounded-lg border border-border bg-card p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              {editingId ? 'Modifier la commande' : 'Nouvelle commande'}
            </h3>
            <OrderForm 
              onSubmit={handleAddOrder}
              onCancel={() => {
                setShowForm(false)
                setEditingId(null)
              }}
              initialData={editingId ? orders.find(o => o.id === editingId) : undefined}
              clients={clients}
            />
          </div>
        )}

        <div className="rounded-lg border border-border bg-card overflow-hidden shadow-sm">
          {orders.length === 0 ? (
            <div className="text-center py-12">
              <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">Aucune commande</h3>
              <p className="text-muted-foreground mb-4">Commencez par ajouter votre première commande</p>
              <Button 
                onClick={() => setShowForm(true)}
                className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                <Plus className="h-4 w-4" />
                Ajouter une commande
              </Button>
            </div>
          ) : (
            <OrderTable 
              orders={orders.map(order => ({
                id: order.id,
                orderNumber: order.order_number,
                clientName: order.client_name,
                product: order.product,
                quantity: order.quantity,
                unitPrice: order.unit_price,
                totalPrice: order.total_price,
                status: order.status,
                date: order.order_date,
                productImage: order.product_image,
                productImages: order.product_images || []
              }))}
              onEdit={handleEdit}
              onDelete={handleDeleteOrder}
              onView={handleViewDetails}
              onMarkAsDelivered={handleMarkAsDelivered}
            />
          )}
        </div>

        {orders.length > 0 && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-lg border border-border bg-card p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Chiffre d'affaires total</p>
                  <p className="text-xl font-bold text-foreground">
                    {formatAriary(calculateTotalRevenue())}
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-green-500" />
              </div>
            </div>
            
            <div className="rounded-lg border border-border bg-card p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Commandes en cours</p>
                  <p className="text-xl font-bold text-foreground">
                    {orders.filter(order => order.status === 'En cours').length}
                  </p>
                </div>
                <Package className="h-8 w-8 text-blue-500" />
              </div>
            </div>
            
            <div className="rounded-lg border border-border bg-card p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Commandes livrées</p>
                  <p className="text-xl font-bold text-foreground">
                    {orders.filter(order => order.status === 'Livré').length}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </div>
          </div>
        )}

        {showDetails && selectedOrder && (
          <OrderDetails 
            order={selectedOrder}
            onClose={handleCloseDetails}
          />
        )}
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
