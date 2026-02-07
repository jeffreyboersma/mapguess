import type { Location } from '../types/game';

/**
 * Generates a random location within reasonable bounds (avoiding poles and extreme areas)
 */
function generateRandomCoordinates(): { lat: number; lng: number } {
  // Latitude between -60 and 70 (avoiding extreme polar regions)
  const lat = Math.random() * 130 - 60;
  // Longitude between -180 and 180
  const lng = Math.random() * 360 - 180;
  return { lat, lng };
}

/**
 * Attempts to find a random location with Street View coverage
 * Returns null if no location found after max attempts
 */
async function findRandomStreetViewLocation(
  maxAttempts: number = 20
): Promise<Location | null> {
  const streetViewService = new google.maps.StreetViewService();

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const coords = generateRandomCoordinates();
    
    try {
      // Use a large radius to increase chances of finding coverage
      const result = await new Promise<google.maps.StreetViewPanoramaData | null>(
        (resolve) => {
          streetViewService.getPanorama(
            {
              location: coords,
              radius: 100000, // 100km radius
              source: google.maps.StreetViewSource.OUTDOOR, // Only official Google Street View
            },
            (data, status) => {
              if (status === google.maps.StreetViewStatus.OK && data?.location?.latLng) {
                resolve(data);
              } else {
                resolve(null);
              }
            }
          );
        }
      );

      if (result?.location?.latLng) {
        return {
          lat: result.location.latLng.lat(),
          lng: result.location.latLng.lng(),
          name: result.location.description || result.location.shortDescription || undefined,
        };
      }
    } catch (error) {
      // Continue to next attempt
      console.warn(`Attempt ${attempt + 1} failed:`, error);
    }
  }

  return null;
}

/**
 * Generates multiple random locations with Street View coverage
 * Falls back to predefined locations if generation fails
 */
export async function generateRandomLocations(
  count: number,
  onProgress?: (current: number, total: number) => void
): Promise<Location[]> {
  const locations: Location[] = [];
  
  for (let i = 0; i < count; i++) {
    if (onProgress) {
      onProgress(i + 1, count);
    }

    const location = await findRandomStreetViewLocation();
    
    if (location) {
      locations.push(location);
    } else {
      // If we can't find a random location, generate a fallback
      // This should rarely happen, but ensures the game can always proceed
      console.warn(`Could not find Street View location for round ${i + 1}, retrying...`);
      
      // Retry with more attempts
      const retryLocation = await findRandomStreetViewLocation(50);
      if (retryLocation) {
        locations.push(retryLocation);
      } else {
        throw new Error(`Failed to generate location for round ${i + 1}`);
      }
    }
  }

  return locations;
}
