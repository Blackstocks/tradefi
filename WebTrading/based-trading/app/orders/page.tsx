"use client"

import { useState } from "react"
import Header from "@/components/Header"
import { Calendar, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react"

type ScopeTab =
  | "Active"
  | "Canceled"
  | "Finished"
  | "Scheduled"
  | "Paused"
  | "Conditional"
type ModeTab = "Single" | "Multi" | "Chained" | "Batch"

export default function OrdersPage() {
  const [scope, setScope] = useState<ScopeTab>("Active")
  const [mode, setMode] = useState<ModeTab>("Single")
  const orders: any[] = []

  const FilterChip = ({
    label,
    rightIcon = <ChevronDown className="h-3.5 w-3.5 opacity-80" />,
    leftIcon,
    className = "",
  }: {
    label: string
    rightIcon?: React.ReactNode
    leftIcon?: React.ReactNode
    className?: string
  }) => (
    <button
      type="button"
      className={`inline-flex items-center gap-1.5 rounded-md border border-white/60 bg-[#0a0a0a] px-2.5 py-1.5 text-xs text-white hover:bg-[#111] ${className}`}
    >
      {leftIcon}
      <span className="whitespace-nowrap">{label}</span>
      {rightIcon}
    </button>
  )

  const SegButton = ({
    label,
    active,
    onClick,
  }: {
    label: string
    active: boolean
    onClick: () => void
  }) => (
    <button
      onClick={onClick}
      className={`rounded-md px-2.5 py-1.5 text-xs border border-white ${
        active
          ? "bg-[#1c1c1c] text-white"
          : "bg-transparent text-white hover:bg_white/10 hover:bg-white/10"
      }`}
    >
      {label}
    </button>
  )

  return (
    <div className="bg-background min-h-screen flex flex-col text-white text-xs">
      <Header />
      <main className="flex-1 overflow-auto">
        {/* full-width, no side margins */}
        <div className="w-full px-0 py-3">
          {/* TOP FILTER BAR — centered */}
          <div className="flex w-full flex-wrap items-center justify-center gap-2.5">
            <FilterChip
              label="Date From"
              rightIcon={<Calendar className="h-3.5 w-3.5 opacity-80" />}
            />
            <FilterChip
              label="Date To"
              rightIcon={<Calendar className="h-3.5 w-3.5 opacity-80" />}
            />
            <FilterChip label="Account" />
            <FilterChip label="Pair" />
            <FilterChip label="Side" />
            <FilterChip label="Strategy" />
            <FilterChip label="Market Type" />
          </div>

          {/* SEGMENTED BUTTONS + Cancel All */}
          <div className="mt-3 flex items-center justify-between px-4">
            <div className="flex flex-wrap items-center gap-2">
              {(
                [
                  "Active",
                  "Canceled",
                  "Finished",
                  "Scheduled",
                  "Paused",
                  "Conditional",
                ] as ScopeTab[]
              ).map((t) => (
                <SegButton
                  key={t}
                  label={t}
                  active={scope === t}
                  onClick={() => setScope(t)}
                />
              ))}

              <div className="mx-2 h-5 w-px bg-white/30" />

              {(["Single", "Multi", "Chained", "Batch"] as ModeTab[]).map(
                (t) => (
                  <SegButton
                    key={t}
                    label={t}
                    active={mode === t}
                    onClick={() => setMode(t)}
                  />
                )
              )}
            </div>

            <button
              type="button"
              className="font-medium text-red-400 hover:text-red-300"
            >
              Cancel All
            </button>
          </div>

          {/* TABLE SHELL */}
          <div className="relative mt-3 overflow-hidden rounded-lg border border-border bg-card">
            {/* header */}
            <div className="sticky top-0 grid grid-cols-12 gap-2 border-b border-border bg-card/90 px-5 py-2.5 font-medium text-white backdrop-blur">
              <div className="col-span-2">Pair</div>
              <div className="col-span-1">Side</div>
              <div className="col-span-2">Target Qty</div>
              <div className="col-span-1">Filled</div>
              <div className="col-span-2">Time Start</div>
              <div className="col-span-2">Strategy</div>
              <div className="col-span-2">Status</div>
            </div>

            {/* body (taller) */}
            <div className="relative min-h-[520px]">
              {orders.length === 0 ? (
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                  <p className="text-sm font-medium">No orders found</p>
                </div>
              ) : (
                <div className="divide-y divide-border">{/* rows */}</div>
              )}
            </div>
          </div>
        </div>

        {/* PAGINATION — bottom of page */}
        <div className="sticky bottom-0 w-full bg-background/60 backdrop-blur px-4 py-2.5">
          <div className="ml-auto flex w-full max-w-[300px] items-center justify-end gap-2">
            <span>1–15 of 15</span>
            <button className="inline-flex h-6 w-6 items-center justify-center rounded border border-white bg-transparent hover:bg-white/10">
              <ChevronLeft className="h-3.5 w-3.5" />
            </button>
            <button className="inline-flex h-6 w-6 items-center justify-center rounded border border-white bg-transparent hover:bg-white/10">
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
