"use client"
import React, { useEffect, useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react"
import { useRouter, usePathname } from 'next/navigation'
import TableOne from "../Tables/TableOne";
import ProjectHeader from "@/components/ProjectHeader";
import DataStatsOne from "@/components/DataStats/DataStatsOne";
import ChartOne from "@/components/Charts/ChartOne";
import { formatDistanceToNow } from 'date-fns';
import DefaultLayout from "../Layouts/DefaultLaout";
import Image from "next/image";
import { FcGoogle } from "react-icons/fc";
import { useProjectContext } from "@/helpers/ProjectContext";
import { useReinitLenis } from "@/hooks/use-reinit-lenis";


const ECommerce: React.FC = () => {
  useReinitLenis()
  const { data: session, status } = useSession()
  const router = useRouter()
  const pathname = usePathname()
  const [accessTokenGoogle, setAccessTokenGoogle] = useState("")
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    // console.log("Session status:", status)
    // console.log("Session data:", session)

    if (session) {
      localStorage.setItem('accessTokenGoogle', session?.accessToken);
      setAccessTokenGoogle(session?.accessToken)
      // console.log("Retrieved access token:", session.accessToken);
    }
  }, [session, status])



  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute
    return () => clearInterval(timer);
  }, []);

  const handleSignIn = () => {
    // console.log("Initiating Google sign-in...")
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
          <h1 className="text-2xl font-bold mb-4 flex gap-2 items-center">Connect to Google Search Console</h1>
          <button
            onClick={handleSignIn}
            className="bg-blue-500 flex items-center gap-2 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300"
          >
            Connect with <FcGoogle className="text-2xl bg-white rounded-full" />

          </button>
        </div>
      </DefaultLayout>
    )
  }

  return (
    <DefaultLayout>
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-black ">Google Search Console Dashboard</h1>
          <button
        onClick={() => {
          // console.log("Signing out...")
          signOut({ callbackUrl: pathname })
        }}
        className="bg-primary hover:bg-red-500 text-white font-bold py-1.5 px-4 rounded-md flex gap-2 items-center transition duration-300"
      >
        Disconnect From Google {session?.user?.name}
        <Image 
  src={session?.user?.image ?? '/images/user/user-20.png'}  // Replace with a valid fallback image path
  width={30}
  height={30}
  alt="te"
  className="rounded-full"
/>
      </button>
        </div>

      <div className="mb-4 w-full md:mt-6">
        <ProjectHeader  />
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