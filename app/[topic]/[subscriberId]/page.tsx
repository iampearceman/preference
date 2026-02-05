import { notFound } from 'next/navigation';
import ClientWrapper from './client-wrapper';

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

  const subscriberExists = await validateSubscriber(subscriberId);
  if (!subscriberExists) {
    notFound();
  }

  return <ClientWrapper subscriberId={subscriberId} topic={topic} />;
}
