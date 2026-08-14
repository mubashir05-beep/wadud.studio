"use client"

import { useReveal } from "@/hooks/use-reveal"
import { ArrowUpRight, CheckCircle2, Clock } from "lucide-react"

export function WorkSection({ activeFlare }: { activeFlare?: { primary: string; secondary: string } }) {
  const { ref, isVisible } = useReveal(0.3)
  const flareColor = activeFlare?.primary || "#ffffff"

  return (
    <section
      ref={ref}
      className="flex min-h-screen md:h-screen w-full md:w-screen md:shrink-0 md:snap-start md:snap-always flex-col justify-center py-16 sm:py-20 md:py-0 px-4 sm:px-8 md:px-12 lg:px-16"
    >
      <div className="mx-auto w-full max-w-7xl">
        <div
          className={`mb-5 sm:mb-6 transition-all duration-700 md:mb-8 ${
            isVisible ? "translate-x-0 opacity-100" : "-translate-x-12 opacity-0"
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2.5 sm:gap-3">
            <div>
              <h2 className="mb-1 font-sans text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extralight tracking-tight text-white">
                Projects & Roadmap
              </h2>
              <p className="font-mono text-xs text-white/70 md:text-sm">
                / Focused execution · Currently building wadud.care
              </p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-3 py-1 backdrop-blur-md self-start sm:self-auto">
              <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
              <span className="font-mono text-[10px] sm:text-[11px] text-white/90">
                1 Active Flagship · 3 Future Concepts
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-3 sm:space-y-3.5 md:space-y-4">
          {[
            {
              number: "01",
              title: "Wadud Care",
              domain: "wadud.care",
              category: "Private doctor consultations, verified PMC telemedicine & AI triage for Pakistan and diaspora.",
              phase: "CURRENTLY BUILDING",
              status: "Active Focus",
              isCurrent: true,
              link: "https://wadud.care",
              direction: "left",
            },
            {
              number: "02",
              title: "Wadud Legal",
              domain: "Future Project",
              category: "Confidential legal intelligence and verified counsel for family, property, and civil affairs.",
              phase: "FUTURE PROJECT",
              status: "Research Phase",
              isCurrent: false,
              direction: "right",
            },
            {
              number: "03",
              title: "Wadud Financial",
              domain: "Future Project",
              category: "Ethical, interest-free financial tools and micro-grant infrastructure for underserved communities.",
              phase: "FUTURE PROJECT",
              status: "Concept Phase",
              isCurrent: false,
              direction: "left",
            },
            {
              number: "04",
              title: "Wadud Learn",
              domain: "Future Project",
              category: "Localized educational intelligence connecting underprivileged students with verified mentors.",
              phase: "FUTURE PROJECT",
              status: "Concept Phase",
              isCurrent: false,
              direction: "right",
            },
          ].map((project, i) => (
            <ProjectCard
              key={i}
              project={project}
              index={i}
              isVisible={isVisible}
              flareColor={flareColor}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

function ProjectCard({
  project,
  index,
  isVisible,
  flareColor,
}: {
  project: {
    number: string
    title: string
    domain: string
    category: string
    phase: string
    status: string
    isCurrent: boolean
    link?: string
    direction: string
  }
  index: number
  isVisible: boolean
  flareColor: string
}) {
  const getRevealClass = () => {
    if (!isVisible) {
      return project.direction === "left" ? "-translate-x-12 opacity-0" : "translate-x-12 opacity-0"
    }
    return "translate-x-0 opacity-100"
  }

  const handleClick = () => {
    if (project.link) {
      window.open(project.link, "_blank", "noopener,noreferrer")
    }
  }

  return (
    <div
      onClick={handleClick}
      role={project.link ? "link" : "article"}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" && project.link) handleClick()
      }}
      className={`group relative flex flex-col md:flex-row md:items-center justify-between border transition-all duration-500 rounded-xl sm:rounded-2xl p-4 sm:p-4.5 md:p-5 ${
        project.isCurrent
          ? "border-white/40 bg-white/[0.07] hover:border-white hover:bg-white/[0.12] cursor-pointer shadow-[0_0_25px_rgba(255,255,255,0.06)]"
          : "border-white/10 bg-white/[0.02] hover:border-white/25 hover:bg-white/[0.04] opacity-80 hover:opacity-100 cursor-default"
      } ${getRevealClass()}`}
      style={{
        transitionDelay: `${index * 80}ms`,
      }}
    >
      <div className="flex items-start md:items-center gap-3 sm:gap-4 md:gap-6">
        <span className="font-mono text-xs sm:text-sm font-bold text-white/50 group-hover:text-white transition-colors duration-300 md:text-base pt-0.5 md:pt-0">
          {project.number}
        </span>
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-1">
            <h3 className="font-sans text-lg sm:text-xl md:text-2xl lg:text-3xl font-light text-white transition-transform duration-300 group-hover:translate-x-1">
              {project.title}
            </h3>

            {project.isCurrent ? (
              <span className="inline-flex items-center gap-1 rounded-full border border-white bg-white text-black px-2 sm:px-2.5 py-0.5 font-mono text-[9px] sm:text-[10px] font-semibold uppercase tracking-wider">
                <span className="h-1.5 w-1.5 rounded-full bg-black animate-pulse" />
                {project.phase}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-full border border-white/20 bg-white/5 text-white/70 px-2 sm:px-2.5 py-0.5 font-mono text-[9px] sm:text-[10px] uppercase tracking-wider">
                <Clock className="h-2.5 w-2.5 text-white/50" />
                {project.phase}
              </span>
            )}

            {project.isCurrent && (
              <span className="hidden sm:inline-flex items-center gap-1 font-mono text-[11px] text-white/90 underline underline-offset-4 decoration-white/40 group-hover:decoration-white transition-all">
                wadud.care
                <ArrowUpRight className="h-3 w-3" />
              </span>
            )}
          </div>
          <p className="font-mono text-xs sm:text-sm text-white/70 leading-relaxed max-w-full md:max-w-3xl">
            {project.category}
          </p>
        </div>
      </div>

      <div className="mt-3 md:mt-0 flex items-center justify-between md:justify-end gap-3 pl-6 md:pl-0 border-t border-white/5 pt-2.5 md:border-none md:pt-0">
        <span className="font-mono text-[11px] sm:text-xs text-white/50 group-hover:text-white/80 transition-colors">
          {project.status}
        </span>

        {project.isCurrent && (
          <div className="inline-flex items-center gap-1 rounded-full border border-white/30 bg-white/10 px-3 py-1 font-mono text-xs text-white transition-all group-hover:border-white group-hover:bg-white group-hover:text-black">
            <span>Visit Platform</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </div>
        )}
      </div>
    </div>
  )
}
