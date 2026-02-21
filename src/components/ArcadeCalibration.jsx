import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LOCATIONS } from "../data/zones";

function ArcadeCalibration() {
  const [prevLocation, setPrevLocation] = useState("");
  const [currentLocation, setCurrentLocation] = useState("");
  const [step, setStep] = useState("travel");
  const [sliderValue, setSliderValue] = useState(0);
  const [unlocked, setUnlocked] = useState(false);
  const navigate = useNavigate();

  const targetSlider = 73;

  const handleTravelSubmit = (e) => {
    e.preventDefault();
    if (prevLocation && currentLocation) setStep("hack");
  };

  const handleSliderRelease = () => {
    if (Math.abs(sliderValue - targetSlider) <= 5) {
      setUnlocked(true);
      setTimeout(() => {
        localStorage.setItem("turningPoint_calibrated", "1");
        navigate("/dashboard", { replace: true });
      }, 400);
    }
  };

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-[#0a0a0a] px-6">
      <div className="w-full max-w-md border border-[#3d3832] bg-[#1a1816] p-6">
        <h2 className="font-heading mb-6 text-xl text-primary">
          Arcade Calibration Protocol
        </h2>

        {step === "travel" && (
          <form onSubmit={handleTravelSubmit} className="space-y-4">
            <p className="font-mono text-xs text-secondary">
              Verify travel. Select previous and current location.
            </p>
            <div>
              <label className="mb-1 block font-mono text-[10px] uppercase text-secondary">
                Previous Location
              </label>
              <select
                value={prevLocation}
                onChange={(e) => setPrevLocation(e.target.value)}
                className="w-full border border-[#3d3832] bg-[#2d2a24] px-3 py-2 font-mono text-sm text-primary"
                required
              >
                <option value="">— Select —</option>
                {LOCATIONS.map((l) => (
                  <option key={l.value} value={l.value}>
                    {l.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block font-mono text-[10px] uppercase text-secondary">
                Current Location
              </label>
              <select
                value={currentLocation}
                onChange={(e) => setCurrentLocation(e.target.value)}
                className="w-full border border-[#3d3832] bg-[#2d2a24] px-3 py-2 font-mono text-sm text-primary"
                required
              >
                <option value="">— Select —</option>
                {LOCATIONS.map((l) => (
                  <option key={l.value} value={l.value}>
                    {l.label}
                  </option>
                ))}
              </select>
            </div>
            <button
              type="submit"
              className="w-full border border-[#3d3832] bg-[#2d2a24] py-2 font-mono text-xs uppercase text-primary hover:bg-[#3d3832]"
            >
              Confirm Travel
            </button>
          </form>
        )}

        {step === "hack" && (
          <div className="space-y-6">
            <p className="font-mono text-xs text-secondary">
              Align the slider to unlock terminal access.
            </p>
            <div className="space-y-2">
              <div className="flex justify-between font-mono text-[10px] text-secondary">
                <span>0</span>
                <span>Target: {targetSlider}</span>
                <span>100</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={sliderValue}
                onChange={(e) => setSliderValue(Number(e.target.value))}
                onMouseUp={handleSliderRelease}
                onTouchEnd={handleSliderRelease}
                className="w-full accent-[#9c8a3c]"
              />
              <p className="text-center font-mono text-[10px] text-secondary">
                {unlocked ? "Access granted." : `Current: ${sliderValue}`}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ArcadeCalibration;
