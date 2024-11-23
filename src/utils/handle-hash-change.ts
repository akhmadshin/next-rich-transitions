import type { SingletonRouter } from 'next/router';

export const getHandleHashChangeStart = (singletonRouter: SingletonRouter) => () => {
  let routerKey = (singletonRouter.router as never as { _key: string })._key;

  window.__NTH_routerKeyByHashRouteKey = window.__NTH_routerKeyByHashRouteKey || {};
  if (window.__NTH_routerKeyByHashRouteKey[routerKey]) {
    routerKey = window.__NTH_routerKeyByHashRouteKey[routerKey];
  }

  window.__NTH_routerKeyCopy = routerKey
  if (window.__NTH_viewTransition) {
    window.__NTH_viewTransition.skipTransition();
  }
}

export const handleHashChangeComplete = () => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  const routerKey = singletonRouter.router!._key;

  window.__NTH_routerKeyByHashRouteKey = window.__NTH_routerKeyByHashRouteKey || {};
  if (!window.__NTH_routerKeyByHashRouteKey[routerKey]) {
    window.__NTH_routerKeyByHashRouteKey = {
      ...window.__NTH_routerKeyByHashRouteKey,
      [routerKey]: window.__NTH_routerKeyCopy
    };
    window.__NTH_routerKeyCopy = undefined;
  }
}
