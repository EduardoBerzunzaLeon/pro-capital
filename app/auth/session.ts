import {createCookieSessionStorage } from "@remix-run/node";

type SessionData = {
  credentials: {
    token: string;
    user: {
      email: string;
      name: string;
    };
  };
};

type SessionFlashData = {
  error: string;
};

const { getSession, commitSession, destroySession } =
  createCookieSessionStorage<SessionData, SessionFlashData>({
    // a Cookie from `createCookie` or the CookieOptions to create one
    cookie: {
      name: "__session",
      httpOnly: true,
      sameSite: "lax",
      maxAge: 60*1000*60*60,
      secrets: [process.env.SESSION_SECRET as string],
      secure: true,
    },
  });

export { getSession, commitSession, destroySession };