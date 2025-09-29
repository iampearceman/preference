'use client';

import { NovuProvider, usePreferences } from '@novu/react';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';
import dynamic from 'next/dynamic';

// UI
const LoadingSpinner = () => (
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

const ErrorState = ({ error, onRetry }: { error: Error; onRetry: () => void }) => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="max-w-md w-full p-8 text-center">
      <h2 className="text-xl font-bold text-foreground mb-2">Error Loading Preferences</h2>
      <p className="text-foreground/70 mb-4">{error.message || 'Unable to load your notification preferences.'}</p>
      <button
        onClick={onRetry}
        className="bg-foreground text-background px-4 py-2 rounded-lg hover:bg-foreground/90 transition-colors"
        aria-label="Retry loading preferences"
      >
        Try Again
      </button>
    </div>
  </div>
);

const ActionButton = ({ 
  onClick, 
  disabled, 
  loading, 
  children, 
  variant = 'primary' 
}: {
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
}) => {
  const baseClasses = "px-6 py-3 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variantClasses = {
    primary: "bg-foreground text-background hover:bg-foreground/90",
    secondary: "border border-foreground/20 text-foreground hover:bg-foreground/5",
    danger: "bg-red-500 text-white hover:bg-red-600",
    success: "bg-green-600 text-white hover:bg-green-700"
  } as const;

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseClasses} ${variantClasses[variant]}`}
    >
      {loading ? 'Loading…' : children}
    </button>
  );
};

function UnsubscribeContent() {
  const { preferences, isLoading: preferencesLoading, error: preferencesError, refetch } = usePreferences();
  const params = useParams();
  const [isLoading, setIsLoading] = useState(false);

  const workflowId = params.workflowId as string;
  const subscriberId = params.subscriberId as string;

  const formattedWorkflowId = workflowId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

  if (preferencesLoading) return <LoadingSpinner />;
  if (preferencesError) return <ErrorState error={preferencesError} onRetry={() => window.location.reload()} />;

  const findWorkflowPreference = () => {
    if (!preferences) return null;
    return (
      preferences.find(pref => pref.workflow?.id === workflowId) ||
      preferences.find(pref => pref.workflow?.identifier === workflowId) ||
      null
    );
  };

  const workflowPreference = findWorkflowPreference();
  const isUnsubscribed = workflowPreference?.channels?.email === false;


  const handleUnsubscribeClick = async () => {
    if (!workflowPreference) {
      toast.error(`Could not find preference for workflow: ${workflowId}.`);
      return;
    }

    setIsLoading(true);
    try {
      await workflowPreference.update({ channels: { email: false } });
      await refetch();
      toast.success('Successfully unsubscribed');
    } catch (error) {
      toast.error('Failed to unsubscribe. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubscribe = async () => {
    if (!workflowPreference) {
      toast.error(`Could not find preference for workflow: ${workflowId}.`);
      return;
    }

    setIsLoading(true);
    try {
      await workflowPreference.update({ channels: { email: true } });
      await refetch();
      toast.success('Successfully subscribed');
    } catch (error) {
      toast.error('Failed to subscribe. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isUnsubscribed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="max-w-md w-full p-8 text-center">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-foreground mb-2">Subscribe for<br />{formattedWorkflowId}</h2>
          </div>

          <div className="space-y-3">
            <ActionButton onClick={handleSubscribe} loading={isLoading} variant="success">
              Subscribe
            </ActionButton>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="max-w-md w-full p-8">
        <div className="mb-6 max-w-sm mx-auto text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">Unsubscribe from<br />{formattedWorkflowId}</h1>
        </div>

        <div className="space-y-3 max-w-sm mx-auto text-center">
          <ActionButton
            onClick={handleUnsubscribeClick}
            disabled={!workflowPreference}
            loading={isLoading}
            variant="danger"
          >
            <span className="flex items-center justify-center">Unsubscribe</span>
          </ActionButton>
          
          {!workflowPreference && (
            <div className="text-sm text-red-400 mt-2">
              No preference found for this workflow. This might be a configuration issue.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function UnsubscribePage() {
  const params = useParams();
  const rawSubscriberId = params.subscriberId as string;
  // Decode the URL-encoded subscriber ID (e.g., %3A becomes :)
  const subscriberId = decodeURIComponent(rawSubscriberId);
  const applicationIdentifier = process.env.NEXT_PUBLIC_NOVU_APP_ID || 'wigHgL-WyfKf';

  return (
    <NovuProvider subscriberId={subscriberId} applicationIdentifier={applicationIdentifier}>
      <UnsubscribeContent />
    </NovuProvider>
  );
}

export default dynamic(() => Promise.resolve(UnsubscribePage), { ssr: false });
