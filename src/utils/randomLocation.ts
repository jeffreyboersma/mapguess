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
 * Gets the location name with country using reverse geocoding
 */
async function getLocationNameWithCountry(
  lat: number,
  lng: number,
  streetViewDescription?: string
): Promise<string> {
  const geocoder = new google.maps.Geocoder();
  
  try {
    const result = await new Promise<google.maps.GeocoderResult[]>(
      (resolve, reject) => {
        geocoder.geocode(
          { location: { lat, lng } },
          (results, status) => {
            if (status === google.maps.GeocoderStatus.OK && results) {
              resolve(results);
            } else {
              reject(new Error(`Geocoding failed: ${status}`));
            }
          }
        );
      }
    );

    if (result && result.length > 0) {
      // Find the country from address components
      let country = '';
      let locality = '';
      let adminArea = '';
      
      // Try to find country from the first result, but check all results if needed
      for (const geocodeResult of result) {
        for (const component of geocodeResult.address_components) {
          if (component.types.includes('country') && !country) {
            country = component.long_name;
          }
          if (component.types.includes('locality') && !locality) {
            locality = component.long_name;
          }
          if (component.types.includes('administrative_area_level_1') && !adminArea) {
            adminArea = component.long_name;
          }
        }
        // If we found a country, we can stop looking
        if (country) break;
      }

      // Build the location name
      if (streetViewDescription && country) {
        // If we have a Street View description, use it and append the country
        // Check if the description already contains the country
        if (!streetViewDescription.includes(country)) {
          return `${streetViewDescription}, ${country}`;
        }
        return streetViewDescription;
      } else if (locality && country) {
        // Use locality and country
        return `${locality}, ${country}`;
      } else if (adminArea && country) {
        // Use admin area and country
        return `${adminArea}, ${country}`;
      } else if (country) {
        // Just the country
        return country;
      } else if (streetViewDescription) {
        // If we have Street View description but no country, still use it
        return streetViewDescription;
      }
    }
  } catch (error) {
    console.warn('Geocoding failed:', error);
  }

  // Last resort fallback
  return 'Unknown Location';
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
        const lat = result.location.latLng.lat();
        const lng = result.location.latLng.lng();
        const streetViewDescription = result.location.description || result.location.shortDescription;
        
        // Get location name with country
        const name = await getLocationNameWithCountry(
          lat,
          lng,
          streetViewDescription ?? undefined
        );
        
        return {
          lat,
          lng,
          name,
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
