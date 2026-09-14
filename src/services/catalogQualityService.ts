export const catalogQualityService: any = new Proxy({}, {
  get: () => () => Promise.resolve({})
});
