function TaskPanel({ tasks, accentColor, currentTarget, listenMode, onSpeak }) {
  if (!tasks?.length) return null;

  return (
    <div className="flex flex-col gap-2 border border-border bg-card p-4">
      <h3
        className={`font-mono text-xs uppercase tracking-wider text-[#6b6358] ${listenMode ? "cursor-pointer hover:opacity-90" : ""}`}
        role={listenMode ? "button" : undefined}
        tabIndex={listenMode ? 0 : undefined}
        onClick={() => listenMode && onSpeak?.("Missions.")}
        onKeyDown={(e) => listenMode && onSpeak && (e.key === "Enter" || e.key === " ") && onSpeak("Missions.")}
      >
        Missions
      </h3>
      {currentTarget && (
        <p className="font-mono text-[10px] text-primary border-b border-border pb-1.5">
          Focus: {currentTarget.text} ({currentTarget.current}/{currentTarget.target})
        </p>
      )}
      <ul className="space-y-2">
        {tasks.map((t) => {
          const progressText = t.completed
            ? "Completed."
            : `${t.text}. ${t.current ?? 0} of ${t.target}.`;
          return (
            <li
              key={t.id}
              className={`flex flex-col gap-0.5 border-l-2 pl-2 font-mono text-xs ${
                t.completed ? "border-[#4a5d3a] text-secondary" : "border-border text-primary"
              } ${listenMode ? "cursor-pointer hover:opacity-90" : ""}`}
              style={!t.completed ? { borderLeftColor: accentColor } : undefined}
              role={listenMode ? "button" : undefined}
              tabIndex={listenMode ? 0 : undefined}
              onClick={() => listenMode && onSpeak?.(progressText)}
              onKeyDown={(e) => listenMode && onSpeak && (e.key === "Enter" || e.key === " ") && onSpeak(progressText)}
            >
              <span className={t.completed ? "line-through" : ""}>{t.text}</span>
              {!t.completed && t.target != null && (
                <span className="text-[10px] text-secondary">
                  {t.current ?? 0} / {t.target}
                  {t.reward ? ` · Reward: ${t.reward}` : ""}
                </span>
              )}
              {t.completed && <span className="text-[10px] text-[#4a5d3a]">Completed</span>}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default TaskPanel;
