'use client'

import { IChartApi, ISeriesApi, LineData, UTCTimestamp } from 'lightweight-charts'

export interface IndicatorOptions {
  chart: IChartApi
  candlestickSeries: ISeriesApi<"Candlestick">
}

// Simple Moving Average
export function addSMA(options: IndicatorOptions, period: number = 20) {
  const { chart } = options
  
  const smaSeries = chart.addLineSeries({
    color: '#f97316',
    lineWidth: 2,
    priceLineVisible: false,
    lastValueVisible: false,
    crosshairMarkerVisible: false,
  })

  return {
    series: smaSeries,
    update: (data: any[]) => {
      const smaData: LineData[] = []
      
      for (let i = period - 1; i < data.length; i++) {
        let sum = 0
        for (let j = 0; j < period; j++) {
          sum += data[i - j].close
        }
        smaData.push({
          time: data[i].time,
          value: sum / period,
        })
      }
      
      smaSeries.setData(smaData)
    }
  }
}

// Exponential Moving Average
export function addEMA(options: IndicatorOptions, period: number = 20) {
  const { chart } = options
  
  const emaSeries = chart.addLineSeries({
    color: '#3b82f6',
    lineWidth: 2,
    priceLineVisible: false,
    lastValueVisible: false,
    crosshairMarkerVisible: false,
  })

  return {
    series: emaSeries,
    update: (data: any[]) => {
      const emaData: LineData[] = []
      const multiplier = 2 / (period + 1)
      
      if (data.length === 0) return
      
      // Calculate initial SMA
      let ema = 0
      for (let i = 0; i < Math.min(period, data.length); i++) {
        ema += data[i].close
      }
      ema = ema / Math.min(period, data.length)
      
      emaData.push({
        time: data[Math.min(period - 1, data.length - 1)].time,
        value: ema,
      })
      
      // Calculate EMA for remaining data
      for (let i = period; i < data.length; i++) {
        ema = (data[i].close - ema) * multiplier + ema
        emaData.push({
          time: data[i].time,
          value: ema,
        })
      }
      
      emaSeries.setData(emaData)
    }
  }
}

// Bollinger Bands
export function addBollingerBands(options: IndicatorOptions, period: number = 20, stdDev: number = 2) {
  const { chart } = options
  
  const upperBand = chart.addLineSeries({
    color: 'rgba(168, 85, 247, 0.5)',
    lineWidth: 1,
    priceLineVisible: false,
    lastValueVisible: false,
    crosshairMarkerVisible: false,
  })
  
  const lowerBand = chart.addLineSeries({
    color: 'rgba(168, 85, 247, 0.5)',
    lineWidth: 1,
    priceLineVisible: false,
    lastValueVisible: false,
    crosshairMarkerVisible: false,
  })
  
  const middleBand = chart.addLineSeries({
    color: 'rgba(168, 85, 247, 0.8)',
    lineWidth: 1,
    lineStyle: 2, // Dashed
    priceLineVisible: false,
    lastValueVisible: false,
    crosshairMarkerVisible: false,
  })

  return {
    series: { upper: upperBand, lower: lowerBand, middle: middleBand },
    update: (data: any[]) => {
      const upperData: LineData[] = []
      const lowerData: LineData[] = []
      const middleData: LineData[] = []
      
      for (let i = period - 1; i < data.length; i++) {
        let sum = 0
        for (let j = 0; j < period; j++) {
          sum += data[i - j].close
        }
        const sma = sum / period
        
        let squaredDiffSum = 0
        for (let j = 0; j < period; j++) {
          squaredDiffSum += Math.pow(data[i - j].close - sma, 2)
        }
        const stdDeviation = Math.sqrt(squaredDiffSum / period)
        
        middleData.push({ time: data[i].time, value: sma })
        upperData.push({ time: data[i].time, value: sma + stdDev * stdDeviation })
        lowerData.push({ time: data[i].time, value: sma - stdDev * stdDeviation })
      }
      
      upperBand.setData(upperData)
      lowerBand.setData(lowerData)
      middleBand.setData(middleData)
    }
  }
}

// RSI (Relative Strength Index)
export function addRSI(options: IndicatorOptions, period: number = 14) {
  const { chart } = options
  
  // Create a new price scale for RSI
  const rsiSeries = chart.addLineSeries({
    color: '#f97316',
    lineWidth: 2,
    priceFormat: {
      type: 'custom',
      formatter: (price: any) => price.toFixed(0),
    },
    priceScaleId: 'rsi',
  })
  
  // Configure RSI scale
  chart.priceScale('rsi').applyOptions({
    scaleMargins: {
      top: 0.8,
      bottom: 0,
    },
  })

  // Add RSI levels
  rsiSeries.createPriceLine({
    price: 70,
    color: 'rgba(239, 68, 68, 0.5)',
    lineWidth: 1,
    lineStyle: 2,
    axisLabelVisible: true,
  })
  
  rsiSeries.createPriceLine({
    price: 30,
    color: 'rgba(34, 197, 94, 0.5)',
    lineWidth: 1,
    lineStyle: 2,
    axisLabelVisible: true,
  })

  return {
    series: rsiSeries,
    update: (data: any[]) => {
      const rsiData: LineData[] = []
      
      if (data.length < period + 1) return
      
      for (let i = period; i < data.length; i++) {
        let gains = 0
        let losses = 0
        
        for (let j = 1; j <= period; j++) {
          const change = data[i - j + 1].close - data[i - j].close
          if (change > 0) {
            gains += change
          } else {
            losses -= change
          }
        }
        
        const avgGain = gains / period
        const avgLoss = losses / period
        const rs = avgLoss === 0 ? 100 : avgGain / avgLoss
        const rsi = 100 - (100 / (1 + rs))
        
        rsiData.push({
          time: data[i].time,
          value: rsi,
        })
      }
      
      rsiSeries.setData(rsiData)
    }
  }
}

// MACD (Moving Average Convergence Divergence)
export function addMACD(options: IndicatorOptions, fastPeriod: number = 12, slowPeriod: number = 26, signalPeriod: number = 9) {
  const { chart } = options
  
  const macdLine = chart.addLineSeries({
    color: '#3b82f6',
    lineWidth: 2,
    priceScaleId: 'macd',
    priceLineVisible: false,
    lastValueVisible: false,
  })
  
  const signalLine = chart.addLineSeries({
    color: '#ef4444',
    lineWidth: 2,
    priceScaleId: 'macd',
    priceLineVisible: false,
    lastValueVisible: false,
  })
  
  const histogram = chart.addHistogramSeries({
    color: '#22c55e',
    priceScaleId: 'macd',
  })
  
  // Configure MACD scale
  chart.priceScale('macd').applyOptions({
    scaleMargins: {
      top: 0.85,
      bottom: 0,
    },
  })

  return {
    series: { macd: macdLine, signal: signalLine, histogram },
    update: (data: any[]) => {
      if (data.length < slowPeriod + signalPeriod) return
      
      // Calculate EMAs
      const emaFast = calculateEMA(data, fastPeriod)
      const emaSlow = calculateEMA(data, slowPeriod)
      
      // Calculate MACD line
      const macdData: LineData[] = []
      const macdValues: number[] = []
      
      for (let i = slowPeriod - 1; i < data.length; i++) {
        const macdValue = emaFast[i] - emaSlow[i]
        macdData.push({
          time: data[i].time,
          value: macdValue,
        })
        macdValues.push(macdValue)
      }
      
      // Calculate Signal line
      const signalData: LineData[] = []
      const signalEMA = calculateEMAFromValues(macdValues, signalPeriod)
      
      for (let i = signalPeriod - 1; i < macdValues.length; i++) {
        signalData.push({
          time: data[i + slowPeriod - 1].time,
          value: signalEMA[i],
        })
      }
      
      // Calculate Histogram
      const histogramData: any[] = []
      for (let i = 0; i < signalData.length; i++) {
        const macdIdx = i + signalPeriod - 1
        const histValue = macdData[macdIdx].value - signalData[i].value
        histogramData.push({
          time: signalData[i].time,
          value: histValue,
          color: histValue >= 0 ? 'rgba(34, 197, 94, 0.5)' : 'rgba(239, 68, 68, 0.5)',
        })
      }
      
      macdLine.setData(macdData)
      signalLine.setData(signalData)
      histogram.setData(histogramData)
    }
  }
}

// Helper function to calculate EMA
function calculateEMA(data: any[], period: number): number[] {
  const ema: number[] = []
  const multiplier = 2 / (period + 1)
  
  // Calculate initial SMA
  let sum = 0
  for (let i = 0; i < period; i++) {
    sum += data[i].close
  }
  ema[period - 1] = sum / period
  
  // Calculate EMA
  for (let i = period; i < data.length; i++) {
    ema[i] = (data[i].close - ema[i - 1]) * multiplier + ema[i - 1]
  }
  
  return ema
}

function calculateEMAFromValues(values: number[], period: number): number[] {
  const ema: number[] = []
  const multiplier = 2 / (period + 1)
  
  // Calculate initial SMA
  let sum = 0
  for (let i = 0; i < period; i++) {
    sum += values[i]
  }
  ema[period - 1] = sum / period
  
  // Calculate EMA
  for (let i = period; i < values.length; i++) {
    ema[i] = (values[i] - ema[i - 1]) * multiplier + ema[i - 1]
  }
  
  return ema
}