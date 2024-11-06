'use client'

import { usePathname } from 'next/navigation';
import { SessionProvider } from 'next-auth/react';
import { GoogleSearchConsoleDataProvider } from "@/helpers/GoogleSearchConsoleDataContext"
import { Toaster } from 'react-hot-toast';
import { GoogleAnalyticsDataProvider } from "@/helpers/GoogleAnalyticsDataContext";
import { ProjectProvider } from "@/helpers/ProjectContext";
import { ProfileProvider } from "@/helpers/ProfileContext";
import React , { useRef } from 'react'
import gsap from 'gsap-trial/dist/gsap';
import { ScrollTrigger } from 'gsap-trial/dist/ScrollTrigger';
import { ScrollSmoother } from 'gsap-trial/dist/ScrollSmoother';
import useIsomorphicLayoutEffect from '../helpers/isomorphicEffect';

export default function Providers({ children }: { children: React.ReactNode }) {
  const smoother:any = useRef();
  const ctx:any = useRef();
  const pathname = usePathname();

  useIsomorphicLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

    ctx.current = gsap.context(() => {
      smoother.current = ScrollSmoother.create({
        smooth: 2,
        effects: true,
      });
    });

    return () => ctx.current.revert();
  }, [pathname]);


  return <>  <SessionProvider>
    <Toaster />
    <ProfileProvider>
      <ProjectProvider>
        <GoogleAnalyticsDataProvider>
          <GoogleSearchConsoleDataProvider>
          <div id="smooth-wrapper">
          <div id="smooth-content">
            {children}
            </div>
            </div>
          </GoogleSearchConsoleDataProvider>
        </GoogleAnalyticsDataProvider>
      </ProjectProvider>
    </ProfileProvider>
  </SessionProvider></>

}