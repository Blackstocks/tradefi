'use client'

import { useEffect, useRef, useState } from 'react'
import { createChart, IChartApi } from 'lightweight-charts'

interface DraggableChartWrapperProps {
  symbol: string
  interval: string
  indicators: string[]
  symbolName: string
}

export default function DraggableChartWrapper(props: DraggableChartWrapperProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const chartRef = useRef<IChartApi | null>(null)
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    if (!containerRef.current) return

    // Delay initialization slightly
    const initTimer = setTimeout(() => {
      if (!containerRef.current) return

      try {
        // Create a basic chart
        const chart = createChart(containerRef.current, {
          layout: {
            background: { color: '#000000' },
            textColor: '#d1d4dc',
          },
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight,
          grid: {
            vertLines: { visible: false },
            horzLines: { color: 'rgba(42, 46, 57, 0.6)' },
          },
        })

        chartRef.current = chart
        
        // Add basic candlestick series
        const candlestickSeries = chart.addCandlestickSeries({
          upColor: '#26a69a',
          downColor: '#ef5350',
        })

        // Add some dummy data
        candlestickSeries.setData([
          { time: '2024-01-01', open: 100, high: 110, low: 90, close: 105 },
          { time: '2024-01-02', open: 105, high: 115, low: 100, close: 110 },
        ])

        setIsInitialized(true)
      } catch (error) {
        console.error('Chart initialization error:', error)
      }
    }, 100)

    return () => {
      clearTimeout(initTimer)
      // Cleanup chart
      if (chartRef.current) {
        try {
          chartRef.current.remove()
        } catch (error) {
          // Ignore cleanup errors
        }
        chartRef.current = null
      }
    }
  }, [])

  // Handle resize
  useEffect(() => {
    if (!chartRef.current || !containerRef.current) return

    const handleResize = () => {
      if (chartRef.current && containerRef.current) {
        try {
          chartRef.current.applyOptions({
            width: containerRef.current.clientWidth,
            height: containerRef.current.clientHeight,
          })
        } catch (error) {
          // Ignore resize errors during cleanup
        }
      }
    }

    window.addEventListener('resize', handleResize)
    
    // Initial resize
    handleResize()

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [isInitialized])

  return (
    <div className="relative h-full w-full bg-black">
      <div ref={containerRef} className="h-full w-full" />
      {!isInitialized && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-gray-500 text-xs">Loading chart...</div>
        </div>
      )}
    </div>
  )
}