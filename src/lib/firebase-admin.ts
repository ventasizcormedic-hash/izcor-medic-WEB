export const adminAuth: any = {
  verifyIdToken: async (_token: string) => ({
    uid: 'dev-admin',
    email: 'admin@izcormedic.com',
  }),
};
