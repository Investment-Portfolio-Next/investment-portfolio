type ProtectedRoutes = {
    PORTFOLIO: string
    ANALYTICS: string
    PROFILE: string
    TRANSACTIONS: string
    TRANSACTION: (id: string) => string
    SETUP: string
    QUOTES: string
}

type PublicRoutes = {
    HOME: string
    TARIFFS: string
    CONTACTS: string
    DEMO: string
}

export const PROTECTED_PAGE: ProtectedRoutes = {
    PORTFOLIO: '/portfolio',
    ANALYTICS: '/portfolio/analytics',
    PROFILE: '/portfolio/profile',
    TRANSACTIONS: '/portfolio/transactions',
    TRANSACTION: (id: string) => `/portfolio/transactions/${id}`, // if special symbols will be used - to change for `/portfolio/transactions/${encodeURIComponent(id)}`
    SETUP: '/portfolio/setup', // temp not used
    QUOTES: '/portfolio/quotes', // temp not used
}

export const PUBLIC_PAGE: PublicRoutes = {
    HOME: '/',
    TARIFFS: '/tariffs',
    CONTACTS: '/contacts',
    DEMO: '/portfolio', // temp path as the authorization is not implemented
}
