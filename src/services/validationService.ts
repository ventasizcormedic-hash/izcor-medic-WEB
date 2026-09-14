export const validationService: any = new Proxy({}, {
  get: () => () => Promise.resolve({})
});
