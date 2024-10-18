import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]/route'

export async function GET(req) {
  console.log("Received request:", req.url)
  const session = await getServerSession(authOptions)
  console.log("Session:", JSON.stringify(session, null, 2))

  if (!session || !session.accessToken) {
    console.error("Unauthorized: No session or access token")
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const action = searchParams.get('action')
  console.log("Action:", action)

  try {
    if (action === 'getGA4Properties') {
      console.log("Fetching GA4 properties list...")

      // Include the filter parameter in the URL
      const filterValue = encodeURIComponent('display_name:Test Property')
      const response = await fetch(`https://analyticsadmin.googleapis.com/v1beta/properties?filter=${filterValue}`, {
        headers: {
          'Authorization': `Bearer ${session.accessToken}`,
          'Accept': 'application/json',
        },
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error(`Error response from GA API: ${response.status} ${response.statusText}`)
        console.error("Error details:", errorText)
        return NextResponse.json({ error: 'Failed to fetch GA4 properties' }, { status: response.status })
      }

      const data = await response.json()
      console.log("GA4 properties response:", JSON.stringify(data, null, 2))
      return NextResponse.json(data)

    } else {
      console.error("Invalid action:", action)
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 })
  }
}