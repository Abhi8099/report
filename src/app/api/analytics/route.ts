import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/auth';

export async function GET(req: any) {
  // Step 1: Log the request details
  console.log("Received request:", req.url);

  // Step 2: Retrieve and log the session details
  const session = await getServerSession(authOptions);
  console.log("Session data:", JSON.stringify(session, null, 2));

  // Step 3: Handle missing session or access token
  if (!session || !session.accessToken) {
    console.error("Unauthorized: No session or access token");
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Step 4: Extract search parameters from the request URL
  const { searchParams } = new URL(req.url);
  const action = searchParams.get('action');
  console.log("Action parameter:", action);

  try {
    // Step 5: Check if action is 'getGA4Properties'
    if (action === 'getGA4Properties') {
      console.log("Fetching GA4 properties list...");

      // Step 6: Fetch Google Analytics accounts
      const accountsResponse = await fetch('https://analyticsadmin.googleapis.com/v1beta/accounts', {
        headers: {
          'Authorization': `Bearer ${session.accessToken}`,
          'Accept': 'application/json',
        },
      });

      // Step 7: Handle account fetch failure
      if (!accountsResponse.ok) {
        const errorText = await accountsResponse.text();
        console.error(`Error fetching accounts: ${accountsResponse.status} ${accountsResponse.statusText}`);
        console.error("Error details:", errorText);
        return NextResponse.json({ error: 'Failed to fetch accounts' }, { status: accountsResponse.status });
      }

      // Step 8: Parse and log the fetched account data
      const accountsData = await accountsResponse.json();
      const accounts = accountsData.accounts || [];
      console.log("Accounts fetched:", JSON.stringify(accounts, null, 2));

      if (accounts.length === 0) {
        return NextResponse.json({ message: 'No Google Analytics accounts found' }, { status: 404 });
      }

      // Step 9: Fetch properties for each account
      const allProperties = [];
      for (const account of accounts) {
        const accountId = account.name;
        console.log(`Fetching properties for account: ${accountId}`);

        // Fetch properties for the current account
        const propertiesResponse = await fetch(`https://analyticsadmin.googleapis.com/v1beta/properties?filter=parent:${accountId}`, {
          headers: {
            'Authorization': `Bearer ${session.accessToken}`,
            'Accept': 'application/json',
          },
        });

        // Step 10: Handle property fetch failure for individual accounts
        if (!propertiesResponse.ok) {
          const errorText = await propertiesResponse.text();
          console.error(`Error fetching properties for account ${accountId}: ${propertiesResponse.status} ${propertiesResponse.statusText}`);
          console.error("Error details:", errorText);
          continue; // Skip to the next account if there is an error
        }

        // Parse and log the fetched properties data
        const propertiesData = await propertiesResponse.json();
        const properties = propertiesData.properties || [];
        allProperties.push(...properties);
        console.log(`Properties for account ${accountId}:`, JSON.stringify(properties, null, 2));
      }

      // Step 11: Handle the case where no properties were found
      if (allProperties.length === 0) {
        return NextResponse.json({ message: 'No GA4 properties found' }, { status: 404 });
      }

      // Step 12: Log and return the fetched properties
      console.log("GA4 properties found:", JSON.stringify(allProperties, null, 2));
      const projectIds = allProperties.map(prop => prop.name);

      return NextResponse.json({ projectIds, properties: allProperties });

    } else {
      // Step 13: Handle invalid actions
      console.error("Invalid action received:", action);
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error: any) {
    // Step 14: Log any caught errors
    console.error('Error occurred:', error);
    return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 });
  }
}
