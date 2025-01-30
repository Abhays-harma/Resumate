import { createMiddleware } from 'hono/factory'
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { KindeUser } from '@kinde-oss/kinde-auth-nextjs/types';

export const getAuthUser = createMiddleware<{
    Variables: {
      user: KindeUser<Record<string, any>>
    }
  }>(async (c, next) => {
    try {
        const { getUser } = getKindeServerSession();
        const user = await getUser();
        c.set('user',user)
        await next();
    } catch (error) {
        return c.json({
            message:error,
        },401)
    }

})