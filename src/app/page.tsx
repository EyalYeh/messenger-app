"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { Box, TextField, Button, Typography } from "@mui/material";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Page() {
  const { data: session } = useSession();

  if (session) {
    return (
      <main style={{ padding: 20 }}>
        <Typography variant="h5" gutterBottom>
          Welcome, {session.user?.email}
        </Typography>
        <Button variant="contained" color="secondary" onClick={() => signOut()}>
          Sign out
        </Button>
      </main>
    );
  }

  const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();

      if (!email.includes("@")) {
        setError("Email must contain @");
        return;
        }
        if (!isLogin && username.length < 3) {
          setError("Username must be at least 3 characters");
          return;
        }
        if (password.length < 6) {
          setError("Password must be at least 6 characters");
          return;
        }

        setError("");

        if (isLogin) {
          // Sign in with credentials
          const result = await signIn("credentials", {
            redirect: false,
            email,
            password,
          });
          console.log("signIn result:", result);
          if (result?.error) {
            setError(result.error);
          } 
          else {
            // Successful login
            router.push("/home"); // or wherever
          }
        } 
        else {
          // Sign up by calling your API route
          console.log("Attempting signup..."); //debug code
          const response = await fetch("http://localhost:3003/api/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: username, email, password }),
          });

          const data = await response.json(); //debug code
          console.log("Signup response:", data); //debug code

          if (!response.ok) {
            const data = await response.json();
            setError(data.message || "Signup failed");
            return;
          }

          // Optionally, sign in user immediately after signup
          const result = await signIn("credentials", {
            redirect: false,
            email,
            password,
          });

          if (result?.error) {
            setError(result.error);
          } 
          else {
            router.push("/home");
         }
      }
    };


  return (
    <main style={{ padding: 20, backgroundColor: "#f0f2f5", minHeight: "100vh" }}>
      <Box
        width={350}
        mx="auto"
        mt={8}
        p={4}
        borderRadius={2}
        boxShadow={3}
        bgcolor="white"
      >
        <Typography variant="h5" sx={{color:"black" ,textAlign:"center"}}>
            {isLogin ? "Log In" : "Sign Up"}
        </Typography>

        <Button
          fullWidth
          onClick={() => signIn("github")}
          variant="outlined"
          sx={{ mb: 2 }}
        >
          Sign in with GitHub
        </Button>

        <form onSubmit={handleSubmit}>

          <TextField
            name="email"
            label="Email"
            variant="outlined"
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            margin="normal"
            required
          />
          {!isLogin &&(
            <TextField
              name="username"
              label="Username"
              type="username"
              variant="outlined"
              onChange={(e) => setUsername(e.target.value)}
              fullWidth
              margin="normal"
              required
            />
          )}
          <TextField
              name="password"
              label="Password"
              type="password"
              variant="outlined"
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              margin="normal"
              required
            />  

          {error && (
          <Typography color="error" sx={{ mt: 1, textAlign: "center" }}>
            {error}
          </Typography>
          )}

          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ mt: 2 }}
            >{isLogin ? "Log In" : "Sign Up"}</Button>
        </form>

        <Typography sx = {{color:"black", textAlign:"center"}}>
                {isLogin ? "Don't have an account?" : "Already have an account?"}
                <Button
                    onClick={() => setIsLogin(prev => !prev)}
                >
                    {isLogin ? "Sign Up" : "Log In"}
                </Button>
            </Typography>
      </Box>
    </main>
  );
}