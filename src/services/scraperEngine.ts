export const scraperEngine: any = new Proxy({}, {
  get: () => () => Promise.resolve({})
});
