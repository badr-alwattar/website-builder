import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { signToken, buildAuthCookie } from '@/lib/auth';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
  }

  const { email, password } = parsed.data;

  const user = await prisma.user.findUnique({ where: { email } });
  const valid = user ? await bcrypt.compare(password, user.password) : false;

  if (!user || !valid) {
    return NextResponse.json(
      { error: 'Invalid email or password' },
      { status: 401 },
    );
  }

  const token = await signToken({
    sub: user.id,
    name: user.name,
    email: user.email,
  });
  const res = NextResponse.json({ success: true });
  res.cookies.set(buildAuthCookie(token));
  return res;
}
