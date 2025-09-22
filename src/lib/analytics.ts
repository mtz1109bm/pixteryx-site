// src/lib/analytics.ts
export function track(name: string, props?: Record<string, any>) {
  if (typeof window !== "undefined" && (window as any).plausible) {
    (window as any).plausible(name, props ? { props } : undefined);
  }
}

// Typage global pour éviter les erreurs TS
declare global {
  interface Window {
    plausible?: (eventName: string, options?: { props?: Record<string, any> }) => void;
  }
}
