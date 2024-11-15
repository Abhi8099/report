"use client"
import DefaultLayout from '@/components/Layouts/DefaultLaout'
import React from 'react'
import { useSession, signIn, signOut } from "next-auth/react"
import { useRouter, usePathname } from 'next/navigation'
import Image from "next/image";
import ProjectHeader from '@/components/ProjectHeader';
import { FcGoogle } from 'react-icons/fc'
import { useProjectContext } from '@/helpers/ProjectContext'


const Dashboard = () => {
  const {
    projects,
    loading,
  } = useProjectContext();
  const { data: session, status } = useSession()
  const pathname = usePathname()


  const handleSignIn = () => {
    console.log("Initiating Google sign-in...")
    const callbackUrl = `${window.location.origin}${pathname}`
    signIn('google', { callbackUrl })
  }


  return (
    <DefaultLayout>
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold ">Dashboard</h1>

          {session?
                    <button
                    onClick={() => {
                      console.log("Signing out...")
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
          :        <div className="flex flex-col items-center justify-center bg-gray-100">
          <button
            onClick={handleSignIn}
            className="bg-blue-500 flex items-center gap-2 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300"
          >
            Connect with <FcGoogle className="text-2xl bg-white rounded-full" />

          </button>
        </div>
          }

        </div>

      <div className="mb-4 w-full md:mt-6">
        <ProjectHeader  />
      </div>
    </DefaultLayout>
  )
}

export default Dashboard
