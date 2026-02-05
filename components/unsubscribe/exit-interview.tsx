"use client"

import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

interface ExitInterviewProps {
  selectedReasons: string[]
  onReasonsChange: (reasons: string[]) => void
}

const feedbackReasons = [
  { id: "inbox-overwhelmed", label: "My inbox is overwhelmed" },
  { id: "topics-not-relevant", label: "Topics aren't relevant anymore" },
  { id: "no-time", label: "Not enough time to read" },
  { id: "too-frequent", label: "Even monthly is too frequent" },
  { id: "content-quality", label: "Content quality changed" },
  { id: "other", label: "Other reason" },
]

export function ExitInterview({ selectedReasons, onReasonsChange }: ExitInterviewProps) {
  const toggleReason = (reasonId: string) => {
    if (selectedReasons.includes(reasonId)) {
      onReasonsChange(selectedReasons.filter((id) => id !== reasonId))
    } else {
      onReasonsChange([...selectedReasons, reasonId])
    }
  }

  return (
    <section className="space-y-4">
      <div className="space-y-1">
        <h2 className="text-sm font-semibold text-foreground">Quick feedback</h2>
        <p className="text-xs text-muted-foreground">
          Help us improve by sharing why you&apos;re leaving
        </p>
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        {feedbackReasons.map((reason) => (
          <label
            key={reason.id}
            htmlFor={reason.id}
            className="flex items-center gap-3 rounded-lg border border-border bg-card px-3.5 py-3 cursor-pointer transition-all hover:border-foreground/20 has-[[data-state=checked]]:border-foreground/40 has-[[data-state=checked]]:bg-muted"
          >
            <Checkbox
              id={reason.id}
              checked={selectedReasons.includes(reason.id)}
              onCheckedChange={() => toggleReason(reason.id)}
              className="data-[state=checked]:bg-foreground data-[state=checked]:border-foreground"
            />
            <Label htmlFor={reason.id} className="flex-1 cursor-pointer font-normal text-sm text-foreground">
              {reason.label}
            </Label>
          </label>
        ))}
      </div>
    </section>
  )
}
