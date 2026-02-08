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

// Geographic bounds for all countries
const COUNTRY_BOUNDS: Record<string, { latMin: number; latMax: number; lngMin: number; lngMax: number }> = {
  // Africa
  'Algeria': { latMin: 19, latMax: 37, lngMin: -9, lngMax: 12 },
  'Angola': { latMin: -18, latMax: -5, lngMin: 12, lngMax: 24 },
  'Benin': { latMin: 6, latMax: 13, lngMin: 1, lngMax: 4 },
  'Botswana': { latMin: -27, latMax: -18, lngMin: 20, lngMax: 29 },
  'Burkina Faso': { latMin: 10, latMax: 15, lngMin: -6, lngMax: 3 },
  'Burundi': { latMin: -4, latMax: -3, lngMin: 29, lngMax: 31 },
  'Cameroon': { latMin: 2, latMax: 13, lngMin: 8, lngMax: 17 },
  'Cape Verde': { latMin: 15, latMax: 17, lngMin: -25, lngMax: -23 },
  'Central African Republic': { latMin: 3, latMax: 11, lngMin: 15, lngMax: 28 },
  'Chad': { latMin: 7, latMax: 24, lngMin: 14, lngMax: 24 },
  'Comoros': { latMin: -13, latMax: -11, lngMin: 43, lngMax: 45 },
  'Congo': { latMin: -5, latMax: 4, lngMin: 11, lngMax: 19 },
  'Democratic Republic of the Congo': { latMin: -13, latMax: 6, lngMin: 12, lngMax: 32 },
  'Djibouti': { latMin: 11, latMax: 13, lngMin: 42, lngMax: 44 },
  'Egypt': { latMin: 22, latMax: 32, lngMin: 25, lngMax: 37 },
  'Equatorial Guinea': { latMin: 1, latMax: 3, lngMin: 9, lngMax: 12 },
  'Eritrea': { latMin: 13, latMax: 18, lngMin: 37, lngMax: 44 },
  'Eswatini': { latMin: -27, latMax: -26, lngMin: 31, lngMax: 32 },
  'Ethiopia': { latMin: 3, latMax: 15, lngMin: 33, lngMax: 48 },
  'Gabon': { latMin: -4, latMax: 2, lngMin: 9, lngMax: 15 },
  'Gambia': { latMin: 13, latMax: 14, lngMin: -17, lngMax: -13 },
  'Ghana': { latMin: 5, latMax: 11, lngMin: -4, lngMax: 2 },
  'Guinea': { latMin: 8, latMax: 13, lngMin: -15, lngMax: -8 },
  'Guinea-Bissau': { latMin: 11, latMax: 13, lngMin: -17, lngMax: -14 },
  'Ivory Coast': { latMin: 4, latMax: 11, lngMin: -9, lngMax: -2 },
  'Kenya': { latMin: -5, latMax: 5, lngMin: 34, lngMax: 42 },
  'Lesotho': { latMin: -31, latMax: -29, lngMin: 27, lngMax: 30 },
  'Liberia': { latMin: 4, latMax: 9, lngMin: -12, lngMax: -7 },
  'Libya': { latMin: 20, latMax: 33, lngMin: 10, lngMax: 25 },
  'Madagascar': { latMin: -26, latMax: -12, lngMin: 43, lngMax: 51 },
  'Malawi': { latMin: -17, latMax: -9, lngMin: 33, lngMax: 36 },
  'Mali': { latMin: 10, latMax: 25, lngMin: -13, lngMax: 5 },
  'Mauritania': { latMin: 15, latMax: 27, lngMin: -17, lngMax: -5 },
  'Mauritius': { latMin: -21, latMax: -20, lngMin: 57, lngMax: 58 },
  'Morocco': { latMin: 28, latMax: 36, lngMin: -13, lngMax: -1 },
  'Mozambique': { latMin: -27, latMax: -11, lngMin: 30, lngMax: 41 },
  'Namibia': { latMin: -29, latMax: -17, lngMin: 12, lngMax: 25 },
  'Niger': { latMin: 12, latMax: 24, lngMin: 0, lngMax: 16 },
  'Nigeria': { latMin: 4, latMax: 14, lngMin: 3, lngMax: 15 },
  'Rwanda': { latMin: -3, latMax: -1, lngMin: 29, lngMax: 31 },
  'São Tomé and Príncipe': { latMin: 0, latMax: 2, lngMin: 6, lngMax: 8 },
  'Senegal': { latMin: 12, latMax: 17, lngMin: -18, lngMax: -11 },
  'Seychelles': { latMin: -5, latMax: -4, lngMin: 55, lngMax: 56 },
  'Sierra Leone': { latMin: 7, latMax: 10, lngMin: -14, lngMax: -10 },
  'Somalia': { latMin: -2, latMax: 12, lngMin: 41, lngMax: 52 },
  'South Africa': { latMin: -35, latMax: -22, lngMin: 16, lngMax: 33 },
  'South Sudan': { latMin: 4, latMax: 13, lngMin: 24, lngMax: 36 },
  'Sudan': { latMin: 9, latMax: 22, lngMin: 22, lngMax: 39 },
  'Tanzania': { latMin: -12, latMax: -1, lngMin: 29, lngMax: 41 },
  'Togo': { latMin: 6, latMax: 11, lngMin: 0, lngMax: 2 },
  'Tunisia': { latMin: 30, latMax: 38, lngMin: 7, lngMax: 12 },
  'Uganda': { latMin: -2, latMax: 4, lngMin: 30, lngMax: 35 },
  'Zambia': { latMin: -18, latMax: -8, lngMin: 22, lngMax: 34 },
  'Zimbabwe': { latMin: -23, latMax: -15, lngMin: 25, lngMax: 33 },
  
  // Asia
  'Afghanistan': { latMin: 29, latMax: 39, lngMin: 60, lngMax: 75 },
  'Armenia': { latMin: 39, latMax: 42, lngMin: 43, lngMax: 47 },
  'Azerbaijan': { latMin: 39, latMax: 42, lngMin: 45, lngMax: 51 },
  'Bahrain': { latMin: 26, latMax: 27, lngMin: 50, lngMax: 51 },
  'Bangladesh': { latMin: 21, latMax: 27, lngMin: 88, lngMax: 93 },
  'Bhutan': { latMin: 27, latMax: 28, lngMin: 89, lngMax: 92 },
  'Brunei': { latMin: 4, latMax: 5, lngMin: 114, lngMax: 116 },
  'Cambodia': { latMin: 10, latMax: 15, lngMin: 102, lngMax: 108 },
  'China': { latMin: 18, latMax: 54, lngMin: 73, lngMax: 135 },
  'Cyprus': { latMin: 35, latMax: 36, lngMin: 32, lngMax: 34 },
  'Georgia': { latMin: 41, latMax: 44, lngMin: 40, lngMax: 47 },
  'India': { latMin: 8, latMax: 35, lngMin: 68, lngMax: 97 },
  'Indonesia': { latMin: -11, latMax: 6, lngMin: 95, lngMax: 141 },
  'Iran': { latMin: 25, latMax: 40, lngMin: 44, lngMax: 64 },
  'Iraq': { latMin: 29, latMax: 38, lngMin: 39, lngMax: 49 },
  'Israel': { latMin: 30, latMax: 34, lngMin: 34, lngMax: 36 },
  'Japan': { latMin: 30, latMax: 46, lngMin: 129, lngMax: 146 },
  'Jordan': { latMin: 29, latMax: 34, lngMin: 35, lngMax: 40 },
  'Kazakhstan': { latMin: 41, latMax: 55, lngMin: 47, lngMax: 87 },
  'Kuwait': { latMin: 29, latMax: 31, lngMin: 47, lngMax: 49 },
  'Kyrgyzstan': { latMin: 40, latMax: 43, lngMin: 70, lngMax: 81 },
  'Laos': { latMin: 14, latMax: 23, lngMin: 100, lngMax: 108 },
  'Lebanon': { latMin: 33, latMax: 35, lngMin: 35, lngMax: 37 },
  'Malaysia': { latMin: 1, latMax: 7, lngMin: 100, lngMax: 120 },
  'Maldives': { latMin: -1, latMax: 8, lngMin: 72, lngMax: 74 },
  'Mongolia': { latMin: 42, latMax: 52, lngMin: 87, lngMax: 120 },
  'Myanmar': { latMin: 10, latMax: 29, lngMin: 92, lngMax: 102 },
  'Nepal': { latMin: 27, latMax: 31, lngMin: 80, lngMax: 89 },
  'North Korea': { latMin: 38, latMax: 43, lngMin: 124, lngMax: 131 },
  'Oman': { latMin: 17, latMax: 27, lngMin: 52, lngMax: 60 },
  'Pakistan': { latMin: 24, latMax: 37, lngMin: 61, lngMax: 77 },
  'Palestine': { latMin: 31, latMax: 33, lngMin: 34, lngMax: 36 },
  'Philippines': { latMin: 5, latMax: 21, lngMin: 117, lngMax: 127 },
  'Qatar': { latMin: 25, latMax: 27, lngMin: 51, lngMax: 52 },
  'Russia': { latMin: 41, latMax: 82, lngMin: 19, lngMax: 180 },
  'Saudi Arabia': { latMin: 16, latMax: 32, lngMin: 34, lngMax: 56 },
  'Singapore': { latMin: 1, latMax: 2, lngMin: 103, lngMax: 104 },
  'South Korea': { latMin: 33, latMax: 39, lngMin: 125, lngMax: 130 },
  'Sri Lanka': { latMin: 6, latMax: 10, lngMin: 79, lngMax: 82 },
  'Syria': { latMin: 33, latMax: 37, lngMin: 36, lngMax: 43 },
  'Taiwan': { latMin: 22, latMax: 26, lngMin: 120, lngMax: 122 },
  'Tajikistan': { latMin: 37, latMax: 41, lngMin: 68, lngMax: 75 },
  'Thailand': { latMin: 6, latMax: 21, lngMin: 97, lngMax: 106 },
  'Timor-Leste': { latMin: -9, latMax: -8, lngMin: 125, lngMax: 128 },
  'Turkey': { latMin: 36, latMax: 42, lngMin: 26, lngMax: 45 },
  'Turkmenistan': { latMin: 36, latMax: 43, lngMin: 53, lngMax: 67 },
  'United Arab Emirates': { latMin: 23, latMax: 27, lngMin: 51, lngMax: 57 },
  'Uzbekistan': { latMin: 38, latMax: 46, lngMin: 56, lngMax: 74 },
  'Vietnam': { latMin: 8, latMax: 24, lngMin: 102, lngMax: 110 },
  'Yemen': { latMin: 12, latMax: 19, lngMin: 43, lngMax: 54 },
  
  // Europe
  'Albania': { latMin: 40, latMax: 43, lngMin: 19, lngMax: 21 },
  'Andorra': { latMin: 42, latMax: 43, lngMin: 1, lngMax: 2 },
  'Austria': { latMin: 47, latMax: 49, lngMin: 9, lngMax: 17 },
  'Belarus': { latMin: 51, latMax: 57, lngMin: 23, lngMax: 33 },
  'Belgium': { latMin: 50, latMax: 52, lngMin: 2, lngMax: 7 },
  'Bosnia and Herzegovina': { latMin: 43, latMax: 46, lngMin: 16, lngMax: 20 },
  'Bulgaria': { latMin: 41, latMax: 44, lngMin: 22, lngMax: 29 },
  'Croatia': { latMin: 43, latMax: 47, lngMin: 13, lngMax: 20 },
  'Czech Republic': { latMin: 48, latMax: 51, lngMin: 12, lngMax: 19 },
  'Czechia': { latMin: 48, latMax: 51, lngMin: 12, lngMax: 19 },
  'Denmark': { latMin: 55, latMax: 58, lngMin: 8, lngMax: 13 },
  'Estonia': { latMin: 58, latMax: 60, lngMin: 22, lngMax: 28 },
  'Finland': { latMin: 60, latMax: 70, lngMin: 20, lngMax: 32 },
  'France': { latMin: 42, latMax: 51, lngMin: -5, lngMax: 8 },
  'Germany': { latMin: 47, latMax: 55, lngMin: 6, lngMax: 15 },
  'Greece': { latMin: 35, latMax: 42, lngMin: 19, lngMax: 28 },
  'Hungary': { latMin: 46, latMax: 49, lngMin: 16, lngMax: 23 },
  'Iceland': { latMin: 63, latMax: 67, lngMin: -25, lngMax: -13 },
  'Ireland': { latMin: 51, latMax: 56, lngMin: -11, lngMax: -5 },
  'Italy': { latMin: 36, latMax: 47, lngMin: 6, lngMax: 19 },
  'Kosovo': { latMin: 42, latMax: 43, lngMin: 20, lngMax: 22 },
  'Latvia': { latMin: 56, latMax: 58, lngMin: 21, lngMax: 29 },
  'Liechtenstein': { latMin: 47, latMax: 48, lngMin: 9, lngMax: 10 },
  'Lithuania': { latMin: 54, latMax: 57, lngMin: 21, lngMax: 27 },
  'Luxembourg': { latMin: 49, latMax: 51, lngMin: 5, lngMax: 7 },
  'Malta': { latMin: 35, latMax: 36, lngMin: 14, lngMax: 15 },
  'Moldova': { latMin: 46, latMax: 49, lngMin: 27, lngMax: 30 },
  'Monaco': { latMin: 43, latMax: 44, lngMin: 7, lngMax: 8 },
  'Montenegro': { latMin: 42, latMax: 44, lngMin: 18, lngMax: 21 },
  'Netherlands': { latMin: 51, latMax: 54, lngMin: 3, lngMax: 8 },
  'North Macedonia': { latMin: 41, latMax: 43, lngMin: 20, lngMax: 23 },
  'Norway': { latMin: 58, latMax: 71, lngMin: 4, lngMax: 31 },
  'Poland': { latMin: 49, latMax: 55, lngMin: 14, lngMax: 24 },
  'Portugal': { latMin: 37, latMax: 42, lngMin: -10, lngMax: -6 },
  'Romania': { latMin: 44, latMax: 49, lngMin: 20, lngMax: 30 },
  'San Marino': { latMin: 43, latMax: 44, lngMin: 12, lngMax: 13 },
  'Serbia': { latMin: 42, latMax: 46, lngMin: 19, lngMax: 23 },
  'Slovakia': { latMin: 48, latMax: 50, lngMin: 17, lngMax: 23 },
  'Slovenia': { latMin: 45, latMax: 47, lngMin: 13, lngMax: 17 },
  'Spain': { latMin: 36, latMax: 44, lngMin: -10, lngMax: 4 },
  'Sweden': { latMin: 55, latMax: 69, lngMin: 11, lngMax: 24 },
  'Switzerland': { latMin: 46, latMax: 48, lngMin: 6, lngMax: 11 },
  'Ukraine': { latMin: 44, latMax: 52, lngMin: 22, lngMax: 40 },
  'United Kingdom': { latMin: 50, latMax: 60, lngMin: -8, lngMax: 2 },
  'Vatican City': { latMin: 41, latMax: 42, lngMin: 12, lngMax: 13 },
  
  // North America
  'Antigua and Barbuda': { latMin: 17, latMax: 18, lngMin: -62, lngMax: -61 },
  'Bahamas': { latMin: 23, latMax: 27, lngMin: -80, lngMax: -73 },
  'Barbados': { latMin: 13, latMax: 14, lngMin: -60, lngMax: -59 },
  'Belize': { latMin: 16, latMax: 19, lngMin: -90, lngMax: -87 },
  'Canada': { latMin: 42, latMax: 70, lngMin: -141, lngMax: -52 },
  'Costa Rica': { latMin: 8, latMax: 11, lngMin: -86, lngMax: -82 },
  'Cuba': { latMin: 20, latMax: 24, lngMin: -85, lngMax: -74 },
  'Dominica': { latMin: 15, latMax: 16, lngMin: -62, lngMax: -61 },
  'Dominican Republic': { latMin: 18, latMax: 20, lngMin: -72, lngMax: -68 },
  'El Salvador': { latMin: 13, latMax: 15, lngMin: -91, lngMax: -87 },
  'Grenada': { latMin: 12, latMax: 13, lngMin: -62, lngMax: -61 },
  'Guatemala': { latMin: 14, latMax: 18, lngMin: -93, lngMax: -88 },
  'Haiti': { latMin: 18, latMax: 20, lngMin: -75, lngMax: -71 },
  'Honduras': { latMin: 13, latMax: 17, lngMin: -90, lngMax: -83 },
  'Jamaica': { latMin: 17, latMax: 19, lngMin: -79, lngMax: -76 },
  'Mexico': { latMin: 14, latMax: 33, lngMin: -118, lngMax: -86 },
  'Nicaragua': { latMin: 11, latMax: 15, lngMin: -88, lngMax: -83 },
  'Panama': { latMin: 7, latMax: 10, lngMin: -83, lngMax: -77 },
  'Saint Kitts and Nevis': { latMin: 17, latMax: 18, lngMin: -63, lngMax: -62 },
  'Saint Lucia': { latMin: 13, latMax: 14, lngMin: -61, lngMax: -60 },
  'Saint Vincent and the Grenadines': { latMin: 13, latMax: 14, lngMin: -62, lngMax: -61 },
  'Trinidad and Tobago': { latMin: 10, latMax: 11, lngMin: -62, lngMax: -60 },
  'United States': { latMin: 25, latMax: 50, lngMin: -125, lngMax: -66 },
  
  // South America
  'Argentina': { latMin: -55, latMax: -22, lngMin: -74, lngMax: -53 },
  'Bolivia': { latMin: -23, latMax: -10, lngMin: -70, lngMax: -58 },
  'Brazil': { latMin: -34, latMax: 5, lngMin: -74, lngMax: -35 },
  'Chile': { latMin: -56, latMax: -17, lngMin: -76, lngMax: -66 },
  'Colombia': { latMin: -4, latMax: 13, lngMin: -79, lngMax: -66 },
  'Ecuador': { latMin: -5, latMax: 2, lngMin: -81, lngMax: -75 },
  'Guyana': { latMin: 1, latMax: 9, lngMin: -61, lngMax: -57 },
  'Paraguay': { latMin: -28, latMax: -19, lngMin: -63, lngMax: -54 },
  'Peru': { latMin: -18, latMax: 0, lngMin: -82, lngMax: -68 },
  'Suriname': { latMin: 2, latMax: 6, lngMin: -59, lngMax: -54 },
  'Uruguay': { latMin: -35, latMax: -30, lngMin: -59, lngMax: -53 },
  'Venezuela': { latMin: 1, latMax: 13, lngMin: -74, lngMax: -60 },
  
  // Oceania
  'Australia': { latMin: -44, latMax: -10, lngMin: 113, lngMax: 154 },
  'Fiji': { latMin: -20, latMax: -16, lngMin: 177, lngMax: 181 },
  'Kiribati': { latMin: -4, latMax: 4, lngMin: -157, lngMax: 173 },
  'Marshall Islands': { latMin: 5, latMax: 15, lngMin: 165, lngMax: 172 },
  'Micronesia': { latMin: 5, latMax: 10, lngMin: 138, lngMax: 163 },
  'Nauru': { latMin: -1, latMax: 0, lngMin: 166, lngMax: 167 },
  'New Zealand': { latMin: -47, latMax: -34, lngMin: 166, lngMax: 179 },
  'Palau': { latMin: 7, latMax: 8, lngMin: 134, lngMax: 135 },
  'Papua New Guinea': { latMin: -12, latMax: -1, lngMin: 141, lngMax: 157 },
  'Samoa': { latMin: -14, latMax: -13, lngMin: -173, lngMax: -171 },
  'Solomon Islands': { latMin: -11, latMax: -6, lngMin: 156, lngMax: 163 },
  'Tonga': { latMin: -22, latMax: -15, lngMin: -176, lngMax: -173 },
  'Tuvalu': { latMin: -10, latMax: -5, lngMin: 176, lngMax: 180 },
  'Vanuatu': { latMin: -20, latMax: -13, lngMin: 166, lngMax: 170 },
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
  regionName?: string,
  usedPanoIds: Set<string> = new Set()
): Promise<Location | null> {
  const streetViewService = new google.maps.StreetViewService();

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const coords = generateRandomCoordinates(regionType, regionName);
    
    try {
      // Use a smaller radius to get more diverse locations
      // Start with 50km, but increase if we're having trouble finding locations
      const radius = attempt < 10 ? 50000 : attempt < 15 ? 75000 : 100000;
      
      const result = await new Promise<google.maps.StreetViewPanoramaData | null>(
        (resolve) => {
          streetViewService.getPanorama(
            {
              location: coords,
              radius: radius,
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
        const panoId = result.location.pano;
        
        // Skip if we've already used this panorama
        if (panoId && usedPanoIds.has(panoId)) {
          continue;
        }
        
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
        
        // Mark this panorama ID as used
        if (panoId) {
          usedPanoIds.add(panoId);
        }
        
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
  const usedPanoIds = new Set<string>(); // Track used panorama IDs to avoid duplicates
  
  for (let i = 0; i < count; i++) {
    if (onProgress) {
      onProgress(i + 1, count);
    }

    const location = await findRandomStreetViewLocation(20, regionType, regionName, usedPanoIds);
    
    if (location) {
      locations.push(location);
    } else {
      // If we can't find a random location, generate a fallback
      // This should rarely happen, but ensures the game can always proceed
      console.warn(`Could not find Street View location for round ${i + 1}, retrying...`);
      
      // Retry with more attempts
      const retryLocation = await findRandomStreetViewLocation(50, regionType, regionName, usedPanoIds);
      if (retryLocation) {
        locations.push(retryLocation);
      } else {
        throw new Error(`Failed to generate location for round ${i + 1}. Try selecting a different region.`);
      }
    }
  }

  return locations;
}

/**
 * Gets the map view bounds (center and zoom) for a given region
 * Returns null for world view (default zoom)
 */
export function getRegionMapView(
  regionType: 'world' | 'continent' | 'country',
  regionName?: string
): { center: { lat: number; lng: number }; zoom: number } | null {
  if (regionType === 'world') {
    return null; // Use default world view
  }

  let bounds: { latMin: number; latMax: number; lngMin: number; lngMax: number } | undefined;

  if (regionType === 'country' && regionName) {
    bounds = COUNTRY_BOUNDS[regionName];
  } else if (regionType === 'continent' && regionName) {
    bounds = CONTINENT_BOUNDS[regionName];
  }

  if (!bounds) {
    return null; // Fallback to world view if no bounds found
  }

  // Calculate center of the bounds
  const centerLat = (bounds.latMin + bounds.latMax) / 2;
  let centerLng: number;
  
  // Handle longitude wrapping (e.g., Oceania)
  if (bounds.lngMin > bounds.lngMax) {
    // Wrapped around 180°/-180°
    const range1 = 180 - bounds.lngMin;
    centerLng = bounds.lngMin + range1 / 2;
    if (centerLng > 180) centerLng -= 360;
  } else {
    centerLng = (bounds.lngMin + bounds.lngMax) / 2;
  }

  // Calculate appropriate zoom level based on the bounds size
  const latDiff = Math.abs(bounds.latMax - bounds.latMin);
  const lngDiff = bounds.lngMin > bounds.lngMax 
    ? (180 - bounds.lngMin) + (bounds.lngMax - (-180))
    : Math.abs(bounds.lngMax - bounds.lngMin);
  
  const maxDiff = Math.max(latDiff, lngDiff);
  
  // Determine zoom level based on size
  let zoom: number;
  if (maxDiff > 100) {
    zoom = 2;
  } else if (maxDiff > 60) {
    zoom = 3;
  } else if (maxDiff > 30) {
    zoom = 4;
  } else if (maxDiff > 15) {
    zoom = 5;
  } else if (maxDiff > 8) {
    zoom = 6;
  } else {
    zoom = 7;
  }

  return { center: { lat: centerLat, lng: centerLng }, zoom };
}

// Export the region data for use in UI
export { CONTINENTS, COUNTRIES };
