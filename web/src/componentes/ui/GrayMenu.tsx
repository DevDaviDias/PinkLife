interface GrayMenuProps {
  items: {
    title: string;
    onClick?: () => void;
    active?: boolean;
  }[];
}

export default function GrayMenu({ items }: GrayMenuProps) {
  return (
    <div className="mt-4 flex w-full gap-2 rounded-2xl border border-pink-100 bg-pink-50 p-1.5">
      {items.map((item, index) => (
        <button
          key={index}
          onClick={item.onClick}
          className={`w-full rounded-xl px-3 py-1.5 text-[0.9em] font-semibold transition-all ${
            item.active
              ? "bg-pink-500 text-white shadow-sm shadow-pink-200"
              : "bg-transparent text-pink-400 hover:bg-white hover:text-pink-500"
          }`}
        >
          {item.title}
        </button>
      ))}
    </div>
  );
}
