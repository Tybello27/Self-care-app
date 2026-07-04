"use client";

export type Tab = "home" | "planner" | "insights";

const items: { id: Tab; label: string; icon: string }[] = [
  { id: "home", label: "Home", icon: "🏡" },
  { id: "planner", label: "Planner", icon: "🗓️" },
  { id: "insights", label: "Insights", icon: "📊" },
];

export default function BottomNav({
  tab,
  setTab,
  onAdd,
}: {
  tab: Tab;
  setTab: (t: Tab) => void;
  onAdd: () => void;
}) {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 mx-auto max-w-md px-4 pb-[calc(env(safe-area-inset-bottom)+12px)]">
      <div className="glass-strong relative flex items-center justify-around rounded-[1.75rem] px-2 py-2.5">
        {items.slice(0, 1).map((it) => (
          <NavBtn key={it.id} it={it} tab={tab} setTab={setTab} />
        ))}
        {items.slice(1, 2).map((it) => (
          <NavBtn key={it.id} it={it} tab={tab} setTab={setTab} />
        ))}

        <button
          onClick={onAdd}
          className="press -mt-8 grid h-14 w-14 place-items-center rounded-full bg-gradient-to-br from-violet-500 to-pink-500 text-2xl text-white shadow-lg shadow-pink-300"
          aria-label="Add ritual"
        >
          +
        </button>

        {items.slice(2, 3).map((it) => (
          <NavBtn key={it.id} it={it} tab={tab} setTab={setTab} />
        ))}
      </div>
    </nav>
  );
}

function NavBtn({
  it,
  tab,
  setTab,
}: {
  it: { id: Tab; label: string; icon: string };
  tab: Tab;
  setTab: (t: Tab) => void;
}) {
  const active = tab === it.id;
  return (
    <button
      onClick={() => setTab(it.id)}
      className={`press flex flex-1 flex-col items-center gap-0.5 rounded-2xl py-1 transition-all ${
        active ? "" : "opacity-50"
      }`}
    >
      <span className={`text-xl ${active ? "scale-110" : ""} transition-transform`}>
        {it.icon}
      </span>
      <span
        className={`text-[10px] font-bold ${
          active ? "text-violet-500" : "text-[#a99cb8]"
        }`}
      >
        {it.label}
      </span>
    </button>
  );
}
