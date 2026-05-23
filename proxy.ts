import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const PROTECTED = ['/builder'];

export async function proxy(req: NextRequest) {
  const isProtected = PROTECTED.some((path) =>
    req.nextUrl.pathname.startsWith(path),
  );
  if (!isProtected) return NextResponse.next();

  const token = req.cookies.get('auth_token')?.value;

  if (!token) {
    return NextResponse.redirect(new URL('/?auth=login', req.url));
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
    await jwtVerify(token, secret);
    return NextResponse.next();
  } catch {
    const res = NextResponse.redirect(new URL('/?auth=login', req.url));
    res.cookies.delete('auth_token');
    return res;
  }
}

export const config = {
  matcher: ['/builder/:path*'],
};
