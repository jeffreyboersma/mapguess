import type { Location } from '../types/game';
import { MAX_SCORE_PER_ROUND } from '../types/game';

export interface RegionBounds {
  latMin: number;
  latMax: number;
  lngMin: number;
  lngMax: number;
}

// Check if a location is within the region bounds
function isLocationInRegion(location: Location, bounds: RegionBounds): boolean {
  const { lat, lng } = location;
  const { latMin, latMax, lngMin, lngMax } = bounds;
  
  // Check latitude
  if (lat < latMin || lat > latMax) {
    return false;
  }
  
  // Handle longitude wrapping (e.g., Oceania wraps around 180°/-180°)
  if (lngMin > lngMax) {
    // Region wraps around the date line
    return lng >= lngMin || lng <= lngMax;
  } else {
    return lng >= lngMin && lng <= lngMax;
  }
}

// Calculate the diagonal distance of a region (approximate maximum distance)
function calculateRegionDiagonal(bounds: RegionBounds): number {
  // Calculate distance from southwest corner to northeast corner
  const southwest: Location = { lat: bounds.latMin, lng: bounds.lngMin };
  const northeast: Location = { lat: bounds.latMax, lng: bounds.lngMax };
  return calculateDistance(southwest, northeast);
}

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
// If region bounds are provided, score is relative to region size
export function calculateScore(
  distance: number, 
  guessLocation?: Location,
  regionBounds?: RegionBounds
): number {
  // If region bounds provided, use region-relative scoring
  if (regionBounds && guessLocation) {
    // Check if guess is outside the region
    if (!isLocationInRegion(guessLocation, regionBounds)) {
      return 0;
    }
    
    // Calculate the maximum distance (diagonal of the region)
    const maxDistance = calculateRegionDiagonal(regionBounds);
    
    // Score decreases relative to region size
    // Perfect score for exact match, 0 at or beyond maxDistance
    const normalizedDistance = distance / maxDistance;
    const score = MAX_SCORE_PER_ROUND * Math.exp(-normalizedDistance * 5);
    return Math.round(Math.max(0, score));
  }
  
  // Default world scoring - exponential decay with distance
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
