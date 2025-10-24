'use client'

import { useEffect, useRef, useState } from 'react'
import { 
  createChart, 
  ColorType, 
  IChartApi, 
  ISeriesApi,
  CandlestickData,
  UTCTimestamp,
  MouseEventParams,
  Time
} from 'lightweight-charts'
import { addSMA, addEMA, addBollingerBands, addRSI, addMACD } from './ChartIndicators'
import { fetchBTCData, subscribeToBTCUpdates } from '@/services/marketDataService'

interface LightweightChartProps {
  symbol: string
  interval: string
  indicators?: string[]
  symbolName?: string
}

export default function LightweightChart({ symbol, interval, indicators = ['volume'], symbolName }: LightweightChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null)
  const chartRef = useRef<IChartApi | null>(null)
  const candlestickSeriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null)
  const volumeSeriesRef = useRef<ISeriesApi<"Histogram"> | null>(null)
  const lastUpdateTimeRef = useRef<number>(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!chartContainerRef.current) return

    // Create chart with TradingView-like styling
    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: '#000000' },
        textColor: '#d1d4dc',
        fontSize: 12,
      },
      width: chartContainerRef.current.clientWidth,
      height: chartContainerRef.current.clientHeight,
      grid: {
        vertLines: {
          color: 'rgba(42, 46, 57, 0)',
          style: 0,
          visible: false,
        },
        horzLines: {
          color: 'rgba(42, 46, 57, 0.6)',
          style: 0,
          visible: true,
        },
      },
      crosshair: {
        mode: 0,
        vertLine: {
          width: 1,
          color: '#9B9B9B',
          style: 1,
          labelBackgroundColor: '#131722',
        },
        horzLine: {
          width: 1,
          color: '#9B9B9B',
          style: 1,
          labelBackgroundColor: '#131722',
        },
      },
      rightPriceScale: {
        borderColor: 'rgba(42, 46, 57, 0.6)',
        borderVisible: false,
        autoScale: true,
        scaleMargins: {
          top: 0.1,
          bottom: 0.25,
        },
        minimumWidth: 70,
      },
      timeScale: {
        borderColor: 'rgba(42, 46, 57, 0.6)',
        borderVisible: false,
        timeVisible: true,
        secondsVisible: false,
        fixLeftEdge: true,
        fixRightEdge: true,
        lockVisibleTimeRangeOnResize: true,
        rightBarStaysOnScroll: true,
        tickMarkFormatter: (time: UTCTimestamp) => {
          const date = new Date(time * 1000)
          const hours = date.getHours().toString().padStart(2, '0')
          const minutes = date.getMinutes().toString().padStart(2, '0')
          return `${hours}:${minutes}`
        },
      },
      watermark: {
        visible: false,
      },
      handleScroll: {
        vertTouchDrag: false,
      },
    })

    chartRef.current = chart

    // Create candlestick series with TradingView colors
    const candlestickSeries = chart.addCandlestickSeries({
      upColor: '#26a69a',
      downColor: '#ef5350',
      borderVisible: false,
      wickUpColor: '#26a69a',
      wickDownColor: '#ef5350',
      priceScaleId: 'right',
    })

    candlestickSeriesRef.current = candlestickSeries

    // Create volume series
    const volumeSeries = chart.addHistogramSeries({
      color: '#26a69a',
      priceFormat: {
        type: 'volume',
      },
      priceScaleId: '',
    })

    volumeSeriesRef.current = volumeSeries
    
    // Set up volume series scale
    volumeSeries.priceScale().applyOptions({
      scaleMargins: {
        top: 0.85,
        bottom: 0,
      },
    })

    // Set loading state
    setIsLoading(true)
    
    // Fetch real BTC data
    fetchBTCData(interval).then(({ candles, volumes }) => {
      // Clear existing data first
      candlestickSeries.setData([])
      volumeSeries.setData([])
      
      // Set new data
      candlestickSeries.setData(candles)
      volumeSeries.setData(volumes)
      
      // Set the last update time to the most recent candle
      if (candles.length > 0) {
        lastUpdateTimeRef.current = candles[candles.length - 1].time as number
      }
      
      setIsLoading(false)
      
      // Add indicators based on props
      const indicatorRefs: any = {}
    
      if (indicators.includes('sma')) {
        indicatorRefs.sma = addSMA({ chart, candlestickSeries }, 20)
        indicatorRefs.sma.update(candles)
      }
      
      if (indicators.includes('ema')) {
        indicatorRefs.ema = addEMA({ chart, candlestickSeries }, 20)
        indicatorRefs.ema.update(candles)
      }
      
      if (indicators.includes('bb')) {
        indicatorRefs.bb = addBollingerBands({ chart, candlestickSeries }, 20, 2)
        indicatorRefs.bb.update(candles)
      }
      
      if (indicators.includes('rsi')) {
        indicatorRefs.rsi = addRSI({ chart, candlestickSeries }, 14)
        indicatorRefs.rsi.update(candles)
      }
      
      if (indicators.includes('macd')) {
        indicatorRefs.macd = addMACD({ chart, candlestickSeries }, 12, 26, 9)
        indicatorRefs.macd.update(candles)
      }

      // Fit content
      chart.timeScale().fitContent()
    }).catch((error) => {
      console.error('Error fetching chart data:', error)
      setIsLoading(false)
    })

    // Handle resize
    const handleResize = () => {
      if (chartContainerRef.current && chartRef.current) {
        try {
          chartRef.current.applyOptions({
            width: chartContainerRef.current.clientWidth,
            height: chartContainerRef.current.clientHeight,
          })
        } catch (error) {
          console.warn('Chart resize error (likely during drag):', error)
        }
      }
    }

    window.addEventListener('resize', handleResize)

    // Crosshair sync with price label
    chart.subscribeCrosshairMove((param: MouseEventParams<Time>) => {
      if (!param || !param.time || !param.seriesData) return

      const data = param.seriesData.get(candlestickSeries)
      if (!data) return

      const candleData = data as CandlestickData
      const tooltip = document.getElementById('chart-tooltip')
      
      if (tooltip && param.point) {
        const price = candleData.close
        tooltip.style.left = param.point.x + 'px'
        tooltip.style.top = param.point.y + 'px'
        tooltip.style.display = 'block'
        tooltip.innerHTML = `
          <div>O: ${candleData.open.toFixed(2)}</div>
          <div>H: ${candleData.high.toFixed(2)}</div>
          <div>L: ${candleData.low.toFixed(2)}</div>
          <div>C: ${candleData.close.toFixed(2)}</div>
        `
      }
    })

    // Subscribe to real-time updates
    const unsubscribe = subscribeToBTCUpdates(symbol, interval, (candle, volume) => {
      try {
        if (candlestickSeriesRef.current && volumeSeriesRef.current) {
          // Only update if we have valid data and time is not in the past
          if (candle && candle.time && typeof candle.time === 'number') {
            // Check if this is a new or current candle
            if (candle.time >= lastUpdateTimeRef.current) {
              candlestickSeriesRef.current.update(candle)
              lastUpdateTimeRef.current = candle.time
            }
          }
          if (volume && volume.time && typeof volume.time === 'number') {
            if (volume.time >= lastUpdateTimeRef.current) {
              volumeSeriesRef.current.update(volume)
            }
          }
        }
      } catch (error) {
        console.error('Error updating chart:', error)
      }
    })

    return () => {
      window.removeEventListener('resize', handleResize)
      unsubscribe()
      
      // Safely cleanup chart
      if (chartRef.current) {
        try {
          chartRef.current.remove()
        } catch (error) {
          console.warn('Chart cleanup error:', error)
        }
        chartRef.current = null
      }
      
      // Clear all refs
      candlestickSeriesRef.current = null
      volumeSeriesRef.current = null
    }
  }, [symbol, interval, indicators])

  return (
    <div className="relative h-full w-full bg-black">
      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black z-30">
          <div className="flex flex-col items-center gap-2">
            <div className="text-[#d1d4dc] text-sm">Loading chart data...</div>
            <div className="text-[#787b86] text-xs">This may take a few seconds</div>
          </div>
        </div>
      )}
      
      {/* Chart header overlay */}
      <div className="absolute top-4 left-4 z-20 pointer-events-none">
        <div className="flex items-baseline gap-2">
          <span className="text-[#d1d4dc] font-medium text-sm">{symbolName || 'BTC/USD'}</span>
          <span className="text-[#787b86] text-xs">• {interval === '1' ? '1m' : interval === '5' ? '5m' : interval === '15' ? '15m' : interval === '60' ? '1H' : interval === '240' ? '4H' : interval === 'D' ? '1D' : interval === 'W' ? '1W' : interval}</span>
          <span className="text-[#787b86] text-xs">• BINANCE</span>
        </div>
      </div>
      
      <div ref={chartContainerRef} className="h-full w-full" />
      <div
        id="chart-tooltip"
        className="absolute hidden bg-[#1a1a1a] border border-[#2a2a2a] p-2 rounded text-xs pointer-events-none z-10 text-[#d1d4dc] shadow-lg"
        style={{ display: 'none' }}
      />
    </div>
  )
}