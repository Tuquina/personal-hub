import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { getRepository } from "@/lib/content/get-repository";

function stars(n: number) {
  return "★".repeat(n) + "☆".repeat(5 - n);
}

export default async function ReadingPage() {
  const repo = getRepository();
  const books = await repo.getBooks();
  const reading = books.filter((b) => b.status === "reading");
  const log = books.filter((b) => b.status !== "reading");
  const doneCount = books.filter((b) => b.status === "done").length;

  return (
    <>
      <Nav />
      <div className="animate-fade-up">
        <div className="px-14 pt-[72px] pb-11 flex justify-between items-end">
          <div>
            <div className="font-mono text-label tracking-[.14em] text-faint mb-5">READING / 04</div>
            <div className="text-7xl leading-none font-extrabold tracking-[-.04em]">
              The <span className="font-serif italic font-normal text-accent">bookshelf</span>
            </div>
          </div>
          <div className="font-mono text-xs text-faint text-right">
            {reading.length} IN PROGRESS
            <br />
            {doneCount} THIS YEAR
          </div>
        </div>

        <div className="border-t border-line grid grid-cols-2">
          {reading.map((b, i) => (
            <div
              key={b.id}
              className={`px-14 py-10 ${i === 0 ? "pr-11 border-r" : "pl-11"} border-soft hover-row`}
            >
              <div className="font-mono text-label tracking-[.14em] text-accent mb-5">● READING NOW</div>
              <div className="text-h4 font-bold tracking-[-.02em] mb-1.5">{b.title}</div>
              <div className="font-mono text-xs text-faint mb-6">
                {b.author} · {b.genre}
              </div>
              <div className="h-[3px] bg-muted/[.18] rounded overflow-hidden mb-2.5">
                <div
                  className="h-full bg-accent shadow-glow-progress"
                  style={{ width: `${b.progressPercent}%` }}
                />
              </div>
              <div className="font-mono text-xs text-muted">{b.progressPercent}%</div>
            </div>
          ))}
        </div>

        <div className="px-14 pt-9 pb-12 border-t border-line">
          <div className="font-mono text-label tracking-[.14em] text-faint mb-[22px]">LOG</div>
          <div className="flex flex-col">
            {log.map((b) => (
              <div
                key={b.id}
                className="grid grid-cols-[76px_1fr_220px_110px] gap-6 items-baseline px-2 py-[15px] border-t border-soft rounded-md hover-row-tight transition-colors duration-250"
              >
                <span
                  className={`font-mono text-label border rounded px-1.5 py-0.5 text-center ${
                    b.status === "queued" ? "text-muted border-bold" : "text-faint border-strong"
                  }`}
                >
                  {b.status.toUpperCase()}
                </span>
                <span className="text-body-lg">{b.title}</span>
                <span className="font-mono text-xs text-faint">
                  {b.author} · {b.genre}
                </span>
                <span className={`font-mono text-xs text-right ${b.rating ? "text-accent" : "text-faint"}`}>
                  {b.rating ? stars(b.rating) : "UP NEXT"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
