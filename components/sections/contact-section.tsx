"use client"

import { Mail, MapPin, ArrowUpRight } from "lucide-react"
import { useReveal } from "@/hooks/use-reveal"

export function ContactSection({ activeFlare }: { activeFlare?: { primary: string; secondary: string } }) {
  const { ref, isVisible } = useReveal(0.3)

  const founders = [
    {
      name: "Muhammad Mubashir Munir Khan",
      role: "Co-Founder",
      email: "contact.muhammadmubashir@gmail.com",
    },
    {
      name: "Saifullah Akhtar",
      role: "Co-Founder",
      email: "saifullah.akhtar13@gmail.com",
    },
    {
      name: "Abdul Wahab Tahir",
      role: "Co-Founder",
      email: "contact.abdulwahabtahir@gmail.com",
    },
  ]

  return (
    <section
      ref={ref}
      className="flex min-h-screen md:h-screen w-full md:w-screen md:shrink-0 md:snap-start md:snap-always flex-col justify-center py-16 sm:py-20 md:py-0 px-4 sm:px-8 md:px-12 lg:px-16"
    >
      <div className="mx-auto w-full max-w-7xl">
        <div
          className={`mb-6 sm:mb-8 transition-all duration-700 md:mb-12 ${
            isVisible ? "translate-x-0 opacity-100" : "-translate-x-12 opacity-0"
          }`}
        >
          <h2 className="mb-2 font-sans text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-extralight tracking-tight text-white">
            Let's <span className="font-normal text-white underline decoration-white/30 underline-offset-8">connect</span>
          </h2>
          <p className="font-mono text-xs text-white/70 md:text-sm">
            / Direct founder contact, inquiries & Wadud Care partnerships
          </p>
        </div>

        {/* 3 Founders Cards */}
        <div className="grid gap-3.5 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3 md:gap-6 mb-6 sm:mb-8">
          {founders.map((founder, i) => (
            <a
              key={founder.email}
              href={`mailto:${founder.email}`}
              className={`group flex flex-col justify-between rounded-xl sm:rounded-2xl border border-white/15 bg-white/[0.03] p-4.5 sm:p-5 md:p-6 transition-all duration-500 hover:border-white hover:bg-white/[0.08] hover:shadow-[0_0_30px_rgba(255,255,255,0.08)] ${
                isVisible ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"
              }`}
              style={{ transitionDelay: `${150 + i * 80}ms` }}
            >
              <div>
                <div className="mb-3 sm:mb-4 flex items-center justify-between">
                  <span className="inline-flex items-center rounded-full border border-white/20 bg-white/5 px-2 sm:px-2.5 py-0.5 font-mono text-[9px] sm:text-[10px] uppercase tracking-wider text-white/70">
                    {founder.role}
                  </span>
                  <div className="flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-full border border-white/20 bg-white/5 text-white/60 transition-all duration-300 group-hover:border-white group-hover:bg-white group-hover:text-black">
                    <ArrowUpRight className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                  </div>
                </div>

                <h3 className="font-sans text-base sm:text-lg md:text-xl font-medium text-white transition-transform duration-300 group-hover:translate-x-1">
                  {founder.name}
                </h3>
              </div>

              <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-white/10 flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 text-white/50 group-hover:text-white transition-colors shrink-0" />
                <span className="font-mono text-[11px] sm:text-xs text-white/70 group-hover:text-white transition-colors truncate">
                  {founder.email}
                </span>
              </div>
            </a>
          ))}
        </div>

        {/* Studio Info & Quick Links Footer */}
        <div
          className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 pt-3.5 sm:pt-4 border-t border-white/10 transition-all duration-700 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
          style={{ transitionDelay: "400ms" }}
        >
          <div className="flex items-center gap-2 text-white/70 font-mono text-[11px] sm:text-xs">
            <MapPin className="h-3.5 w-3.5 text-white/60 shrink-0" />
            <span>Headquarters: Islamabad, Pakistan</span>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
            <a
              href="https://wadud.care"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full border border-white bg-white text-black px-3.5 sm:px-4 py-1.5 font-mono text-xs font-semibold hover:bg-neutral-200 transition-colors shadow-[0_0_15px_rgba(255,255,255,0.15)]"
            >
              <span>wadud.care</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </a>

            <a
              href="https://wadud.studio"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 rounded-full border border-white/20 bg-white/5 px-3.5 sm:px-4 py-1.5 font-mono text-xs text-white hover:border-white/40 hover:bg-white/10 transition-colors"
            >
              <span>wadud.studio</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
