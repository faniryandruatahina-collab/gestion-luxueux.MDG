import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Luxueux.MDG',
  description: 'Application complète de gestion des clients, commandes et finances',
  icons: {
    icon: '/logo.jpg',
    apple: '/logo.jpg',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr">
      <body className={`font-sans antialiased`}>
        {/* HEADER FIXE */}
        <header className="fixed top-0 left-0 right-0 border-b border-border bg-card z-50">
          <div className="mx-auto flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-3">
              <img 
                src="/logo.jpg"
                alt="Luxueux.MDG Logo" 
                className="h-10 w-10 rounded-lg object-cover"
              />
              <h1 className="text-2xl font-bold text-foreground">Luxueux.MDG</h1>
            </div>
            <nav className="flex gap-8">
              <a href="/" className="text-foreground hover:text-accent transition-colors">
                Accueil
              </a>
              <a href="/clients" className="text-foreground hover:text-accent transition-colors">
                Clients
              </a>
              <a href="/orders" className="text-foreground hover:text-accent transition-colors">
                Commandes
              </a>
              <a href="/dashboard" className="text-foreground hover:text-accent transition-colors">
                Tableau de bord
              </a>
            </nav>
          </div>
        </header>

        {/* CONTENU PRINCIPAL AVEC PADDING */}
        <main className="pt-20 pb-16 min-h-screen"> {/* pt-20 pour header, pb-16 pour footer */}
          {children}
        </main>
        
        {/* FOOTER FIXE */}
        <footer className="fixed bottom-0 left-0 right-0 border-t border-border bg-card py-3 z-40">
          <div className="mx-auto max-w-7xl px-6">
            <div className="flex flex-col sm:flex-row justify-between items-center">
              <div className="text-sm text-muted-foreground">
                © 2024 Luxueux.MDG. Tous droits réservés.
              </div>
              <div className="text-sm text-muted-foreground mt-2 sm:mt-0">
                Développé par <span className="text-accent font-medium">Votre Nom</span>
              </div>
            </div>
          </div>
        </footer>
        
        <Analytics />
      </body>
    </html>
  )
}
