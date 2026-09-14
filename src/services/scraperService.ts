export const scraperService: any = new Proxy({}, {
  get: () => () => Promise.resolve({})
});
