export function useAnalytics() {
  return {
    trackEvent: (_category: string, _action: string, _label?: string) => {},
    trackProductView: (_product: any) => {}
  };
}
