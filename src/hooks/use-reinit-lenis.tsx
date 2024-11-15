'use client'

import { useEffect } from 'react'

declare global {
  interface Window {
    reinitLenis?: () => void;
  }
}
export function useReinitLenis() {
  useEffect(() => {
    if (typeof window !== 'undefined' && typeof window.reinitLenis === 'function') {
      window.reinitLenis()
    }
  }, [])
}
