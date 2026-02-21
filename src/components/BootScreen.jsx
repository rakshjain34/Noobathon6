import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const LINES = [
  "> SYSTEM INIT",
  "> LOADING CORDYCEPS ARCHIVE...",
  "> ESTABLISHING CONNECTION",
  "> CLEARANCE VERIFIED",
  "> READY",
];

function BootScreen() {
  const [visibleLines, setVisibleLines] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const timers = [];
    for (let i = 0; i < LINES.length; i++) {
      timers.push(
        setTimeout(() => setVisibleLines(i + 1), (i + 1) * 350)
      );
    }
    const redirectTimer = setTimeout(() => {
      navigate("/calibration", { replace: true });
    }, 3000);

    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(redirectTimer);
    };
  }, [navigate]);

  return (
    <div className="flex h-screen w-full items-center justify-center bg-[#0a0a0a]">
      <pre className="font-mono text-sm text-[#8e857a]">
        {LINES.slice(0, visibleLines).map((line, i) => (
          <span key={i}>{`${line}\n`}</span>
        ))}
      </pre>
    </div>
  );
}

export default BootScreen;
