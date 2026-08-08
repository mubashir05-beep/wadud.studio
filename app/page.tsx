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

const sectionFlares = [
  { primary: "#d47a3e", secondary: "#1b6b50", glow: "rgba(212, 122, 62, 0.35)", name: "Warm Amber" },
  { primary: "#10b981", secondary: "#059669", glow: "rgba(16, 185, 129, 0.35)", name: "Care Emerald" },
  { primary: "#3b82f6", secondary: "#06b6d4", glow: "rgba(59, 130, 246, 0.35)", name: "Cyber Sapphire" },
  { primary: "#f43f5e", secondary: "#fb923c", glow: "rgba(244, 63, 94, 0.35)", name: "Crimson Vision" },
  { primary: "#8b5cf6", secondary: "#ec4899", glow: "rgba(139, 92, 246, 0.35)", name: "Violet Platinum" },
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
  const [accentColor, setAccentColor] = useState(sectionFlares[0].primary)
  const [secondaryAccent, setSecondaryAccent] = useState(sectionFlares[0].secondary)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [isLoaded, setIsLoaded] = useState(false)
  const touchStartY = useRef(0)
  const touchStartX = useRef(0)
  const shaderContainerRef = useRef<HTMLDivElement>(null)
  const scrollThrottleRef = useRef<number>()

  // Mouse reactivity tracking
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2
      const y = (e.clientY / window.innerHeight - 0.5) * 2
      setMousePos({ x, y })
    }
    window.addEventListener("mousemove", handleMouseMove, { passive: true })
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

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

  const scrollToSection = useCallback((index: number) => {
    if (scrollContainerRef.current) {
      const sectionWidth = scrollContainerRef.current.offsetWidth
      scrollContainerRef.current.scrollTo({
        left: sectionWidth * index,
        behavior: "smooth",
      })
      setCurrentSection(index)
    }
  }, [])

  // Keyboard navigation reactivity
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "PageDown") {
        if (currentSection < sectionFlares.length - 1) {
          scrollToSection(currentSection + 1)
        }
      } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
        if (currentSection > 0) {
          scrollToSection(currentSection - 1)
        }
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [currentSection, scrollToSection])

  const handleContinuousScroll = useCallback(() => {
    if (!scrollContainerRef.current) return
    const container = scrollContainerRef.current
    const sectionWidth = container.offsetWidth
    if (!sectionWidth) return

    const scrollLeft = container.scrollLeft
    const rawProgress = Math.max(0, Math.min(scrollLeft / sectionWidth, sectionFlares.length - 1))
    
    const index0 = Math.floor(rawProgress)
    const index1 = Math.min(index0 + 1, sectionFlares.length - 1)
    const factor = rawProgress - index0

    const interpolatedPrimary = lerpColor(sectionFlares[index0].primary, sectionFlares[index1].primary, factor)
    const interpolatedSecondary = lerpColor(sectionFlares[index0].secondary, sectionFlares[index1].secondary, factor)
    setAccentColor(interpolatedPrimary)
    setSecondaryAccent(interpolatedSecondary)

    const newSection = Math.round(rawProgress)
    if (newSection !== currentSection && newSection >= 0 && newSection < sectionFlares.length) {
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
  }, [currentSection, scrollToSection])

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

  const activeFlare = sectionFlares[currentSection] || sectionFlares[0]

  return (
    <main className="relative h-screen w-full overflow-hidden bg-black text-white selection:bg-white selection:text-black">
      <CustomCursor />
      <GrainOverlay />

      {/* Smooth Ambient Accent Glow */}
      <div
        className="pointer-events-none fixed inset-0 z-0 transition-all duration-700 ease-out"
        style={{
          background: `radial-gradient(circle at ${50 + mousePos.x * 15}% ${50 + mousePos.y * 15}%, ${accentColor}30 0%, transparent 60%)`,
        }}
      />

      {/* Reactive WebGL Shader Background */}
      <div
        ref={shaderContainerRef}
        className={`fixed inset-0 z-0 transition-opacity duration-1000 ${isLoaded ? "opacity-90" : "opacity-0"}`}
        style={{ contain: "strict" }}
      >
        <Shader className="h-full w-full">
          <Swirl
            colorA={accentColor}
            colorB={secondaryAccent}
            speed={0.7}
            detail={0.8}
            blend={55}
            coarseX={40 + mousePos.x * 15}
            coarseY={40 + mousePos.y * 15}
            mediumX={40 + mousePos.x * 10}
            mediumY={40 + mousePos.y * 10}
            fineX={40}
            fineY={40}
          />
          <ChromaFlow
            baseColor="#080808"
            upColor={accentColor}
            downColor="#121212"
            leftColor={secondaryAccent}
            rightColor={accentColor}
            intensity={0.85 + Math.abs(mousePos.x) * 0.15}
            radius={1.8}
            momentum={25}
            maskType="alpha"
            opacity={0.92}
          />
        </Shader>
        <div className="absolute inset-0 bg-black/55 backdrop-blur-[1px]" />
      </div>

      {/* Clean Header Nav */}
      <nav
        className={`fixed left-0 right-0 top-0 z-50 flex items-center justify-between px-6 py-6 transition-opacity duration-700 md:px-12 ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
      >
        <button
          onClick={() => scrollToSection(0)}
          className="flex items-center gap-3 transition-transform hover:scale-105"
        >
          <div
            className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 backdrop-blur-md border border-white/20 font-bold text-xl transition-all duration-500 hover:scale-110"
            style={{ borderColor: `${accentColor}80`, color: accentColor }}
          >
            W
          </div>
          <div className="flex flex-col text-left">
            <span className="font-sans text-xl font-bold tracking-tight text-white">
              Wadud<span className="font-light" style={{ color: accentColor }}>.studio</span>
            </span>
            <span
              className="font-mono text-[10px] tracking-widest uppercase transition-colors duration-700 font-semibold"
              style={{ color: accentColor }}
            >
              ودود · The Loving
            </span>
          </div>
        </button>

        <div className="hidden items-center gap-8 md:flex">
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
                className="absolute -bottom-1 left-0 h-0.5 transition-all duration-500"
                style={{
                  backgroundColor: accentColor,
                  width: currentSection === index ? "100%" : "0%",
                }}
              />
            </button>
          ))}
        </div>

        <MagneticButton variant="primary" onClick={() => window.open("https://wadud.care", "_blank")}>
          Wadud Care
        </MagneticButton>
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
        {/* Section 0: Hero Section */}
        <section className="flex h-screen w-screen shrink-0 snap-start snap-always flex-col justify-center px-6 md:px-12 lg:px-16">
          <div className="mx-auto w-full max-w-6xl">
            <div
              className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 backdrop-blur-md transition-all duration-700"
              style={{ borderColor: `${accentColor}60` }}
            >
              <span
                className="h-2 w-2 rounded-full animate-pulse"
                style={{ backgroundColor: accentColor }}
              />
              <p className="font-mono text-xs text-white/90">AI & Tech for Societal Good · Privacy First</p>
            </div>

            <h1 className="mb-4 font-sans text-4xl font-extralight tracking-tight text-white md:text-7xl lg:text-8xl">
              Technology built for <span className="font-normal" style={{ color: accentColor }}>societal betterment</span>.
            </h1>

            <p className="mb-8 max-w-3xl text-base font-light text-white/80 md:text-xl">
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
        <WorkSection activeFlare={activeFlare} />

        {/* Section 2: Pillars */}
        <ServicesSection activeFlare={activeFlare} />

        {/* Section 3: Vision */}
        <AboutSection scrollToSection={scrollToSection} activeFlare={activeFlare} />

        {/* Section 4: Contact */}
        <ContactSection activeFlare={activeFlare} />
      </div>

      {/* Floating Section Tracker & Interactive Key Guide */}
      <div className="fixed bottom-6 right-6 z-50 hidden items-center gap-4 rounded-full border border-white/15 bg-black/70 px-5 py-2.5 backdrop-blur-md md:flex transition-all duration-700">
        <div
          className="h-2.5 w-2.5 rounded-full animate-pulse transition-colors duration-700"
          style={{ backgroundColor: accentColor }}
        />
        <span className="font-mono text-xs uppercase tracking-wider font-medium text-white">
          {activeFlare.name}
        </span>
        <span className="font-mono text-xs text-white/40">/</span>
        <span className="font-mono text-xs font-semibold text-white">0{currentSection + 1} of 05</span>
      </div>

      <style jsx global>{`
        div::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </main>
  )
}



