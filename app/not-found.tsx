'use client';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="max-w-md w-full text-center">
        {/* 404 Number */}
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-foreground/20 select-none">
            404
          </h1>
        </div>

        {/* Main Message */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Something went wrong
          </h2>
          <p className="text-foreground/70 text-lg leading-relaxed">
            Please open the link from your email again. If the issue continues, contact support.
          </p>
        </div>


        {/* Help Text */}
        <div className="mt-12 pt-8 border-t border-foreground/10">
          <p className="text-sm text-foreground/50">
            If you believe this is an error, please contact support.
          </p>
        </div>
      </div>
    </div>
  );
}
