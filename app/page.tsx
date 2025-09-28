import { notFound } from 'next/navigation';

export default function Home() {
  // Make the main route unreachable by returning a 404
  notFound();
}
