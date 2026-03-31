import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import AdminSidebar from '@/components/AdminSidebar';
import AdminSecurityHandler from '@/components/AdminSecurityHandler';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'admin' && user.app_metadata?.role !== 'admin') {
    redirect('/profile');
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--miami-night)', display: 'flex', flexDirection: 'row' }} className="admin-container">
      <AdminSecurityHandler sessionToken={user.id} />
      <AdminSidebar />
      <main style={{ flex: 1, overflowY: 'auto', paddingBottom: 40 }} className="admin-main">
        {children}
      </main>
      
      <style>{`
        @media (max-width: 1024px) {
          .admin-container {
            flex-direction: column !important;
          }
          .admin-main {
            padding-bottom: 80px;
          }
        }
      `}</style>
    </div>
  );
}
