export const TRADING_PAIRS = {
  SPOT: [
    { symbol: 'BINANCE:BTCUSDT', name: 'BTC/USDT', exchange: 'Binance' },
    { symbol: 'BINANCE:ETHUSDT', name: 'ETH/USDT', exchange: 'Binance' },
    { symbol: 'BINANCE:SOLUSDT', name: 'SOL/USDT', exchange: 'Binance' },
    { symbol: 'BINANCE:BNBUSDT', name: 'BNB/USDT', exchange: 'Binance' },
    { symbol: 'BINANCE:ADAUSDT', name: 'ADA/USDT', exchange: 'Binance' },
    { symbol: 'BINANCE:XRPUSDT', name: 'XRP/USDT', exchange: 'Binance' },
    { symbol: 'BINANCE:DOTUSDT', name: 'DOT/USDT', exchange: 'Binance' },
    { symbol: 'BINANCE:AVAXUSDT', name: 'AVAX/USDT', exchange: 'Binance' },
    { symbol: 'BINANCE:MATICUSDT', name: 'MATIC/USDT', exchange: 'Binance' },
    { symbol: 'BINANCE:LINKUSDT', name: 'LINK/USDT', exchange: 'Binance' },
    { symbol: 'BINANCE:ATOMUSDT', name: 'ATOM/USDT', exchange: 'Binance' },
    { symbol: 'BINANCE:NEARUSDT', name: 'NEAR/USDT', exchange: 'Binance' },
    { symbol: 'BINANCE:ARBUSDT', name: 'ARB/USDT', exchange: 'Binance' },
    { symbol: 'BINANCE:OPUSDT', name: 'OP/USDT', exchange: 'Binance' },
    { symbol: 'BINANCE:INJUSDT', name: 'INJ/USDT', exchange: 'Binance' }
  ],
  FUTURES: [
    { symbol: 'BINANCE:BTCUSDT.P', name: 'BTC-PERP', exchange: 'Binance Futures' },
    { symbol: 'BINANCE:ETHUSDT.P', name: 'ETH-PERP', exchange: 'Binance Futures' },
    { symbol: 'BINANCE:SOLUSDT.P', name: 'SOL-PERP', exchange: 'Binance Futures' },
  ],
  FOREX: [
    { symbol: 'FX:EURUSD', name: 'EUR/USD', exchange: 'Forex' },
    { symbol: 'FX:GBPUSD', name: 'GBP/USD', exchange: 'Forex' },
    { symbol: 'FX:USDJPY', name: 'USD/JPY', exchange: 'Forex' },
  ],
  STOCKS: [
    { symbol: 'NASDAQ:AAPL', name: 'Apple', exchange: 'NASDAQ' },
    { symbol: 'NASDAQ:TSLA', name: 'Tesla', exchange: 'NASDAQ' },
    { symbol: 'NASDAQ:MSFT', name: 'Microsoft', exchange: 'NASDAQ' },
    { symbol: 'NASDAQ:GOOGL', name: 'Google', exchange: 'NASDAQ' },
    { symbol: 'NASDAQ:NVDA', name: 'NVIDIA', exchange: 'NASDAQ' },
  ],
  INDICES: [
    { symbol: 'SP:SPX', name: 'S&P 500', exchange: 'Index' },
    { symbol: 'NASDAQ:NDX', name: 'NASDAQ 100', exchange: 'Index' },
    { symbol: 'DJ:DJI', name: 'Dow Jones', exchange: 'Index' },
  ]
}

export const CHART_LAYOUTS = {
  BASIC: ['Volume'],
  STANDARD: ['Volume', 'RSI'],
  ADVANCED: ['Volume', 'RSI', 'MACD'],
  PRO: ['Volume', 'RSI', 'MACD', 'Bollinger Bands', 'Stochastic']
}

export const DRAWING_TOOLS = [
  { id: 'trend_line', name: 'Trend Line', icon: 'TrendingUp' },
  { id: 'horizontal_line', name: 'Horizontal Line', icon: 'Minus' },
  { id: 'vertical_line', name: 'Vertical Line', icon: 'Separator' },
  { id: 'channel', name: 'Parallel Channel', icon: 'ChevronsUpDown' },
  { id: 'rectangle', name: 'Rectangle', icon: 'Square' },
  { id: 'fib_retracement', name: 'Fibonacci Retracement', icon: 'GitBranch' },
  { id: 'text', name: 'Text', icon: 'Type' },
]

export const INDICATORS = [
  {
    category: 'Trend',
    items: [
      { id: 'MA', name: 'Moving Average', params: ['length', 'source'] },
      { id: 'EMA', name: 'Exponential MA', params: ['length', 'source'] },
      { id: 'WMA', name: 'Weighted MA', params: ['length', 'source'] },
      { id: 'VWAP', name: 'VWAP', params: [] },
      { id: 'SAR', name: 'Parabolic SAR', params: ['acceleration', 'maximum'] },
    ]
  },
  {
    category: 'Oscillators',
    items: [
      { id: 'RSI', name: 'RSI', params: ['length'] },
      { id: 'MACD', name: 'MACD', params: ['fast', 'slow', 'signal'] },
      { id: 'STOCH', name: 'Stochastic', params: ['k', 'd', 'smooth'] },
      { id: 'CCI', name: 'CCI', params: ['length'] },
      { id: 'WILLIAMSR', name: 'Williams %R', params: ['length'] },
    ]
  },
  {
    category: 'Volatility',
    items: [
      { id: 'BB', name: 'Bollinger Bands', params: ['length', 'mult'] },
      { id: 'ATR', name: 'Average True Range', params: ['length'] },
      { id: 'KC', name: 'Keltner Channels', params: ['length', 'mult'] },
      { id: 'DC', name: 'Donchian Channels', params: ['length'] },
    ]
  },
  {
    category: 'Volume',
    items: [
      { id: 'VOLUME', name: 'Volume', params: ['ma_length'] },
      { id: 'OBV', name: 'On Balance Volume', params: [] },
      { id: 'CMF', name: 'Chaikin Money Flow', params: ['length'] },
      { id: 'VWAP', name: 'VWAP', params: [] },
    ]
  }
]