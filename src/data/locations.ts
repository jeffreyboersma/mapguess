import type { Location } from '../types/game';

// Curated list of interesting Street View locations around the world
export const STREET_VIEW_LOCATIONS: Location[] = [
  // Europe
  { lat: 48.8584, lng: 2.2945, name: 'Eiffel Tower, Paris' },
  { lat: 51.5014, lng: -0.1419, name: 'Big Ben, London' },
  { lat: 41.9029, lng: 12.4534, name: 'Vatican City, Rome' },
  { lat: 52.3676, lng: 4.9041, name: 'Amsterdam, Netherlands' },
  { lat: 41.4036, lng: 2.1744, name: 'Sagrada Familia, Barcelona' },
  { lat: 48.2082, lng: 16.3738, name: 'Vienna, Austria' },
  { lat: 50.0875, lng: 14.4213, name: 'Prague, Czech Republic' },
  { lat: 59.3293, lng: 18.0686, name: 'Stockholm, Sweden' },
  { lat: 55.6761, lng: 12.5683, name: 'Copenhagen, Denmark' },
  { lat: 60.1699, lng: 24.9384, name: 'Helsinki, Finland' },
  
  // North America
  { lat: 40.7484, lng: -73.9857, name: 'Empire State Building, NYC' },
  { lat: 37.7749, lng: -122.4194, name: 'San Francisco, USA' },
  { lat: 34.0522, lng: -118.2437, name: 'Los Angeles, USA' },
  { lat: 41.8781, lng: -87.6298, name: 'Chicago, USA' },
  { lat: 43.6532, lng: -79.3832, name: 'Toronto, Canada' },
  { lat: 45.5017, lng: -73.5673, name: 'Montreal, Canada' },
  { lat: 49.2827, lng: -123.1207, name: 'Vancouver, Canada' },
  { lat: 25.7617, lng: -80.1918, name: 'Miami, USA' },
  { lat: 47.6062, lng: -122.3321, name: 'Seattle, USA' },
  { lat: 39.7392, lng: -104.9903, name: 'Denver, USA' },
  
  // Asia
  { lat: 35.6762, lng: 139.6503, name: 'Tokyo, Japan' },
  { lat: 37.5665, lng: 126.9780, name: 'Seoul, South Korea' },
  { lat: 22.3193, lng: 114.1694, name: 'Hong Kong' },
  { lat: 1.3521, lng: 103.8198, name: 'Singapore' },
  { lat: 13.7563, lng: 100.5018, name: 'Bangkok, Thailand' },
  { lat: 25.0330, lng: 121.5654, name: 'Taipei, Taiwan' },
  { lat: 28.6139, lng: 77.2090, name: 'New Delhi, India' },
  { lat: 31.2304, lng: 121.4737, name: 'Shanghai, China' },
  { lat: 35.0116, lng: 135.7681, name: 'Kyoto, Japan' },
  { lat: 34.6937, lng: 135.5023, name: 'Osaka, Japan' },
  
  // South America
  { lat: -22.9068, lng: -43.1729, name: 'Rio de Janeiro, Brazil' },
  { lat: -34.6037, lng: -58.3816, name: 'Buenos Aires, Argentina' },
  { lat: -33.4489, lng: -70.6693, name: 'Santiago, Chile' },
  { lat: -12.0464, lng: -77.0428, name: 'Lima, Peru' },
  { lat: -23.5505, lng: -46.6333, name: 'São Paulo, Brazil' },
  { lat: 4.7110, lng: -74.0721, name: 'Bogotá, Colombia' },
  
  // Oceania
  { lat: -33.8688, lng: 151.2093, name: 'Sydney, Australia' },
  { lat: -37.8136, lng: 144.9631, name: 'Melbourne, Australia' },
  { lat: -36.8509, lng: 174.7645, name: 'Auckland, New Zealand' },
  { lat: -27.4698, lng: 153.0251, name: 'Brisbane, Australia' },
  
  // Africa & Middle East
  { lat: -33.9249, lng: 18.4241, name: 'Cape Town, South Africa' },
  { lat: 30.0444, lng: 31.2357, name: 'Cairo, Egypt' },
  { lat: 25.2048, lng: 55.2708, name: 'Dubai, UAE' },
  { lat: 31.7683, lng: 35.2137, name: 'Jerusalem, Israel' },
  { lat: -1.2921, lng: 36.8219, name: 'Nairobi, Kenya' },
  
  // More interesting spots
  { lat: 64.1466, lng: -21.9426, name: 'Reykjavik, Iceland' },
  { lat: 35.6892, lng: 51.3890, name: 'Tehran, Iran' },
  { lat: 41.0082, lng: 28.9784, name: 'Istanbul, Turkey' },
  { lat: 55.7558, lng: 37.6173, name: 'Moscow, Russia' },
  { lat: 19.4326, lng: -99.1332, name: 'Mexico City, Mexico' },
];

// Function to get random locations for a game
export function getRandomLocations(count: number): Location[] {
  const shuffled = [...STREET_VIEW_LOCATIONS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}
