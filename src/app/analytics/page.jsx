"use client"

import React, { useEffect, useState } from 'react'
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import { useSession, signIn, signOut } from "next-auth/react"




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
  const [error, setError] = useState(null)
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
    } catch (error) {
      console.error('Error fetching GA4 properties:', error)
      setError(`Failed to fetch GA4 properties: ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }
  
  return (
    <DefaultLayout >

  </DefaultLayout>
  )
}

export default Analytics
