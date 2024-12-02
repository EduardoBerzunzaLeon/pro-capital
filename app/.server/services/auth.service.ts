import { createCookieSessionStorage } from '@remix-run/node'

import { Authenticator } from 'remix-auth';
import { FormStrategy } from "remix-auth-form";

import { Repository } from '../adapter/repository';
import { User, UserI } from '../domain/entity';
import { parseWithZod } from '@conform-to/zod';
import { loginSchema } from '~/schemas';
import { ServerError, ValidationConformError } from '../errors';
import { encriptor } from '../adapter';

const sessionSecret = process.env.SESSION_SECRET

if (!sessionSecret) {
  throw new Error('SESSION_SECRET must be set')
}

export const sessionStorage  = createCookieSessionStorage({
  cookie: {
    name: 'procapital-session',
    secure: process.env.NODE_ENV === 'production',
    secrets: [sessionSecret],
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
    httpOnly: true,
  },
});

export const { getSession, commitSession, destroySession } = sessionStorage;
export const USER_PASSWORD_STRATEGY = "user-password-strategy";

export const authenticator = new Authenticator<Omit<User, 'password'> | Error | null>(sessionStorage , {
    sessionKey: "sessionKey",
    sessionErrorKey: "sessionErrorKey",
  });

authenticator.use(
    new FormStrategy(async ({ form }) => {
      const submission = parseWithZod(form, { schema: loginSchema });

      if (submission.status !== 'success') {
        throw new ValidationConformError('Error en las credenciales', submission.reply());
      }
      
      const { userName, password } = submission.value;

      return await signIn(userName, password);
    }),
    USER_PASSWORD_STRATEGY
);

export const signIn = async (username: string, password: string) => {

  const userDb = await Repository.auth.findByUserName(username);

  if(!userDb) {
    throw ServerError.badRequest('Credenciales Incorrectas');
  }

  const { password: passwordBd, ...restUser } = new User(userDb as UserI);

  const isValidPassword = await encriptor.compare(password, passwordBd);

  if(!isValidPassword) {
    throw ServerError.badRequest('Credenciales Incorrectas');
  }

  return restUser;
}

export default {
  signIn,
  authenticator
}