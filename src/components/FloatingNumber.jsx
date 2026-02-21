export default function FloatingNumber({ text, type, index = 0 }) {
  const isDamage = type === "hp" && text.startsWith("-");
  const offset = (index % 5) * 24 - 48;
  return (
    <span
      className={`pointer-events-none fixed left-1/2 top-1/3 z-[60] -translate-x-1/2 font-mono text-sm font-bold ${
        isDamage ? "text-red-400" : "text-amber-300"
      }`}
      style={{
        animation: "floatUp 1.2s ease-out forwards",
        textShadow: "0 0 8px currentColor",
        marginLeft: `${offset}px`,
      }}
    >
      {text}
    </span>
  );
}
