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
      <body className={`font-sans antialiased flex flex-col min-h-screen`}>
        {/* Contenu principal avec padding pour header/footer fixes */}
        <main className="flex-1 pt-16 pb-20"> {/* pt-16 pour header, pb-20 pour footer */}
          {children}
        </main>
        
        {/* VOTRE SIGNATURE EN BAS - FIXE */}
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
