import Link from "next/link";

export function Footer() {
  return (
    <div className="border-t border-line px-14 py-6 flex justify-between items-center gap-6 flex-wrap">
      <div className="font-serif italic text-body-lg text-muted">
        &quot;El éxito es la suma de pequeños esfuerzos repetidos cada día.&quot;
      </div>
      <div className="flex items-center gap-6 font-mono text-label text-faint">
        <span>© 2026 · BUILT BY ME, FOR ME</span>
        <Link href="/admin" className="transition-colors duration-250 hover:text-accent">
          admin →
        </Link>
      </div>
    </div>
  );
}
