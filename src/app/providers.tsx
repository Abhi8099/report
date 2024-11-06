'use client'

import { usePathname } from 'next/navigation';
import { SessionProvider } from 'next-auth/react';
import { GoogleSearchConsoleDataProvider } from "@/helpers/GoogleSearchConsoleDataContext"
import { Toaster } from 'react-hot-toast';
import { GoogleAnalyticsDataProvider } from "@/helpers/GoogleAnalyticsDataContext";
import { ProjectProvider } from "@/helpers/ProjectContext";
import { ProfileProvider } from "@/helpers/ProfileContext";
import React , { useEffect, useRef } from 'react'
import gsap from 'gsap-trial/dist/gsap';
import { ScrollTrigger } from 'gsap-trial/dist/ScrollTrigger';
import { ScrollSmoother } from 'gsap-trial/dist/ScrollSmoother';
import useIsomorphicLayoutEffect from '../helpers/isomorphicEffect';
import Lenis from '@studio-freight/lenis';

export default function Providers({ children }: { children: React.ReactNode }) {
  // const smoother:any = useRef();
  // const ctx:any = useRef();
  // const pathname = usePathname();

  // useIsomorphicLayoutEffect(() => {
  //   gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

  //   ctx.current = gsap.context(() => {
  //     smoother.current = ScrollSmoother.create({
  //       smooth: 2,
  //       effects: true,
  //     });
  //   });

  //   return () => ctx.current.revert();
  // }, [pathname]);


  const pathname = usePathname();

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      touchMultiplier: 2,
    })

    function raf(time: number) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)

    return () => {
      lenis.destroy()
    }
  }, [pathname])
  

  return <>  <SessionProvider>
    <Toaster />
    <ProfileProvider>
      <ProjectProvider>
        <GoogleAnalyticsDataProvider>
          <GoogleSearchConsoleDataProvider>

            {children}

          </GoogleSearchConsoleDataProvider>
        </GoogleAnalyticsDataProvider>
      </ProjectProvider>
    </ProfileProvider>
  </SessionProvider></>

}