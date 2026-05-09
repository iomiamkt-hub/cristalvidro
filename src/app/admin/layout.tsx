import { AdminSidebar } from "./_components/sidebar";

export const metadata = { title: "Admin — Cristal Vidro" };

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh flex" style={{ background: "#080808" }}>
      <AdminSidebar />
      <main className="flex-1 flex flex-col min-h-dvh lg:pl-56">
        <div className="flex-1 p-6 lg:p-10 max-w-4xl w-full">
          {children}
        </div>
      </main>
    </div>
  );
}
