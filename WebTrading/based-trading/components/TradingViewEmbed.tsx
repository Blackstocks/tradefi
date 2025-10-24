'use client'

import { memo } from 'react'

interface TradingViewEmbedProps {
  symbol?: string
  interval?: string
  theme?: 'light' | 'dark'
  style?: string
  locale?: string
  hide_top_toolbar?: boolean
  hide_legend?: boolean
  save_image?: boolean
  hide_volume?: boolean
}

function TradingViewEmbed({
  symbol = 'BINANCE:BTCUSDT',
  interval = 'D',
  theme = 'dark',
  style = '1',
  locale = 'en',
  hide_top_toolbar = false,
  hide_legend = false,
  save_image = true,
  hide_volume = false
}: TradingViewEmbedProps) {
  // Create URL parameters
  const params = new URLSearchParams({
    symbol,
    interval,
    theme,
    style,
    locale,
    toolbar_bg: theme === 'dark' ? '#111111' : '#f1f3f6',
    enable_publishing: 'false',
    withdateranges: 'true',
    hide_side_toolbar: 'false',
    allow_symbol_change: 'true',
    save_image: save_image.toString(),
    hide_volume: hide_volume.toString(),
    hide_top_toolbar: hide_top_toolbar.toString(),
    hide_legend: hide_legend.toString(),
    studies: 'Volume@tv-basicstudies'
  })

  const embedUrl = `https://www.tradingview.com/widgetembed/?${params.toString()}`

  return (
    <div className="h-full w-full bg-card rounded-lg overflow-hidden">
      <iframe
        src={embedUrl}
        className="w-full h-full border-0"
        allow="fullscreen"
        loading="lazy"
        title="TradingView Chart"
      />
    </div>
  )
}

export default memo(TradingViewEmbed)