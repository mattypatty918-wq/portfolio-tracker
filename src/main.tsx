import { useState, useEffect } from 'preact/hooks';
import { App } from './App';

export function Main() {
  return <App />;
}

if (typeof window !== 'undefined') {
  const root = document.getElementById('app');
  if (root) {
    import('preact').then(({ render }) => {
      render(<Main />, root);
    });
  }
}