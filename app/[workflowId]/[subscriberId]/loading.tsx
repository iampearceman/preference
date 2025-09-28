export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-md w-full p-8 text-center">
        <div className="space-y-4" role="status" aria-label="Loading unsubscribe page">
          <div className="h-8 bg-foreground/10 rounded animate-pulse"></div>
          <div className="h-4 bg-foreground/10 rounded animate-pulse"></div>
          <div className="h-4 bg-foreground/10 rounded animate-pulse"></div>
          <div className="h-12 bg-foreground/10 rounded animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}
