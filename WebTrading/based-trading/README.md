# Based Trading Platform Clone

A professional cryptocurrency trading terminal built with Next.js 14, TypeScript, and Tailwind CSS, inspired by based.one and Hyperliquid interfaces.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Charts**: Lightweight Charts (TradingView library)
- **State Management**: Zustand (installed, ready for implementation)
- **UI Components**: Custom components with Radix UI primitives
- **Real-time Data**: WebSocket ready architecture

## Features

- 📊 **Real-time Trading Charts** - Interactive candlestick charts with multiple timeframes
- 📖 **Order Book** - Live bid/ask visualization with depth
- 💹 **Trading Interface** - Market, limit, and stop orders with leverage
- 📱 **Responsive Design** - Fully responsive grid layout
- 🌙 **Dark Theme** - Professional dark mode interface
- 💼 **Portfolio Management** - Positions, orders, and trade history
- 📈 **Market Watchlist** - Favorite markets with real-time prices

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) to view the application

## Project Structure

```
based-trading/
├── app/                    # Next.js app router pages
│   ├── page.tsx           # Main trading page
│   ├── layout.tsx         # Root layout
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── Header.tsx         # Navigation header
│   ├── Sidebar.tsx        # Market watchlist sidebar
│   ├── TradingChart.tsx   # Chart component
│   ├── OrderBook.tsx      # Order book display
│   ├── TradingForm.tsx    # Buy/sell form
│   ├── AccountOverview.tsx # Account stats
│   └── PositionsPanel.tsx # Positions/orders/history
├── lib/                   # Utility functions
├── hooks/                 # Custom React hooks
├── types/                 # TypeScript type definitions
└── utils/                 # Helper functions
```

## Component Architecture

Each component is designed to be:
- **Self-contained**: Minimal dependencies between components
- **Reusable**: Easy to import and use in different contexts
- **Type-safe**: Full TypeScript support
- **Performant**: Optimized re-renders and efficient updates

## Future Enhancements

- WebSocket integration for real-time price updates
- Hyperliquid API integration
- Advanced charting indicators
- Multi-exchange support
- Mobile app version
- Social trading features

## Development

The codebase follows modern React best practices:
- Server and Client Components where appropriate
- Proper TypeScript typing
- Tailwind CSS for consistent styling
- Component composition patterns
- Performance optimizations

## License

This is a demo/educational project. Please ensure you have proper licensing for any production use.