export const deduplicationService: any = new Proxy({}, {
  get: () => () => Promise.resolve({})
});
