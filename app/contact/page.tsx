import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { InfoRequestForm } from "@/components/contact/info-request-form";

const LINKS = [
  { label: "EMAIL", value: "fernandotuquina@gmail.com", href: "mailto:fernandotuquina@gmail.com", arrow: "→", external: false },
  { label: "GITHUB", value: "github.com/Tuquina", href: "https://github.com/Tuquina", arrow: "↗", external: true },
  {
    label: "LINKEDIN",
    value: "in/fernandonahueltuquina",
    href: "https://www.linkedin.com/in/fernandonahueltuquina/",
    arrow: "↗",
    external: true,
  },
];

export default function ContactPage() {
  return (
    <>
      <Nav />
      <div className="animate-fade-up">
        <div className="px-14 pt-[88px] pb-14">
          <div className="font-mono text-label tracking-[.14em] text-faint mb-6">CONTACT / SAY HI</div>
          <div className="text-h1 leading-[1.15] font-bold tracking-[-.035em] max-w-[900px]">
            No forms, no funnels. Just <span className="font-serif italic font-normal text-accent">write to me</span>.
          </div>
          <div className="mt-6 flex items-center gap-2.5 font-mono text-xs text-muted">
            <span className="w-[7px] h-[7px] rounded-full bg-accent shadow-glow-dot animate-pulse-soft" />
            CURRENTLY OPEN TO SENIOR BACKEND ROLES
          </div>
        </div>
        <div className="flex flex-col pb-16">
          {LINKS.map((l, i) => (
            <a
              key={l.label}
              href={l.href}
              target={l.external ? "_blank" : undefined}
              rel={l.external ? "noreferrer" : undefined}
              className={`grid grid-cols-[140px_1fr_auto] gap-8 items-baseline px-14 py-[34px] border-t ${
                i === LINKS.length - 1 ? "border-b" : ""
              } border-soft text-inherit block hover-row`}
            >
              <span className="font-mono text-xs text-faint">{l.label}</span>
              <span className="text-h3 font-semibold tracking-[-.02em]">{l.value}</span>
              <span className="font-mono text-sm text-accent">{l.arrow}</span>
            </a>
          ))}
        </div>
        <InfoRequestForm />
      </div>
      <Footer />
    </>
  );
}
