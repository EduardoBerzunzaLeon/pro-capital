import { createCookieSessionStorage } from '@remix-run/node'

import { Authenticator } from 'remix-auth';
import { FormStrategy } from "remix-auth-form";

import { Repository } from '../adapter/repository';
import { User, UserI } from '../domain/entity';
import { parseWithZod } from '@conform-to/zod';
import { idSchema, loginSchema } from '~/schemas';
import { ServerError, ValidationConformError } from '../errors';
import { encriptor } from '../adapter';
import { Service } from '.';
import { RequestId } from '../interfaces';
import { validationZod } from './validation.service';

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
export const findById = async (userId: RequestId) => {
  const { id } = validationZod({ id: userId }, idSchema);
  return await Repository.auth.findById(id); 
}
 
// export const requirePermission = (loader: LoaderFunction, permission: string) => {

//   return async (args: LoaderFunctionArgs) => {
//     const { request } = args;

//     const user = await authenticator.isAuthenticated(request, {
//       failureRedirect: "/login",
//     });
    
//     if(!user || user instanceof Error) {
//       throw ServerError.unauthorized('usuario no autenticado');          
//     }

//     await Service.role.hasPermission(user.role.role, permission);

//     return loader({ ...args, user });
//   }
// } 

export const requirePermission = async (request: Request, permission: string) => {
      
    const user = await authenticator.isAuthenticated(request, {
      failureRedirect: "/login",
    });
    
    if(!user) {
      throw ServerError.unauthorized('usuario no autenticado');          
    }

    if(user instanceof Error) {
      throw user;
    }

    const hasPermission = await Service.role.hasPermission(user.role, permission);

    // TODO: Implement this afther
    // const findPermission = user.permissions.find(({ servername }) => servername === permission);

    // console.log({ hasPermission, findPermission });

    // authenticator.
    // if(hasPermission && !findPermission) {
      // const userUpdated = await Repository.auth.findById(user.id);

      // const { password, ...restUser } = new User(userUpdated as UserI);

      // return restUser;
      // throw ServerError.upgradeRequired(user.id+'');

      // const session = await getSession(request.headers.get("cookie"));
      // session.set(Service.auth.authenticator.sessionKey, restUser);
      // const headers = new Headers();
      // headers.append('Set-Cookie',await commitSession(session));

    // }

    // if(!hasPermission && findPermission) {
      
      // throw ServerError.upgradeRequired(user.id+'');

      // const session = await getSession(request.headers.get("cookie"));
      // session.set(Service.auth.authenticator.sessionKey, restUser);
      // const headers = new Headers();
      // headers.append('Set-Cookie',await commitSession(session));

    // }
    
    

    if(!hasPermission) {
      throw ServerError.forbidden('No tiene acceso a esta ruta');
    } 
  
    return user;
}

export default {
  signIn,
  authenticator,
  requirePermission,
  findById
}