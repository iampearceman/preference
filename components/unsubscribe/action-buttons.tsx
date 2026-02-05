'use client';

import { Button } from "@/components/ui/button"

interface ActionButtonsProps {
  onUnsubscribe: () => void
  loading?: boolean
  disabled?: boolean
  needsFeedback?: boolean
}

export function ActionButtons({ onUnsubscribe, loading, disabled, needsFeedback }: ActionButtonsProps) {
  return (
    <div className="flex flex-col gap-3 pt-6 border-t border-border">
      <Button
        onClick={onUnsubscribe}
        disabled={disabled || loading}
        className="w-full rounded-lg h-10 font-medium"
        size="lg"
      >
        {loading ? 'Unsubscribing...' : 'Unsubscribe from newsletter'}
      </Button>

      {needsFeedback ? (
        <p className="text-center text-xs text-muted-foreground">
          Please select at least one reason above to continue
        </p>
      ) : (
        <p className="text-center text-xs text-muted-foreground">
          You can always resubscribe from our website
        </p>
      )}

      <div className="mt-8 flex items-center justify-center gap-1.5 text-xs text-muted-foreground/50">
        <span>Powered by</span>
        <a
          href="https://novu.co?utm_source=preference_center&utm_medium=web&utm_content=powered_by"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 transition-opacity opacity-50 hover:opacity-100"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://cdn.sanity.io/images/w2rl2099/production/444a0f5893c11414cd50ee5d5e14d792fcd6ed1a-863x270.svg"
            alt="Novu"
            className="h-3.5 w-auto"
          />
        </a>
      </div>
    </div>
  )
}
