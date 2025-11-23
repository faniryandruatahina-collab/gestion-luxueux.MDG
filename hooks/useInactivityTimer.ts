'use client'

import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'

export function useInactivityTimer(timeoutMinutes: number = 30) {
  const router = useRouter()
  const timerRef = useRef<NodeJS.Timeout>()

  const resetTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
    }
    
    // 30 minutes par défaut (1800000 ms)
    const timeoutMs = timeoutMinutes * 60 * 1000
    
    timerRef.current = setTimeout(() => {
      // Vérifier si l'utilisateur est authentifié
      const auth = localStorage.getItem('adminAuth')
      if (auth) {
        localStorage.removeItem('adminAuth')
        localStorage.removeItem('adminLoginTime')
        router.push('/admin')
      }
    }, timeoutMs)
  }

  useEffect(() => {
    // Événements qui reset le timer
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart']
    
    const handleActivity = () => {
      resetTimer()
    }

    // Ajouter les écouteurs d'événements
    events.forEach(event => {
      document.addEventListener(event, handleActivity)
    })

    // Démarrer le timer initial
    resetTimer()

    // Nettoyage
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
      events.forEach(event => {
        document.removeEventListener(event, handleActivity)
      })
    }
  }, [timeoutMinutes, router])

  return { resetTimer }
}
