"use client"

import { createContext, useContext, ReactNode } from "react"

interface MarketerContextValue {
  marketerId: string | null
  isFromProof: boolean
}

const MarketerContext = createContext<MarketerContextValue>({
  marketerId: null,
  isFromProof: false,
})

export function MarketerIdProvider({ 
  children, 
  marketerId,
  isFromProof = false,
}: { 
  children: ReactNode
  marketerId: string | null
  isFromProof?: boolean
}) {
  return (
    <MarketerContext.Provider value={{ marketerId, isFromProof }}>
      {children}
    </MarketerContext.Provider>
  )
}

export function useMarketerId() {
  const { marketerId } = useContext(MarketerContext)
  return marketerId
}

export function useMarketerContext() {
  return useContext(MarketerContext)
}
