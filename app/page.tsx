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
import { ArrowUpRight, Menu, X } from "lucide-react"

const sectionFlares = [
  { primary: "#ffffff", secondary: "#404040", glow: "rgba(255, 255, 255, 0.12)", name: "Studio Core" },
  { primary: "#ffffff", secondary: "#525252", glow: "rgba(255, 255, 255, 0.12)", name: "Wadud Care" },
  { primary: "#e5e5e5", secondary: "#737373", glow: "rgba(229, 229, 229, 0.12)", name: "Core Pillars" },
  { primary: "#ffffff", secondary: "#262626", glow: "rgba(255, 255, 255, 0.12)", name: "Studio Vision" },
  { primary: "#d4d4d4", secondary: "#525252", glow: "rgba(212, 212, 212, 0.12)", name: "Connect" },
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
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
    setMobileMenuOpen(false)
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      const sections = document.querySelectorAll("section")
      if (sections[index]) {
        sections[index].scrollIntoView({ behavior: "smooth", block: "start" })
        setCurrentSection(index)
      }
      return
    }

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
    if (!scrollContainerRef.current || typeof window === "undefined" || window.innerWidth < 768) return
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

  // Mobile vertical scroll tracking
  useEffect(() => {
    if (typeof window === "undefined") return
    const handleMobileScroll = () => {
      if (window.innerWidth >= 768) return
      const sections = document.querySelectorAll("section")
      const scrollPosition = window.scrollY + window.innerHeight / 3
      sections.forEach((sec, idx) => {
        const top = sec.offsetTop
        const height = sec.offsetHeight
        if (scrollPosition >= top && scrollPosition < top + height) {
          setCurrentSection(idx)
          setAccentColor(sectionFlares[idx]?.primary || "#ffffff")
          setSecondaryAccent(sectionFlares[idx]?.secondary || "#404040")
        }
      })
    }
    window.addEventListener("scroll", handleMobileScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleMobileScroll)
  }, [])

  // Desktop wheel horizontal scrolling
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (typeof window === "undefined" || window.innerWidth < 768) return

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
      if (scrollThrottleRef.current || typeof window === "undefined" || window.innerWidth < 768) return

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
    <main className="relative min-h-screen md:h-screen w-full overflow-x-hidden md:overflow-hidden bg-black text-white selection:bg-white selection:text-black">
      <CustomCursor />
      <GrainOverlay />

      {/* Smooth Ambient Monochrome Accent Glow */}
      <div
        className="pointer-events-none fixed inset-0 z-0 transition-all duration-700 ease-out"
        style={{
          background: `radial-gradient(circle at ${50 + mousePos.x * 15}% ${50 + mousePos.y * 15}%, rgba(255, 255, 255, 0.08) 0%, transparent 65%)`,
        }}
      />

      {/* Reactive WebGL Monochrome Shader Background */}
      <div
        ref={shaderContainerRef}
        className={`fixed inset-0 z-0 transition-opacity duration-1000 ${isLoaded ? "opacity-85" : "opacity-0"}`}
        style={{ contain: "strict" }}
      >
        <Shader className="h-full w-full">
          <Swirl
            colorA={accentColor}
            colorB={secondaryAccent}
            speed={0.45}
            detail={0.8}
            blend={60}
            coarseX={40 + mousePos.x * 15}
            coarseY={40 + mousePos.y * 15}
            mediumX={40 + mousePos.x * 10}
            mediumY={40 + mousePos.y * 10}
            fineX={40}
            fineY={40}
          />
          <ChromaFlow
            baseColor="#000000"
            upColor={accentColor}
            downColor="#080808"
            leftColor={secondaryAccent}
            rightColor={accentColor}
            intensity={0.65 + Math.abs(mousePos.x) * 0.1}
            radius={1.7}
            momentum={20}
            maskType="alpha"
            opacity={0.88}
          />
        </Shader>
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px]" />
      </div>

      {/* Clean Header Nav */}
      <nav
        className={`fixed left-0 right-0 top-0 z-50 flex items-center justify-between px-4 sm:px-6 md:px-12 py-3.5 sm:py-4 md:py-6 bg-black/60 md:bg-transparent backdrop-blur-md md:backdrop-blur-none border-b border-white/10 md:border-none transition-opacity duration-700 ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
      >
        <button
          onClick={() => scrollToSection(0)}
          className="flex items-center transition-transform hover:opacity-80 cursor-pointer"
        >
          <span className="font-sans text-xl md:text-2xl font-bold tracking-tight text-white">
            Wadud<span className="font-light text-white/60">.studio</span>
          </span>
        </button>

        <div className="hidden items-center gap-8 md:flex">
          {["Home", "Projects", "Pillars", "About", "Contact"].map((item, index) => (
            <button
              key={item}
              onClick={() => scrollToSection(index)}
              className={`group relative font-sans text-sm font-medium transition-colors ${
                currentSection === index ? "text-white font-semibold" : "text-white/60 hover:text-white"
              }`}
            >
              {item}
              <span
                className="absolute -bottom-1 left-0 h-0.5 bg-white transition-all duration-300"
                style={{
                  width: currentSection === index ? "100%" : "0%",
                }}
              />
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <MagneticButton
            variant="primary"
            onClick={() => window.open("https://wadud.care", "_blank")}
          >
            <span className="flex items-center gap-1.5">
              <span>wadud.care</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </span>
          </MagneticButton>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex md:hidden h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition-colors hover:bg-white/20"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 flex flex-col justify-between bg-black/95 px-6 pt-24 pb-8 backdrop-blur-xl md:hidden animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex flex-col space-y-4">
            {["Home", "Projects", "Pillars", "About", "Contact"].map((item, index) => (
              <button
                key={item}
                onClick={() => scrollToSection(index)}
                className="flex items-center justify-between border-b border-white/10 py-3 text-left font-sans text-xl font-light text-white"
              >
                <span>{item}</span>
                <span className="font-mono text-xs text-white/40">0{index + 1}</span>
              </button>
            ))}
          </div>

          <div className="pt-6 border-t border-white/10">
            <button
              onClick={() => window.open("https://wadud.care", "_blank")}
              className="flex w-full items-center justify-center gap-2 rounded-full border border-white bg-white py-3 font-sans text-sm font-semibold text-black"
            >
              <span>Visit wadud.care</span>
              <ArrowUpRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Responsive Scroll Container: Vertical on Mobile, Snap-Horizontal on Desktop */}
      <div
        ref={scrollContainerRef}
        data-scroll-container
        className={`relative z-10 flex flex-col md:flex-row w-full min-h-screen md:h-screen md:overflow-x-auto md:overflow-y-hidden md:snap-x md:snap-mandatory scroll-smooth transition-opacity duration-700 ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {/* Section 0: Hero Section */}
        <section className="flex min-h-screen md:h-screen w-full md:w-screen md:shrink-0 md:snap-start md:snap-always flex-col justify-center pt-24 sm:pt-28 pb-16 sm:pb-20 md:py-0 px-4 sm:px-8 md:px-12 lg:px-16">
          <div className="mx-auto w-full max-w-6xl">
            <div className="mb-4 sm:mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-3 sm:px-4 py-1 sm:py-1.5 backdrop-blur-md max-w-full">
              <span className="h-1.5 sm:h-2 w-1.5 sm:w-2 rounded-full bg-white animate-pulse shrink-0" />
              <p className="font-mono text-[11px] sm:text-xs text-white/90 truncate">
                Currently Building: <span className="text-white font-medium">wadud.care</span> · Privacy-First AI
              </p>
            </div>

            <h1 className="mb-4 sm:mb-5 font-sans text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-extralight tracking-tight text-white leading-tight">
              Technology built for <span className="font-normal text-white underline decoration-white/30 underline-offset-8">societal betterment</span>.
            </h1>

            <p className="mb-6 sm:mb-8 max-w-3xl text-sm sm:text-base md:text-xl font-light text-white/80 leading-relaxed">
              Wadud.studio engineers privacy-centric, intelligent platforms rooted in human dignity. We are currently building and scaling <a href="https://wadud.care" target="_blank" rel="noreferrer" className="text-white underline decoration-white/60 hover:decoration-white font-medium">wadud.care</a>, bringing secure doctor consultations and telemedicine to everyone.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 sm:items-center">
              <MagneticButton
                size="lg"
                variant="primary"
                onClick={() => window.open("https://wadud.care", "_blank")}
              >
                <span className="flex items-center gap-1.5">
                  <span>Explore wadud.care</span>
                  <ArrowUpRight className="h-4 w-4" />
                </span>
              </MagneticButton>
              <MagneticButton size="lg" variant="secondary" onClick={() => scrollToSection(1)}>
                View Projects & Roadmap
              </MagneticButton>
            </div>
          </div>
        </section>

        {/* Section 1: Projects */}
        <WorkSection activeFlare={activeFlare} />

        {/* Section 2: Pillars */}
        <ServicesSection activeFlare={activeFlare} />

        {/* Section 3: About */}
        <AboutSection scrollToSection={scrollToSection} activeFlare={activeFlare} />

        {/* Section 4: Contact */}
        <ContactSection activeFlare={activeFlare} />
      </div>

      <style jsx global>{`
        div::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </main>
  )
}



