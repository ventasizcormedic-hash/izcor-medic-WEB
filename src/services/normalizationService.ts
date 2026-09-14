export const normalizationService: any = new Proxy({}, {
  get: () => () => Promise.resolve({})
});
