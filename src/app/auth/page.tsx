'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { Loader2 } from 'lucide-react'

export default function AuthCallback() {
    const { data: session, status } = useSession()
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (status === 'loading') {
                setError('Authentication is taking longer than expected. Please try again.')
            }
        }, 10000) // 10 seconds timeout

        return () => clearTimeout(timeoutId)
    }, [status])

    useEffect(() => {
        if (status === 'authenticated') {
            if (window.opener) {
                window.opener.postMessage('signin-successful', window.location.origin)
                window.close()
            } else {
                window.location.href = '/'
            }
        } else if (status === 'unauthenticated') {
            setError('Authentication failed. Please try again.')
        }
    }, [status])

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
                <div className="bg-white p-8 rounded-lg shadow-md text-center">
                    <h1 className="text-2xl font-bold text-red-600 mb-4">Authentication Error</h1>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <button
                        onClick={() => window.close()}
                        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300"
                    >
                        Close Window
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
                <h1 className="text-2xl font-bold mb-4">Authenticating...</h1>
                <Loader2 className="animate-spin h-8 w-8 text-blue-500 mx-auto" />
                <p className="text-gray-600 mt-4">Please wait while we complete the authentication process.</p>
            </div>
        </div>
    )
}