import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { getRepository } from "@/lib/content/get-repository";

export default async function NotesPage() {
  const repo = getRepository();
  const notes = await repo.getPublishedNotes();

  return (
    <>
      <Nav />
      <div className="animate-fade-up">
        <div className="px-14 pt-[72px] pb-11 flex justify-between items-end">
          <div>
            <div className="font-mono text-label tracking-[.14em] text-faint mb-5">NOTES / 02</div>
            <div className="text-7xl leading-none font-extrabold tracking-[-.04em]">
              Technical <span className="font-serif italic font-normal text-accent">notes</span>
            </div>
          </div>
          <div className="font-mono text-xs text-faint text-right">
            {notes.length} POSTS
            <br />
            MOSTLY BACKEND
          </div>
        </div>
        <div className="flex flex-col pb-6">
          {notes.map((n, i) => (
            <a
              key={n.id}
              href="#"
              className={`grid grid-cols-[110px_1fr_130px_90px] gap-8 items-baseline px-14 py-[26px] border-t ${
                i === notes.length - 1 ? "border-b" : ""
              } border-soft text-inherit block hover-row`}
            >
              <span className="font-mono text-xs text-faint">{n.date}</span>
              <span className="text-h5 font-semibold tracking-[-.015em]">{n.title}</span>
              <span className="font-mono text-xs text-muted">{n.category}</span>
              <span className="font-mono text-xs text-faint text-right">{n.minutes} MIN</span>
            </a>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
}
