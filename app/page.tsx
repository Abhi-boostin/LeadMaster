import Link from "next/link";

export default function Home() {
  return (
    <section className="py-16 sm:py-24">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight mb-4">
          Manage leads with clarity
        </h1>
        <p className="text-base sm:text-lg text-black/70 dark:text-white/70 mb-8">
          LeadMaster keeps your buyers organized and your outreach simple. Sign in
          with a magic link and get straight to your dashboard.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link
            href="/auth/signup"
            className="inline-flex items-center justify-center h-10 px-5 rounded-md bg-black text-white dark:bg-white dark:text-black hover:opacity-90"
          >
            Get started
          </Link>
          <Link
            href="/auth/login"
            className="inline-flex items-center justify-center h-10 px-5 rounded-md border border-black/15 dark:border-white/20 hover:bg-black/5 dark:hover:bg-white/10"
          >
            I have an account
          </Link>
        </div>
      </div>
    </section>
  );
} 