export const cacheEngine = {
  get: <T = any>(_key?: any): { value: T; etag?: string } | any => null,
  set: <T = any>(_key?: any, _val?: any, _ttl?: any, _tags?: any): string => 'W/"etag-123"',
  delete: (_key?: any): void => {},
  clear: (): void => {},
  invalidateTag: (_tag?: any): void => {},
};
