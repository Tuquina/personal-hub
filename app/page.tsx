import Link from "next/link";
import { Nav } from "@/components/nav";
import { QuickActions } from "@/components/nav";
import { Ticker } from "@/components/ticker";
import { Footer } from "@/components/footer";
import { Greeting } from "@/components/clock";
import { getRepository } from "@/lib/content/get-repository";

const NAME_LETTERS = ["F", "e", "r", "n", "a", "n", "d", "o"];

export default async function HomePage() {
  const repo = getRepository();
  const [now, projects, notes, books, trainingStats] = await Promise.all([
    repo.getNowStatus(),
    repo.getProjects(),
    repo.getPublishedNotes(),
    repo.getBooks(),
    repo.getTrainingStats(),
  ]);

  const latestNote = notes[0];
  const featuredProject = projects[0];
  const readingNow = books.filter((b) => b.status === "reading");
  const bars = trainingStats.weeklyVolume.slice(-6);

  return (
    <>
      <Ticker />
      <Nav />

      <div className="animate-fade-up">
        {/* hero */}
        <div className="px-14 pt-16 pb-11 relative">
          <div className="flex items-baseline gap-3.5 mb-5">
            <div className="font-serif italic text-2xl text-secondary flex items-baseline gap-2.5">
              <span className="h-[1.3em] overflow-hidden inline-block align-bottom">
                <span className="flex flex-col leading-[1.3em] animate-words">
                  <span>hola — soy</span>
                  <span>hey — I&apos;m</span>
                  <span>che, soy</span>
                  <span>hola — soy</span>
                </span>
              </span>
              <span className="inline-block w-[9px] h-[18px] bg-accent animate-blink translate-y-[2px]" />
            </div>
            <Greeting className="font-mono text-meta text-faint" />
          </div>

          <div className="text-hero leading-[.95] font-extrabold tracking-[-.045em]">
            <span className="block overflow-hidden pb-[.06em] -mb-[.06em]">
              {NAME_LETTERS.map((letter, i) => (
                <span
                  key={i}
                  className="inline-block animate-rise"
                  style={{ animationDelay: `${0.05 + i * 0.04}s` }}
                >
                  {letter}
                </span>
              ))}
            </span>
            <span className="block overflow-hidden pb-[.12em] -mb-[.06em]">
              <span className="inline-block animate-rise" style={{ animationDelay: ".38s" }}>
                <span className="font-serif font-normal italic tracking-[-.01em] text-accent cursor-default transition-shadow duration-300 hover:[text-shadow:0_0_34px_rgb(var(--accent)_/_0.55)]">
                  Nahuel
                </span>
              </span>
              <span className="inline-block animate-rise" style={{ animationDelay: ".46s" }}> Tuquina</span>
            </span>
          </div>

          <div className="flex justify-between items-end mt-8 gap-10 animate-fade-up" style={{ animationDelay: ".55s" }}>
            <div className="text-lead leading-[1.55] text-secondary max-w-[600px] font-normal">
              I build financial systems in Java &amp; Spring —{" "}
              <span className="font-serif italic text-sublead text-primary">clean, boring, correct</span> — and spend
              the rest of my energy running long distances and reading too much manga.
            </div>
            <div className="flex flex-col gap-2 font-mono text-meta text-faint text-right flex-none">
              <span className="flex gap-2 items-center justify-end text-muted">
                <span className="w-[7px] h-[7px] rounded-full bg-accent shadow-glow-dot animate-pulse-soft" />
                open to senior roles
              </span>
              <span>buenos aires · utc-3</span>
            </div>
          </div>
        </div>

        <QuickActions />

        {/* grid */}
        <div className="border-t border-line grid grid-cols-[1.4fr_1fr_1fr]">
          <div className="row-span-2 px-14 pr-11 py-9 border-r border-soft hover-row">
            <div className="font-mono text-label tracking-[.14em] text-faint mb-5">THIS WEEK, IN MY LIFE</div>
            <div className="text-h4 leading-[1.3] font-semibold tracking-[-.02em] mb-[22px]">{now.headline}</div>
            <div className="text-body leading-[1.65] text-muted">{now.weekSummary}</div>
            <div className="mt-8 flex flex-col font-mono text-xs">
              <a
                href="https://github.com/Tuquina"
                target="_blank"
                rel="noreferrer"
                className="flex justify-between border-t border-soft py-[13px] text-muted transition-all duration-250 hover:text-primary hover:pl-1.5"
              >
                <span>GITHUB</span>
                <span className="text-primary">/TUQUINA →</span>
              </a>
              <a
                href="https://www.linkedin.com/in/fernandonahueltuquina/"
                target="_blank"
                rel="noreferrer"
                className="flex justify-between border-t border-soft py-[13px] text-muted transition-all duration-250 hover:text-primary hover:pl-1.5"
              >
                <span>LINKEDIN</span>
                <span className="text-primary">/FERNANDONAHUELTUQUINA →</span>
              </a>
              <a
                href="mailto:fernandotuquina@gmail.com"
                className="flex justify-between border-t border-soft py-[13px] text-muted transition-all duration-250 hover:text-primary hover:pl-1.5"
              >
                <span>MAIL</span>
                <span className="text-primary">FERNANDOTUQUINA@ →</span>
              </a>
            </div>
          </div>

          <Link href="/training" className="px-10 py-9 border-r border-soft block hover-row">
            <div className="flex justify-between items-baseline mb-[18px]">
              <span className="font-mono text-label tracking-[.14em] text-faint">TRAINING</span>
              <span className="font-mono text-label text-accent">→</span>
            </div>
            <div className="flex items-end gap-[7px] h-16 mb-4">
              {bars.map((h, i) => {
                const isLast = i === bars.length - 1;
                return (
                  <span
                    key={i}
                    className={`flex-1 origin-bottom animate-grow ${
                      isLast ? "bg-accent shadow-glow-bar" : "bg-muted/25"
                    }`}
                    style={{ height: `${h}%`, animationDelay: `${i * 0.07}s` }}
                  />
                );
              })}
            </div>
            <div className="font-mono text-xs text-muted leading-[1.7]">
              {trainingStats.thisWeekKm} KM THIS WEEK · BLOCK 6/20
              <br />
              <span className="text-faint">NEXT UP: SNOWBOARD · 08.15 ❄</span>
            </div>
          </Link>

          <Link href="/reading" className="px-10 pr-14 py-9 block hover-row">
            <div className="flex justify-between items-baseline mb-[18px]">
              <span className="font-mono text-label tracking-[.14em] text-faint">READING</span>
              <span className="font-mono text-label text-accent">→</span>
            </div>
            <div className="flex flex-col gap-3.5 text-body leading-[1.4]">
              {readingNow.map((b) => (
                <div key={b.id}>
                  {b.title}
                  <br />
                  <span className="font-mono text-label text-faint">
                    {b.author}
                    {b.progressPercent ? ` · ${b.progressPercent}%` : ""}
                  </span>
                </div>
              ))}
            </div>
          </Link>

          <Link
            href="/notes"
            className="px-10 py-9 border-r border-t border-soft block hover-row"
          >
            <div className="flex justify-between items-baseline mb-[18px]">
              <span className="font-mono text-label tracking-[.14em] text-faint">LATEST NOTE</span>
              <span className="font-mono text-label text-accent">→</span>
            </div>
            <div className="text-xl leading-[1.3] font-semibold tracking-[-.01em]">{latestNote?.title}</div>
            <div className="mt-3 font-mono text-label text-faint">
              {latestNote?.date} · {latestNote?.minutes} MIN READ
            </div>
          </Link>

          <Link href="/work" className="px-10 pr-14 py-9 border-t border-soft block hover-row">
            <div className="flex justify-between items-baseline mb-[18px]">
              <span className="font-mono text-label tracking-[.14em] text-faint">SELECTED WORK</span>
              <span className="font-mono text-label text-accent">→</span>
            </div>
            <div className="text-xl leading-[1.3] font-semibold tracking-[-.01em]">{featuredProject?.title}</div>
            <div className="mt-3 font-mono text-label text-faint">{featuredProject?.stack}</div>
          </Link>
        </div>
      </div>

      <Footer />
    </>
  );
}
