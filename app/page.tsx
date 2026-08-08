"use client"

import { Shader, ChromaFlow, Swirl } from "shaders/react"
import { CustomCursor } from "@/components/custom-cursor"
import { GrainOverlay } from "@/components/grain-overlay"
import { WorkSection } from "@/components/sections/work-section"
import { ServicesSection } from "@/components/sections/services-section"
import { AboutSection } from "@/components/sections/about-section"
import { ContactSection } from "@/components/sections/contact-section"
import { MagneticButton } from "@/components/magnetic-button"
import { useRef, useEffect, useState, useCallback } from "react"

const sectionAccents = [
  { hex: "#d47a3e", name: "Warm Amber" },
  { hex: "#10b981", name: "Care Emerald" },
  { hex: "#3b82f6", name: "Cyber Sapphire" },
  { hex: "#f43f5e", name: "Crimson Vision" },
  { hex: "#8b5cf6", name: "Violet Platinum" },
]

function lerpColor(color1: string, color2: string, factor: number): string {
  const c1 = parseInt(color1.replace("#", ""), 16)
  const c2 = parseInt(color2.replace("#", ""), 16)

  const r1 = (c1 >> 16) & 255, g1 = (c1 >> 8) & 255, b1 = c1 & 255
  const r2 = (c2 >> 16) & 255, g2 = (c2 >> 8) & 255, b2 = c2 & 255

  const r = Math.round(r1 + factor * (r2 - r1))
  const g = Math.round(g1 + factor * (g2 - g1))
  const b = Math.round(b1 + factor * (b2 - b1))

  const toHex = (n: number) => n.toString(16).padStart(2, "0")
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`
}

export default function Home() {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [currentSection, setCurrentSection] = useState(0)
  const [accentColor, setAccentColor] = useState(sectionAccents[0].hex)
  const [isLoaded, setIsLoaded] = useState(false)
  const touchStartY = useRef(0)
  const touchStartX = useRef(0)
  const shaderContainerRef = useRef<HTMLDivElement>(null)
  const scrollThrottleRef = useRef<number>()

  useEffect(() => {
    const checkShaderReady = () => {
      if (shaderContainerRef.current) {
        const canvas = shaderContainerRef.current.querySelector("canvas")
        if (canvas && canvas.width > 0 && canvas.height > 0) {
          setIsLoaded(true)
          return true
        }
      }
      return false
    }

    if (checkShaderReady()) return

    const intervalId = setInterval(() => {
      if (checkShaderReady()) {
        clearInterval(intervalId)
      }
    }, 100)

    const fallbackTimer = setTimeout(() => {
      setIsLoaded(true)
    }, 1500)

    return () => {
      clearInterval(intervalId)
      clearTimeout(fallbackTimer)
    }
  }, [])

  const scrollToSection = (index: number) => {
    if (scrollContainerRef.current) {
      const sectionWidth = scrollContainerRef.current.offsetWidth
      scrollContainerRef.current.scrollTo({
        left: sectionWidth * index,
        behavior: "smooth",
      })
      setCurrentSection(index)
    }
  }

  const handleContinuousScroll = useCallback(() => {
    if (!scrollContainerRef.current) return
    const container = scrollContainerRef.current
    const sectionWidth = container.offsetWidth
    if (!sectionWidth) return

    const scrollLeft = container.scrollLeft
    const rawProgress = Math.max(0, Math.min(scrollLeft / sectionWidth, sectionAccents.length - 1))
    
    const index0 = Math.floor(rawProgress)
    const index1 = Math.min(index0 + 1, sectionAccents.length - 1)
    const factor = rawProgress - index0

    const interpolatedAccent = lerpColor(sectionAccents[index0].hex, sectionAccents[index1].hex, factor)
    setAccentColor(interpolatedAccent)

    const newSection = Math.round(rawProgress)
    if (newSection !== currentSection && newSection >= 0 && newSection < sectionAccents.length) {
      setCurrentSection(newSection)
    }
  }, [currentSection])

  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0].clientY
      touchStartX.current = e.touches[0].clientX
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (Math.abs(e.touches[0].clientY - touchStartY.current) > 10) {
        e.preventDefault()
      }
    }

    const handleTouchEnd = (e: TouchEvent) => {
      const touchEndY = e.changedTouches[0].clientY
      const touchEndX = e.changedTouches[0].clientX
      const deltaY = touchStartY.current - touchEndY
      const deltaX = touchStartX.current - touchEndX

      if (Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaY) > 50) {
        if (deltaY > 0 && currentSection < 4) {
          scrollToSection(currentSection + 1)
        } else if (deltaY < 0 && currentSection > 0) {
          scrollToSection(currentSection - 1)
        }
      }
    }

    const container = scrollContainerRef.current
    if (container) {
      container.addEventListener("touchstart", handleTouchStart, { passive: true })
      container.addEventListener("touchmove", handleTouchMove, { passive: false })
      container.addEventListener("touchend", handleTouchEnd, { passive: true })
    }

    return () => {
      if (container) {
        container.removeEventListener("touchstart", handleTouchStart)
        container.removeEventListener("touchmove", handleTouchMove)
        container.removeEventListener("touchend", handleTouchEnd)
      }
    }
  }, [currentSection])

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault()

        if (!scrollContainerRef.current) return

        scrollContainerRef.current.scrollBy({
          left: e.deltaY,
          behavior: "smooth",
        })

        handleContinuousScroll()
      }
    }

    const container = scrollContainerRef.current
    if (container) {
      container.addEventListener("wheel", handleWheel, { passive: false })
    }

    return () => {
      if (container) {
        container.removeEventListener("wheel", handleWheel)
      }
    }
  }, [handleContinuousScroll])

  useEffect(() => {
    const handleScroll = () => {
      if (scrollThrottleRef.current) return

      scrollThrottleRef.current = requestAnimationFrame(() => {
        handleContinuousScroll()
        scrollThrottleRef.current = undefined
      })
    }

    const container = scrollContainerRef.current
    if (container) {
      container.addEventListener("scroll", handleScroll, { passive: true })
    }

    return () => {
      if (container) {
        container.removeEventListener("scroll", handleScroll)
      }
      if (scrollThrottleRef.current) {
        cancelAnimationFrame(scrollThrottleRef.current)
      }
    }
  }, [handleContinuousScroll])

  return (
    <main className="relative h-screen w-full overflow-hidden bg-black text-white selection:bg-white selection:text-black">
      <CustomCursor />
      <GrainOverlay />

      {/* Smooth Minimal Ambient Accent Glow (Low Opacity) */}
      <div
        className="pointer-events-none fixed inset-0 z-0 transition-colors duration-500 ease-linear"
        style={{
          background: `radial-gradient(circle at ${currentSection * 20 + 20}% 40%, ${accentColor}18 0%, transparent 50%)`,
        }}
      />

      {/* Shader Background (Dominant Pure Black + Low Intensity Secondary Accent) */}
      <div
        ref={shaderContainerRef}
        className={`fixed inset-0 z-0 transition-opacity duration-1000 ${isLoaded ? "opacity-100" : "opacity-0"}`}
        style={{ contain: "strict" }}
      >
        <Shader className="h-full w-full">
          <Swirl
            colorA="#000000"
            colorB={accentColor}
            speed={0.3}
            detail={0.5}
            blend={85}
            coarseX={30}
            coarseY={30}
            mediumX={30}
            mediumY={30}
            fineX={30}
            fineY={30}
          />
          <ChromaFlow
            baseColor="#000000"
            upColor="#000000"
            downColor="#000000"
            leftColor="#050505"
            rightColor={accentColor}
            intensity={0.35}
            radius={1.4}
            momentum={15}
            maskType="alpha"
            opacity={0.7}
          />
        </Shader>
        <div className="absolute inset-0 bg-black/85 backdrop-blur-[2px]" />
      </div>

      {/* Clean Minimal Nav */}
      <nav
        className={`fixed left-0 right-0 top-0 z-50 flex items-center justify-center px-6 py-6 transition-opacity duration-700 md:px-12 ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="flex items-center gap-8">
          {["Home", "Ecosystem", "Pillars", "Vision", "Contact"].map((item, index) => (
            <button
              key={item}
              onClick={() => scrollToSection(index)}
              className={`group relative font-sans text-sm font-medium transition-colors ${
                currentSection === index ? "text-white font-semibold" : "text-white/60 hover:text-white"
              }`}
            >
              {item}
              <span
                className={`absolute -bottom-1 left-0 h-0.5 bg-white transition-all duration-300 ${
                  currentSection === index ? "w-full" : "w-0 group-hover:w-full"
                }`}
              />
            </button>
          ))}
        </div>
      </nav>

      {/* Snap Scroll Container */}
      <div
        ref={scrollContainerRef}
        data-scroll-container
        className={`relative z-10 flex h-screen w-full overflow-x-auto overflow-y-hidden snap-x snap-mandatory scroll-smooth transition-opacity duration-700 ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {/* Section 0: Hero Section (Pure White Primary) */}
        <section className="flex h-screen w-screen shrink-0 snap-start snap-always flex-col justify-center px-6 md:px-12 lg:px-16">
          <div className="mx-auto w-full max-w-6xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 backdrop-blur-md">
              <span className="h-2 w-2 rounded-full bg-white animate-pulse" />
              <p className="font-mono text-xs text-white mix-blend-difference">
                AI & Tech for Societal Good · Privacy First
              </p>
            </div>

            <h1 className="mb-4 font-sans text-4xl font-extralight tracking-tight text-white mix-blend-difference md:text-7xl lg:text-8xl">
              Technology built for <span className="font-normal text-white">societal betterment</span>.
            </h1>

            <p className="mb-8 max-w-3xl text-base font-light text-white/80 mix-blend-difference md:text-xl">
              Privacy-first AI platforms designed for real human empowerment, safety, and genuine care.
            </p>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <MagneticButton
                size="lg"
                variant="primary"
                onClick={() => window.open("https://wadud.care", "_blank")}
              >
                Explore Wadud Care
              </MagneticButton>
              <MagneticButton size="lg" variant="secondary" onClick={() => scrollToSection(3)}>
                Our Mission
              </MagneticButton>
            </div>
          </div>
        </section>

        {/* Section 1: Ecosystem */}
        <WorkSection />

        {/* Section 2: Pillars */}
        <ServicesSection />

        {/* Section 3: Vision */}
        <AboutSection scrollToSection={scrollToSection} />

        {/* Section 4: Contact */}
        <ContactSection />
      </div>

      <style jsx global>{`
        div::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </main>
  )
}


