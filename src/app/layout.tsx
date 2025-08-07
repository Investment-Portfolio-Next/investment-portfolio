import type { Metadata } from 'next'
import { Open_Sans } from 'next/font/google'
import '../styles/globals.scss'
import { QueryProvider } from '@/providers/QueryProvider'

const openSans = Open_Sans({
    subsets: ['latin', 'cyrillic'],
    weight: ['400', '600', '700', '800'],
    variable: '--font-open-sans', // CSS-переменная для шрифта
    display: 'swap', // параметр для производительности
})

export const metadata: Metadata = {
    title: 'Investing Portfolio',
    description: 'Manage portfolios, trades, and quotes in one investment tracking app',
    icons: {
        icon: '/assets/favicon.png', // или .png
    },
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en">
            <body className={`${openSans.variable} antialiased`}>
                <QueryProvider>{children}</QueryProvider>
            </body>
        </html>
    )
}
