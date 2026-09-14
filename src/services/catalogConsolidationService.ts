export const catalogConsolidationService: any = new Proxy({}, {
  get: () => () => Promise.resolve({})
});
