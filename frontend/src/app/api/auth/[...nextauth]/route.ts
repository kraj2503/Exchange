import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "@/app/lib/db/db";

interface User {
  id: string;
  name: string;
  image: string;
  email: string;
  email_verified: boolean;
}
export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
      profile(profile) {
        return {
          id: profile.sub, // Unique Google ID
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          email_verified: profile.email_verified, // Profile picture URL
        };
      },
    }),
  ],
  secret: process.env.AUTH_SECRET,
  callbacks: {
    async signIn({ user }) {
      const res = await prisma.user.findUnique({
        where: {
          email: user.email,
        },
      });
      console.log(res);
      if (res) {
        return true;
      } else {
        console.log("adding to db");
        console.log(user);
        await prisma.user.create({
          data: {
            id: user.id,
            name: user.name,
            Image: user.image,
            email: user.email,
            isVerified: user.email_verified,
            provider: "Google",
          },
        });
        console.log("New user added to DB");
        return true;
      }
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
