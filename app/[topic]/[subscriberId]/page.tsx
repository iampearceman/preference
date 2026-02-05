import { notFound } from 'next/navigation';
import UnsubscribeClient from './unsubscribe-client';

async function validateSubscriber(subscriberId: string): Promise<boolean> {
  const apiKey = process.env.NOVU_API_KEY;
  if (!apiKey) {
    throw new Error('NOVU_API_KEY is not configured');
  }

  const res = await fetch(
    `https://api.novu.co/v2/subscribers/${encodeURIComponent(subscriberId)}`,
    {
      headers: {
        Authorization: `ApiKey ${apiKey}`,
      },
      cache: 'no-store',
    }
  );

  return res.ok;
}

interface PageProps {
  params: Promise<{ topic: string; subscriberId: string }>;
}

export default async function UnsubscribePage({ params }: PageProps) {
  const { topic, subscriberId } = await params;
  const decodedSubscriberId = decodeURIComponent(subscriberId);

  const subscriberExists = await validateSubscriber(decodedSubscriberId);
  if (!subscriberExists) {
    notFound();
  }

  return <UnsubscribeClient subscriberId={decodedSubscriberId} topic={topic} />;
}
