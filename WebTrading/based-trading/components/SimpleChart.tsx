'use client'

import { useEffect, useRef, useState } from 'react'

interface Candle {
  time: number
  open: number
  high: number
  low: number
  close: number
  volume: number
}

interface SimpleChartProps {
  symbol: string
}

export default function SimpleChart({ symbol }: SimpleChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [candles, setCandles] = useState<Candle[]>([])
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

  // Generate mock data
  useEffect(() => {
    const generateMockData = () => {
      const data: Candle[] = []
      const now = Date.now()
      const basePrice = 43000
      
      for (let i = 100; i >= 0; i--) {
        const time = now - i * 15 * 60 * 1000 // 15 min intervals
        const open = basePrice + (Math.random() - 0.5) * 500
        const close = open + (Math.random() - 0.5) * 200
        const high = Math.max(open, close) + Math.random() * 100
        const low = Math.min(open, close) - Math.random() * 100
        const volume = Math.random() * 1000000
        
        data.push({ time, open, high, low, close, volume })
      }
      
      setCandles(data)
    }
    
    generateMockData()
    const interval = setInterval(generateMockData, 5000)
    
    return () => clearInterval(interval)
  }, [])

  // Handle resize
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight
        })
      }
    }
    
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Draw chart
  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx || candles.length === 0) return

    // Set canvas size
    canvas.width = dimensions.width
    canvas.height = dimensions.height

    // Clear canvas
    ctx.fillStyle = '#111111'
    ctx.fillRect(0, 0, dimensions.width, dimensions.height)

    // Calculate scales
    const padding = { top: 20, right: 60, bottom: 40, left: 60 }
    const chartWidth = dimensions.width - padding.left - padding.right
    const chartHeight = dimensions.height - padding.top - padding.bottom

    // Find price range
    const prices = candles.flatMap(c => [c.high, c.low])
    const minPrice = Math.min(...prices) * 0.999
    const maxPrice = Math.max(...prices) * 1.001
    const priceRange = maxPrice - minPrice

    // Draw grid lines
    ctx.strokeStyle = '#1e1e1e'
    ctx.lineWidth = 1
    
    // Horizontal grid lines
    for (let i = 0; i <= 5; i++) {
      const y = padding.top + (i / 5) * chartHeight
      ctx.beginPath()
      ctx.moveTo(padding.left, y)
      ctx.lineTo(dimensions.width - padding.right, y)
      ctx.stroke()
      
      // Price labels
      const price = maxPrice - (i / 5) * priceRange
      ctx.fillStyle = '#6b7280'
      ctx.font = '12px monospace'
      ctx.textAlign = 'right'
      ctx.fillText(price.toFixed(2), dimensions.width - padding.right + 55, y + 4)
    }

    // Draw candles
    const candleWidth = Math.max(2, (chartWidth / candles.length) * 0.8)
    const spacing = chartWidth / candles.length

    candles.forEach((candle, i) => {
      const x = padding.left + i * spacing + spacing / 2
      const openY = padding.top + ((maxPrice - candle.open) / priceRange) * chartHeight
      const closeY = padding.top + ((maxPrice - candle.close) / priceRange) * chartHeight
      const highY = padding.top + ((maxPrice - candle.high) / priceRange) * chartHeight
      const lowY = padding.top + ((maxPrice - candle.low) / priceRange) * chartHeight

      const isGreen = candle.close >= candle.open

      // Draw wick
      ctx.strokeStyle = isGreen ? '#22c55e' : '#ef4444'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(x, highY)
      ctx.lineTo(x, lowY)
      ctx.stroke()

      // Draw body
      ctx.fillStyle = isGreen ? '#22c55e' : '#ef4444'
      const bodyHeight = Math.abs(closeY - openY) || 1
      const bodyY = Math.min(openY, closeY)
      ctx.fillRect(x - candleWidth / 2, bodyY, candleWidth, bodyHeight)
    })

    // Draw current price line
    const currentPrice = candles[candles.length - 1].close
    const currentPriceY = padding.top + ((maxPrice - currentPrice) / priceRange) * chartHeight
    
    ctx.strokeStyle = '#f97316'
    ctx.lineWidth = 1
    ctx.setLineDash([5, 5])
    ctx.beginPath()
    ctx.moveTo(padding.left, currentPriceY)
    ctx.lineTo(dimensions.width - padding.right, currentPriceY)
    ctx.stroke()
    ctx.setLineDash([])

    // Current price label
    ctx.fillStyle = '#f97316'
    ctx.fillRect(dimensions.width - padding.right + 5, currentPriceY - 10, 50, 20)
    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 12px monospace'
    ctx.textAlign = 'left'
    ctx.fillText(currentPrice.toFixed(2), dimensions.width - padding.right + 8, currentPriceY + 4)

  }, [candles, dimensions])

  return (
    <div ref={containerRef} className="h-full w-full relative bg-[#111111] rounded">
      <div className="absolute top-2 left-2 text-xs text-muted-foreground">
        {symbol} • 15m
      </div>
      <canvas 
        ref={canvasRef}
        className="w-full h-full"
      />
    </div>
  )
}