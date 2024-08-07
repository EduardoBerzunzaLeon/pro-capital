import { createCookieSessionStorage } from '@remix-run/node'

import { Authenticator, AuthorizationError } from 'remix-auth';
import { FormStrategy } from "remix-auth-form";

import { Repository } from './adapter/repository';
import { User } from './domain/entity';

const sessionSecret = process.env.SESSION_SECRET

if (!sessionSecret) {
  throw new Error('SESSION_SECRET must be set')
}


// export const { getSession, commitSession, destroySession } = sessionStorage;


export const storage = createCookieSessionStorage({
  cookie: {
    name: 'procapital-session',
    secure: process.env.NODE_ENV === 'production',
    secrets: [sessionSecret],
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
    httpOnly: true,
  },
})


export const authenticator = new Authenticator<User | Error | null>(storage, {
    sessionKey: "sessionKey", // keep in sync
    sessionErrorKey: "sessionErrorKey", // keep in sync
  });

authenticator.use(
    new FormStrategy(async ({ form }) => {
      const username = form.get("userName") as string; // or email... etc
      const password = form.get("password") as string;
  
      if (!username || username?.length === 0) throw new AuthorizationError('Bad Credentials: username is required')
        if (typeof username !== 'string')
          throw new AuthorizationError('Bad Credentials: Email must be a string')
    
        if (!password || password?.length === 0) throw new AuthorizationError('Bad Credentials: Password is required')
        if (typeof password !== 'string')
          throw new AuthorizationError('Bad Credentials: Password must be a string')
    
        // try {
          
          const user = await Repository.auth.login(username, password);
          return user;
          
        // } catch (error) {
        //   if(error instanceof Error) {
        //     throw new AuthorizationError(error.message);
        //   }
        //   throw new Response('Error en el servidor', { status: 500 });
        // }

      // And return the user as the Authenticator expects it
    }),
    "user-pass"
  );

// export async function createUserSession(userId: number, redirectTo: string) {
//     const session = await storage.getSession()
//     session.set('userId', userId)
//     return redirect(redirectTo, {
//       headers: {
//         'Set-Cookie': await storage.commitSession(session),
//       },
//     })
//   }