import { createCookieSessionStorage } from "@remix-run/node";

export const flashSession = createCookieSessionStorage({
  cookie: {
    name: "__flash",
    httpOnly: true,
    maxAge: 10,
    path: "/",
    sameSite: "lax",
    secrets: [process.env.SESSION_SECRET ?? 'secret'],
    secure: process.env.NODE_ENV === 'production',
  },
});

