import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { publicProcedure, router } from './trpc';
import { TRPCError } from '@trpc/server';
import { db } from '@/db';


export const appRouter = router(
  {
    sayHi:publicProcedure.query(()=>{
      console.log("sayHi")
      return "Hello"
    }),
    authCallback: publicProcedure.query(async () => {
      console.log("from authcallback router at seerver i guess");
      const { getUser } = await getKindeServerSession();
      const user = await getUser();
      if (!user?.id || !user?.email)
        throw new TRPCError({ code: "UNAUTHORIZED" })

      //check if user is in the database.
      const dbUser = await db.user.findFirst(
        {
          where: {
            id: user.id
          }
        }
      )
      console.log("User in DB:", dbUser);
      if (!dbUser) {
        //create user in db
        await db.user.create(
          {
            data: {
              id: user.id,
              email: user.email
            }
          }
        )
        console.log("New User in DB:", dbUser);
      }
      return { success: true };
    })
  }
)
export type AppRouter = typeof appRouter;