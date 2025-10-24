'use client'

import { useState, useEffect, useContext, createContext, useRef } from 'react'
import dynamic from 'next/dynamic'

// Create a context for drag state
export const DragContext = createContext<{
  isDragging: boolean
  setIsDragging: (value: boolean) => void
}>({
  isDragging: false,
  setIsDragging: () => {}
})

const DraggableChartWrapper = dynamic(() => import('./DraggableChartWrapper'), { 
  ssr: false,
  loading: () => (
    <div className="h-full bg-black flex items-center justify-center">
      <div className="text-gray-500 text-xs">Loading chart...</div>
    </div>
  )
})

interface SafeDraggableChartProps {
  currentSymbol: string
  symbolName: string
  showHeader?: boolean
}

export default function SafeDraggableChart({ 
  currentSymbol, 
  symbolName, 
  showHeader = false 
}: SafeDraggableChartProps) {
  const { isDragging } = useContext(DragContext)
  const [chartVisible, setChartVisible] = useState(true)
  const mountedRef = useRef(true)

  useEffect(() => {
    return () => {
      mountedRef.current = false
    }
  }, [])

  useEffect(() => {
    let timeout: NodeJS.Timeout

    if (isDragging) {
      // Hide chart immediately when dragging starts
      setChartVisible(false)
    } else {
      // Show chart after drag ends
      timeout = setTimeout(() => {
        if (mountedRef.current) {
          setChartVisible(true)
        }
      }, 500)
    }

    return () => {
      clearTimeout(timeout)
    }
  }, [isDragging])

  // Show placeholder during drag
  if (isDragging || !chartVisible) {
    return (
      <div className="bg-black border border-[#2a2e39] flex flex-col h-full">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-gray-500 text-xs">Moving chart...</div>
        </div>
      </div>
    )
  }

  // Render simple wrapper chart
  return (
    <div className="bg-black border border-[#2a2e39] h-full">
      <DraggableChartWrapper
        symbol={currentSymbol}
        interval="5m"
        indicators={['volume']}
        symbolName={symbolName}
      />
    </div>
  )
}