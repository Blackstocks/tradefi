'use client'

import { useState, useCallback } from 'react'
import { Responsive, WidthProvider } from 'react-grid-layout'
import { GripVertical } from 'lucide-react'
import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'

const ResponsiveGridLayout = WidthProvider(Responsive)

interface DraggableLayoutProps {
  children: {
    chart: React.ReactNode
    orderBook: React.ReactNode
    sidebar: React.ReactNode
    marketHeader: React.ReactNode
  }
}

export default function DraggableLayout({ children }: DraggableLayoutProps) {
  // Define initial layouts for different breakpoints
  const [layouts, setLayouts] = useState({
    lg: [
      { i: 'market-header', x: 0, y: 0, w: 12, h: 1, static: true },
      { i: 'chart', x: 0, y: 1, w: 6, h: 8 },
      { i: 'orderbook', x: 6, y: 1, w: 3, h: 8 },
      { i: 'sidebar', x: 9, y: 1, w: 3, h: 8 }
    ],
    md: [
      { i: 'market-header', x: 0, y: 0, w: 10, h: 1, static: true },
      { i: 'chart', x: 0, y: 1, w: 5, h: 8 },
      { i: 'orderbook', x: 5, y: 1, w: 3, h: 8 },
      { i: 'sidebar', x: 8, y: 1, w: 2, h: 8 }
    ],
    sm: [
      { i: 'market-header', x: 0, y: 0, w: 6, h: 1, static: true },
      { i: 'chart', x: 0, y: 1, w: 6, h: 6 },
      { i: 'orderbook', x: 0, y: 7, w: 6, h: 4 },
      { i: 'sidebar', x: 0, y: 11, w: 6, h: 4 }
    ]
  })

  const handleLayoutChange = useCallback((currentLayout: any, allLayouts: any) => {
    setLayouts(allLayouts)
    // Save to localStorage for persistence
    localStorage.setItem('tradingLayouts', JSON.stringify(allLayouts))
  }, [])

  // Custom drag handle component
  const DragHandle = () => (
    <div className="absolute top-0 left-0 w-full h-6 bg-black/50 opacity-0 hover:opacity-100 transition-opacity cursor-move flex items-center justify-center">
      <GripVertical className="h-4 w-4 text-white/50" />
    </div>
  )

  return (
    <div className="h-full bg-black">
      <style jsx global>{`
        .react-grid-item {
          transition: all 200ms ease;
          transition-property: left, top;
        }
        .react-grid-item.cssTransforms {
          transition-property: transform;
        }
        .react-grid-item.resizing {
          z-index: 100;
          will-change: width, height;
        }
        .react-grid-item.react-draggable-dragging {
          transition: none;
          z-index: 100;
          will-change: transform;
        }
        .react-grid-item.dropping {
          visibility: hidden;
        }
        .react-grid-item.react-grid-placeholder {
          background: #ff6b00;
          opacity: 0.2;
          transition-duration: 100ms;
          z-index: 2;
          border-radius: 4px;
        }
        .react-resizable-handle {
          position: absolute;
          width: 20px;
          height: 20px;
          background-image: url('data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDE2LjAuMCwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPgo8IURPQ1RZUEUgc3ZnIFBVQkxJQyAiLS8vVzNDLy9EVEQgU1ZHIDEuMS8vRU4iICJodHRwOi8vd3d3LnczLm9yZy9HcmFwaGljcy9TVkcvMS4xL0RURC9zdmcxMS5kdGQiPgo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IgoJIHdpZHRoPSI2cHgiIGhlaWdodD0iNnB4IiB2aWV3Qm94PSIwIDAgNiA2IiBlbmFibGUtYmFja2dyb3VuZD0ibmV3IDAgMCA2IDYiIHhtbDpzcGFjZT0icHJlc2VydmUiPgo8ZyBvcGFjaXR5PSIwLjMwMiI+Cgk8cGF0aCBkPSJNNiw2SDBWNGg0djJINnoiLz4KCTxwYXRoIGQ9Ik02LDNIMFYwaDZ2M3oiLz4KPC9nPgo8L3N2Zz4K');
          background-position: bottom right;
          background-repeat: no-repeat;
          background-origin: content-box;
          box-sizing: border-box;
          cursor: se-resize;
        }
        .react-resizable-handle-se {
          bottom: 0;
          right: 0;
        }
      `}</style>

      <ResponsiveGridLayout
        className="layout"
        layouts={layouts}
        breakpoints={{ lg: 1200, md: 996, sm: 768 }}
        cols={{ lg: 12, md: 10, sm: 6 }}
        rowHeight={80}
        onLayoutChange={handleLayoutChange}
        draggableHandle=".drag-handle"
        compactType={null}
        preventCollision={true}
      >
        <div key="market-header" className="relative">
          {children.marketHeader}
        </div>
        
        <div key="chart" className="relative border border-[#1a1a1a] overflow-hidden">
          <div className="drag-handle">
            <DragHandle />
          </div>
          <div className="h-full">
            {children.chart}
          </div>
        </div>
        
        <div key="orderbook" className="relative border border-[#1a1a1a] overflow-hidden">
          <div className="drag-handle">
            <DragHandle />
          </div>
          <div className="h-full">
            {children.orderBook}
          </div>
        </div>
        
        <div key="sidebar" className="relative border border-[#1a1a1a] overflow-hidden">
          <div className="drag-handle">
            <DragHandle />
          </div>
          <div className="h-full">
            {children.sidebar}
          </div>
        </div>
      </ResponsiveGridLayout>
    </div>
  )
}