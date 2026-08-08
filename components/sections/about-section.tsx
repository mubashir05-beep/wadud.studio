"use client"

import { MagneticButton } from "@/components/magnetic-button"
import { useReveal } from "@/hooks/use-reveal"

export function AboutSection({
  scrollToSection,
  activeFlare,
}: {
  scrollToSection?: (index: number) => void
  activeFlare?: { primary: string; secondary: string }
}) {
  const { ref, isVisible } = useReveal(0.3)
  const flareColor = activeFlare?.primary || "#f43f5e"

  return (
    <section
      ref={ref}
      className="flex h-screen w-screen shrink-0 snap-start snap-always items-center px-6 md:px-12 lg:px-16"
    >
      <div className="mx-auto w-full max-w-7xl">
        <div className="grid gap-8 md:grid-cols-2 md:gap-16 lg:gap-24">
          {/* Left side - Story */}
          <div className="flex flex-col justify-center">
            <div
              className={`mb-4 transition-all duration-700 md:mb-6 ${
                isVisible ? "translate-y-0 opacity-100" : "-translate-y-12 opacity-0"
              }`}
            >
              <h2 className="mb-2 font-sans text-4xl font-extralight tracking-tight text-white md:text-6xl lg:text-7xl">
                Guided by care. <br className="hidden md:block" />
                Built for <span className="font-normal" style={{ color: flareColor }}>real impact</span>.
              </h2>
              <p className="font-mono text-xs text-white/70 md:text-sm">
                / Technology for the betterment of others and self
              </p>
            </div>

            <div
              className={`space-y-3 transition-all duration-700 ${
                isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
              }`}
              style={{ transitionDelay: "200ms" }}
            >
              <p className="max-w-xl text-base font-light text-white/80 md:text-xl">
                Building privacy-first AI platforms that solve real human problems with genuine care, security, and dignity.
              </p>
            </div>

            <div
              className={`mt-6 flex flex-wrap gap-3 transition-all duration-700 md:mt-8 ${
                isVisible ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"
              }`}
              style={{ transitionDelay: "400ms" }}
            >
              <MagneticButton size="lg" variant="primary" onClick={() => scrollToSection?.(4)}>
                Partner With Wadud.studio
              </MagneticButton>
              <MagneticButton size="lg" variant="secondary" onClick={() => scrollToSection?.(1)}>
                Explore Ecosystem
              </MagneticButton>
            </div>
          </div>

          {/* Right side - Interactive Stats */}
          <div className="flex flex-col justify-center space-y-5 md:space-y-8">
            {[
              { value: "230M+", label: "People Impacted", sublabel: "Pakistan first focus & diaspora", direction: "right" },
              { value: "100%", label: "Private & Secure", sublabel: "Zero data selling or monetization", direction: "left" },
              { value: "6-Step", label: "Verification", sublabel: "Strict PMC licence & identity checks", direction: "right" },
            ].map((stat, i) => {
              const getRevealClass = () => {
                if (!isVisible) {
                  return stat.direction === "left" ? "-translate-x-16 opacity-0" : "translate-x-16 opacity-0"
                }
                return "translate-x-0 opacity-100"
              }

              return (
                <div
                  key={i}
                  className={`group flex items-baseline gap-4 border-l-2 pl-4 transition-all duration-500 hover:scale-105 hover:bg-white/5 rounded-r-xl p-3 md:gap-8 md:pl-8 ${getRevealClass()}`}
                  style={{
                    borderColor: flareColor,
                    transitionDelay: `${300 + i * 120}ms`,
                    marginLeft: i % 2 === 0 ? "0" : "auto",
                    maxWidth: i % 2 === 0 ? "100%" : "88%",
                  }}
                >
                  <div
                    className="text-3xl font-light transition-transform duration-300 group-hover:scale-110 md:text-5xl lg:text-6xl"
                    style={{ color: flareColor }}
                  >
                    {stat.value}
                  </div>
                  <div>
                    <div className="font-sans text-base font-medium text-white md:text-lg">{stat.label}</div>
                    <div className="font-mono text-xs text-white/60">{stat.sublabel}</div>
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
