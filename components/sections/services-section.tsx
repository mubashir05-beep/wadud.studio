"use client"

import { useReveal } from "@/hooks/use-reveal"

export function ServicesSection() {
  const { ref, isVisible } = useReveal(0.3)

  return (
    <section
      ref={ref}
      className="flex h-screen w-screen shrink-0 snap-start snap-always items-center px-6 md:px-12 lg:px-16"
    >
      <div className="mx-auto w-full max-w-7xl">
        <div
          className={`mb-8 transition-all duration-700 md:mb-12 ${
            isVisible ? "translate-y-0 opacity-100" : "-translate-y-12 opacity-0"
          }`}
        >
          <h2 className="mb-1 font-sans text-4xl font-extralight tracking-tight text-white mix-blend-difference md:text-6xl lg:text-7xl">
            Core Pillars
          </h2>
          <p className="font-mono text-xs text-white/70 mix-blend-difference md:text-sm">
            / Principles built into every Wadud product
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 md:gap-x-16 md:gap-y-10 lg:gap-x-24">
          {[
            {
              title: "Bank-Grade Privacy & Security",
              description: "End-to-end encryption with unique keys, zero data monetization, and audit logging.",
              direction: "top",
            },
            {
              title: "Rigorous 6-Step Verification",
              description: "Strict PMC medical licence validation, government ID checks, and human review.",
              direction: "right",
            },
            {
              title: "Guided by Al-Wadud (The Loving)",
              description: "Built around genuine care for people facing embarrassment or cultural barriers.",
              direction: "left",
            },
            {
              title: "Latest AI & Ecosystem Handoff",
              description: "AI symptom assistance, digital prescriptions, and automated 1122 emergency connection.",
              direction: "bottom",
            },
          ].map((service, i) => (
            <ServiceCard key={i} service={service} index={i} isVisible={isVisible} />
          ))}
        </div>
      </div>
    </section>
  )
}

function ServiceCard({
  service,
  index,
  isVisible,
}: {
  service: { title: string; description: string; direction: string }
  index: number
  isVisible: boolean
}) {
  const getRevealClass = () => {
    if (!isVisible) {
      switch (service.direction) {
        case "left":
          return "-translate-x-16 opacity-0"
        case "right":
          return "translate-x-16 opacity-0"
        case "top":
          return "-translate-y-16 opacity-0"
        case "bottom":
          return "translate-y-16 opacity-0"
        default:
          return "translate-y-12 opacity-0"
      }
    }
    return "translate-x-0 translate-y-0 opacity-100"
  }

  return (
    <div
      className={`group transition-all duration-700 ${getRevealClass()}`}
      style={{
        transitionDelay: `${index * 120}ms`,
      }}
    >
      <div className="mb-2 flex items-center gap-3">
        <div className="h-px w-8 bg-white transition-all duration-300 group-hover:w-12" />
        <span className="font-mono text-xs font-bold text-white">
          0{index + 1}
        </span>
      </div>
      <h3 className="mb-1 font-sans text-xl font-light text-white mix-blend-difference md:text-3xl">{service.title}</h3>
      <p className="truncate font-mono text-xs text-white/70 mix-blend-difference md:text-sm">{service.description}</p>
    </div>
  )
}
