"use client"

import { MagneticButton } from "@/components/magnetic-button"
import { useReveal } from "@/hooks/use-reveal"
import { ArrowUpRight } from "lucide-react"

export function AboutSection({
  scrollToSection,
  activeFlare,
}: {
  scrollToSection?: (index: number) => void
  activeFlare?: { primary: string; secondary: string }
}) {
  const { ref, isVisible } = useReveal(0.3)
  const flareColor = activeFlare?.primary || "#ffffff"

  return (
    <section
      ref={ref}
      className="flex min-h-screen md:h-screen w-full md:w-screen md:shrink-0 md:snap-start md:snap-always flex-col justify-center py-16 sm:py-20 md:py-0 px-4 sm:px-8 md:px-12 lg:px-16"
    >
      <div className="mx-auto w-full max-w-7xl">
        <div className="grid gap-8 md:grid-cols-2 md:gap-14 lg:gap-20">
          {/* Left side - Story */}
          <div className="flex flex-col justify-center">
            <div
              className={`mb-4 transition-all duration-700 md:mb-6 ${
                isVisible ? "translate-y-0 opacity-100" : "-translate-y-12 opacity-0"
              }`}
            >
              <h2 className="mb-2 font-sans text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extralight tracking-tight text-white">
                Rooted in care. <br className="hidden md:block" />
                Built for <span className="font-normal text-white underline decoration-white/30 underline-offset-8">real impact</span>.
              </h2>
              <p className="font-mono text-xs text-white/70 md:text-sm">
                / Technology for societal betterment & human empowerment
              </p>
            </div>

            <div
              className={`space-y-3 transition-all duration-700 ${
                isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
              }`}
              style={{ transitionDelay: "200ms" }}
            >
              <p className="max-w-xl text-base sm:text-lg md:text-xl font-light text-white/80 leading-relaxed">
                Wadud.studio builds privacy-first AI platforms designed to resolve urgent social and healthcare challenges.
              </p>
              <p className="max-w-xl text-xs sm:text-sm md:text-base font-light text-white/60 leading-relaxed">
                Our active flagship, <strong className="text-white font-medium">wadud.care</strong>, provides confidential, verified telemedicine consultations across Pakistan, ensuring care without judgment, compromise, or data exploitation.
              </p>
            </div>

            <div
              className={`mt-6 flex flex-col sm:flex-row flex-wrap gap-3 transition-all duration-700 md:mt-8 ${
                isVisible ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"
              }`}
              style={{ transitionDelay: "400ms" }}
            >
              <MagneticButton
                size="lg"
                variant="primary"
                onClick={() => window.open("https://wadud.care", "_blank")}
              >
                <span>Visit wadud.care</span>
                <ArrowUpRight className="h-4 w-4" />
              </MagneticButton>
              <MagneticButton size="lg" variant="secondary" onClick={() => scrollToSection?.(4)}>
                Contact Studio
              </MagneticButton>
            </div>
          </div>

          {/* Right side - Interactive Stats */}
          <div className="flex flex-col justify-center space-y-3 sm:space-y-4 md:space-y-6">
            {[
              {
                value: "100%",
                label: "Privacy-First Architecture",
                sublabel: "Zero patient data selling or monetization",
                direction: "right",
              },
              {
                value: "Direct",
                label: "PMC Verified Consultations",
                sublabel: "Confidential telemedicine via wadud.care",
                direction: "left",
              },
              {
                value: "1122",
                label: "Emergency Integration",
                sublabel: "Rapid dispatch handoff protocol for crises",
                direction: "right",
              },
            ].map((stat, i) => {
              const getRevealClass = () => {
                if (!isVisible) {
                  return stat.direction === "left" ? "-translate-x-12 opacity-0" : "translate-x-12 opacity-0"
                }
                return "translate-x-0 opacity-100"
              }

              return (
                <div
                  key={i}
                  className={`group flex items-center gap-3 sm:gap-4 md:gap-6 border-l-2 border-white/40 hover:border-white pl-3.5 sm:pl-4 md:pl-6 transition-all duration-500 bg-white/[0.02] hover:bg-white/[0.06] rounded-r-xl sm:rounded-r-2xl p-3.5 sm:p-4 md:p-5 ${getRevealClass()}`}
                  style={{
                    transitionDelay: `${250 + i * 80}ms`,
                  }}
                >
                  <div className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-light text-white transition-transform duration-300 group-hover:scale-105 min-w-[75px] sm:min-w-[100px] md:min-w-[120px]">
                    {stat.value}
                  </div>
                  <div>
                    <div className="font-sans text-sm sm:text-base md:text-lg font-medium text-white">{stat.label}</div>
                    <div className="font-mono text-[11px] sm:text-xs text-white/60">{stat.sublabel}</div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
