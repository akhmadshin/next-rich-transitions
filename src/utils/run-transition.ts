import { transitionHelper } from './transition-helper';
import { timeout } from './timeout';


export const runTransition = async () => {
  if (window.__NTH_viewTransition) {
    window.__NTH_viewTransition.skipTransition();
    await timeout(0);
  }

  const pageMountedPromise: Promise<void> = new Promise(resolve => {
    window.__NTH_pageMounted = resolve;
  })
  transitionHelper({
    update: async () => {
      if (window.__NTH_pageMounted) {
        await pageMountedPromise;
      }
    },
  });
}