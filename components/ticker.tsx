const ITEMS = [
  { label: "NOW", text: "WRITING THESIS ON SETTLEMENT PIPELINES" },
  { text: "WEEK 6/20 OF MARATHON BLOCK · 42 KM" },
  { text: "READING: EL ÚLTIMO SECRETO + BLACK CLOVER 32" },
  { text: "NEXT ADVENTURE: SNOWBOARD · 08.15" },
  { text: "LAST UPDATE: WEDNESDAY 23:47" },
];

function Row() {
  return (
    <div className="flex gap-12 font-mono text-label tracking-[.1em] text-muted pr-12 whitespace-nowrap">
      {ITEMS.map((item, i) => (
        <span key={i}>
          {item.label && <span className="text-accent">{item.label} — </span>}
          {item.text}
        </span>
      ))}
    </div>
  );
}

/** TODO: swap ITEMS for the "now" record coming from ContentRepository.getNowStatus() */
export function Ticker() {
  return (
    <div className="border-b border-line overflow-hidden py-[9px] bg-accent/[.04]">
      <div className="flex w-max animate-tick">
        <Row />
        <Row />
      </div>
    </div>
  );
}
