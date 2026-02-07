import type { Location } from '../types/game';
import { MAX_SCORE_PER_ROUND } from '../types/game';

// Calculate distance between two points using Haversine formula
export function calculateDistance(point1: Location, point2: Location): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRad(point2.lat - point1.lat);
  const dLng = toRad(point2.lng - point1.lng);
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(point1.lat)) * Math.cos(toRad(point2.lat)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in kilometers
}

function toRad(deg: number): number {
  return deg * (Math.PI / 180);
}

// Calculate score based on distance
// Perfect score (5000) for exact match, decreases exponentially with distance
export function calculateScore(distance: number): number {
  // Score decreases exponentially with distance
  // At 1km: ~4975 points
  // At 10km: ~4750 points
  // At 100km: ~3750 points
  // At 1000km: ~1000 points
  // At 5000km: ~50 points
  const score = MAX_SCORE_PER_ROUND * Math.exp(-distance / 2000);
  return Math.round(Math.max(0, score));
}

// Format distance for display
export function formatDistance(km: number): string {
  if (km < 1) {
    return `${Math.round(km * 1000)} m`;
  } else if (km < 10) {
    return `${km.toFixed(1)} km`;
  } else {
    return `${Math.round(km)} km`;
  }
}
