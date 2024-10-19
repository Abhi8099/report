'use client'

import React, { useEffect, useState } from 'react'
import { useSession, signIn, signOut } from "next-auth/react"
import { usePathname } from 'next/navigation'
import DefaultLayout from "@/components/Layouts/DefaultLaout"
import ProjectHeader from '@/components/ProjectHeader'
import Image from 'next/image'
import { FcGoogle } from 'react-icons/fc'

export default function Analytics() {
  const { data: session, status } = useSession()
  const pathname = usePathname()
  const [properties, setProperties] = useState([])
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (session) {
      fetchGA4Properties()
    }
  }, [session])

  useEffect(() => {
    // Listen for messages from the popup
    const handleMessage = (event: MessageEvent) => {
      if (event.data === 'signin-successful') {
        window.location.reload() // Reload the page to update the session
      }
    }

    window.addEventListener('message', handleMessage)

    return () => {
      window.removeEventListener('message', handleMessage)
    }
  }, [])

  const fetchGA4Properties = async () => {
    console.log("Fetching GA4 properties...")
    setError(null)
    setIsLoading(true)

    try {
      const res = await fetch('/api/analytics?action=getGA4Properties', {
        cache: 'force-cache',
        next: { revalidate: 60 } 
      })
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`)
      }

      const data = await res.json()
      setProperties(data.properties || [])
    } catch (error: any) {
      console.error('Error fetching GA4 properties:', error)
      setError(`Failed to fetch GA4 properties: ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  const handleConnect = async () => {
    console.log("Opening Google login popup...");6
    const callbackUrl = `${window.location.origin}${pathname}/google`;
  
    try {
      // Attempt to open the Google login page in a popup
      const popup = window.open(
        `/api/auth/signin/google?callbackUrl=${encodeURIComponent(callbackUrl)}`,
        'google-signin-popup',
        'width=500,height=600'
      );
  
      if (!popup) {
        throw new Error("Popup blocked or failed to open.");
      }
      const interval = setInterval(() => {
        if (popup.closed) {
          clearInterval(interval);
          console.log("Popup closed.");
        }
      }, 1000);
    } catch (error:any) {
      console.error(error.message);
      alert('Please allow popups for this site to log in with Google.');
    }
  };
  

  if (status === "loading") {
    return (
      <DefaultLayout>
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          <span className="ml-2 text-primary">Loading session...</span>
        </div>
      </DefaultLayout>
    )
  }

  if (!session) {
    return (
      <DefaultLayout>
        <div className="flex flex-col items-center justify-center min-h-[80vh] bg-gray-100">
          <h1 className="text-2xl font-bold mb-4">Connect to Google Analytics</h1>
          <button
            onClick={handleConnect}
            className="bg-blue-500 hover:bg-blue-600 flex items-center gap-2 text-white font-bold py-2 px-4 rounded transition duration-300"
          >
            Connect with <FcGoogle className="text-2xl bg-white rounded-full" />
          </button>
        </div>
      </DefaultLayout>
    )
  }

  if (isLoading) {
    return (
      <DefaultLayout>
        <div className="flex justify-center items-center min-h-[80vh]">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          <span className="ml-2 text-primary">Loading properties...</span>
        </div>
      </DefaultLayout>
    )
  }

  return (
    <DefaultLayout>
      <div className="flex flex-col space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Google Analytics Dashboard</h1>
          <button
            onClick={() => {
              console.log("Signing out...")
              signOut({ callbackUrl: pathname })
            }}
            className="bg-primary hover:bg-red-500 text-white font-bold py-1.5 px-4 rounded-md flex gap-2 items-center transition duration-300"
          >
            Disconnect From Google {session?.user?.name}
            <Image
              src={session?.user?.image ?? '/images/user/user-20.png'} 
              width={30}
              height={30}
              alt="user avatar"
              className="rounded-full"
            />
          </button>
        </div>

        <div className="mb-4 w-full md:mt-6">
          <ProjectHeader />
        </div>
      </div>
    </DefaultLayout>
  )
}