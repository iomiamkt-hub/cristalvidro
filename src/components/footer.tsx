export function Footer() {
  return (
    <footer className="px-4 py-8 border-t border-white/5">
      <div className="max-w-lg mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        <div>
          <p className="text-white font-semibold text-sm">Cristal Vidro</p>
          <p className="text-zinc-600 text-xs">Vidros e espelhos sob medida</p>
        </div>
        <div className="flex items-center gap-4 text-xs text-zinc-600">
          <span>📍 São Paulo, SP</span>
          <span>📞 (11) 9 9999-9999</span>
        </div>
      </div>
    </footer>
  );
}
