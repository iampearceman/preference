'use client';

import {
  NovuProvider,
  useSubscriptions,
  useRemoveSubscription,
  useCreateSubscription,
} from '@novu/react';
import { useState, useRef, useEffect } from 'react';
import toast from 'react-hot-toast';
import { mixpanel } from '@/lib/mixpanel';

import { ContextHeader } from '@/components/unsubscribe/context-header';
import { ExitInterview } from '@/components/unsubscribe/exit-interview';
import { DownChannel } from '@/components/unsubscribe/down-channel';
import { ActionButtons } from '@/components/unsubscribe/action-buttons';
import { SuccessState } from '@/components/unsubscribe/success-state';
import { Button } from '@/components/ui/button';

const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="max-w-md w-full p-8 text-center">
      <div className="space-y-3" role="status" aria-label="Loading unsubscribe page">
        <div className="h-6 bg-muted rounded-md animate-pulse"></div>
        <div className="h-4 bg-muted rounded-md animate-pulse w-3/4 mx-auto"></div>
        <div className="h-4 bg-muted rounded-md animate-pulse w-1/2 mx-auto"></div>
        <div className="h-10 bg-muted rounded-lg animate-pulse mt-4"></div>
      </div>
    </div>
  </div>
);

const ErrorState = ({ error, onRetry }: { error: Error; onRetry: () => void }) => (
  <div className="min-h-screen flex items-center justify-center bg-background px-4">
    <div className="mx-auto max-w-md text-center">
      <h2 className="text-lg font-semibold text-foreground mb-2">Error Loading Subscription</h2>
      <p className="text-sm text-muted-foreground mb-6">{error.message || 'Unable to load your subscription details.'}</p>
      <Button onClick={onRetry} className="rounded-lg">
        Try Again
      </Button>
    </div>
  </div>
);

function UnsubscribeContent({ topic }: { topic: string }) {
  const formattedTopic = topic.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());

  const { subscriptions, isLoading: subscriptionsLoading, error: subscriptionsError, refetch } = useSubscriptions({ topicKey: topic });
  const { remove, isRemoving } = useRemoveSubscription();
  const { create, isCreating } = useCreateSubscription();

  const [feedbackReasons, setFeedbackReasons] = useState<string[]>([]);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showUndo, setShowUndo] = useState(false);

  // Store the removed subscription's identifier so we can recreate it on undo
  const removedIdentifierRef = useRef<string | null>(null);

  const isSubscribed = subscriptions && subscriptions.length > 0;
  const currentSubscription = subscriptions?.[0];

  const hasTrackedPageView = useRef(false);
  useEffect(() => {
    if (subscriptionsLoading || hasTrackedPageView.current) return;
    hasTrackedPageView.current = true;
    mixpanel.track('[Marketing] Unsubscribe Page Viewed', {
      topic,
      topic_formatted: formattedTopic,
      is_currently_subscribed: !!isSubscribed,
    });
  }, [subscriptionsLoading, topic, formattedTopic, isSubscribed]);

  if (subscriptionsLoading) return <LoadingSpinner />;
  if (subscriptionsError) return <ErrorState error={subscriptionsError} onRetry={() => window.location.reload()} />;

  const handleUnsubscribe = async () => {
    if (!currentSubscription) {
      toast.error('No active subscription found for this topic.');
      return;
    }

    mixpanel.track('[Marketing] Unsubscribe Clicked', {
      topic,
      topic_formatted: formattedTopic,
      feedback_reasons: feedbackReasons,
      feedback_reason_count: feedbackReasons.length,
    });

    try {
      // Store identifier before removing so we can recreate on undo
      removedIdentifierRef.current = currentSubscription.identifier ?? null;

      await remove({
        subscription: currentSubscription,
      });
      await refetch();
      setIsSuccess(true);
      setShowUndo(true);
      setTimeout(() => setShowUndo(false), 10000);
      toast.success('Successfully unsubscribed');

      mixpanel.track('[Marketing] Unsubscribe Completed', {
        topic,
        topic_formatted: formattedTopic,
        feedback_reasons: feedbackReasons,
        feedback_reason_count: feedbackReasons.length,
      });
    } catch {
      mixpanel.track('[Marketing] Unsubscribe Failed', { topic, topic_formatted: formattedTopic });
      toast.error('Failed to unsubscribe. Please try again.');
    }
  };

  const handleUndo = async () => {
    mixpanel.track('[Marketing] Undo Unsubscribe Clicked', { topic, topic_formatted: formattedTopic });

    try {
      await create({
        topicKey: topic,
        identifier: removedIdentifierRef.current ?? topic,
      });
      await refetch();
      setIsSuccess(false);
      setShowUndo(false);
      removedIdentifierRef.current = null;
      toast.success('Successfully resubscribed');

      mixpanel.track('[Marketing] Resubscribe Completed', {
        topic,
        topic_formatted: formattedTopic,
        source: 'undo',
      });
    } catch {
      mixpanel.track('[Marketing] Resubscribe Failed', { topic, topic_formatted: formattedTopic, source: 'undo' });
      toast.error('Failed to resubscribe. Please try again.');
    }
  };

  const handleSubscribe = async () => {
    mixpanel.track('[Marketing] Resubscribe Clicked', { topic, topic_formatted: formattedTopic, source: 'already_unsubscribed' });

    try {
      await create({
        topicKey: topic,
        identifier: removedIdentifierRef.current ?? topic,
      });
      await refetch();
      toast.success('Successfully subscribed');

      mixpanel.track('[Marketing] Resubscribe Completed', {
        topic,
        topic_formatted: formattedTopic,
        source: 'already_unsubscribed',
      });
    } catch {
      mixpanel.track('[Marketing] Resubscribe Failed', { topic, topic_formatted: formattedTopic, source: 'already_unsubscribed' });
      toast.error('Failed to subscribe. Please try again.');
    }
  };

  // Already unsubscribed (no subscription found) and not just completed
  if (!isSubscribed && !isSuccess) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="mx-auto max-w-md text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground text-balance mb-2">
            You&apos;re currently unsubscribed
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-sm mx-auto mb-6">
            from {formattedTopic}
          </p>
          <Button
            onClick={handleSubscribe}
            disabled={isCreating}
            className="rounded-lg px-6 h-10 font-medium"
            size="lg"
          >
            {isCreating ? 'Subscribing...' : 'Resubscribe'}
          </Button>
        </div>
      </main>
    );
  }

  // Just completed unsubscribe - show success with undo
  if (isSuccess) {
    return (
      <SuccessState
        showUndo={showUndo}
        onUndo={handleUndo}
        undoLoading={isCreating}
      />
    );
  }

  // Main unsubscribe flow
  return (
    <main className="min-h-screen bg-background py-12 px-4 sm:py-16">
      <div className="mx-auto max-w-lg">
        <ContextHeader workflowName={formattedTopic} />

        <div className="mt-10 space-y-10">
          <ExitInterview
            selectedReasons={feedbackReasons}
            onReasonsChange={(reasons) => {
              const added = reasons.find((r) => !feedbackReasons.includes(r));
              const removed = feedbackReasons.find((r) => !reasons.includes(r));
              mixpanel.track('[Marketing] Feedback Reason Toggled', {
                topic,
                topic_formatted: formattedTopic,
                reason: added ?? removed,
                action: added ? 'selected' : 'deselected',
                selected_reasons: reasons,
                selected_count: reasons.length,
              });
              setFeedbackReasons(reasons);
            }}
          />

          <DownChannel />

          <ActionButtons
            onUnsubscribe={handleUnsubscribe}
            loading={isRemoving}
            disabled={!currentSubscription || feedbackReasons.length === 0}
            needsFeedback={feedbackReasons.length === 0}
          />
        </div>
      </div>
    </main>
  );
}

interface UnsubscribePageProps {
  subscriberId: string;
  topic: string;
}

export default function UnsubscribeClient({ subscriberId, topic }: UnsubscribePageProps) {
  const applicationIdentifier = process.env.NEXT_PUBLIC_NOVU_APP_ID || 'wigHgL-WyfKf';

  useEffect(() => {
    mixpanel.identify(subscriberId);
  }, [subscriberId]);

  return (
    <NovuProvider subscriberId={subscriberId} applicationIdentifier={applicationIdentifier}>
      <UnsubscribeContent topic={topic} />
    </NovuProvider>
  );
}
