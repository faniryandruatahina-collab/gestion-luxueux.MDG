'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Plus, ChevronLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import ClientForm from '@/components/client-form'
import ClientTable from '@/components/client-table'

interface Client {
  id: number
  name: string
  email: string
  phone: string
  address: string
  city: string
  zip: string
}

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)

  // Charger les clients au démarrage
  useEffect(() => {
    fetchClients()
  }, [])

  const fetchClients = async () => {
    try {
      console.log('🔄 Chargement des clients...')
      const response = await fetch('/api/clients')
      if (response.ok) {
        const data = await response.json()
        console.log('✅ Clients chargés:', data)
        setClients(data)
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
        alert(editingId ? 'Client modifié avec succès' : 'Client ajouté avec succès')
      } else {
        const errorData = await response.json()
        // Affichez l'erreur de manière claire
        if (errorData.error) {
          console.error('❌ Erreur API:', errorData.error)
          alert(`Erreur: ${errorData.error}`)
        } else {
          console.error('❌ Erreur API inconnue')
          alert('Une erreur inconnue est survenue')
        }
      }
    } catch (error: any) {
      // Affichez l'erreur réelle
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
          console.error('❌ Erreur suppression:', errorData) // ← CORRIGEZ
          alert(`Erreur: ${errorData.error}`)
        }
      } catch (error) {
        console.error('❌ Erreur connexion:', error) // ← CORRIGEZ
        alert('Erreur de connexion au serveur')
      }
    }
  }
  const handleEdit = (client: Client) => {
    setEditingId(client.id)
    setShowForm(true)
  }

  if (loading) {
    return <div className="min-h-screen bg-background flex items-center justify-center">Chargement...</div>
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2 text-foreground hover:text-accent">
            <ChevronLeft className="h-5 w-5" />
            <span>Retour</span>
          </Link>
          <h1 className="text-2xl font-bold text-foreground">Gestion des Clients</h1>
          <div />
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold text-foreground">Liste des Clients</h2>
            <p className="text-sm text-muted-foreground">Total: {clients.length} clients</p>
          </div>
          <Button 
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 bg-primary hover:bg-primary/90"
          >
            <Plus className="h-4 w-4" />
            Ajouter un client
          </Button>
        </div>

        {showForm && (
          <div className="mb-8 rounded-lg border border-border bg-card p-6">
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

        <div className="rounded-lg border border-border bg-card overflow-hidden">
          <ClientTable 
            clients={clients}
            onEdit={handleEdit}
            onDelete={handleDeleteClient}
          />
        </div>
      </main>
    </div>
  )
}