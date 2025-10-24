'use client'

import { useState, useCallback, useEffect } from 'react'
import { Responsive, WidthProvider } from 'react-grid-layout'
import { GripVertical } from 'lucide-react'
import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'
import { DragContext } from './SafeDraggableChart'

const ResponsiveGridLayout = WidthProvider(Responsive)

interface DraggableLayoutProps {
  children: {
    chart: React.ReactNode
    orderBook: React.ReactNode
    sidebar: React.ReactNode
    marketHeader: React.ReactNode
    bottomPanel?: React.ReactNode
  }
}

export default function DraggableLayout({ children }: DraggableLayoutProps) {
  const [isDragging, setIsDragging] = useState(false)
  
  // Match the exact locked layout structure: 75% left (chart+orderbook), 25% right (sidebar)
  const defaultLayouts = {
    lg: [
      // Market header spans only the left 75%
      { i: 'market-header', x: 0, y: 0, w: 9, h: 1, static: false, minW: 6, maxW: 9 },
      // Chart takes most of the left area
      { i: 'chart', x: 0, y: 1, w: 6, h: 6, minW: 4, minH: 4 },
      // Order book on the right of chart
      { i: 'orderbook', x: 6, y: 1, w: 3, h: 6, minW: 2, minH: 4 },
      // Sidebar takes the full right 25%
      { i: 'sidebar', x: 9, y: 0, w: 3, h: 10, minW: 2, minH: 8 },
      // Bottom panel under chart and orderbook only
      { i: 'bottom-panel', x: 0, y: 7, w: 9, h: 3, minW: 6, minH: 2 }
    ]
  }

  // Load saved layouts or use defaults
  const [layouts, setLayouts] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('tradingLayouts')
      if (saved) {
        try {
          return JSON.parse(saved)
        } catch (e) {
          console.error('Failed to load saved layouts:', e)
        }
      }
    }
    return defaultLayouts
  })

  const handleLayoutChange = useCallback((currentLayout: any, allLayouts: any) => {
    setLayouts(allLayouts)
    // Save to localStorage for persistence
    if (typeof window !== 'undefined' && !isDragging) {
      localStorage.setItem('tradingLayouts', JSON.stringify(allLayouts))
    }
  }, [isDragging])

  const handleDragStart = useCallback(() => {
    console.log('Drag started')
    setIsDragging(true)
  }, [])

  const handleDragStop = useCallback(() => {
    console.log('Drag stopped')
    // Longer delay to ensure chart is fully disposed
    setTimeout(() => {
      setIsDragging(false)
    }, 300)
  }, [])

  const handleResizeStart = useCallback(() => {
    console.log('Resize started')
    setIsDragging(true)
  }, [])

  const handleResizeStop = useCallback(() => {
    console.log('Resize stopped')
    setTimeout(() => {
      setIsDragging(false)
    }, 300)
  }, [])

  const resetLayout = () => {
    setLayouts(defaultLayouts)
    if (typeof window !== 'undefined') {
      localStorage.removeItem('tradingLayouts')
    }
  }

  // Custom drag handle component
  const DragHandle = () => (
    <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-black/20 to-transparent opacity-0 hover:opacity-100 transition-opacity cursor-move flex items-center justify-center z-10">
      <div className="bg-gray-700 rounded-full p-1">
        <GripVertical className="h-3 w-3 text-gray-400" />
      </div>
    </div>
  )

  return (
    <DragContext.Provider value={{ isDragging, setIsDragging }}>
      <div className="h-full bg-black relative">
        {/* Reset button */}
        <button
          onClick={resetLayout}
          className="absolute top-2 right-32 z-50 px-3 py-1 bg-black border border-[#1a1a1a] rounded text-xs text-white hover:bg-[#0a0a0a] transition-colors"
        >
          Reset Layout
        </button>

        <style jsx global>{`
          .react-grid-layout {
            position: relative;
          }
          .react-grid-item {
            transition: all 200ms ease;
            transition-property: left, top, width, height;
          }
          .react-grid-item.cssTransforms {
            transition-property: transform, width, height;
          }
          .react-grid-item.resizing {
            z-index: 100;
            will-change: width, height;
          }
          .react-grid-item.react-draggable-dragging {
            transition: none;
            z-index: 100;
            will-change: transform;
            opacity: 0.9;
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
            background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2IiBoZWlnaHQ9IjYiPjxwYXRoIGZpbGw9IiM2NjYiIGQ9Ik02IDZIMFY0LjVoNC41VjZINnpNNiAzSDBWMGg2djN6Ii8+PC9zdmc+');
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
          className="layout h-full"
          layouts={layouts}
          breakpoints={{ lg: 1200 }}
          cols={{ lg: 12 }}
          rowHeight={60}
          margin={[0, 0]}
          containerPadding={[0, 0]}
          onLayoutChange={handleLayoutChange}
          onDragStart={handleDragStart}
          onDragStop={handleDragStop}
          onResizeStart={handleResizeStart}
          onResizeStop={handleResizeStop}
          draggableHandle=".drag-handle"
          compactType={null}
          preventCollision={false}
          isResizable={true}
          isDraggable={true}
        >
          <div key="market-header" className="bg-black">
            {children.marketHeader}
          </div>
          
          <div key="chart" className="relative bg-black overflow-hidden">
            <div className="drag-handle">
              <DragHandle />
            </div>
            <div className="h-full">
              {children.chart}
            </div>
          </div>
          
          <div key="orderbook" className="relative bg-black overflow-hidden">
            <div className="drag-handle">
              <DragHandle />
            </div>
            <div className="h-full">
              {children.orderBook}
            </div>
          </div>
          
          <div key="sidebar" className="relative bg-[#0e0e0e] border-l border-[#1a1a1a] overflow-hidden">
            <div className="drag-handle">
              <DragHandle />
            </div>
            <div className="h-full">
              {children.sidebar}
            </div>
          </div>
          
          <div key="bottom-panel" className="relative bg-black border-t border-[#1a1a1a] overflow-hidden">
            <div className="drag-handle">
              <DragHandle />
            </div>
            <div className="h-full">
              {children.bottomPanel || <div className="p-4 text-gray-500">Bottom Panel</div>}
            </div>
          </div>
        </ResponsiveGridLayout>
      </div>
    </DragContext.Provider>
  )
}