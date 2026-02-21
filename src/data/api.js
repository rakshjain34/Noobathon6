/**
 * Data layer - currently uses localStorage.
 * Replace with MongoDB/API calls for production:
 *
 * - User profiles: { role, location, lastCalibration }
 * - Inventories: { medkits, ammo, rags, alcohol, tradingCards }
 * - Map states: zones with infectionTrend, resources, visibility
 */

const STORAGE_KEYS = {
  role: "turningPoint_role",
  location: "turningPoint_location",
  calibrated: "turningPoint_calibrated",
};

export function getStoredRole() {
  return localStorage.getItem(STORAGE_KEYS.role);
}

export function setStoredRole(role) {
  localStorage.setItem(STORAGE_KEYS.role, role);
}

export function clearSession() {
  Object.values(STORAGE_KEYS).forEach((k) => localStorage.removeItem(k));
}
