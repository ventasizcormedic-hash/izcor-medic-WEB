export const productReviewService: any = new Proxy({}, {
  get: () => () => Promise.resolve({})
});
