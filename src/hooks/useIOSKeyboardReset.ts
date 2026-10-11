import { useEffect } from 'react';

const isEditable = (el: Element | null) =>
  !!el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || (el as HTMLElement).isContentEditable);

const resetViewport = () => {
  window.scrollTo(0, 0);
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
};

// iOS WKWebView leaves the page offset after the keyboard closes, enlarging the bottom gap.
export function useIOSKeyboardReset() {
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    const onFocusOut = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        if (!isEditable(document.activeElement)) resetViewport();
      }, 100);
    };
    const vv = window.visualViewport;
    const onResize = () => {
      if (vv && vv.height >= window.innerHeight - 50 && !isEditable(document.activeElement)) {
        resetViewport();
      }
    };
    document.addEventListener('focusout', onFocusOut);
    vv?.addEventListener('resize', onResize);
    return () => {
      clearTimeout(timer);
      document.removeEventListener('focusout', onFocusOut);
      vv?.removeEventListener('resize', onResize);
    };
  }, []);
}
