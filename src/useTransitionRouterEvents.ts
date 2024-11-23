import { useEffect } from 'react';
import { SingletonRouter } from 'next/router';
import { getHandleRouteChangeComplete } from './utils/handle-route-change-complete';
import { handleHashChangeComplete, getHandleHashChangeStart } from './utils/handle-hash-change';

export function useTransitionRouterEvents(singletonRouter: SingletonRouter) {
  useEffect(() => {
    const router = singletonRouter?.router;

    if (!router) return;

    const handleRouteChangeComplete = getHandleRouteChangeComplete(singletonRouter);
    const handleHashChangeStart = getHandleHashChangeStart(singletonRouter);

    let newRouterKey = (singletonRouter.router as never as { _key: string })._key;
    if (window.__NTH_routerKeyByHashRouteKey && window.__NTH_routerKey) {
      newRouterKey = window.__NTH_routerKeyByHashRouteKey[newRouterKey] ?? newRouterKey;
    }
    window.__NTH_routerKey = newRouterKey;

    router.events.on('routeChangeComplete', handleRouteChangeComplete);
    router.events.on('hashChangeStart', handleHashChangeStart);
    router.events.on('hashChangeComplete', handleHashChangeComplete);

    return () => {
      router.events.off('routeChangeComplete', handleRouteChangeComplete);
      router.events.off('hashChangeStart', handleHashChangeStart);
      router.events.off('hashChangeComplete', handleHashChangeComplete);
    };
  }, [singletonRouter]);
}