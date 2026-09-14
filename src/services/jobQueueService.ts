export const jobQueueService: any = new Proxy({}, {
  get: () => () => Promise.resolve({})
});
