import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { getRepository } from "@/lib/content/get-repository";

export default async function WorkPage() {
  const repo = getRepository();
  const projects = await repo.getProjects();

  return (
    <>
      <Nav />
      <div className="animate-fade-up">
        <div className="px-14 pt-[72px] pb-11 flex justify-between items-end">
          <div>
            <div className="font-mono text-label tracking-[.14em] text-faint mb-5">WORK / 01</div>
            <div className="text-7xl leading-none font-extrabold tracking-[-.04em]">
              Things I&apos;ve <span className="font-serif italic font-normal text-accent">built</span>
            </div>
          </div>
          <div className="font-mono text-xs text-faint text-right">
            {projects.length} PROJECTS
            <br />
            2023 — NOW
          </div>
        </div>
        <div className="flex flex-col">
          {projects.map((p, i) => {
            const Wrapper = p.url ? "a" : "div";
            const linkProps = p.url ? { href: p.url, target: "_blank", rel: "noreferrer" } : {};
            return (
              // eslint-disable-next-line react/jsx-no-target-blank
              <Wrapper
                key={p.id}
                {...(linkProps as any)}
                className={`grid grid-cols-[80px_1fr_340px_90px] gap-8 items-baseline px-14 py-[34px] border-t ${
                  i === projects.length - 1 ? "border-b" : ""
                } border-soft text-inherit block hover-row`}
              >
                <span className="font-mono text-xs text-faint">{p.code}</span>
                <span>
                  <span className="text-h3 font-bold tracking-[-.02em] block mb-2">{p.title}</span>
                  <span className="text-body text-muted leading-[1.55] block max-w-[520px]">
                    {p.description}
                  </span>
                </span>
                <span className="font-mono text-xs text-muted leading-[2]">{p.stack}</span>
                <span
                  className={`font-mono text-xs text-right ${
                    p.status === "live" ? "text-accent" : "text-faint"
                  }`}
                >
                  {p.year}
                </span>
              </Wrapper>
            );
          })}
        </div>
      </div>
      <Footer />
    </>
  );
}
