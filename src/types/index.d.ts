declare global {
  interface Window {
    __NTH_viewTransition?: ViewTransition;
    __NTH_pageMounted?: () => void;
    __NTH_transitionImgSrc?: string;
    __NTH_transitionImgSelector?: string;
    __NTH_transitionImgPosition?: string;
    __NTH_routerKey?: string;
    __NTH_routerKeyCopy?: string;
    __NTH_routerKeyByHashRouteKey?: Record<string, string>;
    __NTH_previousRouterKey?: string;
  }
}

export {};