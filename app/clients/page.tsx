'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Plus, ChevronLeft, Lock, Search, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import ClientForm from '@/components/client-form'
import ClientTable from '@/components/client-table'

interface Client {
  id: number
  name: string
  phone: string
  address: string
  city: string
}

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([])
  const [filteredClients, setFilteredClients] = useState<Client[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()

  useEffect(() => {
    checkAuth()
  }, [])

  useEffect(() => {
    // Filtrer les clients selon le terme de recherche
    if (searchTerm.trim() === '') {
      setFilteredClients(clients)
    } else {
      const filtered = clients.filter(client =>
        client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.phone.includes(searchTerm) ||
        client.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.address.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredClients(filtered)
    }
  }, [searchTerm, clients])

  const checkAuth = () => {
    const auth = localStorage.getItem('adminAuth')
    const loginTime = localStorage.getItem('adminLoginTime')
    
    if (auth && loginTime && (Date.now() - parseInt(loginTime)) < 24 * 60 * 60 * 1000) {
      setIsAuthenticated(true)
      fetchClients()
    } else {
      localStorage.removeItem('adminAuth')
      localStorage.removeItem('adminLoginTime')
      router.push('/admin')
    }
  }

  const fetchClients = async () => {
    try {
      console.log('🔄 Chargement des clients...')
      const response = await fetch('/api/clients')
      if (response.ok) {
        const data = await response.json()
        console.log('✅ Clients chargés:', data)
        setClients(data)
        setFilteredClients(data)
      } else {
        const errorData = await response.json()
        console.error('❌ Erreur chargement clients:', errorData)
      }
    } catch (error) {
      console.error('❌ Erreur connexion:', error)
    } finally {
      setLoading(false)
    }
  }
  
  const handleAddClient = async (data: any) => {
    try {
      const url = editingId ? `/api/clients?id=${editingId}` : '/api/clients'
      const method = editingId ? 'PUT' : 'POST'
  
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
  
      if (response.ok) {
        await fetchClients()
        setShowForm(false)
        setEditingId(null)
        setSearchTerm('') // Réinitialiser la recherche après modification
        alert(editingId ? 'Client modifié avec succès' : 'Client ajouté avec succès')
      } else {
        const errorData = await response.json()
        if (errorData.error) {
          console.error('❌ Erreur API:', errorData.error)
          alert(`Erreur: ${errorData.error}`)
        } else {
          console.error('❌ Erreur API inconnue')
          alert('Une erreur inconnue est survenue')
        }
      }
    } catch (error: any) {
      console.error('❌ Erreur de connexion:', error.message || error)
      alert('Erreur de connexion au serveur')
    }
  }
  
  const handleDeleteClient = async (id: number) => {
    console.log('🗑️ Tentative suppression client ID:', id)
    
    if (confirm('Êtes-vous sûr de vouloir supprimer ce client ?')) {
      try {
        const response = await fetch(`/api/clients?id=${id}`, {
          method: 'DELETE',
        })
  
        console.log('🔍 Statut réponse:', response.status)
  
        if (response.ok) {
          await fetchClients()
          alert('Client supprimé avec succès')
        } else {
          const errorData = await response.json()
          console.error('❌ Erreur suppression:', errorData)
          alert(`Erreur: ${errorData.error}`)
        }
      } catch (error) {
        console.error('❌ Erreur connexion:', error)
        alert('Erreur de connexion au serveur')
      }
    }
  }

  const handleEdit = (client: Client) => {
    setEditingId(client.id)
    setShowForm(true)
  }

  const handleLogout = () => {
    localStorage.removeItem('adminAuth')
    localStorage.removeItem('adminLoginTime')
    router.push('/admin')
  }

  const clearSearch = () => {
    setSearchTerm('')
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
              <Link href="/" className="flex items-center gap-2 text-foreground hover:text-accent transition-colors">
                <ChevronLeft className="h-5 w-5" />
                <span className="hidden sm:inline">Retour</span>
              </Link>
              <h1 className="text-xl sm:text-2xl font-bold text-foreground">Gestion des Clients</h1>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-2 text-sm text-destructive hover:bg-destructive/20 rounded-md transition-colors self-end sm:self-auto"
            >
              <Lock className="h-4 w-4" />
              <span className="hidden sm:inline">Déconnexion</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 mx-auto w-full max-w-6xl px-4 sm:px-6 py-6 pb-28">
        {/* Header Section */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
            <div>
              <h2 className="text-lg sm:text-xl font-semibold text-foreground">Liste des Clients</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Total: {clients.length} client{clients.length > 1 ? 's' : ''}
                {searchTerm && (
                  <span className="text-accent">
                    {' '}({filteredClients.length} résultat{filteredClients.length > 1 ? 's' : ''})
                  </span>
                )}
              </p>
            </div>
            <Button 
              onClick={() => setShowForm(!showForm)}
              className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-md transition-colors w-full sm:w-auto"
            >
              <Plus className="h-4 w-4" />
              {showForm ? 'Masquer' : 'Nouveau client'}
            </Button>
          </div>

          {/* Barre de recherche */}
          <div className="relative">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <input
                type="text"
                placeholder="Rechercher un client par nom, téléphone, ville ou adresse..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-10 py-2 rounded-md border border-border bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
              {searchTerm && (
                <button
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            
            {/* Suggestions de recherche */}
            {searchTerm && filteredClients.length === 0 && (
              <div className="absolute top-full left-0 right-0 bg-card border border-border rounded-md shadow-lg z-10 mt-1 p-3">
                <p className="text-sm text-muted-foreground text-center">
                  Aucun client trouvé pour "{searchTerm}"
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Client Form */}
        {showForm && (
          <div className="mb-6 rounded-lg border border-border bg-card p-4 sm:p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              {editingId ? 'Modifier le client' : 'Nouveau client'}
            </h3>
            <ClientForm 
              onSubmit={handleAddClient}
              onCancel={() => {
                setShowForm(false)
                setEditingId(null)
              }}
              initialData={editingId ? clients.find(c => c.id === editingId) : undefined}
            />
          </div>
        )}

        {/* Clients Table */}
        <div className="rounded-lg border border-border bg-card overflow-hidden">
          <ClientTable 
            clients={filteredClients}
            onEdit={handleEdit}
            onDelete={handleDeleteClient}
          />
        </div>

        {/* Message si aucun résultat */}
        {searchTerm && filteredClients.length === 0 && (
          <div className="text-center py-8">
            <div className="text-muted-foreground mb-4">
              <Search className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <h3 className="text-lg font-semibold mb-2">Aucun résultat</h3>
              <p>Aucun client ne correspond à votre recherche "{searchTerm}"</p>
            </div>
            <Button 
              onClick={clearSearch}
              variant="outline"
              className="mx-auto"
            >
              Afficher tous les clients
            </Button>
          </div>
        )}

        {/* Statistiques rapides */}
        {clients.length > 0 && (
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-lg border border-border bg-card p-4 text-center">
              <div className="text-2xl font-bold text-foreground mb-1">{clients.length}</div>
              <div className="text-sm text-muted-foreground">Clients total</div>
            </div>
            <div className="rounded-lg border border-border bg-card p-4 text-center">
              <div className="text-2xl font-bold text-foreground mb-1">
                {new Set(clients.map(c => c.city)).size}
              </div>
              <div className="text-sm text-muted-foreground">Villes différentes</div>
            </div>
            <div className="rounded-lg border border-border bg-card p-4 text-center">
              <div className="text-2xl font-bold text-foreground mb-1">
                {searchTerm ? filteredClients.length : clients.length}
              </div>
              <div className="text-sm text-muted-foreground">
                {searchTerm ? 'Résultats' : 'Clients affichés'}
              </div>
            </div>
          </div>
        )}
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
