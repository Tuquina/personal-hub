import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { getRepository } from "@/lib/content/get-repository";
import type { UsesItem } from "@/lib/content/types";

const CATEGORIES: UsesItem["category"][] = ["LANGUAGES & BACKEND", "EVERYDAY TOOLS", "OFF THE DESK"];

export default async function UsesPage() {
  const repo = getRepository();
  const items = await repo.getUsesItems();

  return (
    <>
      <Nav />
      <div className="animate-fade-up">
        <div className="px-14 pt-[72px] pb-11">
          <div className="font-mono text-label tracking-[.14em] text-faint mb-5">USES / 05</div>
          <div className="text-7xl leading-none font-extrabold tracking-[-.04em]">
            Tools of the <span className="font-serif italic font-normal text-accent">trade</span>
          </div>
        </div>
        <div className="border-t border-line grid grid-cols-3">
          {CATEGORIES.map((cat, i) => (
            <div key={cat} className={`px-10 py-10 ${i < 2 ? "border-r" : ""} border-soft`}>
              <div className="font-mono text-label tracking-[.14em] text-faint mb-[22px]">{cat}</div>
              <div className="flex flex-col text-body">
                {items
                  .filter((it) => it.category === cat)
                  .map((it) => (
                    <div
                      key={it.id}
                      className="flex justify-between py-[11px] border-t border-soft"
                    >
                      <span>{it.name}</span>
                      <span
                        className={`font-mono text-label ${
                          it.tag === "DAILY" || it.tag === "NON-NEGOTIABLE" ? "text-accent" : "text-faint"
                        }`}
                      >
                        {it.tag}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
}
