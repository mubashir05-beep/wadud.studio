"use client"

import { Mail, MapPin } from "lucide-react"
import { useReveal } from "@/hooks/use-reveal"
import { useState, type FormEvent } from "react"
import { MagneticButton } from "@/components/magnetic-button"

export function ContactSection({ activeFlare }: { activeFlare?: { primary: string; secondary: string } }) {
  const { ref, isVisible } = useReveal(0.3)
  const [formData, setFormData] = useState({ name: "", email: "", message: "" })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const flareColor = activeFlare?.primary || "#8b5cf6"

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!formData.name || !formData.email || !formData.message) {
      return
    }

    setIsSubmitting(true)
    await new Promise((resolve) => setTimeout(resolve, 1200))
    setIsSubmitting(false)
    setSubmitSuccess(true)
    setFormData({ name: "", email: "", message: "" })
    setTimeout(() => setSubmitSuccess(false), 5000)
  }

  return (
    <section
      ref={ref}
      className="flex h-screen w-screen shrink-0 snap-start snap-always items-center px-6 md:px-12 lg:px-16"
    >
      <div className="mx-auto w-full max-w-7xl">
        <div className="grid gap-8 md:grid-cols-[1.2fr_1fr] md:gap-16 lg:gap-24">
          <div className="flex flex-col justify-center">
            <div
              className={`mb-4 transition-all duration-700 md:mb-8 ${
                isVisible ? "translate-x-0 opacity-100" : "-translate-x-12 opacity-0"
              }`}
            >
              <h2 className="mb-2 font-sans text-4xl font-extralight tracking-tight text-white md:text-7xl lg:text-8xl">
                Let's build <span className="font-normal" style={{ color: flareColor }}>together</span>
              </h2>
              <p className="font-mono text-xs text-white/70 md:text-sm">
                / Connect with Wadud.studio
              </p>
            </div>

            <div className="space-y-4 md:space-y-6">
              <div
                className={`transition-all duration-700 ${
                  isVisible ? "translate-x-0 opacity-100" : "-translate-x-16 opacity-0"
                }`}
                style={{ transitionDelay: "150ms" }}
              >
                <div className="mb-1 flex items-center gap-2">
                  <span className="font-mono text-xs font-semibold" style={{ color: flareColor }}>
                    Founder
                  </span>
                </div>
                <p className="text-base font-medium text-white md:text-xl">
                  Muhammad Mubashir Munir Khan
                </p>
              </div>

              <a
                href="mailto:contact.muhammadmubashir@gmail.com"
                className={`group block transition-all duration-700 ${
                  isVisible ? "translate-x-0 opacity-100" : "-translate-x-16 opacity-0"
                }`}
                style={{ transitionDelay: "250ms" }}
              >
                <div className="mb-1 flex items-center gap-2">
                  <Mail className="h-3.5 w-3.5 transition-colors duration-500" style={{ color: flareColor }} />
                  <span className="font-mono text-xs text-white/70">Email</span>
                </div>
                <p className="text-base text-white transition-colors group-hover:text-white/80 md:text-xl">
                  contact.muhammadmubashir@gmail.com
                </p>
              </a>

              <div
                className={`transition-all duration-700 ${
                  isVisible ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"
                }`}
                style={{ transitionDelay: "350ms" }}
              >
                <div className="mb-1 flex items-center gap-2">
                  <MapPin className="h-3.5 w-3.5 transition-colors duration-500" style={{ color: flareColor }} />
                  <span className="font-mono text-xs text-white/70">Headquarters</span>
                </div>
                <p className="text-base text-white md:text-xl">Islamabad, Pakistan</p>
              </div>

              <div
                className={`flex flex-wrap gap-4 pt-2 transition-all duration-700 md:pt-4 ${
                  isVisible ? "translate-x-0 opacity-100" : "-translate-x-8 opacity-0"
                }`}
                style={{ transitionDelay: "450ms" }}
              >
                {[
                  { name: "wadud.care", url: "https://wadud.care" },
                  { name: "wadud.studio", url: "#" },
                  { name: "+92 315 489 5362", url: "tel:+923154895362" },
                ].map((item) => (
                  <a
                    key={item.name}
                    href={item.url}
                    target="_blank"
                    rel="noreferrer"
                    className="border-b border-white/30 font-mono text-xs text-white transition-all hover:border-white"
                    style={{ borderColor: `${flareColor}60` }}
                  >
                    {item.name}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Right side - Interactive Form */}
          <div className="flex flex-col justify-center">
            <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
              <div
                className={`transition-all duration-700 ${
                  isVisible ? "translate-x-0 opacity-100" : "translate-x-16 opacity-0"
                }`}
                style={{ transitionDelay: "200ms" }}
              >
                <label className="mb-1 block font-mono text-xs text-white/70 md:mb-1.5">
                  Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full border-b border-white/20 bg-transparent py-1.5 text-sm text-white placeholder:text-white/30 transition-all duration-300 focus:outline-none backdrop-blur-sm md:py-2 md:text-base"
                  style={{ borderColor: `${flareColor}60` }}
                  placeholder="Your name"
                />
              </div>

              <div
                className={`transition-all duration-700 ${
                  isVisible ? "translate-x-0 opacity-100" : "translate-x-16 opacity-0"
                }`}
                style={{ transitionDelay: "350ms" }}
              >
                <label className="mb-1 block font-mono text-xs text-white/70 md:mb-1.5">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="w-full border-b border-white/20 bg-transparent py-1.5 text-sm text-white placeholder:text-white/30 transition-all duration-300 focus:outline-none backdrop-blur-sm md:py-2 md:text-base"
                  style={{ borderColor: `${flareColor}60` }}
                  placeholder="your@email.com"
                />
              </div>

              <div
                className={`transition-all duration-700 ${
                  isVisible ? "translate-x-0 opacity-100" : "translate-x-16 opacity-0"
                }`}
                style={{ transitionDelay: "500ms" }}
              >
                <label className="mb-1 block font-mono text-xs text-white/70 md:mb-1.5">
                  Message
                </label>
                <textarea
                  rows={2}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                  className="w-full border-b border-white/20 bg-transparent py-1.5 text-sm text-white placeholder:text-white/30 transition-all duration-300 focus:outline-none backdrop-blur-sm md:py-2 md:text-base"
                  style={{ borderColor: `${flareColor}60` }}
                  placeholder="Tell us how you would like to collaborate..."
                />
              </div>

              <div
                className={`pt-2 transition-all duration-700 ${
                  isVisible ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"
                }`}
                style={{ transitionDelay: "650ms" }}
              >
                <MagneticButton
                  variant="primary"
                  size="lg"
                  className="w-full disabled:opacity-50"
                  onClick={isSubmitting ? undefined : undefined}
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                </MagneticButton>
                {submitSuccess && (
                  <p className="mt-3 text-center font-mono text-xs text-white">
                    Message sent successfully.
                  </p>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
