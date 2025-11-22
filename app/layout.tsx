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
    icon: '/logo.jpg', // ← METTEZ LE VRAI NOM DE VOTRE FICHIER
    apple: '/logo.jpg', // ← METTEZ LE VRAI NOM DE VOTRE FICHIER
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
        {children}
        <Analytics />
      </body>
    </html>
  )
}
