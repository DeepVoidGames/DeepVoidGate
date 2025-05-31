export const GA_TRACKING_ID = "G-D4HNW2XMK3";

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

export const pageview = (url: string) => {
  if (!window.gtag) return;
  window.gtag("config", GA_TRACKING_ID, {
    page_path: url,
  });
};

export const event = (action: string, params: Record<string, any>) => {
  if (!window.gtag) return;
  window.gtag("event", action, params);
};
