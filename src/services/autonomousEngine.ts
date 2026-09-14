export const autonomousEngine: any = new Proxy({}, {
  get: () => () => Promise.resolve({})
});
