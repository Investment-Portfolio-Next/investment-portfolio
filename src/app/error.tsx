'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/ui/button/Button'

interface ErrorPageProps {
    error: Error
    reset: () => void
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
    const router = useRouter()
    const message = error.message

    const canRetry = message.includes('Network error') || message.includes('Server error')

    const handleHome = () => {
        window.location.href = '/portfolio'
    }

    const handleBack = () => {
        router.back()
    }

    return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-6 text-center bg-black/80">
            <h1 className="text-2xl text-white/80 text-center mb-6">{message}</h1>

            <div className="flex gap-3">
                {canRetry && (
                    <Button type="button" onClick={reset} variant="primaryTransparent">
                        Try again
                    </Button>
                )}

                <Button type="button" onClick={handleBack} variant="primaryTransparent">
                    Go back
                </Button>

                <Button type="button" onClick={handleHome} variant="primaryTransparent">
                    Home!!
                </Button>
            </div>

            {process.env.NODE_ENV === 'development' && (
                <div className="mt-4 text-left text-xs text-red-500">
                    {JSON.stringify({ message: message, stack: error.stack }, null, 2)}
                </div>
            )}
        </div>
    )
}
