import { isTransitionAvailable } from './is-transition-available';
import { getElementSelector } from './get-element-selector';
import type { SingletonRouter } from 'next/router';

export const getHandleRouteChangeComplete = (singletonRouter: SingletonRouter) => () => {
  if (typeof window === 'undefined') {
    return;
  }
  if (!window.__NTH_pageMounted) {
    return;
  }
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  let newRouterKey = singletonRouter.router!._key;

  if (window.__NTH_routerKeyByHashRouteKey && window.__NTH_routerKey) {
    newRouterKey = window.__NTH_routerKeyByHashRouteKey[newRouterKey] ?? newRouterKey;
  }

  window.__NTH_previousRouterKey = window.__NTH_routerKey;
  window.__NTH_routerKey = newRouterKey;

  let routerKey = window.__NTH_routerKey;
  if (window.__NTH_routerKeyByHashRouteKey && window.__NTH_routerKey) {
    routerKey = window.__NTH_routerKeyByHashRouteKey[window.__NTH_routerKey] ?? routerKey;
  }

  if (window.__NTH_transitionImgSelector && window.__NTH_transitionImgPosition) {
    sessionStorage.setItem(`__NTH_view_transition_image_selector_${window.__NTH_previousRouterKey}-${routerKey}`, window.__NTH_transitionImgSelector);
    sessionStorage.setItem(`__NTH_view_transition_image_${window.__NTH_previousRouterKey}-${routerKey}`, window.__NTH_transitionImgPosition);

    window.__NTH_transitionImgSelector = undefined;
    window.__NTH_transitionImgPosition = undefined;
  }
  // Navigation via back-forward
  const backRouterKey = `${routerKey}-${window.__NTH_previousRouterKey}`;
  const isViewTransitionAvailable = isTransitionAvailable(backRouterKey);

  const imgSelector = sessionStorage.getItem(`__NTH_view_transition_image_selector_${backRouterKey}`);
  const img = imgSelector ? document.querySelector<HTMLImageElement>(imgSelector) : undefined;

  if (img && isViewTransitionAvailable) {
    const el = document.querySelector<HTMLImageElement>(`[style*='view-transition-name']`);
    if (el) {
      el.style.viewTransitionName = '';
    }

    img.style.viewTransitionName = '__NTH_transition-img';
  } else {
    // Navigation via clicking link
    const transitionImg = document.querySelector<HTMLImageElement>(`img[src$='${window.__NTH_transitionImgSrc}']`);

    if (transitionImg) {
      const imgSelector = getElementSelector(transitionImg) || '';

      const el = document.querySelector<HTMLImageElement>(`[style*='view-transition-name']`);
      if (el) {
        el.style.viewTransitionName = '';
      }

      transitionImg.style.viewTransitionName = '__NTH_transition-img';
      sessionStorage.setItem(`__NTH_view_transition_image_selector_${backRouterKey}`, imgSelector);
    }
  }

  window.__NTH_transitionImgSrc = undefined;
  if (window.__NTH_pageMounted) {
    window.__NTH_pageMounted();
    window.__NTH_pageMounted = undefined;
  }
}
