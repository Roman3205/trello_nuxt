import { NuxtAuthHandler } from "#auth";
import CredentialsProvider from "next-auth/providers/credentials";
import userModel from "~/server/models/User.model";

async function getUser(id: string) {
  const user = await userModel.findOne({ _id: id });
  if (!user) {
    throw createError({
      statusCode: 404,
      statusMessage: "User is not found",
    });
  }

  return user.toJSON();
}

export default NuxtAuthHandler({
  secret: useRuntimeConfig().auth.secret,
  pages: {
    signIn: "/auth/login",
  },
  providers: [
    // @ts-expect-error
    CredentialsProvider.default({
      name: "credentials",
      origin: useRuntimeConfig().auth.origin,
      async authorize(credentials: { email: string; password: string }) {
        try {
          const user = await userModel
            .findOne({ email: credentials.email })
            .select("+password");

          if (!user) {
            throw createError({
              statusCode: 404,
              statusMessage: "User is not found",
            });
          }

          const isValid = await user.comparePassword(credentials.password);

          if (!isValid) {
            throw createError({
              statusCode: 400,
              statusMessage: "Incorrect password",
            });
          }
          return {
            _id: user._id,
          };
        } catch (e) {
          console.log(e);
          throw createError({
            statusCode: 400,
            statusMessage: "Bad request",
          });
        }
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token = {
          ...user,
          ...token,
        };
      }
      return token;
    },
    async session({ session, token }) {
      const refreshedUser = await getUser(String(token._id));

      session.user = {
        ...token,
        ...session.user,
        ...refreshedUser,
      };

      return session;
    },
  },
});
