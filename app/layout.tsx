import type { Metadata } from 'next'
import './globals.css'
import Nav from '@/components/Nav'
import { StoreProvider } from '@/lib/store'

export const metadata: Metadata = {
  title: 'MaBoule · Gestion bénévoles',
  description: 'Gestion des bénévoles pour le festival MaBoule à Genappe',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <StoreProvider>
          <div className="flex min-h-screen">
            <Nav />
            <main className="flex-1 p-8 overflow-auto">
              {children}
            </main>
          </div>
        </StoreProvider>
      </body>
    </html>
  )
}
