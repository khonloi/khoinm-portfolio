import React from 'react';
import sanityConfig from '../../sanity.config';

const Studio = React.lazy(() =>
  import('sanity').then((module) => ({ default: module.Studio }))
);

export default function Editor() {
  return (
    <React.Suspense fallback={<div style={{ padding: '2rem', color: '#fff', background: '#000', height: '100vh' }}>Loading Editor...</div>}>
      <Studio config={sanityConfig} />
    </React.Suspense>
  );
}
