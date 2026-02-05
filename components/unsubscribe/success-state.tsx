"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Check, RotateCcw } from "lucide-react"

interface SuccessStateProps {
  showUndo: boolean
  onUndo: () => void
  undoLoading?: boolean
}

export function SuccessState({ showUndo, onUndo, undoLoading }: SuccessStateProps) {
  const [countdown, setCountdown] = useState(10)

  useEffect(() => {
    if (!showUndo) return

    setCountdown(10)

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [showUndo])

  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="mx-auto max-w-md text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 mb-6">
          <Check className="h-7 w-7 text-emerald-600" strokeWidth={2.5} />
        </div>

        <h1 className="text-2xl font-semibold tracking-tight text-foreground text-balance">
          You&apos;ve been unsubscribed
        </h1>

        <p className="mt-3 text-sm text-muted-foreground leading-relaxed max-w-sm mx-auto">
          Thank you for being a reader. We hope to see you again sometime.
        </p>

        {showUndo && (
          <div className="mt-8 rounded-lg border border-border bg-card p-5">
            <p className="text-sm text-muted-foreground mb-3">
              Changed your mind?
            </p>
            <Button
              onClick={onUndo}
              disabled={undoLoading || countdown <= 0}
              className="gap-2 rounded-lg px-5"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              {undoLoading ? 'Resubscribing...' : `Undo (${countdown}s)`}
            </Button>
          </div>
        )}

        {!showUndo && (
          <div className="mt-8">
            <Button variant="outline" asChild className="rounded-lg px-5">
              <a href="https://novu.co?utm_source=preference_center&utm_medium=web&utm_content=return_to_website">Return to website</a>
            </Button>
          </div>
        )}
      </div>
    </main>
  )
}
