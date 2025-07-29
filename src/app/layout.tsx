import type { Metadata } from 'next'
import localFont from 'next/font/local'
import './globals.css'
import { Nunito } from 'next/font/google'
import { Toaster } from './_components/ui/sonner'
import { Footer } from './_components/Footer'

const geistSans = localFont({
  src: './_fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
})
const geistMono = localFont({
  src: './_fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
})

const nunito = Nunito({
  subsets: ['latin'],
  weight: ['200', '400', '600', '700'],
  variable: '--font-nunito',
})

export const metadata: Metadata = {
  title: 'Barbershop',
  description:
    'Sistema moderno com agendamentos online. Cortes, barbas e tratamentos profissionais.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${nunito.variable} bg-background font-nunito text-foreground antialiased`}
      >
        {children}
        <Footer />
        <Toaster />
      </body>
    </html>
  )
}
