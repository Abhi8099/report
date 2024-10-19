import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import  {authOptions} from '../auth/[...nextauth]/auth'

export async function GET(req:any) {
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

      // Step 1: Fetch list of accounts associated with the logged-in Google account
      const accountsResponse = await fetch(`https://analyticsadmin.googleapis.com/v1beta/accounts`, {
        headers: {
          'Authorization': `Bearer ${session.accessToken}`,
          'Accept': 'application/json',
        },
      })

      if (!accountsResponse.ok) {
        const errorText = await accountsResponse.text()
        console.error(`Error response from GA Accounts API: ${accountsResponse.status} ${accountsResponse.statusText}`)
        console.error("Error details:", errorText)
        return NextResponse.json({ error: 'Failed to fetch accounts' }, { status: accountsResponse.status })
      }

      const accountsData = await accountsResponse.json()
      const accounts = accountsData.accounts || []

      if (accounts.length === 0) {
        return NextResponse.json({ message: 'No Google Analytics accounts found' }, { status: 404 })
      }

      console.log("Accounts found:", JSON.stringify(accounts, null, 2))

      // Step 2: Fetch properties for each account
      const allProperties = []

      for (const account of accounts) {
        const accountId = account.name // Format is "accounts/{accountId}"
        console.log(`Fetching properties for account: ${accountId}`)

        const propertiesResponse = await fetch(`https://analyticsadmin.googleapis.com/v1beta/properties?filter=parent:${accountId}`, {
          headers: {
            'Authorization': `Bearer ${session.accessToken}`,
            'Accept': 'application/json',
          },
        })

        if (!propertiesResponse.ok) {
          const errorText = await propertiesResponse.text()
          console.error(`Error response from GA Properties API for account ${accountId}: ${propertiesResponse.status} ${propertiesResponse.statusText}`)
          console.error("Error details:", errorText)
          continue // Skip to the next account if there is an issue fetching properties
        }

        const propertiesData = await propertiesResponse.json()
        const properties = propertiesData.properties || []
        allProperties.push(...properties)
      }

      if (allProperties.length === 0) {
        return NextResponse.json({ message: 'No GA4 properties found' }, { status: 404 })
      }

      console.log("GA4 properties response:", JSON.stringify(allProperties, null, 2))

      // Extract property IDs (project IDs) and return them
      const projectIds = allProperties.map(prop => prop.name)

      return NextResponse.json({ projectIds, properties: allProperties })

    } else {
      console.error("Invalid action:", action)
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }
  } catch (error:any) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 })
  }
}


