"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

export default function Page() {
  const { data: session } = useSession();

  if (session) {
    return (
      <main style={{ padding: 20 }}>
        <h1>Welcome, {session.user?.email}</h1>
        <button onClick={() => signOut()}>Sign out</button>
      </main>
    );
  }

  return (
    <main style={{ padding: 20 }}>
      <Box>
      <h1 color="black">Sign In</h1>
      <Button onClick={() => signIn("github")} variant="text">Sign in with GitHub</Button>

      <form
        onSubmit={async (e) => {
          e.preventDefault();
          const email = (e.currentTarget.email.value);
          const password = (e.currentTarget.password.value);
          await signIn("credentials", { email, password, redirect: false });
        }}
      >
        <TextField id="email" label="Email" variant="filled" />
        <TextField id="password" label="Password" variant="filled" />
        <Button variant="text">Sign in with Email</Button>
      </form>
      </Box>
    </main>
  );
}