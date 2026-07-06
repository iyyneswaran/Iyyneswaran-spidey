'use client';

import { useState, type ReactNode } from 'react';
import { CinematicLoader } from '@/components/ui/CinematicLoader';

export function LoaderWrapper({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <>
      {isLoading && (
        <CinematicLoader onComplete={() => setIsLoading(false)} />
      )}
      <div
        style={{
          opacity: isLoading ? 0 : 1,
          transition: 'opacity 0.3s ease-out',
        }}
      >
        {children}
      </div>
    </>
  );
}
