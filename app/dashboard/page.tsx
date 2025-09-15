import { getSupabaseServerComponentClient } from '@/lib/supabaseClient';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const supabase = getSupabaseServerComponentClient();
  const { data } = await supabase.auth.getUser();
  const user = data.user;

  if (!user) {
    redirect('/auth/login');
  }

  return (
    <main style={{ maxWidth: 720, margin: "80px auto", padding: 24 }}>
      <h1 style={{ marginBottom: 12 }}>Dashboard</h1>
      <p style={{ marginBottom: 24 }}>Welcome, {user.email ?? 'User'}!</p>
      <a href="/auth/logout" style={{ padding: "10px 16px", display: "inline-block" }}>Log out</a>
    </main>
  );
} 