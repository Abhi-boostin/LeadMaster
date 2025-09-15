export default function DashboardPage() {
    return (
      <main style={{ maxWidth: 720, margin: "80px auto", padding: 24 }}>
        <h1 style={{ marginBottom: 12 }}>Dashboard</h1>
        <p style={{ marginBottom: 24 }}>You hehe signed in via magic link. This is your dashboard.</p>
        <a href="/auth/logout" style={{ padding: "10px 16px", display: "inline-block" }}>Log out</a>
      </main>
    );
  } 