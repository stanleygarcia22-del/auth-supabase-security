import './globals.css'
import { Navbar } from './components/Navbar'

export const metadata = {
  title: 'Sistema de Autenticación Segura',
  description: 'Next.js 16 + Supabase SSR',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-gray-50 text-gray-900">
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  )
}