import { Hono } from 'hono';
import { PrismaClient } from '@prisma/client';
import { sign, verify } from 'hono/jwt';

const app = new Hono();
const prisma = new PrismaClient();
const JWT_SECRET = 'your_secret_key';

interface CustomContext {
  req: any;
  set: (key: string, value: any) => void;
  get: (key: 'user') => { userId: string };
  json: (data: any, status?: number) => any;
}

const authMiddleware = async (c: CustomContext, next: () => Promise<void>) => {
  const token = c.req.header('Authorization')?.split(' ')[1];
  if (!token) return c.json({ message: 'Unauthorized' }, 401);
  try {
    const decoded = await verify(token, JWT_SECRET);
    c.set('user', decoded);
    await next();
  } catch {
    return c.json({ message: 'Invalid token' }, 401);
  }
};

app.post('/auth/sign-up', async (c) => {
  const { name, email, password } = await c.req.json();
  try {
    const user = await prisma.user.create({
      data: { name, email, password },
    });
    return c.json({ message: 'User registered' });
  } catch {
    return c.json({ message: 'User already exists' }, 400);
  }
});

app.post('/auth/log-in', async (c) => {
  const { email, password } = await c.req.json();
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || user.password !== password) {
    return c.json({ message: 'Invalid credentials' }, 400);
  }
  const token = await sign({ userId: user.id }, JWT_SECRET);
  return c.json({ token });
});

app.get('/users/me', authMiddleware, async (c: CustomContext) => {
  const userPayload = c.get('user');
  const user = await prisma.user.findUnique({ where: { id: userPayload.userId } });
  return c.json(user);
});

export default app;