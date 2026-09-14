export const autonomousEngine: any = new Proxy({}, {
  get: () => () => Promise.resolve({})
});

export const autonomousEngineService: any = new Proxy({}, {
  get: () => () => Promise.resolve({})
});
