// This is the signup API endpoint — it handles user registration logic on the server side.
// It defines the backend logic that happens when a user tries to sign up through the frontend (e.g. when clicking "Sign Up" on a form)

import { NextRequest, NextResponse } from "next/server"; // NextRequest: A special request object from Next.js (App Router) that gives you access to the request body, headers, etc. NextResponse: Used to send structured HTTP responses.
import { PrismaClient } from "@prisma/client";           // Imports the Prisma Client, which is how we can interact with the database (PostgreSQL, MySQL, etc.).
import bcrypt from "bcrypt";                             // used for securely hashing passwords

const prisma = new PrismaClient();                       // an instance for communication with the database

export async function POST(req: NextRequest) {           // The function that handles POST HTTP requests.
  try {
    const { name, email, password } = await req.json();  // Destructures name, email, and password from the request body.

    if (!email || !password || !name) {                                                         // If any field is missing, return a 400 (Bad Request) with a message.
      return NextResponse.json({ message: "Missing fields" }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });                    // Uses Prisma to check if a user with this email already exists in the database.
    if (existingUser) {                                                                         // If a user with this email already exists, return 409 conflict with message
      return NextResponse.json({ message: "User already exists" }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);                                     // Hashes the plain-text password using bcrypt.

    const user = await prisma.user.create({            // Uses Prisma to create a new user in the database with the given name, email, and hashed password.
      data: {
        name,
        email,
        hashedPassword,
      },
    });

    return NextResponse.json({ message: "User created", userId: user.id }, { status: 201 });    // Sends a response with a success message and the user's ID.
  } catch (error) {                                                                             // If anything goes wrong during the process (e.g. DB down, bcrypt fails), it will log the error and return a 500 (Internal Server Error).   
    console.error("Signup error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}