import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { Playfair_Display } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Toaster } from "@/components/ui/toaster"
import { Suspense } from "react"
import { AuthProvider } from "@/lib/auth-context"
import { Chatbot } from "@/components/chatbot"
import { ThemeProvider } from "@/lib/theme-provider"
import { Breadcrumbs } from "@/components/breadcrumbs"

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Biblioverso - Tu Universo de Libros",
  description: "Explora, reserva y disfruta de miles de libros en nuestra biblioteca digital",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`font-sans ${GeistSans.variable} ${playfair.variable}`}>
        <ThemeProvider defaultTheme="system" storageKey="biblioverso-theme">
          <AuthProvider>
            <Suspense fallback={<div>Loading...</div>}>
              <Header />
              <Breadcrumbs />
              <main className="min-h-screen">{children}</main>
              <Footer />
              <Toaster />
              <Chatbot />
            </Suspense>
          </AuthProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
