"use client"

import { useReveal } from "@/hooks/use-reveal"

export function WorkSection() {
  const { ref, isVisible } = useReveal(0.3)

  return (
    <section
      ref={ref}
      className="flex h-screen w-screen shrink-0 snap-start snap-always items-center px-6 md:px-12 lg:px-16"
    >
      <div className="mx-auto w-full max-w-7xl">
        <div
          className={`mb-6 transition-all duration-700 md:mb-10 ${
            isVisible ? "translate-x-0 opacity-100" : "-translate-x-12 opacity-0"
          }`}
        >
          <h2 className="mb-1 font-sans text-4xl font-extralight tracking-tight text-white mix-blend-difference md:text-6xl lg:text-7xl">
            Our Ecosystem
          </h2>
          <p className="font-mono text-xs text-white/70 mix-blend-difference md:text-sm">
            / Wadud.studio purpose-built product suite
          </p>
        </div>

        <div className="space-y-3 md:space-y-5">
          {[
            {
              number: "01",
              title: "Wadud Care",
              category: "wadud.care · Pakistan's private doctor consultation & telemedicine platform",
              year: "LIVE NOW",
              direction: "left",
              status: "Flagship",
              link: "https://wadud.care",
            },
            {
              number: "02",
              title: "Wadud Legal",
              category: "Confidential legal advice for family, property & employment issues",
              year: "PIPELINE",
              direction: "right",
              status: "Upcoming",
            },
            {
              number: "03",
              title: "Wadud Financial",
              category: "Simple, ethical financial guidance for underserved communities",
              year: "PLANNED",
              direction: "left",
              status: "Concept",
            },
            {
              number: "04",
              title: "Wadud Learn",
              category: "Connecting remote students with verified expert educators",
              year: "PLANNED",
              direction: "right",
              status: "Concept",
            },
          ].map((project, i) => (
            <ProjectCard key={i} project={project} index={i} isVisible={isVisible} />
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
}: {
  project: { number: string; title: string; category: string; year: string; direction: string; status?: string; link?: string }
  index: number
  isVisible: boolean
}) {
  const getRevealClass = () => {
    if (!isVisible) {
      return project.direction === "left" ? "-translate-x-16 opacity-0" : "translate-x-16 opacity-0"
    }
    return "translate-x-0 opacity-100"
  }

  return (
    <div
      onClick={() => project.link && window.open(project.link, "_blank")}
      className={`group flex items-center justify-between border-b border-white/20 py-3.5 transition-all duration-500 hover:border-white cursor-pointer md:py-5 ${getRevealClass()}`}
      style={{
        transitionDelay: `${index * 120}ms`,
        marginLeft: index % 2 === 0 ? "0" : "auto",
        maxWidth: index % 2 === 0 ? "92%" : "96%",
      }}
    >
      <div className="flex items-baseline gap-4 md:gap-8">
        <span className="font-mono text-sm font-bold text-white md:text-base">
          {project.number}
        </span>
        <div>
          <div className="flex items-center gap-3">
            <h3 className="mb-0.5 font-sans text-xl font-light text-white transition-transform duration-300 group-hover:translate-x-2 md:text-3xl lg:text-4xl">
              {project.title}
            </h3>
            {project.status && (
              <span className="rounded-full bg-white/15 border border-white/30 px-2.5 py-0.5 font-mono text-[10px] font-medium uppercase text-white">
                {project.status}
              </span>
            )}
          </div>
          <p className="truncate font-mono text-xs text-white/70 md:text-sm">{project.category}</p>
        </div>
      </div>
      <span className="font-mono text-xs font-semibold text-white/80 md:text-sm">{project.year}</span>
    </div>
  )
}
