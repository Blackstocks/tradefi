'use client'

import { useEffect, useRef, memo } from 'react'

declare global {
  interface Window {
    TradingView: any
  }
}

export interface AdvancedChartProps {
  symbol?: string
  interval?: string
  theme?: 'light' | 'dark'
  container?: string
  libraryPath?: string
  chartsStorageUrl?: string
  chartsStorageApiVersion?: string
  clientId?: string
  userId?: string
  fullscreen?: boolean
  autosize?: boolean
  studiesOverrides?: Record<string, any>
  timeFrames?: Array<{
    text: string
    resolution: string
    description?: string
    title?: string
  }>
  customIndicators?: string[]
}

function AdvancedTradingViewWidget({
  symbol = 'BINANCE:BTCUSDT',
  interval = '15',
  theme = 'dark',
  container = 'tv_chart_container',
  autosize = true,
}: AdvancedChartProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const tvWidgetRef = useRef<any>(null)

  useEffect(() => {
    const initWidget = () => {
      if (!containerRef.current || !window.TradingView) return

      const widgetOptions = {
        symbol: symbol,
        interval: interval,
        container_id: container,
        datafeed: new (window.TradingView as any).Datafeed.UDFCompatibleDatafeed(
          'https://demo-feed-data.tradingview.com'
        ),
        library_path: '/charting_library/',
        locale: 'en',
        disabled_features: [
          'use_localstorage_for_settings',
          'header_symbol_search',
          'symbol_search_hot_key',
          'header_interval_dialog_button',
          'compare_symbol',
          'border_around_the_chart'
        ],
        enabled_features: [
          'study_templates',
          'side_toolbar_in_fullscreen_mode',
          'header_in_fullscreen_mode'
        ],
        charts_storage_url: 'https://saveload.tradingview.com',
        charts_storage_api_version: '1.1',
        client_id: 'based.one',
        user_id: 'public_user_id',
        fullscreen: false,
        autosize: autosize,
        theme: theme,
        overrides: {
          'paneProperties.background': theme === 'dark' ? '#111111' : '#ffffff',
          'paneProperties.backgroundType': 'solid',
          'paneProperties.vertGridProperties.color': theme === 'dark' ? '#1e1e1e' : '#e0e0e0',
          'paneProperties.horzGridProperties.color': theme === 'dark' ? '#1e1e1e' : '#e0e0e0',
          'symbolWatermarkProperties.color': theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
          'scalesProperties.textColor': theme === 'dark' ? '#d1d5db' : '#131722',
          'mainSeriesProperties.candleStyle.upColor': '#22c55e',
          'mainSeriesProperties.candleStyle.downColor': '#ef4444',
          'mainSeriesProperties.candleStyle.drawWick': true,
          'mainSeriesProperties.candleStyle.drawBorder': true,
          'mainSeriesProperties.candleStyle.borderUpColor': '#22c55e',
          'mainSeriesProperties.candleStyle.borderDownColor': '#ef4444',
          'mainSeriesProperties.candleStyle.wickUpColor': '#22c55e',
          'mainSeriesProperties.candleStyle.wickDownColor': '#ef4444',
          'volumePaneSize': 'medium',
          'mainSeriesProperties.showCountdown': true,
          'paneProperties.legendProperties.showLegend': true,
        },
        studies_overrides: {
          'volume.volume.color.0': '#ef4444',
          'volume.volume.color.1': '#22c55e',
          'volume.volume.transparency': 50,
          'volume.volume ma.color': '#f97316',
          'volume.volume ma.transparency': 30,
          'volume.volume ma.linewidth': 2,
          'volume.show ma': true,
          'bollinger bands.median.color': '#f97316',
          'bollinger bands.upper.linewidth': 1,
          'bollinger bands.lower.linewidth': 1,
          'macd.macd.color': '#22c55e',
          'macd.signal.color': '#ef4444',
          'macd.histogram.color': '#f97316',
          'rsi.rsi.color': '#f97316',
          'rsi.rsiBasedMA.color': '#22c55e',
        },
        time_frames: [
          { text: '5y', resolution: 'W', description: '5 Years' },
          { text: '1y', resolution: 'D', description: '1 Year' },
          { text: '6m', resolution: '120', description: '6 Months' },
          { text: '3m', resolution: '60', description: '3 Months' },
          { text: '1m', resolution: '30', description: '1 Month' },
          { text: '5d', resolution: '5', description: '5 Days' },
          { text: '1d', resolution: '1', description: '1 Day' },
        ],
        toolbar_bg: theme === 'dark' ? '#111111' : '#f1f3f6',
        loading_screen: {
          backgroundColor: theme === 'dark' ? '#111111' : '#ffffff',
          foregroundColor: '#f97316',
        },
        custom_css_url: '../themed.css',
        drawings_access: {
          type: 'black',
          tools: [
            { name: 'Trend Line', grayed: false },
            { name: 'Trend Angle', grayed: false },
            { name: 'Horizontal Line', grayed: false },
            { name: 'Horizontal Ray', grayed: false },
            { name: 'Vertical Line', grayed: false },
            { name: 'Parallel Channel', grayed: false },
            { name: 'Rectangle', grayed: false },
            { name: 'Fibonacci Retracement', grayed: false },
          ],
        },
        indicators_access: {
          type: 'white',
          list: [
            'Volume',
            'Moving Average',
            'Moving Average Exponential',
            'Bollinger Bands',
            'Relative Strength Index',
            'MACD',
            'Stochastic',
            'Williams %R',
            'Average True Range',
            'Parabolic SAR',
            'Ichimoku Cloud',
            'Supertrend',
            'VWAP',
            'Pivot Points Standard',
            'Volume Profile',
          ],
        },
      }

      // Create the widget
      tvWidgetRef.current = new (window.TradingView as any).widget(widgetOptions)

      // Widget ready callback
      tvWidgetRef.current.onChartReady(() => {
        // Add volume study by default
        tvWidgetRef.current.chart().createStudy('Volume', false, false, { showMA: true })
        
        // Subscribe to interval changes
        tvWidgetRef.current.chart().onIntervalChanged().subscribe(null, (interval: string) => {
          console.log('Interval changed to:', interval)
        })

        // Subscribe to symbol changes
        tvWidgetRef.current.chart().onSymbolChanged().subscribe(null, (symbolData: any) => {
          console.log('Symbol changed to:', symbolData)
        })
      })
    }

    // Load TradingView library script
    const script = document.createElement('script')
    script.src = 'https://unpkg.com/lightweight-charts/dist/lightweight-charts.standalone.production.js'
    script.async = true
    script.onload = () => {
      // Instead of lightweight-charts, we use the embedded widget
      // This is a placeholder for the actual TradingView library
      initWidget()
    }

    // For now, initialize with timeout (in production, load actual TradingView library)
    setTimeout(initWidget, 100)

    return () => {
      if (tvWidgetRef.current) {
        tvWidgetRef.current.remove()
        tvWidgetRef.current = null
      }
    }
  }, [symbol, interval, theme, container, autosize])

  return (
    <div 
      id={container} 
      ref={containerRef}
      className="h-full w-full"
    />
  )
}

export default memo(AdvancedTradingViewWidget)