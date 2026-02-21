import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import iconUrl from "leaflet/dist/images/marker-icon.png";
import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({ iconUrl, iconRetinaUrl, shadowUrl });

const FACTION_ACCENTS = {
  survivor: "#9c8a3c",
  firefly: "#c4742a",
  military: "#4a5d3a",
};

const HEAT_COLORS = {
  safe: "#3d5a3a",
  caution: "#8b7a3a",
  danger: "#8b3a3a",
};

function getRiskLabel(infectionLevel) {
  if (infectionLevel >= 70) return "Overrun";
  if (infectionLevel >= 40) return "Critical";
  return "Stable";
}

function getHeatTier(infectionLevel) {
  if (infectionLevel >= 70) return "danger";
  if (infectionLevel >= 35) return "caution";
  return "safe";
}

function getRadiusFromInfection(infectionPercent) {
  const p = Math.min(100, Math.max(0, infectionPercent));
  return 120000 + (p / 100) * 400000;
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function ArcadeIcon() {
  return L.divIcon({
    className: "arcade-marker-icon",
    html: `
      <div class="arcade-pin">
        <div class="arcade-pin__ring"></div>
        <div class="arcade-pin__ring arcade-pin__ring--2"></div>
        <div class="arcade-pin__core"></div>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });
}

function MapView({ zones, allZones, role, listenMode, onSpeakZone, onZoneMissionClick }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const layersRef = useRef([]);
  const entityRef = useRef(null);
  const animRef = useRef(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const accentColor = FACTION_ACCENTS[role] || FACTION_ACCENTS.survivor;
    const bounds = L.latLngBounds([[-40, -130], [55, 160]]);

    const map = L.map(mapRef.current, {
      crs: L.CRS.EPSG3857,
      center: [15, 20],
      zoom: 2,
      minZoom: 2,
      maxZoom: 2,
      zoomAnimation: false,
      worldCopyJump: false,
      maxBounds: bounds,
      maxBoundsViscosity: 1,
      attributionControl: false,
      zoomControl: false,
    });

    map.attributionControl?.remove();

    const gridEl = document.createElement("div");
    gridEl.className = "map-grid-bg map-grid-bg--animated";
    gridEl.style.cssText = `
      position:absolute;inset:0;pointer-events:none;z-index:0;
      background:#0d0c0a;
      background-image:
        linear-gradient(rgba(45,42,36,0.14) 1px, transparent 1px),
        linear-gradient(90deg, rgba(45,42,36,0.14) 1px, transparent 1px);
      background-size: 28px 28px;
    `;
    map.getContainer().insertBefore(gridEl, map.getContainer().firstChild);

    const fogEl = document.createElement("div");
    fogEl.className = "map-fog-overlay";
    map.getContainer().appendChild(fogEl);

    mapInstanceRef.current = map;
    const layers = [];
    layers.push({ remove: () => gridEl.remove() });
    layers.push({ remove: () => fogEl.remove() });

    const zoneById = (allZones || zones).reduce((acc, z) => {
      acc[z.id] = z;
      return acc;
    }, {});

    if (role === "firefly" || role === "military") {
      const linkColor = role === "firefly" ? "#c4742a" : "#4a5d3a";
      const factionZones = zones.filter(
        (z) =>
          (role === "firefly" && z.visibility === "firefly") ||
          (role === "military" && z.visibility === "military")
      );
      const drawn = new Set();
      factionZones.forEach((zone) => {
        if (!zone.linkedTo || drawn.has(`${zone.id}-${zone.linkedTo}`)) return;
        const target = zoneById[zone.linkedTo];
        if (!target || !factionZones.some((f) => f.id === target.id)) return;
        drawn.add(`${zone.id}-${zone.linkedTo}`);
        drawn.add(`${zone.linkedTo}-${zone.id}`);
        const polyline = L.polyline([zone.coordinates, target.coordinates], {
          color: linkColor,
          weight: 2,
          opacity: 0.5,
          dashArray: "10, 10",
          className: "map-trail-line",
        }).addTo(map);
        layers.push({ remove: () => polyline.remove() });
      });
    }

    zones.forEach((zone) => {
      const infectionLevel = zone.infectionTrend?.slice(-1)[0] ?? 0;
      const radius = getRadiusFromInfection(infectionLevel);
      const heatTier = getHeatTier(infectionLevel);
      const heatColor = HEAT_COLORS[heatTier];
      const isOverrun = infectionLevel > 70;
      const fillOpacity = isOverrun ? 0.28 : 0.14;
      const borderWeight = 3;

      const riskLabel = getRiskLabel(infectionLevel);
      const resourceSummary = `Ammo ${zone.resources.ammo}% · Food ${zone.resources.food}% · Medical ${zone.resources.medical}%`;

      const isArcade = zone.type === "arcade";

      const speakZone = listenMode && onSpeakZone ? () => onSpeakZone(zone) : null;
      const openMission = onZoneMissionClick ? () => onZoneMissionClick(zone) : null;

      if (isArcade) {
        const arcadeMarker = L.marker(zone.coordinates, {
          icon: ArcadeIcon(),
        }).addTo(map);
        arcadeMarker.bindPopup(
          buildPopupContent(zone.name, riskLabel, infectionLevel, resourceSummary),
          { className: "map-popup-hud" }
        );
        arcadeMarker.on("mouseover", () => arcadeMarker._icon?.classList.add("map-marker-hover"));
        arcadeMarker.on("mouseout", () => arcadeMarker._icon?.classList.remove("map-marker-hover"));
        if (speakZone) arcadeMarker.on("click", speakZone);
        if (openMission) arcadeMarker.on("click", openMission);
        layers.push({ remove: () => arcadeMarker.remove() });
      } else {
        const marker = L.marker(zone.coordinates).addTo(map);
        marker.bindPopup(
          buildPopupContent(zone.name, riskLabel, infectionLevel, resourceSummary),
          { className: "map-popup-hud" }
        );
        marker.on("mouseover", () => marker._icon?.classList.add("map-marker-hover"));
        marker.on("mouseout", () => marker._icon?.classList.remove("map-marker-hover"));
        if (speakZone) marker.on("click", speakZone);
        if (openMission) marker.on("click", openMission);
        layers.push({ remove: () => marker.remove() });
      }

      const circle = L.circle(zone.coordinates, {
        color: heatColor,
        fillColor: heatColor,
        fillOpacity,
        weight: borderWeight,
        radius,
        className: `heat-zone heat-zone--${heatTier}${isOverrun ? " heat-zone--glow" : ""}`,
      }).addTo(map);
      if (speakZone) circle.on("click", speakZone);
      if (openMission) circle.on("click", openMission);
      layers.push({ remove: () => circle.remove() });

      if (isOverrun) {
        const glowCircle = L.circle(zone.coordinates, {
          color: heatColor,
          fillColor: heatColor,
          fillOpacity: 0.08,
          weight: 1,
          radius: radius * 1.2,
          className: "heat-zone heat-zone--pulse",
        }).addTo(map);
        layers.push({ remove: () => glowCircle.remove() });
      }
    });

    const linkedZones = zones.filter((z) => z.linkedTo && zoneById[z.linkedTo]);
    if (linkedZones.length >= 1) {
      const start = linkedZones[0].coordinates;
      const end = zoneById[linkedZones[0].linkedTo]?.coordinates || start;
      const entityMarker = L.circleMarker(start, {
        radius: 6,
        fillColor: accentColor,
        color: "#c4b8a8",
        weight: 2,
        fillOpacity: 0.9,
        className: "map-entity-blip",
      }).addTo(map);
      entityRef.current = { marker: entityMarker, start, end };

      let t = 0;
      const duration = 12000;
      const startTime = performance.now();

      function animateEntity() {
        const elapsed = performance.now() - startTime;
        t = (elapsed % duration) / duration;
        const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
        const lat = lerp(start[0], end[0], eased);
        const lng = lerp(start[1], end[1], eased);
        entityMarker.setLatLng([lat, lng]);
        animRef.current = requestAnimationFrame(animateEntity);
      }
      animateEntity();
      layers.push({
        remove: () => {
          if (animRef.current) cancelAnimationFrame(animRef.current);
          entityMarker.remove();
        },
      });
    }

    layersRef.current = layers;

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
      layersRef.current.forEach((l) => l.remove());
      layersRef.current = [];
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [zones, allZones, role, listenMode, onSpeakZone, onZoneMissionClick]);

  return (
    <div className="relative h-full w-full overflow-hidden map-hud-wrapper">
      <div
        ref={mapRef}
        className={`map-container h-full w-full transition-all duration-500 ${
          listenMode ? "brightness-90 contrast-105" : ""
        }`}
        style={{ width: "100%", height: "100%", background: "#0d0c0a" }}
      />
      <div className="map-scan-line pointer-events-none" aria-hidden />
      <div className="map-zone-shade pointer-events-none" aria-hidden />
    </div>
  );
}

function buildPopupContent(name, riskLabel, infectionLevel, resourceSummary) {
  return `
    <div class="map-popup-content">
      <div class="map-popup-title">${name}</div>
      <div class="map-popup-risk"><span>${riskLabel}</span></div>
      <div class="map-popup-stat">Infection: ${infectionLevel}%</div>
      <div class="map-popup-resources">${resourceSummary}</div>
    </div>
  `;
}

export default MapView;
