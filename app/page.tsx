'use client'

import { useState } from 'react'
import Link from 'next/link'
import { BarChart3, Users, ShoppingCart, TrendingUp } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
  <div className="mx-auto flex items-center justify-between px-6 py-4">
    <div className="flex items-center gap-3"> {/* Augmenté le gap à 3 */}
      {/* Votre logo avec taille augmentée et forme ronde */}
      <img 
        src="/logo.jpg"  // Chemin vers votre logo
        alt="GestioHub Logo" 
        className="h-10 w-10 rounded-full object-cover" // h-10 w-10 + rounded-full
      />
      <h1 className="text-2xl font-bold text-foreground">GestioHub</h1>
    </div>
    <nav className="flex gap-8">
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
  </div>
</header>

      <main className="mx-auto max-w-7xl px-6 py-16">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-4xl font-bold text-foreground">Gestion d'Entreprise Simplifiée</h2>
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
      </main>
    </div>
  )
}
