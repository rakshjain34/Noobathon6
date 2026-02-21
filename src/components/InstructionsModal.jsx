export default function InstructionsModal({ onClose }) {
  return (
    <div
      className="fixed inset-0 z-[110] flex items-center justify-center bg-base/90 p-4 backdrop-blur-sm"
      onClick={onClose}
      onKeyDown={(e) => e.key === "Escape" && onClose()}
      role="dialog"
      aria-modal="true"
      aria-label="Instructions"
    >
      <div
        className="max-h-[80vh] w-full max-w-lg overflow-y-auto border border-border bg-card p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="font-heading text-xl font-bold text-primary border-b border-border pb-2 mb-4">
          Instructions
        </h2>
        <ul className="font-mono text-xs text-secondary space-y-3 list-disc list-inside">
          <li>Use the dashboard to monitor zones, infection, and resources.</li>
          <li>Click zones on the map to open mission modals and start zone missions.</li>
          <li>Manage health, energy, and timer — avoid reaching zero.</li>
          <li>Complete all zone missions to win.</li>
          <li>Supply Medical and Reinforce actions lower zone infection.</li>
          <li>Next Turn advances time and increases infection in high-risk zones.</li>
          <li>Listen Mode: click any element to hear it read aloud.</li>
        </ul>
        <button
          type="button"
          onClick={onClose}
          className="mt-6 w-full border border-border bg-card py-2 font-mono text-xs uppercase text-primary hover:opacity-90"
        >
          Close
        </button>
      </div>
    </div>
  );
}
