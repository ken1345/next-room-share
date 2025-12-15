"use client";

import dynamic from 'next/dynamic';

const ReviewMapContent = dynamic(() => import('./ReviewMapContent'), {
  loading: () => <div className="h-[400px] w-full bg-gray-100 rounded-xl flex items-center justify-center text-gray-400">Map Loading...</div>,
  ssr: false
});

export default function ReviewMap() {
  return <ReviewMapContent />;
}