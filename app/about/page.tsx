import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";

export default function AboutPage() {
  return (
    <>
      <Nav />
      <div className="animate-fade-up">
        <div className="px-14 pt-[72px] pb-14 border-b border-line grid grid-cols-[1fr_380px] gap-16">
          <div>
            <div className="font-mono text-label tracking-[.14em] text-faint mb-6">ABOUT / WHO I AM</div>
            <div className="text-h2 leading-[1.12] font-bold tracking-[-.035em] max-w-[760px]">
              A systems engineer who treats{" "}
              <span className="font-serif italic font-normal text-accent">discipline</span> as a feature.
            </div>
            <div className="mt-8 text-body-lg leading-[1.7] text-secondary max-w-[620px] flex flex-col gap-[18px]">
              <p className="m-0">
                I&apos;m Fernando, a software engineer from Buenos Aires finishing a systems engineering degree.
                My day-to-day is backend work on financial systems: Java, Spring Boot, clean architecture, and
                the kind of SQL that has to be right the first time.
              </p>
              <p className="m-0">
                I care about software that&apos;s predictable and honest — no magic, no surprises. The same way
                I approach training: show up, log the work, trust the accumulation.
              </p>
              <p className="m-0">
                Outside of code: long runs before sunrise, a snowboard trip on the calendar, and an unreasonable
                amount of manga.
              </p>
            </div>
          </div>
          <div className="flex flex-col border-l border-soft pl-10">
            <div className="font-mono text-label tracking-[.14em] text-faint pb-[18px]">FACTS</div>
            {[
              ["Base", "Buenos Aires, AR"],
              ["Focus", "Financial systems"],
              ["Stack", "Java · Spring · .NET · SQL"],
              ["Degree", "Systems Eng. — finishing"],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between border-t border-soft py-[13px] text-sm">
                <span className="text-muted">{k}</span>
                <span>{v}</span>
              </div>
            ))}
            <div className="flex justify-between border-t border-soft py-[13px] text-sm">
              <span className="text-muted">Status</span>
              <span className="text-accent">Open to senior roles</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 border-b border-line">
          <div className="px-14 pr-11 py-11 border-r border-soft hover-row">
            <div className="font-mono text-label text-faint mb-4">VALUE 01</div>
            <div className="text-h3 font-bold tracking-[-.02em] mb-3.5">Consistencia</div>
            <div className="text-body leading-[1.65] text-muted max-w-[420px]">
              Compounding beats intensity. In codebases, in training plans, in reading habits — the boring
              repeated thing wins.
            </div>
          </div>
          <div className="px-11 pl-11 py-11 hover-row">
            <div className="font-mono text-label text-faint mb-4">VALUE 02</div>
            <div className="text-h3 font-bold tracking-[-.02em] mb-3.5">Autonomía</div>
            <div className="text-body leading-[1.65] text-muted max-w-[420px]">
              Own the problem end to end. Understand the domain, question the ticket, ship the thing you&apos;d
              sign your name on.
            </div>
          </div>
        </div>

        <div className="px-14 py-24">
          <div className="font-mono text-label tracking-[.14em] text-faint mb-7">THE LINE I LIVE BY</div>
          <div className="font-serif italic text-h1 leading-[1.18] tracking-[-.01em] max-w-[1020px] text-primary">
            &quot;El éxito es la suma de <span className="text-accent">pequeños esfuerzos</span> repetidos cada
            día.&quot;
          </div>
          <div className="mt-7 font-mono text-xs text-faint">— REPEATED DAILY SINCE I CAN REMEMBER</div>
        </div>
      </div>
      <Footer />
    </>
  );
}
