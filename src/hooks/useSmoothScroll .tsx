'use client'

import { useEffect, useState, ReactNode } from 'react'
import Lenis from '@studio-freight/lenis'
import { usePathname } from 'next/navigation'

interface SmoothScrollWrapperProps {
  children: ReactNode
}

export default function SmoothScrollWrapper({ children }: SmoothScrollWrapperProps) {
  const pathname = usePathname()
  const [lenis, setLenis] = useState<Lenis | null>(null)

  useEffect(() => {
    const initLenis = () => {
      if (lenis) {
        lenis.destroy()
      }

      const newLenis = new Lenis({
        duration: 1.4,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        touchMultiplier: 2,
      })

      setLenis(newLenis)

      function raf(time: number) {
        newLenis.raf(time)
        requestAnimationFrame(raf)
      }

      requestAnimationFrame(raf)
    }

    // Initialize Lenis
    initLenis()

    // Cleanup function
    return () => {
      if (lenis) {
        lenis.destroy()
      }
    }
  }, [pathname]) // Re-run effect whenever `pathname` changes

  return <>{children}</>
}