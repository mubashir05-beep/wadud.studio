"use client"

import { useReveal } from "@/hooks/use-reveal"
import { ShieldCheck, UserCheck, Heart, Cpu } from "lucide-react"

export function ServicesSection({ activeFlare }: { activeFlare?: { primary: string; secondary: string } }) {
  const { ref, isVisible } = useReveal(0.3)
  const flareColor = activeFlare?.primary || "#ffffff"

  return (
    <section
      ref={ref}
      className="flex min-h-screen md:h-screen w-full md:w-screen md:shrink-0 md:snap-start md:snap-always flex-col justify-center py-16 sm:py-20 md:py-0 px-4 sm:px-8 md:px-12 lg:px-16"
    >
      <div className="mx-auto w-full max-w-7xl">
        <div
          className={`mb-6 sm:mb-8 transition-all duration-700 md:mb-12 ${
            isVisible ? "translate-y-0 opacity-100" : "-translate-y-12 opacity-0"
          }`}
        >
          <h2 className="mb-1 font-sans text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extralight tracking-tight text-white">
            Core Pillars
          </h2>
          <p className="font-mono text-xs text-white/70 md:text-sm">
            / Architectural values built into every Wadud system
          </p>
        </div>

        <div className="grid gap-3.5 sm:gap-4 sm:grid-cols-2 md:gap-6 lg:gap-8">
          {[
            {
              icon: ShieldCheck,
              title: "Strict Privacy & Data Sovereignty",
              description:
                "Zero data selling, end-to-end encrypted records, and strict patient-doctor confidentiality across all interactions.",
              direction: "top",
            },
            {
              icon: UserCheck,
              title: "Rigorous PMC & Identity Verification",
              description:
                "Strict Pakistan Medical Commission licence authentication, credential vetting, and human-in-the-loop quality controls.",
              direction: "right",
            },
            {
              icon: Heart,
              title: "Ethos of Al-Wadud (The Loving)",
              description:
                "Rooted in compassion and dignity, eliminating embarrassment, cultural barriers, and fear from seeking healthcare.",
              direction: "left",
            },
            {
              icon: Cpu,
              title: "Intelligent AI & Emergency Integration",
              description:
                "Intelligent symptom triage, low-bandwidth optimization, and rapid direct dispatch handoff to 1122 emergency rescue services.",
              direction: "bottom",
            },
          ].map((service, i) => (
            <ServiceCard key={i} service={service} index={i} isVisible={isVisible} flareColor={flareColor} />
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
  flareColor,
}: {
  service: { icon: any; title: string; description: string; direction: string }
  index: number
  isVisible: boolean
  flareColor: string
}) {
  const getRevealClass = () => {
    if (!isVisible) {
      switch (service.direction) {
        case "left":
          return "-translate-x-12 opacity-0"
        case "right":
          return "translate-x-12 opacity-0"
        case "top":
          return "-translate-y-12 opacity-0"
        case "bottom":
          return "translate-y-12 opacity-0"
        default:
          return "translate-y-12 opacity-0"
      }
    }
    return "translate-x-0 translate-y-0 opacity-100"
  }

  const Icon = service.icon

  return (
    <div
      className={`group rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 transition-all duration-500 bg-white/[0.02] hover:bg-white/[0.06] border border-white/10 hover:border-white/30 ${getRevealClass()}`}
      style={{
        transitionDelay: `${index * 80}ms`,
      }}
    >
      <div className="mb-2.5 sm:mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5 sm:gap-3">
          <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-lg border border-white/20 bg-white/5 text-white">
            <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </div>
          <span className="font-mono text-xs font-bold text-white/50 group-hover:text-white transition-colors">
            0{index + 1}
          </span>
        </div>
        <div className="h-px w-6 sm:w-8 bg-white/20 transition-all duration-300 group-hover:w-12 sm:group-hover:w-16 group-hover:bg-white" />
      </div>
      <h3 className="mb-1.5 sm:mb-2 font-sans text-lg sm:text-xl md:text-2xl font-light text-white transition-transform duration-300 group-hover:translate-x-1">
        {service.title}
      </h3>
      <p className="font-mono text-xs sm:text-sm text-white/70 leading-relaxed">{service.description}</p>
    </div>
  )
}
