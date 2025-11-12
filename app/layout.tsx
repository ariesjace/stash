// app/layout.tsx
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import { UserProvider } from "@/contexts/UserContext"

// Import ClientLayout (needs to be client component)
import ClientLayout from "@/components/client-layout"

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] })
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Stash - IT Asset Management System",
  description: "Localized IT Asset Management System built with Next.js and Tailwind CSS",
  icons: {
    icon: "/stash-mini.png",
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#333333" media="(prefers-color-scheme: dark)" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {/* Wrap children with ClientLayout */}
          <UserProvider><ClientLayout>{children}</ClientLayout></UserProvider>

          <Toaster richColors />
        </ThemeProvider>
      </body>
    </html>
  )
}
