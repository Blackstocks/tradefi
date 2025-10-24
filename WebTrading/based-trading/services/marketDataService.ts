import { CandlestickData, UTCTimestamp } from 'lightweight-charts'

interface BinanceKline {
  t: number // Open time
  o: string // Open
  h: string // High
  l: string // Low
  c: string // Close
  v: string // Volume
}

interface BinanceResponse {
  symbol: string
  data: BinanceKline[]
}

export async function fetchBTCData(interval: string): Promise<{ candles: CandlestickData[], volumes: any[] }> {
  try {
    // Map interval to Binance format
    const intervalMap: Record<string, string> = {
      '1': '1m',
      '5': '5m',
      '15': '15m',
      '60': '1h',
      '240': '4h',
      'D': '1d',
      'W': '1w'
    }
    
    const binanceInterval = intervalMap[interval] || '15m'
    
    // Calculate milliseconds per interval
    const intervalMs: Record<string, number> = {
      '1m': 60 * 1000,
      '5m': 5 * 60 * 1000,
      '15m': 15 * 60 * 1000,
      '1h': 60 * 60 * 1000,
      '4h': 4 * 60 * 60 * 1000,
      '1d': 24 * 60 * 60 * 1000,
      '1w': 7 * 24 * 60 * 60 * 1000
    }
    
    const msPerCandle = intervalMs[binanceInterval] || intervalMs['15m']
    
    // Limit candles based on timeframe to avoid fetching too much data
    const maxCandlesByInterval: Record<string, number> = {
      '1m': 10000,    // ~7 days
      '5m': 10000,    // ~35 days
      '15m': 10000,   // ~104 days
      '1h': 5000,     // ~208 days
      '4h': 2000,     // ~333 days
      '1d': 1000,     // ~2.7 years
      '1w': 500       // ~9.6 years
    }
    
    const totalCandles = maxCandlesByInterval[binanceInterval] || 10000
    const candlesPerRequest = 1000
    const requests = Math.ceil(totalCandles / candlesPerRequest)
    
    const allCandles: CandlestickData[] = []
    const allVolumes: any[] = []
    
    // Make multiple requests to get 10,000 candles
    for (let i = 0; i < requests; i++) {
      const endTime = Date.now() - (i * candlesPerRequest * msPerCandle)
      const startTime = endTime - (candlesPerRequest * msPerCandle)
      
      const response = await fetch(
        `https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=${binanceInterval}&limit=${candlesPerRequest}&endTime=${endTime}`
      )
      
      if (!response.ok) {
        console.warn(`Failed to fetch batch ${i + 1}`)
        continue
      }
      
      const data = await response.json()
      
      data.forEach((kline: any[]) => {
        const time = Math.floor(kline[0] / 1000) as UTCTimestamp
        const open = parseFloat(kline[1])
        const high = parseFloat(kline[2])
        const low = parseFloat(kline[3])
        const close = parseFloat(kline[4])
        const volume = parseFloat(kline[5])
        
        allCandles.push({
          time,
          open,
          high,
          low,
          close
        })
        
        allVolumes.push({
          time,
          value: volume,
          color: close >= open ? 'rgba(38, 166, 154, 0.5)' : 'rgba(239, 83, 80, 0.5)'
        })
      })
      
      // Add a small delay between requests to avoid rate limiting
      if (i < requests - 1) {
        await new Promise(resolve => setTimeout(resolve, 100))
      }
    }
    
    // Sort by time to ensure correct order
    allCandles.sort((a, b) => a.time - b.time)
    allVolumes.sort((a, b) => a.time - b.time)
    
    console.log(`Fetched ${allCandles.length} candles for ${binanceInterval} timeframe (requested interval: ${interval})`)
    
    return { candles: allCandles, volumes: allVolumes }
  } catch (error) {
    console.error('Error fetching BTC data:', error)
    // Return mock data as fallback
    return generateMockData()
  }
}

// WebSocket for real-time updates
export function subscribeToBTCUpdates(
  symbol: string,
  interval: string,
  onUpdate: (candle: CandlestickData, volume: any) => void
): () => void {
  // Map interval to Binance WebSocket format
  const wsIntervalMap: Record<string, string> = {
    '1': '1m',
    '5': '5m',
    '15': '15m',
    '60': '1h',
    '240': '4h',
    'D': '1d',
    'W': '1w'
  }
  
  const wsInterval = wsIntervalMap[interval] || '15m'
  const wsUrl = `wss://stream.binance.com:9443/ws/btcusdt@kline_${wsInterval}`
  console.log(`Connecting to WebSocket: ${wsUrl} for interval: ${interval}`)
  const ws = new WebSocket(wsUrl)
  
  ws.onmessage = (event) => {
    const data = JSON.parse(event.data)
    if (data.k && data.k.x === false) { // Only update on active candles, not closed ones
      const kline = data.k
      const time = Math.floor(kline.t / 1000) as UTCTimestamp
      const open = parseFloat(kline.o)
      const high = parseFloat(kline.h)
      const low = parseFloat(kline.l)
      const close = parseFloat(kline.c)
      const volume = parseFloat(kline.v)
      
      onUpdate(
        { time, open, high, low, close },
        {
          time,
          value: volume,
          color: close >= open ? 'rgba(38, 166, 154, 0.5)' : 'rgba(239, 83, 80, 0.5)'
        }
      )
    }
  }
  
  ws.onerror = (error) => {
    console.error('WebSocket error:', error)
  }
  
  ws.onclose = () => {
    console.log('WebSocket connection closed')
  }
  
  // Return cleanup function
  return () => {
    if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) {
      ws.close()
    }
  }
}

// Fallback mock data generator
function generateMockData(): { candles: CandlestickData[], volumes: any[] } {
  const candles: CandlestickData[] = []
  const volumes: any[] = []
  const basePrice = 120000
  const baseTime = Math.floor(Date.now() / 1000) - 10000 * 15 * 60
  
  for (let i = 0; i < 10000; i++) {
    const time = (baseTime + i * 15 * 60) as UTCTimestamp
    const open = basePrice + (Math.random() - 0.5) * 1000
    const close = open + (Math.random() - 0.5) * 100
    const high = Math.max(open, close) + Math.random() * 50
    const low = Math.min(open, close) - Math.random() * 50
    const volume = Math.random() * 1000 + 100
    
    candles.push({ time, open, high, low, close })
    volumes.push({
      time,
      value: volume,
      color: close >= open ? 'rgba(38, 166, 154, 0.5)' : 'rgba(239, 83, 80, 0.5)'
    })
  }
  
  return { candles, volumes }
}