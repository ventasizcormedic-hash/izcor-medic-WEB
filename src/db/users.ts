import { db } from './index.ts';
import { users } from './schema.ts';
import { eq } from 'drizzle-orm';

export async function getOrCreateUser(uid: string, email: string) {
  const isAdmin = email.toLowerCase().includes('admin') || 
                  email.toLowerCase().includes('izcor') || 
                  email.toLowerCase().includes('ventas');
  const defaultRole = isAdmin ? 'ADMIN' : 'USER';
  
  const result = await db.insert(users)
    .values({ uid, email, role: defaultRole })
    .onConflictDoUpdate({
      target: users.uid,
      set: { email, role: defaultRole },
    })
    .returning();
  return result[0];
}

export async function getUserRole(uid: string) {
  const result = await db.select({ role: users.role }).from(users).where(eq(users.uid, uid)).limit(1);
  return result[0]?.role || 'USER';
}
