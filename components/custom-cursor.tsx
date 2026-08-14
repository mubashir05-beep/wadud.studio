"use client"

import { useEffect, useRef, useState } from "react"

export function CustomCursor() {
  const outerRef = useRef<HTMLDivElement>(null)
  const innerRef = useRef<HTMLDivElement>(null)
  const positionRef = useRef({ x: -100, y: -100 })
  const targetPositionRef = useRef({ x: -100, y: -100 })
  const isPointerRef = useRef(false)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) {
      return
    }

    let animationFrameId: number

    const lerp = (start: number, end: number, factor: number) => {
      return start + (end - start) * factor
    }

    const updateCursor = () => {
      positionRef.current.x = lerp(positionRef.current.x, targetPositionRef.current.x, 0.22)
      positionRef.current.y = lerp(positionRef.current.y, targetPositionRef.current.y, 0.22)

      if (outerRef.current && innerRef.current) {
        const outerScale = isPointerRef.current ? 2.2 : 1
        const innerScale = isPointerRef.current ? 0.3 : 1

        outerRef.current.style.transform = `translate3d(${positionRef.current.x}px, ${positionRef.current.y}px, 0) translate(-50%, -50%) scale(${outerScale})`
        innerRef.current.style.transform = `translate3d(${targetPositionRef.current.x}px, ${targetPositionRef.current.y}px, 0) translate(-50%, -50%) scale(${innerScale})`
      }

      animationFrameId = requestAnimationFrame(updateCursor)
    }

    const handleMouseMove = (e: MouseEvent) => {
      targetPositionRef.current = { x: e.clientX, y: e.clientY }
      if (!isVisible) setIsVisible(true)

      const target = e.target as HTMLElement | null
      if (target) {
        const isInteractive = !!(
          target.closest("button") ||
          target.closest("a") ||
          target.closest("input") ||
          target.closest("textarea") ||
          target.closest("[role='button']") ||
          target.closest(".cursor-pointer") ||
          window.getComputedStyle(target).cursor === "pointer"
        )
        isPointerRef.current = isInteractive
      }
    }

    const handleMouseLeave = () => {
      setIsVisible(false)
    }

    const handleMouseEnter = () => {
      setIsVisible(true)
    }

    window.addEventListener("mousemove", handleMouseMove, { passive: true })
    document.addEventListener("mouseleave", handleMouseLeave)
    document.addEventListener("mouseenter", handleMouseEnter)
    animationFrameId = requestAnimationFrame(updateCursor)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseleave", handleMouseLeave)
      document.removeEventListener("mouseenter", handleMouseEnter)
      cancelAnimationFrame(animationFrameId)
    }
  }, [isVisible])

  if (!isVisible) return null

  return (
    <>
      {/* Outer Ring */}
      <div
        ref={outerRef}
        className="pointer-events-none fixed left-0 top-0 z-[99999] select-none will-change-transform transition-transform duration-75 ease-out"
      >
        <div className="h-7 w-7 rounded-full border border-white/80 bg-transparent" />
      </div>

      {/* Inner Precision Dot */}
      <div
        ref={innerRef}
        className="pointer-events-none fixed left-0 top-0 z-[99999] select-none will-change-transform"
      >
        <div className="h-1.5 w-1.5 rounded-full bg-white" />
      </div>
    </>
  )
}
