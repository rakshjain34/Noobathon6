import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import iconUrl from "leaflet/dist/images/marker-icon.png";
import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({ iconUrl, iconRetinaUrl, shadowUrl });

const RISK_COLORS = {
  critical: "#c4742a",
  high: "#9c8a3c",
  medium: "#4a5d3a",
  low: "#6b5b4f",
};

const MIN_RADIUS = 180000;
const MAX_RADIUS = 750000;

function getRadiusFromInfection(infectionPercent) {
  const p = Math.min(100, Math.max(0, infectionPercent));
  return MIN_RADIUS + (p / 100) * (MAX_RADIUS - MIN_RADIUS);
}

function MapView({ zones, listenMode }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const layersRef = useRef([]);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const map = L.map(mapRef.current).setView([20, 0], 2);
    L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png", {
      attribution: "© CARTO",
    }).addTo(map);

    mapInstanceRef.current = map;
    const layers = [];

    zones.forEach((zone) => {
      const fillColor = RISK_COLORS[zone.riskLevel] || RISK_COLORS.medium;
      const isHighRisk = zone.riskLevel === "critical" || zone.riskLevel === "high";
      const glowOpacity = listenMode && isHighRisk ? 0.35 : 0.15;
      const infectionLevel = zone.infectionTrend?.slice(-1)[0] ?? 0;
      const radius = getRadiusFromInfection(infectionLevel);

      const riskBadge = zone.riskLevel.toUpperCase();
      const badgeColor = fillColor;

      const marker = L.marker(zone.coordinates).addTo(map);
      marker.bindPopup(
        `<div style="font-family:monospace;padding:8px;font-size:12px;color:#2d2a24">
          <div style="margin-bottom:6px;display:flex;align-items:center;gap:6px">
            <strong style="font-size:14px">${zone.name}</strong>
            <span style="border:1px solid ${badgeColor};color:${badgeColor};padding:2px 6px;font-size:9px;font-weight:600;letter-spacing:0.05em">${riskBadge}</span>
          </div>
          <span style="font-size:11px">Infection: ${infectionLevel}%</span><br/>
          <span style="font-size:11px">Loot: Ammo ${zone.resources.ammo}% | Food ${zone.resources.food}% | Medical ${zone.resources.medical}%</span><br/>
          <span style="font-size:11px">Last: ${zone.lastActivity}</span>
        </div>`
      );
      layers.push({ remove: () => marker.remove() });

      const circle = L.circle(zone.coordinates, {
        color: fillColor,
        fillColor,
        fillOpacity: glowOpacity,
        weight: listenMode && isHighRisk ? 2 : 1,
        radius,
      }).addTo(map);
      layers.push({ remove: () => circle.remove() });
    });

    layersRef.current = layers;

    return () => {
      layersRef.current.forEach((l) => l.remove());
      layersRef.current = [];
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [zones, listenMode]);

  return (
    <div
      ref={mapRef}
      className={`h-full w-full transition-[filter] duration-300 ${
        listenMode ? "brightness-75 contrast-110" : ""
      }`}
      style={{ width: "100%", height: "100%" }}
    />
  );
}

export default MapView;
