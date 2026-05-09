"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      router.push("/admin/dashboard");
    } else {
      setError("Senha incorreta");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center px-6" style={{ background: "#080808" }}>
      <div className="w-full max-w-sm">
        <p className="text-[11px] text-white/20 uppercase tracking-[0.14em] mb-2">Cristal Vidro</p>
        <h1 className="text-[2rem] font-medium text-white tracking-tight mb-12">Admin</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="border-b border-white/[0.07] pb-1">
            <label className="block text-[10px] text-white/20 uppercase tracking-[0.14em] mb-2.5">
              Senha
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              className="w-full bg-transparent text-[15px] font-medium text-white placeholder:text-white/15 outline-none pb-2"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="text-[12px] text-red-400/70">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading || !password}
            className="w-full h-[52px] rounded-xl text-[14px] font-semibold bg-white text-zinc-950 hover:bg-zinc-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="inline-block w-4 h-4 border-2 border-zinc-300 border-t-zinc-800 rounded-full animate-spin" />
            ) : (
              "Entrar"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
