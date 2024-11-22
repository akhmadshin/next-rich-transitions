import { getElementAbsolutePosition } from './get-element-absolute-position';
import { isTransitionAvailable } from './is-transition-available';
import { runTransition } from './run-transition';

export const handleHistoryTransitionStarted = async (futureKeyOrig: string) => {
  await runTransition();

  let futureKey = futureKeyOrig;
  window.__NTH_routerKeyByHashRouteKey = window.__NTH_routerKeyByHashRouteKey || {};
  if (futureKeyOrig && window.__NTH_routerKeyByHashRouteKey[futureKeyOrig]) {
    futureKey = window.__NTH_routerKeyByHashRouteKey[futureKeyOrig];
  }

  let routerKey = window.__NTH_routerKey!;
  if (window.__NTH_routerKeyByHashRouteKey && window.__NTH_routerKey) {
    routerKey = window.__NTH_routerKeyByHashRouteKey[window.__NTH_routerKey] ?? routerKey;
  }

  const bffImgSelector = sessionStorage.getItem(`__NTH_view_transition_image_selector_${routerKey}-${futureKey}`) || '';

  if (bffImgSelector) {
    const clickedImg = document.querySelector<HTMLImageElement>(bffImgSelector);
    if (clickedImg && clickedImg.src) {
      const imgPosition = getElementAbsolutePosition(clickedImg);
      sessionStorage.setItem(
        `__NTH_view_transition_image_${routerKey}-${futureKey}`,
        JSON.stringify(imgPosition)
      );

      window.__NTH_transitionImgSrc = clickedImg.src.replace(location.origin || '', '');
      const isViewTransitionAvailable = isTransitionAvailable(`${routerKey}-${futureKey}`);

      if (isViewTransitionAvailable) {
        const el = document.querySelector<HTMLImageElement>(`[style*='view-transition-name']`);
        if (el) {
          el.style.viewTransitionName = '';
        }
        clickedImg.style.viewTransitionName = '__NTH_transition-img';
      }
      return;
    }
  }
}
