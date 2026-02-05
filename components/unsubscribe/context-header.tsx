interface ContextHeaderProps {
  workflowName: string
}

export function ContextHeader({ workflowName }: ContextHeaderProps) {
  return (
    <header className="text-center pb-8 border-b border-border">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-muted border border-border mb-6">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{workflowName}</span>
      </div>
      <h1 className="text-3xl font-semibold tracking-tight text-foreground text-balance">
        Manage Subscription
      </h1>
      <p className="mt-3 text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
        We understand priorities change. Before you go, we&apos;d love to hear your thoughts.
      </p>
    </header>
  )
}
