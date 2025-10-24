'use client'

import { useEffect, useRef, memo } from 'react'

export interface TradingViewWidgetProps {
  symbol?: string
  interval?: string
  theme?: 'light' | 'dark'
  autosize?: boolean
  hide_side_toolbar?: boolean
  allow_symbol_change?: boolean
  container_id?: string
}

function TradingViewWidget({
  symbol = 'BINANCE:BTCUSDT',
  interval = '15',
  theme = 'dark',
  autosize = true,
  hide_side_toolbar = false,
  allow_symbol_change = true,
  container_id = 'tradingview_widget'
}: TradingViewWidgetProps) {
  const container = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const script = document.createElement("script")
    script.src = "https://s3.tradingview.com/tv.js"
    script.type = "text/javascript"
    script.async = true
    script.onload = () => {
      if (typeof (window as any).TradingView !== 'undefined') {
        new (window as any).TradingView.widget({
          "width": "100%",
          "height": "100%",
          "symbol": symbol,
          "interval": interval,
          "timezone": "Etc/UTC",
          "theme": theme,
          "style": "1",
          "locale": "en",
          "toolbar_bg": "#f1f3f6",
          "enable_publishing": false,
          "allow_symbol_change": allow_symbol_change,
          "container_id": container_id,
          "hide_side_toolbar": hide_side_toolbar,
          "studies": [
            "Volume@tv-basicstudies"
          ],
          "show_popup_button": true,
          "popup_width": "1000",
          "popup_height": "650"
        })
      }
    }
    
    if (container.current) {
      container.current.appendChild(script)
    }

    return () => {
      if (container.current) {
        container.current.innerHTML = ''
      }
    }
  }, [symbol, interval, theme, hide_side_toolbar, allow_symbol_change, container_id])

  return (
    <div ref={container} className="h-full w-full">
      <div 
        className="tradingview-widget-container h-full w-full"
        id={container_id}
      />
    </div>
  )
}

export default memo(TradingViewWidget)