"use client"

import axios from "axios"
import { useSession, signIn, signOut } from "next-auth/react"
import { useEffect, useState } from "react"

export default function SearchConsoleData() {
  const { data: session, status } = useSession()
  const [sites, setSites] = useState([])
  const [selectedSite, setSelectedSite] = useState("")
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [accessTokenGoogle, setaccessTokenGoogle] = useState("")

  useEffect(() => {
    // console.log("Session status:", status)
    // console.log("Session data:", session)


    if (session) {
      fetchSites()
      localStorage.setItem('accessTokenGoogle',session?.accessToken );
      setaccessTokenGoogle(session?.accessToken)
      // console.log("Retrieved access token:", session.accessToken);
    }
  }, [session, status])

  const fetchSites = async () => {
    setLoading(true)
    setError(null)
    // console.log("Fetching sites...")
    try {
      const res = await fetch('/api/search-console?action=getSites')
      // console.log("Sites API response status:", res.status)
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`)
      }
      const data = await res.json()
      // console.log("Sites data:", data)
      setSites(data.siteEntry || [])
    } catch (error) {
      console.error('Error fetching sites:', error)
      setError(`Failed to fetch sites: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }


  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = {
        // id: "270075587",
        "site_url": selectedSite,
        "access_token": accessTokenGoogle ,
        "start_date": "2024-09-01",
        "end_date": "2024-10-02",
    };

    
    try {
    // console.log(formData);
        const response = await axios.post(
            `http://192.168.211.33:8000/api/gsc-data/`,
            // "http://192.168.211.62:8000/api/gsc-data/",
            formData,
            {
                headers: {
                    "Content-Type": "application/json",
                    // "Authorization": `Bearer ${accessTokenGoogle}` 
                },
            }
        );
        if (response.status === 200) {
            // Success feedback
            // console.log("Form submitted successfully", response.data);
        }
    } catch (error) {
        if (error.response) {
            console.error("Error response:", error.response.data);
        } else if (error.request) {
            console.error("No response from server:", error.request);
        } else {
            console.error("Error in setting up the request:", error.message);
        }
    }
};


  const fetchData = async () => {
    if (!selectedSite) return
    setLoading(true)
    setError(null)
    // console.log("Fetching data for site:", selectedSite)
    try {
      const res = await fetch(`/api/search-console?action=getData&siteUrl=${encodeURIComponent(selectedSite)}`)
      // console.log("Data API response status:", res.status)
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`)
      }
      const data = await res.json()
      // console.log("Fetched data:", data)
      setData(data)
    } catch (error) {
      console.error('Error fetching data:', error)
      setError(`Failed to fetch data: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  if (status === "loading") {
    return <div className="flex justify-center items-center h-screen">Loading session...</div>
  }

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <h1 className="text-2xl font-bold mb-4">Connect to Google Search Console</h1>
        <button
          onClick={() => {
            // console.log("Initiating Google sign-in...")
            signIn('google', {
              callbackUrl: `${window.location.origin}/api/auth/callback/google`,
            })
          }}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300"
        >
          Sign in with Google
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">Google Search Console Data</h1>
      <p className="text-gray-600 mb-4">Select a site to view its data</p>
      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <select
            className="w-64 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={selectedSite}
            onChange={(e) => setSelectedSite(e.target.value)}
          >
            <option value="">Select a site</option>
            {sites.map((site) => (
              <option key={site.siteUrl} value={site.siteUrl}>
                {site.siteUrl}
              </option>
            ))}
          </select>
          <button
            onClick={fetchData}
            disabled={!selectedSite || loading}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Fetch Data
          </button>
          <button
            onClick={handleSubmit}
            disabled={!selectedSite || loading}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Fetch Data Via Api
          </button>
        </div>
        <button
          onClick={() => {
            // console.log("Signing out...")
            signOut()
          }}
          className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition duration-300"
        >
          Sign out
        </button>
      </div>

      {loading && <p className="mt-4">Loading...</p>}
      {error && <p className="mt-4 text-red-500">{error}</p>}

      {data && (
        <div className="mt-4">
          <h2 className="text-xl font-semibold mb-2">Search Console Data for {selectedSite}</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-96 text-sm">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      )}

      <div className="mt-4">
        <h2 className="text-xl font-semibold mb-2">Debug Information</h2>
        <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-96 text-sm">
          {JSON.stringify({ session, sites, selectedSite, loading, error }, null, 2)}
        </pre>
      </div>
    </div>
  )
}