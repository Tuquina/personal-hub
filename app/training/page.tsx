import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { getRepository } from "@/lib/content/get-repository";

const WEEK_LABELS = ["W16", "W18", "W20", "W22", "W24", "W26", "W28"];

export default async function TrainingPage() {
  const repo = getRepository();
  const [stats, logs] = await Promise.all([repo.getTrainingStats(), repo.getTrainingLogs()]);

  return (
    <>
      <Nav />
      <div className="animate-fade-up">
        <div className="px-14 pt-[72px] pb-11 flex justify-between items-end">
          <div>
            <div className="font-mono text-label tracking-[.14em] text-faint mb-5">TRAINING / 03</div>
            <div className="text-7xl leading-none font-extrabold tracking-[-.04em]">
              The <span className="font-serif italic font-normal text-accent">long game</span>
            </div>
          </div>
          <div className="font-mono text-xs text-faint text-right leading-[1.8]">
            MARATHON BLOCK · WEEK 6/20
            <br />
            RACE DAY: 11.22.2026
          </div>
        </div>

        <div className="grid grid-cols-4 border-t border-b border-line">
          {[
            ["THIS WEEK", stats.thisWeekKm, "km"],
            ["LONGEST RUN", stats.longestRunKm, "km"],
            ["AVG PACE", stats.avgPace, "/km"],
            ["TO RACE DAY", stats.daysToRaceDay, "days"],
          ].map(([label, val, unit], i) => (
            <div
              key={label as string}
              className={`px-10 py-7 ${i < 3 ? "border-r" : ""} border-soft`}
            >
              <div className="font-mono text-label text-faint mb-2.5">{label}</div>
              <div className={`text-stat font-bold tracking-[-.02em] ${i === 3 ? "text-accent" : ""}`}>
                {val} <span className="text-base text-muted font-normal">{unit}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="px-14 py-11 border-b border-line">
          <div className="flex justify-between items-baseline mb-7">
            <span className="font-mono text-label tracking-[.14em] text-faint">WEEKLY VOLUME — LAST 12 WEEKS</span>
            <span className="font-mono text-label text-muted">
              <span className="inline-block w-2 h-2 bg-accent mr-1.5" />
              CURRENT
            </span>
          </div>
          <div className="flex items-end gap-2.5 h-40">
            {stats.weeklyVolume.map((h, i) => {
              const isLast = i === stats.weeklyVolume.length - 1;
              return (
                <div
                  key={i}
                  className={`flex-1 origin-bottom animate-grow transition-colors duration-250 ${
                    isLast ? "bg-accent shadow-glow-bar-lg" : "bg-muted/25"
                  }`}
                  style={{ height: `${h}%`, animationDelay: `${i * 0.04}s` }}
                />
              );
            })}
          </div>
          <div className="flex justify-between mt-3.5 font-mono text-label text-faint">
            {WEEK_LABELS.map((w) => (
              <span key={w}>{w}</span>
            ))}
          </div>
        </div>

        <div className="px-14 pt-9 pb-12">
          <div className="font-mono text-label tracking-[.14em] text-faint mb-[22px]">
            RECENT SESSIONS — ALL SPORTS WELCOME
          </div>
          <div className="flex flex-col">
            {logs.map((log) => (
              <div
                key={log.id}
                className="grid grid-cols-[64px_92px_1fr_130px_110px] gap-5 items-baseline px-2 py-4 border-t border-soft rounded-md hover-row-tight transition-colors duration-250"
              >
                <span className="font-mono text-xs text-faint">{log.date}</span>
                <span
                  className={`font-mono text-label border rounded px-1.5 py-0.5 text-center ${
                    log.kind === "SNOW" ? "text-accent border-accent/[.35]" : "text-muted border-bold"
                  }`}
                >
                  {log.kind === "SNOW" ? "SNOW ❄" : log.kind}
                </span>
                <span className="text-base">{log.description}</span>
                <span className="font-mono text-xs text-faint">{log.upcoming ? "UPCOMING" : log.detail}</span>
                <span className="font-mono text-xs text-faint text-right">{log.duration}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
