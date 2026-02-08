import type { Location } from '../types/game';

// Mapping of countries to continents
const COUNTRY_TO_CONTINENT: Record<string, string> = {
  // Africa
  'Algeria': 'Africa', 'Angola': 'Africa', 'Benin': 'Africa', 'Botswana': 'Africa',
  'Burkina Faso': 'Africa', 'Burundi': 'Africa', 'Cameroon': 'Africa', 'Cape Verde': 'Africa',
  'Central African Republic': 'Africa', 'Chad': 'Africa', 'Comoros': 'Africa', 'Congo': 'Africa',
  'Democratic Republic of the Congo': 'Africa', 'Djibouti': 'Africa', 'Egypt': 'Africa',
  'Equatorial Guinea': 'Africa', 'Eritrea': 'Africa', 'Eswatini': 'Africa', 'Ethiopia': 'Africa',
  'Gabon': 'Africa', 'Gambia': 'Africa', 'Ghana': 'Africa', 'Guinea': 'Africa',
  'Guinea-Bissau': 'Africa', 'Ivory Coast': 'Africa', 'Kenya': 'Africa', 'Lesotho': 'Africa',
  'Liberia': 'Africa', 'Libya': 'Africa', 'Madagascar': 'Africa', 'Malawi': 'Africa',
  'Mali': 'Africa', 'Mauritania': 'Africa', 'Mauritius': 'Africa', 'Morocco': 'Africa',
  'Mozambique': 'Africa', 'Namibia': 'Africa', 'Niger': 'Africa', 'Nigeria': 'Africa',
  'Rwanda': 'Africa', 'São Tomé and Príncipe': 'Africa', 'Senegal': 'Africa', 'Seychelles': 'Africa',
  'Sierra Leone': 'Africa', 'Somalia': 'Africa', 'South Africa': 'Africa', 'South Sudan': 'Africa',
  'Sudan': 'Africa', 'Tanzania': 'Africa', 'Togo': 'Africa', 'Tunisia': 'Africa',
  'Uganda': 'Africa', 'Zambia': 'Africa', 'Zimbabwe': 'Africa',
  
  // Asia
  'Afghanistan': 'Asia', 'Armenia': 'Asia', 'Azerbaijan': 'Asia', 'Bahrain': 'Asia',
  'Bangladesh': 'Asia', 'Bhutan': 'Asia', 'Brunei': 'Asia', 'Cambodia': 'Asia',
  'China': 'Asia', 'Cyprus': 'Asia', 'Georgia': 'Asia', 'India': 'Asia',
  'Indonesia': 'Asia', 'Iran': 'Asia', 'Iraq': 'Asia', 'Israel': 'Asia',
  'Japan': 'Asia', 'Jordan': 'Asia', 'Kazakhstan': 'Asia', 'Kuwait': 'Asia',
  'Kyrgyzstan': 'Asia', 'Laos': 'Asia', 'Lebanon': 'Asia', 'Malaysia': 'Asia',
  'Maldives': 'Asia', 'Mongolia': 'Asia', 'Myanmar': 'Asia', 'Nepal': 'Asia',
  'North Korea': 'Asia', 'Oman': 'Asia', 'Pakistan': 'Asia', 'Palestine': 'Asia',
  'Philippines': 'Asia', 'Qatar': 'Asia', 'Saudi Arabia': 'Asia', 'Singapore': 'Asia',
  'South Korea': 'Asia', 'Sri Lanka': 'Asia', 'Syria': 'Asia', 'Taiwan': 'Asia',
  'Tajikistan': 'Asia', 'Thailand': 'Asia', 'Timor-Leste': 'Asia', 'Turkey': 'Asia',
  'Turkmenistan': 'Asia', 'United Arab Emirates': 'Asia', 'Uzbekistan': 'Asia', 'Vietnam': 'Asia',
  'Yemen': 'Asia',
  
  // Europe
  'Albania': 'Europe', 'Andorra': 'Europe', 'Austria': 'Europe', 'Belarus': 'Europe',
  'Belgium': 'Europe', 'Bosnia and Herzegovina': 'Europe', 'Bulgaria': 'Europe', 'Croatia': 'Europe',
  'Czech Republic': 'Europe', 'Czechia': 'Europe', 'Denmark': 'Europe', 'Estonia': 'Europe',
  'Finland': 'Europe', 'France': 'Europe', 'Germany': 'Europe', 'Greece': 'Europe',
  'Hungary': 'Europe', 'Iceland': 'Europe', 'Ireland': 'Europe', 'Italy': 'Europe',
  'Kosovo': 'Europe', 'Latvia': 'Europe', 'Liechtenstein': 'Europe', 'Lithuania': 'Europe',
  'Luxembourg': 'Europe', 'Malta': 'Europe', 'Moldova': 'Europe', 'Monaco': 'Europe',
  'Montenegro': 'Europe', 'Netherlands': 'Europe', 'North Macedonia': 'Europe', 'Norway': 'Europe',
  'Poland': 'Europe', 'Portugal': 'Europe', 'Romania': 'Europe', 'Russia': 'Europe',
  'San Marino': 'Europe', 'Serbia': 'Europe', 'Slovakia': 'Europe', 'Slovenia': 'Europe',
  'Spain': 'Europe', 'Sweden': 'Europe', 'Switzerland': 'Europe', 'Ukraine': 'Europe',
  'United Kingdom': 'Europe', 'Vatican City': 'Europe',
  
  // North America
  'Antigua and Barbuda': 'North America', 'Bahamas': 'North America', 'Barbados': 'North America',
  'Belize': 'North America', 'Canada': 'North America', 'Costa Rica': 'North America',
  'Cuba': 'North America', 'Dominica': 'North America', 'Dominican Republic': 'North America',
  'El Salvador': 'North America', 'Grenada': 'North America', 'Guatemala': 'North America',
  'Haiti': 'North America', 'Honduras': 'North America', 'Jamaica': 'North America',
  'Mexico': 'North America', 'Nicaragua': 'North America', 'Panama': 'North America',
  'Saint Kitts and Nevis': 'North America', 'Saint Lucia': 'North America',
  'Saint Vincent and the Grenadines': 'North America', 'Trinidad and Tobago': 'North America',
  'United States': 'North America',
  
  // South America
  'Argentina': 'South America', 'Bolivia': 'South America', 'Brazil': 'South America',
  'Chile': 'South America', 'Colombia': 'South America', 'Ecuador': 'South America',
  'Guyana': 'South America', 'Paraguay': 'South America', 'Peru': 'South America',
  'Suriname': 'South America', 'Uruguay': 'South America', 'Venezuela': 'South America',
  
  // Oceania
  'Australia': 'Oceania', 'Fiji': 'Oceania', 'Kiribati': 'Oceania', 'Marshall Islands': 'Oceania',
  'Micronesia': 'Oceania', 'Nauru': 'Oceania', 'New Zealand': 'Oceania', 'Palau': 'Oceania',
  'Papua New Guinea': 'Oceania', 'Samoa': 'Oceania', 'Solomon Islands': 'Oceania',
  'Tonga': 'Oceania', 'Tuvalu': 'Oceania', 'Vanuatu': 'Oceania',
};

// List of continents
const CONTINENTS = [
  'Africa',
  'Asia', 
  'Europe',
  'North America',
  'South America',
  'Oceania'
];

// List of countries (extracted from the mapping)
const COUNTRIES = Object.keys(COUNTRY_TO_CONTINENT).sort();

// Geographic bounds for continents
const CONTINENT_BOUNDS: Record<string, { latMin: number; latMax: number; lngMin: number; lngMax: number }> = {
  'Africa': { latMin: -35, latMax: 37, lngMin: -18, lngMax: 52 },
  'Asia': { latMin: -10, latMax: 75, lngMin: 25, lngMax: 180 },
  'Europe': { latMin: 35, latMax: 72, lngMin: -25, lngMax: 55 },
  'North America': { latMin: 7, latMax: 72, lngMin: -170, lngMax: -50 },
  'South America': { latMin: -56, latMax: 13, lngMin: -82, lngMax: -34 },
  'Oceania': { latMin: -48, latMax: 20, lngMin: 110, lngMax: -175 }, // Note: wraps around 180°
};

// Geographic bounds for major countries
const COUNTRY_BOUNDS: Record<string, { latMin: number; latMax: number; lngMin: number; lngMax: number }> = {
  // Africa
  'Algeria': { latMin: 19, latMax: 37, lngMin: -9, lngMax: 12 },
  'Egypt': { latMin: 22, latMax: 32, lngMin: 25, lngMax: 37 },
  'Ethiopia': { latMin: 3, latMax: 15, lngMin: 33, lngMax: 48 },
  'Kenya': { latMin: -5, latMax: 5, lngMin: 34, lngMax: 42 },
  'Morocco': { latMin: 28, latMax: 36, lngMin: -13, lngMax: -1 },
  'Nigeria': { latMin: 4, latMax: 14, lngMin: 3, lngMax: 15 },
  'South Africa': { latMin: -35, latMax: -22, lngMin: 16, lngMax: 33 },
  'Tanzania': { latMin: -12, latMax: -1, lngMin: 29, lngMax: 41 },
  
  // Asia
  'China': { latMin: 18, latMax: 54, lngMin: 73, lngMax: 135 },
  'India': { latMin: 8, latMax: 35, lngMin: 68, lngMax: 97 },
  'Indonesia': { latMin: -11, latMax: 6, lngMin: 95, lngMax: 141 },
  'Japan': { latMin: 30, latMax: 46, lngMin: 129, lngMax: 146 },
  'Kazakhstan': { latMin: 41, latMax: 55, lngMin: 47, lngMax: 87 },
  'Mongolia': { latMin: 42, latMax: 52, lngMin: 87, lngMax: 120 },
  'Philippines': { latMin: 5, latMax: 21, lngMin: 117, lngMax: 127 },
  'Russia': { latMin: 41, latMax: 82, lngMin: 19, lngMax: 180 }, // Note: also extends west
  'Saudi Arabia': { latMin: 16, latMax: 32, lngMin: 34, lngMax: 56 },
  'South Korea': { latMin: 33, latMax: 39, lngMin: 125, lngMax: 130 },
  'Thailand': { latMin: 6, latMax: 21, lngMin: 97, lngMax: 106 },
  'Turkey': { latMin: 36, latMax: 42, lngMin: 26, lngMax: 45 },
  'Vietnam': { latMin: 8, latMax: 24, lngMin: 102, lngMax: 110 },
  
  // Europe
  'France': { latMin: 42, latMax: 51, lngMin: -5, lngMax: 8 },
  'Germany': { latMin: 47, latMax: 55, lngMin: 6, lngMax: 15 },
  'Italy': { latMin: 36, latMax: 47, lngMin: 6, lngMax: 19 },
  'Norway': { latMin: 58, latMax: 71, lngMin: 4, lngMax: 31 },
  'Poland': { latMin: 49, latMax: 55, lngMin: 14, lngMax: 24 },
  'Spain': { latMin: 36, latMax: 44, lngMin: -10, lngMax: 4 },
  'Sweden': { latMin: 55, latMax: 69, lngMin: 11, lngMax: 24 },
  'Ukraine': { latMin: 44, latMax: 52, lngMin: 22, lngMax: 40 },
  'United Kingdom': { latMin: 50, latMax: 60, lngMin: -8, lngMax: 2 },
  
  // North America
  'Canada': { latMin: 42, latMax: 70, lngMin: -141, lngMax: -52 },
  'Mexico': { latMin: 14, latMax: 33, lngMin: -118, lngMax: -86 },
  'United States': { latMin: 25, latMax: 50, lngMin: -125, lngMax: -66 },
  
  // South America
  'Argentina': { latMin: -55, latMax: -22, lngMin: -74, lngMax: -53 },
  'Brazil': { latMin: -34, latMax: 5, lngMin: -74, lngMax: -35 },
  'Chile': { latMin: -56, latMax: -17, lngMin: -76, lngMax: -66 },
  'Colombia': { latMin: -4, latMax: 13, lngMin: -79, lngMax: -66 },
  'Peru': { latMin: -18, latMax: 0, lngMin: -82, lngMax: -68 },
  
  // Oceania
  'Australia': { latMin: -44, latMax: -10, lngMin: 113, lngMax: 154 },
  'New Zealand': { latMin: -47, latMax: -34, lngMin: 166, lngMax: 179 },
};

/**
 * Generates a random location within specified bounds
 */
function generateRandomCoordinates(
  regionType: 'world' | 'continent' | 'country' = 'world',
  regionName?: string
): { lat: number; lng: number } {
  let bounds: { latMin: number; latMax: number; lngMin: number; lngMax: number };
  
  if (regionType === 'country' && regionName && COUNTRY_BOUNDS[regionName]) {
    bounds = COUNTRY_BOUNDS[regionName];
  } else if (regionType === 'continent' && regionName && CONTINENT_BOUNDS[regionName]) {
    bounds = CONTINENT_BOUNDS[regionName];
  } else if (regionType === 'continent' && regionName) {
    // For continents without specific bounds, use a reasonable default
    bounds = { latMin: -60, latMax: 70, lngMin: -180, lngMax: 180 };
  } else if (regionType === 'country' && regionName) {
    // For countries without specific bounds, try to use continent bounds
    const continent = COUNTRY_TO_CONTINENT[regionName];
    if (continent && CONTINENT_BOUNDS[continent]) {
      bounds = CONTINENT_BOUNDS[continent];
    } else {
      // Fallback to world bounds
      bounds = { latMin: -60, latMax: 70, lngMin: -180, lngMax: 180 };
    }
  } else {
    // World - use reasonable bounds avoiding extreme polar regions
    bounds = { latMin: -60, latMax: 70, lngMin: -180, lngMax: 180 };
  }
  
  // Handle longitude wrapping (e.g., Oceania: 110 to -175)
  let lng: number;
  if (bounds.lngMin > bounds.lngMax) {
    // Wrapped around 180°/-180°
    const range1 = 180 - bounds.lngMin;
    const range2 = bounds.lngMax - (-180);
    const totalRange = range1 + range2;
    const randomValue = Math.random() * totalRange;
    
    if (randomValue < range1) {
      lng = bounds.lngMin + randomValue;
    } else {
      lng = -180 + (randomValue - range1);
    }
  } else {
    lng = bounds.lngMin + Math.random() * (bounds.lngMax - bounds.lngMin);
  }
  
  const lat = bounds.latMin + Math.random() * (bounds.latMax - bounds.latMin);
  
  return { lat, lng };
}

/**
 * Gets the location name with country using reverse geocoding
 * Returns both the formatted name and the country
 */
async function getLocationNameWithCountry(
  lat: number,
  lng: number,
  streetViewDescription?: string
): Promise<{ name: string; country: string }> {
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
      let name = 'Unknown Location';
      if (streetViewDescription && country) {
        // If we have a Street View description, use it and append the country
        // Check if the description already contains the country
        if (!streetViewDescription.includes(country)) {
          name = `${streetViewDescription}, ${country}`;
        } else {
          name = streetViewDescription;
        }
      } else if (locality && country) {
        // Use locality and country
        name = `${locality}, ${country}`;
      } else if (adminArea && country) {
        // Use admin area and country
        name = `${adminArea}, ${country}`;
      } else if (country) {
        // Just the country
        name = country;
      } else if (streetViewDescription) {
        // If we have Street View description but no country, still use it
        name = streetViewDescription;
      }

      return { name, country };
    }
  } catch (error) {
    console.warn('Geocoding failed:', error);
  }

  // Last resort fallback
  return { name: 'Unknown Location', country: '' };
}

/**
 * Attempts to find a random location with Street View coverage
 * Returns null if no location found after max attempts
 */
async function findRandomStreetViewLocation(
  maxAttempts: number = 20,
  regionType: 'world' | 'continent' | 'country' = 'world',
  regionName?: string
): Promise<Location | null> {
  const streetViewService = new google.maps.StreetViewService();

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const coords = generateRandomCoordinates(regionType, regionName);
    
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
        const locationData = await getLocationNameWithCountry(
          lat,
          lng,
          streetViewDescription ?? undefined
        );

        // Validate the location against the selected region
        if (regionType === 'country' && regionName) {
          // For country selection, check if the country matches exactly
          if (locationData.country !== regionName) {
            continue; // Skip this location and try again
          }
        } else if (regionType === 'continent' && regionName) {
          // For continent selection, check if the country belongs to the selected continent
          const locationContinent = COUNTRY_TO_CONTINENT[locationData.country];
          if (locationContinent !== regionName) {
            continue; // Skip this location and try again
          }
        }
        // For 'world', accept any location
        
        return {
          lat,
          lng,
          name: locationData.name,
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
  regionType: 'world' | 'continent' | 'country' = 'world',
  regionName?: string,
  onProgress?: (current: number, total: number) => void
): Promise<Location[]> {
  const locations: Location[] = [];
  
  for (let i = 0; i < count; i++) {
    if (onProgress) {
      onProgress(i + 1, count);
    }

    const location = await findRandomStreetViewLocation(20, regionType, regionName);
    
    if (location) {
      locations.push(location);
    } else {
      // If we can't find a random location, generate a fallback
      // This should rarely happen, but ensures the game can always proceed
      console.warn(`Could not find Street View location for round ${i + 1}, retrying...`);
      
      // Retry with more attempts
      const retryLocation = await findRandomStreetViewLocation(50, regionType, regionName);
      if (retryLocation) {
        locations.push(retryLocation);
      } else {
        throw new Error(`Failed to generate location for round ${i + 1}. Try selecting a different region.`);
      }
    }
  }

  return locations;
}

// Export the region data for use in UI
export { CONTINENTS, COUNTRIES };
