import { useState } from "react";
import { signIn } from "next-auth/react";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      alert("Signup successful! Please log in.");
      setIsLogin(true);
    } else {
      const data = await res.json();
      setError(data.message || "Signup failed");
    }
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    const res = await signIn("credentials", {
      redirect: false,
      email: form.email,
      password: form.password,
    });

    if (res?.error) {
      setError("Invalid email or password");
    } else {
      // redirect to home or wherever
      window.location.href = "/";
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "auto", padding: 20 }}>
      <h2>{isLogin ? "Login" : "Sign Up"}</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <button onClick={() => signIn("github")} style={{ marginBottom: 20 }}>
        Sign in with GitHub
      </button>

      {isLogin ? (
        <form onSubmit={handleLogin}>
          <input
            name="email"
            type="email"
            placeholder="Email"
            required
            onChange={handleChange}
          />
          <br />
          <input
            name="password"
            type="password"
            placeholder="Password"
            required
            onChange={handleChange}
          />
          <br />
          <button type="submit">Log In</button>
          <p>
            Don't have an account?{" "}
            <button type="button" onClick={() => setIsLogin(false)}>
              Sign Up
            </button>
          </p>
        </form>
      ) : (
        <form onSubmit={handleSignup}>
          <input
            name="name"
            type="text"
            placeholder="Name"
            required
            onChange={handleChange}
          />
          <br />
          <input
            name="email"
            type="email"
            placeholder="Email"
            required
            onChange={handleChange}
          />
          <br />
          <input
            name="password"
            type="password"
            placeholder="Password"
            required
            onChange={handleChange}
          />
          <br />
          <button type="submit">Sign Up</button>
          <p>
            Already have an account?{" "}
            <button type="button" onClick={() => setIsLogin(true)}>
              Log In
            </button>
          </p>
        </form>
      )}
    </div>
  );
}