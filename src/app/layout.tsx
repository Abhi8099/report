"use client";
import "jsvectormap/dist/css/jsvectormap.css";
import "flatpickr/dist/flatpickr.min.css";
import "@/css/satoshi.css";
import "@/css/style.css";
import React, { useEffect, useState } from "react";
import { SessionProvider } from 'next-auth/react';
import Loader from "@/components/common/Loader";
import { GoogleSearchConsoleDataProvider } from "@/helpers/GoogleSearchConsoleDataContext"
import { Toaster } from 'react-hot-toast';
import { GoogleAnalyticsDataProvider } from "@/helpers/GoogleAnalyticsDataContext";
import { ProjectProvider } from "@/helpers/ProjectContext";
import { ProfileProvider } from "@/helpers/ProfileContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);

  // const pathname = usePathname();

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return (
    <SessionProvider>
    <html lang="en">
      <body suppressHydrationWarning={true}>
      <Toaster />
      <ProfileProvider>
      <ProjectProvider>
      <GoogleAnalyticsDataProvider>
<GoogleSearchConsoleDataProvider>
        {loading ? <Loader /> : children}
        </GoogleSearchConsoleDataProvider>
        </GoogleAnalyticsDataProvider>
        </ProjectProvider>
        </ProfileProvider>
      </body>
    </html>
    </SessionProvider>
  );
}
