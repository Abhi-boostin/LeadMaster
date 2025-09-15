"use client";

import { useState } from "react";
import Link from "next/link";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setStatus(null);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Failed to send magic link");
      setStatus("Magic link sent! Check your email to continue.");
    } catch (err: any) {
      setStatus(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="max-w-md mx-auto py-16">
      <h1 className="text-2xl font-semibold mb-6">Sign up</h1>
      <form onSubmit={onSubmit} className="rounded-lg border border-black/10 dark:border-white/15 p-4">
        <label htmlFor="email" className="block text-sm mb-2">Email</label>
        <input
          id="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="block w-full rounded-md border border-black/15 dark:border-white/20 bg-transparent px-3 py-2 mb-4"
        />
        <button type="submit" disabled={loading} className="h-10 px-4 rounded-md bg-black text-white dark:bg-white dark:text-black disabled:opacity-60">
          {loading ? "Sending..." : "Send magic link"}
        </button>
      </form>
      {status && (
        <p className="mt-3 text-sm">{status}</p>
      )}
      <p className="mt-6 text-sm">
        Already have an account? <Link href="/auth/login" className="underline">Login</Link>
      </p>
    </main>
  );
} 