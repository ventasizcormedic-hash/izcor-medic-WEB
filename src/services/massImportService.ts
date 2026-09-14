export const massImportService: any = new Proxy({}, {
  get: () => () => Promise.resolve({})
});
