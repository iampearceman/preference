"use client"

import { MessageCircle, HelpCircle, ArrowUpRight } from "lucide-react"
import { mixpanel } from "@/lib/mixpanel"

const channels = [
  {
    name: "Join our Discord",
    description: "Chat with the community",
    href: "https://discord.novu.co",
    icon: <MessageCircle className="h-4 w-4" />,
  },
  {
    name: "Contact Support",
    description: "We're here to help",
    href: "https://novu.co/contact-us",
    icon: <HelpCircle className="h-4 w-4" />,
  },
  {
    name: "Follow on LinkedIn",
    description: "Bite-sized updates",
    href: "https://www.linkedin.com/company/novuhq",
    icon: (
      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    ),
  },
  {
    name: "Follow on X",
    description: "Quick updates",
    href: "https://x.com/novabordhq",
    icon: (
      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    ),
  },
]

export function DownChannel() {
  return (
    <section className="space-y-4">
      <div className="space-y-1">
        <h2 className="text-sm font-semibold text-foreground">Stay connected</h2>
        <p className="text-xs text-muted-foreground">
          Other ways to keep in touch with us
        </p>
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        {channels.map((channel) => (
          <a
            key={channel.name}
            href={channel.href}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => mixpanel.track('[Marketing] Alternative Channel Clicked', { channel: channel.name })}
            className="group flex items-center gap-3 rounded-lg border border-border bg-card px-3.5 py-3 transition-all hover:border-foreground/20"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground transition-colors group-hover:bg-foreground group-hover:text-background">
              {channel.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1">
                <span className="font-medium text-sm text-foreground">{channel.name}</span>
                <ArrowUpRight className="h-3 w-3 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
              </div>
              <span className="text-xs text-muted-foreground">
                {channel.description}
              </span>
            </div>
          </a>
        ))}
      </div>
    </section>
  )
}
