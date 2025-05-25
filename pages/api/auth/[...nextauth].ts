import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export default NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID || "",
      clientSecret: process.env.GITHUB_SECRET || "",
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password){
          throw new Error("Missing credentials");
        }

       const user = await prisma.user.findUnique({
       where: { email: credentials.email },
        select: {
          id: true,
          name: true,
          email: true,
          hashedPassword: true, 
        },
       });

        if (!user ) throw new Error("No user was found");

       const isValid = user.hashedPassword
         ? await bcrypt.compare(credentials.password, user.hashedPassword)
         : false;
       if (!isValid) throw new Error("Password is not valid");


        return {
          id: user.id,
          name: user.name,
          email: user.email,
        };
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
});