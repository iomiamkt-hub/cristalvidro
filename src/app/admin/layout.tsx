import { AdminSidebar } from "./_components/sidebar";

export const metadata = { title: "Admin — Cristal Vidro" };

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-dvh overflow-hidden" style={{ background: "#080808" }}>
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="p-6 lg:p-10 max-w-4xl">
          {children}
        </div>
      </main>
    </div>
  );
}
