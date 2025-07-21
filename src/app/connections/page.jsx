// app/connections/page.jsx
import { Suspense } from 'react';
import ConnectionPageClient from './ConnectionPageClient';

export default function Page() {
  return (
    <Suspense fallback={<div className="p-4">Loading...</div>}>
      <ConnectionPageClient />
    </Suspense>
  );
}
