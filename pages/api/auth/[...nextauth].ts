import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";              // allows users to log in using GitHub (via OAuth).
import CredentialsProvider from "next-auth/providers/credentials";    // allows users to log in using their email and password (
import { PrismaAdapter } from "@next-auth/prisma-adapter";            // Use Prisma to store and manage users/sessions in the database.
import { PrismaClient } from "@prisma/client";                        // compare hashed passwords
import bcrypt from "bcrypt";

const prisma = new PrismaClient();                              // Creating a Prisma client instance to talk to the database.

export default NextAuth({                                       // Exporting the NextAuth config object. This runs when the frontend requests /api/auth/*
  adapter: PrismaAdapter(prisma),
  providers: [                                                  // authentication providers (GitHub, credentials, Google, etc.).
    GithubProvider({                                            // Uses environment variables to authenticate via GitHub.
      clientId: process.env.GITHUB_ID || "",
      clientSecret: process.env.GITHUB_SECRET || "",
    }),
    CredentialsProvider({                                       // custom login form using email and password.
      name: "Credentials",
      credentials: {                                            // the login form fields
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {                            // this function runs when someone logs in using email/password.
        if (!credentials?.email || !credentials?.password){     // validates that both email and password were submitted
          throw new Error("Missing credentials");
        }

       const user = await prisma.user.findUnique({              // look up the user by email in the database, and retrieve relevant fields
       where: { email: credentials.email },
        select: {
          id: true,
          name: true,
          email: true,
          hashedPassword: true, 
        },
       });

        if (!user ) throw new Error("No user was found");       //  if no such user exists, an error is thrown

       const isValid = user.hashedPassword                                    // if the user has a hashed password, check if it matches the input password using bcrypt.
         ? await bcrypt.compare(credentials.password, user.hashedPassword)
         : false;
       if (!isValid) throw new Error("Password is not valid");                // if the password doesn't match, reject the login


        return {                          // if everything is OK, return the user object — this creates a session for the user.
          id: user.id,
          name: user.name,
          email: user.email,
        };
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
});