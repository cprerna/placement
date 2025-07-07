import Topbar from '@/components/app-topbar';
import { stackServerApp } from '@/stack';
import Sidebar from '@/components/app-sidebar';

export default async function ProtectedRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  await stackServerApp.getUser({ or: 'redirect' });

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0">
        <Topbar />
        <main className="flex-1 p-4 bg-gray-200 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
