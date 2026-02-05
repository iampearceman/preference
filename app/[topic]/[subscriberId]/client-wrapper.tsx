'use client';

import dynamic from 'next/dynamic';

const UnsubscribeClient = dynamic(
  () => import('./unsubscribe-client'),
  { ssr: false }
);

export default function ClientWrapper({ subscriberId, topic }: { subscriberId: string; topic: string }) {
  return <UnsubscribeClient subscriberId={subscriberId} topic={topic} />;
}
