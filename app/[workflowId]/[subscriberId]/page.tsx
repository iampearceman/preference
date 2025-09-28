'use client';

import { NovuProvider, usePreferences } from '@novu/react';
import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

// Reusable UI Components
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="max-w-md w-full p-8 text-center">
      <div className="animate-pulse space-y-4" role="status" aria-label="Loading unsubscribe page">
        <div className="h-8 bg-foreground/10 rounded"></div>
        <div className="h-4 bg-foreground/10 rounded"></div>
        <div className="h-4 bg-foreground/10 rounded"></div>
        <div className="h-12 bg-foreground/10 rounded"></div>
      </div>
    </div>
  </div>
);

const ErrorState = ({ error, onRetry }: { error: Error; onRetry: () => void }) => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="max-w-md w-full p-8 text-center">
      <div className="text-red-500 mb-4" role="img" aria-label="Error icon">
        <svg className="h-12 w-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      </div>
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
  variant?: 'primary' | 'secondary' | 'danger';
}) => {
  const baseClasses = "w-full px-6 py-3 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variantClasses = {
    primary: "bg-foreground text-background hover:bg-foreground/90",
    secondary: "border border-foreground/20 text-foreground hover:bg-foreground/5",
    danger: "bg-red-500 text-white hover:bg-red-600"
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseClasses} ${variantClasses[variant]}`}
    >
      {loading ? (
        <span className="flex items-center justify-center">
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Loading...
        </span>
      ) : (
        children
      )}
    </button>
  );
};

function UnsubscribeContent() {
  const { preferences, isLoading: preferencesLoading, error: preferencesError, refetch } = usePreferences();
  const params = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [isUnsubscribed, setIsUnsubscribed] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const workflowId = params.workflowId as string;
  const subscriberId = params.subscriberId as string;
  
  // Format workflow ID for display (remove dashes and capitalize)
  const formattedWorkflowId = workflowId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

  if (preferencesLoading) {
    return <LoadingSpinner />;
  }

  if (preferencesError) {
    return <ErrorState error={preferencesError} onRetry={() => window.location.reload()} />;
  }

  const findWorkflowPreference = () => {
    if (!preferences) return null;
    return preferences.find(
      pref => pref.workflow?.id === workflowId || pref.workflow?.identifier === workflowId
    );
  };

  const handleUnsubscribeClick = () => {
    setShowConfirmation(true);
  };

  const handleConfirmUnsubscribe = async () => {
    const workflowPreference = findWorkflowPreference();
    
    if (!workflowPreference) {
      toast.error(`Could not find preference for workflow: ${workflowId}`);
      return;
    }

    setIsLoading(true);
    
    try {
      await workflowPreference.update({
        channels: { email: false },
      });
      
      setIsUnsubscribed(true);
      setShowConfirmation(false);
      toast.success('Successfully unsubscribed from notifications!');
    } catch (error) {
      toast.error('Failed to unsubscribe. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResubscribe = async () => {
    const workflowPreference = findWorkflowPreference();

    if (!workflowPreference) {
      toast.error(`Could not find preference for workflow: ${workflowId}`);
      return;
    }

    setIsLoading(true);
    
    try {
      await workflowPreference.update({
        channels: {
          email: true,
          sms: true,
          in_app: true,
          chat: true,
          push: true,
        },
      });
      
      setIsUnsubscribed(false);
      await refetch();
      toast.success('Successfully resubscribed to notifications!');
    } catch (error) {
      toast.error('Failed to resubscribe. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isUnsubscribed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="max-w-md w-full p-8 text-center">
          <div className="mb-6">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-500 mb-4" role="img" aria-label="Success checkmark">
              <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Successfully Unsubscribed!</h2>
            <p className="text-foreground/70">
              You have been unsubscribed from all notifications for this workflow.
            </p>
          </div>
          
          <div className="space-y-3">
            <ActionButton
              onClick={handleResubscribe}
              loading={isLoading}
              variant="primary"
            >
              Resubscribe (Made a mistake?)
            </ActionButton>
            
            <ActionButton
              onClick={() => window.close()}
              disabled={isLoading}
              variant="secondary"
            >
              Close Window
            </ActionButton>
          </div>
          
          <p className="text-sm text-foreground/50 mt-4">You can safely close this page</p>
        </div>
      </div>
    );
  }

  if (showConfirmation) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="max-w-md w-full p-8 text-center">
          <div className="mb-6">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-500 mb-4" role="img" aria-label="Warning icon">
              <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Are you sure?</h2>
          </div>

          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6" role="alert">
            <p className="text-red-500 font-medium mb-2">
              You're about to unsubscribe from all notifications for this workflow.
            </p>
            <p className="text-red-500/80 text-sm">
              This means you won't receive any future notifications via email, SMS, push, or in-app messages for this workflow.
            </p>
          </div>

          <div className="space-y-3">
            <ActionButton
              onClick={handleConfirmUnsubscribe}
              loading={isLoading}
              variant="danger"
            >
              Yes, Unsubscribe Me
            </ActionButton>
            
            <ActionButton
              onClick={() => setShowConfirmation(false)}
              disabled={isLoading}
              variant="secondary"
            >
              Cancel
            </ActionButton>
          </div>

          <p className="text-sm text-foreground/50 mt-4">
            You can always resubscribe later if you change your mind.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="max-w-md w-full p-8 text-center">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground mb-2 whitespace-nowrap">Unsubscribe from {formattedWorkflowId}</h1>
        </div>

        
        <div className="space-y-3">
          <ActionButton
            onClick={handleUnsubscribeClick}
            disabled={!preferences}
            variant="danger"
          >
            <span className="flex items-center justify-center">
              <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Unsubscribe from All Notifications
            </span>
          </ActionButton>
        </div>
      </div>
    </div>
  );
}

export default function UnsubscribePage() {
  const params = useParams();
  const subscriberId = params.subscriberId as string;
  const applicationIdentifier = process.env.NEXT_PUBLIC_NOVU_APP_ID || 'wigHgL-WyfKf';

  return (
    <NovuProvider
      subscriberId={subscriberId}
      applicationIdentifier={applicationIdentifier}
    >
      <UnsubscribeContent />
    </NovuProvider>
  );
}
