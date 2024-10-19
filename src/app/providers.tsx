'use client'

import { SessionProvider } from 'next-auth/react';
import { GoogleSearchConsoleDataProvider } from "@/helpers/GoogleSearchConsoleDataContext"
import { Toaster } from 'react-hot-toast';
import { GoogleAnalyticsDataProvider } from "@/helpers/GoogleAnalyticsDataContext";
import { ProjectProvider } from "@/helpers/ProjectContext";
import { ProfileProvider } from "@/helpers/ProfileContext";
import React from 'react'

export default function Providers({children }: {children :React.ReactNode}) {
return     <SessionProvider>
<Toaster />
<ProfileProvider>
<ProjectProvider>
<GoogleAnalyticsDataProvider>
<GoogleSearchConsoleDataProvider>
{ children}
  </GoogleSearchConsoleDataProvider>
  </GoogleAnalyticsDataProvider>
  </ProjectProvider>
  </ProfileProvider>
</SessionProvider>

}