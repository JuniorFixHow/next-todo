import AuthProvider from '@/components/AuthProvider/AuthProvider'
import './globals.css'
import { Inter } from 'next/font/google'
import Header from '@/components/header/Header'
import { ThemeContextProvider } from '@/context/ThemeContext'
import Footer from '@/components/footer/Footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: "Junior's Todo",
  description: 'Create a todo to simplify activities',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeContextProvider>
          <AuthProvider>
            <Header />
            {children}
            <Footer />
          </AuthProvider>
        </ThemeContextProvider>
        </body>
    </html>
  )
}
