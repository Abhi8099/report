"use client"
import React, { useEffect, useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react"
import { useRouter, usePathname } from 'next/navigation'
import TableOne from "../Tables/TableOne";
import ProjectHeader from "../ProjectHeader";
import DataStatsOne from "@/components/DataStats/DataStatsOne";
import ChartOne from "@/components/Charts/ChartOne";
import { formatDistanceToNow } from 'date-fns';
import DefaultLayout from "../Layouts/DefaultLaout";

const ECommerce: React.FC = () => {
  const { data: session, status } = useSession()
  const router = useRouter()
  const pathname = usePathname()
  const [accessTokenGoogle, setAccessTokenGoogle] = useState("")
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    console.log("Session status:", status)
    console.log("Session data:", session)

    if (session) {
      localStorage.setItem('accessTokenGoogle', session?.accessToken);
      setAccessTokenGoogle(session?.accessToken)
      console.log("Retrieved access token:", session.accessToken);
    }
  }, [session, status])



  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute
    return () => clearInterval(timer);
  }, []);

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
          <h1 className="text-2xl font-bold mb-4">Connect to Google Search Console</h1>
          <button
            onClick={handleSignIn}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300"
          >
            Sign in with Google
          </button>
        </div>
      </DefaultLayout>
    )
  }

  return (
    <DefaultLayout>
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
      <div className="mb-4 flex items-center w-full justify-between px-4 md:mt-6">
        <h3 className="text-2xl font-semibold text-black dark:text-white">Google search console:</h3>
        <h3 className="text-sm font-semibold">Last update: {formatDistanceToNow(currentTime, { addSuffix: true })}</h3>
      </div>
      <div className='bg-white dark:bg-gray-dark p-7 rounded-[10px]'>
        <DataStatsOne />
      </div>

      <div className="mt-4 w-full gap-4 md:mt-6 md:gap-6 2xl:mt-9 2xl:gap-7.5">
        <ChartOne />

        <div className="col-span-12 xl:col-span-8 mt-8">
          <TableOne />
        </div>
      </div>
    </DefaultLayout>
  );
};

export default ECommerce;