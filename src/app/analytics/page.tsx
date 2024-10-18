"use client"

import React, { useEffect, useState } from 'react'
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import { useSession, signIn, signOut } from "next-auth/react"
import ProjectHeader from '@/components/ProjectHeader';
import { usePathname } from 'next/navigation';



const Analytics = () => {
  const { data: session, status } = useSession()
  useEffect(() => {
    console.log("Session status:", status)
    console.log("Session data:", session)
    if(session){
      fetchGA4Properties()
    }

  }, [session, status])


  const [properties, setProperties] = useState([])
  const [error, setError] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)

  const fetchGA4Properties = async () => {
    console.log("Fetching GA4 properties...")
    setError(null)
    setIsLoading(true)

    try {
      const res = await fetch('/api/analytics?action=getGA4Properties')
      console.log("GA4 Properties API response status:", res.status)

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`)
      }

      const data = await res.json()
      console.log("GA4 Properties data:", data)

      setProperties(data.properties || [])
    } catch (error:any) {
      console.error('Error fetching GA4 properties:', error)
      setError(`Failed to fetch GA4 properties: ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }
  const pathname = usePathname()

  const handleSignIn = () => {
    console.log("Initiating Google sign-in...")
    const callbackUrl = `${window.location.origin}${pathname}`
    signIn('google', { callbackUrl })
  }

  if (status === "loading") {
    return <div className="flex justify-center items-center h-screen">Loading session...</div>
  }

  if (!session) {
    return (
      <DefaultLayout>
        <div className="flex flex-col items-center justify-center min-h-[80vh] bg-gray-100">
          <h1 className="text-2xl font-bold mb-4">Connect to Google Analytics</h1>
          <button
            onClick={handleSignIn}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300"
          >
            Connect with Google
          </button>
        </div>
      </DefaultLayout>
    )
  }
  
  return (
    <DefaultLayout >
      <button
        onClick={() => {
          console.log("Signing out...")
          signOut({ callbackUrl: pathname })
        }}
        className="bg-primary hover:bg-red-500 text-white font-bold py-2 px-4 rounded transition duration-300"
      >
        Disconnect From Google {session?.user?.name}
      </button>

      <div className="mb-4 w-full md:mt-6">
        <ProjectHeader  />
      </div>



  </DefaultLayout>
  )
}

export default Analytics
