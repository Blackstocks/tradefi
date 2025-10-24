'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { 
  Settings, 
  TrendingUp, 
  TrendingDown, 
  Maximize2,
  BarChart3,
  Activity,
  Layers,
  Grid3x3,
  Expand,
  PlusCircle,
  LineChart
} from 'lucide-react'
import SymbolSelector from './SymbolSelector'

// Dynamic import to avoid SSR issues
const TradingViewWidget = dynamic(
  () => import('./TradingViewWidget'),
  { 
    ssr: false,
    loading: () => (
      <div className="h-full flex items-center justify-center bg-card">
        <div className="text-muted-foreground">Loading chart...</div>
      </div>
    )
  }
)

const TradingViewEmbed = dynamic(
  () => import('./TradingViewEmbed'),
  { ssr: false }
)

const LightweightChart = dynamic(
  () => import('./LightweightChart'),
  { 
    ssr: false,
    loading: () => (
      <div className="h-full flex items-center justify-center bg-[#0a0a0a]">
        <div className="text-muted-foreground">Loading chart...</div>
      </div>
    )
  }
)

interface MarketData {
  symbol: string
  price: number
  change: number
  high: number
  low: number
  volume: string
}

interface TradingChartProps {
  currentSymbol?: string
  symbolName?: string
  showHeader?: boolean
}

export default function TradingChart({ 
  currentSymbol: propSymbol, 
  symbolName: propSymbolName,
  showHeader = true 
}: TradingChartProps) {
  const [mounted, setMounted] = useState(false)
  const [timeframe, setTimeframe] = useState('15')
  const [chartType, setChartType] = useState<'candles' | 'line' | 'bars'>('candles')
  const [activeIndicators, setActiveIndicators] = useState<string[]>(['volume'])
  const [currentSymbol, setCurrentSymbol] = useState(propSymbol || 'BINANCE:BTCUSDT')
  const [symbolName, setSymbolName] = useState(propSymbolName || 'BTC/USDT')
  const [marketData, setMarketData] = useState<MarketData>({
    symbol: 'BTC/USDT',
    price: 43250.50,
    change: 2.35,
    high: 43850.00,
    low: 42100.00,
    volume: '1.2B'
  })

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (propSymbol) setCurrentSymbol(propSymbol)
    if (propSymbolName) setSymbolName(propSymbolName)
  }, [propSymbol, propSymbolName])

  const handleSymbolChange = (symbol: string, name: string) => {
    setCurrentSymbol(symbol)
    setSymbolName(name)
    setMarketData(prev => ({ ...prev, symbol: name }))
  }

  // Simulate real-time price updates (only on client side)
  useEffect(() => {
    if (!mounted) return
    
    const interval = setInterval(() => {
      setMarketData(prev => ({
        ...prev,
        price: prev.price + (Math.random() - 0.5) * 50,
        change: (Math.random() - 0.5) * 5
      }))
    }, 3000)

    return () => clearInterval(interval)
  }, [mounted])

  const timeframes = [
    { label: '1m', value: '1' },
    { label: '5m', value: '5' },
    { label: '15m', value: '15' },
    { label: '1H', value: '60' },
    { label: '4H', value: '240' },
    { label: '1D', value: 'D' },
    { label: '1W', value: 'W' }
  ]

  const indicators = [
    { id: 'volume', label: 'Volume', icon: BarChart3 },
    { id: 'sma', label: 'SMA', icon: Activity },
    { id: 'ema', label: 'EMA', icon: Activity },
    { id: 'bb', label: 'BB', icon: Expand },
    { id: 'rsi', label: 'RSI', icon: Layers },
    { id: 'macd', label: 'MACD', icon: Grid3x3 }
  ]
  
  const toggleIndicator = (indicatorId: string) => {
    setActiveIndicators(prev => {
      if (prev.includes(indicatorId)) {
        return prev.filter(id => id !== indicatorId)
      } else {
        return [...prev, indicatorId]
      }
    })
  }

  const tradingViewTimeframe = (tf: string) => {
    switch(tf) {
      case '1': return '1'
      case '5': return '5'
      case '15': return '15'
      case '60': return '60'
      case '240': return '240'
      case 'D': return 'D'
      case 'W': return 'W'
      default: return '15'
    }
  }

  return (
    <div className="bg-black border border-[#2a2e39] flex flex-col h-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-2 border-b border-[#2a2e39] gap-2 bg-black">
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-2 lg:gap-6 w-full">
          {showHeader && (
            <>
              {/* Symbol Selector */}
              <SymbolSelector 
                currentSymbol={currentSymbol} 
                onSymbolChange={handleSymbolChange}
              />

              {/* Price Info - Mobile */}
              <div className="flex lg:hidden items-center justify-between w-full">
                <div className="flex items-center space-x-2">
                  <span className="text-lg sm:text-xl font-bold">
                    ${marketData.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                  <div className={`flex items-center space-x-1 ${marketData.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {marketData.change >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                    <span className="text-xs font-medium">{Math.abs(marketData.change).toFixed(2)}%</span>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground">
                  Vol: {marketData.volume}
                </div>
              </div>

              {/* Price Info & Market Stats - Desktop */}
              <div className="hidden lg:flex items-center gap-4">
                <div className="border-l border-border pl-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl font-bold">
                      ${marketData.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                    <div className={`flex items-center space-x-1 ${marketData.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {marketData.change >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                      <span className="text-sm font-medium">{Math.abs(marketData.change).toFixed(2)}%</span>
                    </div>
                  </div>
                </div>

                {/* Market Stats - Hidden on smaller screens */}
                <div className="hidden xl:flex items-center space-x-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">24h High:</span>
                    <span className="ml-1 font-medium">${marketData.high.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">24h Low:</span>
                    <span className="ml-1 font-medium">${marketData.low.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">24h Vol:</span>
                    <span className="ml-1 font-medium">{marketData.volume}</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Chart Controls */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full lg:w-auto">
          {/* Timeframe Selector */}
          <div className="flex items-center space-x-0.5 bg-[#1a1a1a] rounded p-0.5 overflow-x-auto no-scrollbar">
            {timeframes.map(tf => (
              <button
                key={tf.value}
                onClick={() => setTimeframe(tf.value)}
                className={`px-2 py-0.5 text-[11px] font-medium rounded transition-colors whitespace-nowrap ${
                  timeframe === tf.value 
                    ? 'bg-[#ff6b00] text-white' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {tf.label}
              </button>
            ))}
          </div>

          {/* Indicators Toggle - Hidden on mobile */}
          <div className="hidden sm:flex items-center space-x-1">
            {indicators.slice(0, 4).map(indicator => (
              <button
                key={indicator.id}
                onClick={() => toggleIndicator(indicator.id)}
                className={`p-1.5 sm:p-2 rounded transition-colors ${
                  activeIndicators.includes(indicator.id)
                    ? 'text-primary bg-primary/10'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
                title={indicator.label}
              >
                <indicator.icon className="h-3 w-3 sm:h-4 sm:w-4" />
              </button>
            ))}
          </div>

          {/* Settings & Fullscreen - Desktop only */}
          <div className="hidden lg:flex items-center space-x-1">
            <button className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded transition-colors">
              <Settings className="h-4 w-4" />
            </button>
            <button className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded transition-colors">
              <Maximize2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Chart Container */}
      <div className="flex-1 relative min-h-0 bg-black">
        {/* Lightweight Charts Implementation */}
        <LightweightChart 
          symbol={currentSymbol} 
          interval={timeframe}
          indicators={activeIndicators}
          symbolName={symbolName}
        />
      </div>
    </div>
  )
}