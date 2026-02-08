import React, { useState, useEffect, useRef } from 'react';
import { Map, useMap } from '@vis.gl/react-google-maps';
import { CONTINENTS, COUNTRIES, getRegionMapView, getRegionBounds } from '../utils/randomLocation';
import type { RegionType } from '../types/game';

interface GameSetupProps {
  onStartGame: (rounds: number, timeLimit: number | null, regionType: RegionType, regionName?: string) => void;
  onBack: () => void;
  error?: string | null;
}

// RegionBorder component to draw outline of selected region
const RegionBorder: React.FC<{
  regionType: RegionType;
  regionName?: string;
}> = ({ regionType, regionName }) => {
  const map = useMap();
  const polygonRef = useRef<google.maps.Polygon | null>(null);

  useEffect(() => {
    if (!map || regionType === 'world' || !regionName) {
      // Clean up existing polygon
      if (polygonRef.current) {
        polygonRef.current.setMap(null);
        polygonRef.current = null;
      }
      return;
    }

    const bounds = getRegionBounds(regionType, regionName);
    if (!bounds) {
      // Clean up existing polygon if no bounds
      if (polygonRef.current) {
        polygonRef.current.setMap(null);
        polygonRef.current = null;
      }
      return;
    }

    // Create a rectangle outlining the selected region
    const regionBorder = [
      { lat: bounds.latMax, lng: bounds.lngMin },
      { lat: bounds.latMax, lng: bounds.lngMax },
      { lat: bounds.latMin, lng: bounds.lngMax },
      { lat: bounds.latMin, lng: bounds.lngMin },
      { lat: bounds.latMax, lng: bounds.lngMin },
    ];

    // Clean up existing polygon
    if (polygonRef.current) {
      polygonRef.current.setMap(null);
    }

    // Create polygon with just the border (no fill)
    polygonRef.current = new google.maps.Polygon({
      paths: [regionBorder],
      strokeColor: '#10b981',
      strokeOpacity: 0.8,
      strokeWeight: 3,
      fillColor: 'transparent',
      fillOpacity: 0,
      map,
      clickable: false,
    });

    return () => {
      if (polygonRef.current) {
        polygonRef.current.setMap(null);
        polygonRef.current = null;
      }
    };
  }, [map, regionType, regionName]);

  return null;
};

const MapPreview: React.FC<{ regionType: RegionType; regionName?: string }> = ({ regionType, regionName }) => {
  const map = useMap();
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (!map) return;

    const mapView = getRegionMapView(regionType, regionName);
    
    if (mapView) {
      map.setCenter(mapView.center);
      map.setZoom(mapView.zoom);
    } else {
      // Default world view
      map.setCenter({ lat: 20, lng: 0 });
      map.setZoom(1);
    }
    
    hasInitialized.current = true;
  }, [map, regionType, regionName]);

  return null;
};

const GameSetup: React.FC<GameSetupProps> = ({ onStartGame, onBack, error }) => {
  const [rounds, setRounds] = useState(10);
  const [timeLimit, setTimeLimit] = useState<number | null>(null);
  const [regionType, setRegionType] = useState<RegionType>('world');
  const [selectedRegion, setSelectedRegion] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const roundOptions = [3, 5, 10, 15, 20];
  const timeLimitOptions = [
    { value: null, label: 'No Limit' },
    { value: 30, label: '30s' },
    { value: 60, label: '60s' },
    { value: 90, label: '90s' },
    { value: 120, label: '2min' },
  ];

  const handleRegionTypeChange = (type: RegionType) => {
    setRegionType(type);
    setSelectedRegion('');
    setIsDropdownOpen(false);
  };

  const handleStartGame = () => {
    setIsGenerating(true);
    onStartGame(rounds, timeLimit, regionType, selectedRegion || undefined);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#0a0a0f] via-[#12121a] to-[#0a0a0f] px-4">
      {/* Back Button */}
      <button
        onClick={onBack}
        disabled={isGenerating}
        className="absolute top-6 left-6 text-gray-400 hover:text-white flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-800/60 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back
      </button>

      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-12 mt-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
            Game Setup
          </h2>
          <p className="text-gray-400">
            Configure your single player game
          </p>
        </div>

        {/* Round Selection */}
        <div className="mb-10">
          <label className="block text-gray-300 text-sm font-medium mb-4">
            Number of Rounds
          </label>
          <div className="grid grid-cols-5 gap-2">
            {roundOptions.map((option) => (
              <button
                key={option}
                onClick={() => setRounds(option)}
                disabled={isGenerating}
                className={`py-3 px-4 rounded-lg font-semibold text-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer ${
                  rounds === option
                    ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-lg shadow-emerald-500/25'
                    : 'bg-gray-800/60 text-gray-300 hover:bg-gray-700/60 border border-gray-700/50'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* Time Limit Selection */}
        <div className="mb-10">
          <label className="block text-gray-300 text-sm font-medium mb-4">
            Time Limit (per round)
          </label>
          <div className="grid grid-cols-5 gap-2">
            {timeLimitOptions.map((option) => (
              <button
                key={option.label}
                onClick={() => setTimeLimit(option.value)}
                disabled={isGenerating}
                className={`py-3 px-4 rounded-lg font-semibold text-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer ${
                  timeLimit === option.value
                    ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-lg shadow-emerald-500/25'
                    : 'bg-gray-800/60 text-gray-300 hover:bg-gray-700/60 border border-gray-700/50'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Region Selection */}
        <div className="mb-10">
          <label className="block text-gray-300 text-sm font-medium mb-4">
            Region
          </label>
          <div className="grid grid-cols-3 gap-2 mb-4">
            <button
              onClick={() => handleRegionTypeChange('world')}
              disabled={isGenerating}
              className={`py-3 px-4 rounded-lg font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer ${
                regionType === 'world'
                  ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-lg shadow-emerald-500/25'
                  : 'bg-gray-800/60 text-gray-300 hover:bg-gray-700/60 border border-gray-700/50'
              }`}
            >
              World
            </button>
            <button
              onClick={() => handleRegionTypeChange('continent')}
              disabled={isGenerating}
              className={`py-3 px-4 rounded-lg font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer ${
                regionType === 'continent'
                  ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-lg shadow-emerald-500/25'
                  : 'bg-gray-800/60 text-gray-300 hover:bg-gray-700/60 border border-gray-700/50'
              }`}
            >
              Continent
            </button>
            <button
              onClick={() => handleRegionTypeChange('country')}
              disabled={isGenerating}
              className={`py-3 px-4 rounded-lg font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer ${
                regionType === 'country'
                  ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-lg shadow-emerald-500/25'
                  : 'bg-gray-800/60 text-gray-300 hover:bg-gray-700/60 border border-gray-700/50'
              }`}
            >
              Country
            </button>
          </div>

          {/* Continent Selector */}
          {regionType === 'continent' && (
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                disabled={isGenerating}
                className={`w-full py-3 px-4 rounded-xl bg-gray-800/60 text-white border border-gray-700/50 focus:outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer hover:bg-gray-700/60 flex items-center justify-between relative ${isDropdownOpen ? 'z-20' : ''}`}
              >
                <span className={selectedRegion ? 'text-white' : 'text-gray-400'}>
                  {selectedRegion || 'Select a Continent'}
                </span>
                <svg 
                  className={`w-5 h-5 text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {isDropdownOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-10" 
                    onClick={() => setIsDropdownOpen(false)}
                  />
                  <div className="absolute z-20 w-full mt-2 bg-gray-800 border border-gray-700/50 rounded-xl shadow-xl max-h-60 overflow-y-auto pr-2 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-600 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:my-1 [&::-webkit-scrollbar-thumb:hover]:bg-gray-500">
                    {CONTINENTS.map((continent) => (
                      <button
                        key={continent}
                        onClick={() => {
                          setSelectedRegion(continent);
                          setIsDropdownOpen(false);
                        }}
                        className={`w-full px-4 py-3 text-left transition-colors cursor-pointer ${
                          selectedRegion === continent
                            ? 'bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 text-white font-medium'
                            : 'text-gray-300 hover:bg-gray-700/60'
                        }`}
                      >
                        {continent}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {/* Country Selector */}
          {regionType === 'country' && (
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                disabled={isGenerating}
                className={`w-full py-3 px-4 rounded-xl bg-gray-800/60 text-white border border-gray-700/50 focus:outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer hover:bg-gray-700/60 flex items-center justify-between relative ${isDropdownOpen ? 'z-20' : ''}`}
              >
                <span className={selectedRegion ? 'text-white' : 'text-gray-400'}>
                  {selectedRegion || 'Select a Country'}
                </span>
                <svg 
                  className={`w-5 h-5 text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {isDropdownOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-10" 
                    onClick={() => setIsDropdownOpen(false)}
                  />
                  <div className="absolute z-20 w-full mt-2 bg-gray-800 border border-gray-700/50 rounded-xl shadow-xl max-h-60 overflow-y-auto pr-2 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-600 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:my-1 [&::-webkit-scrollbar-thumb:hover]:bg-gray-500">
                    {COUNTRIES.map((country) => (
                      <button
                        key={country}
                        onClick={() => {
                          setSelectedRegion(country);
                          setIsDropdownOpen(false);
                        }}
                        className={`w-full px-4 py-3 text-left transition-colors cursor-pointer ${
                          selectedRegion === country
                            ? 'bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 text-white font-medium'
                            : 'text-gray-300 hover:bg-gray-700/60'
                        }`}
                      >
                        {country}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Region Map Preview */}
        <div className="mb-10">
          <label className="block text-gray-300 text-sm font-medium mb-4">
            Region Preview
          </label>
          <div className="w-full h-64 rounded-xl overflow-hidden border border-gray-700/50 shadow-lg">
            <Map
              key={`${regionType}-${selectedRegion || 'none'}`}
              defaultCenter={{ lat: 20, lng: 0 }}
              defaultZoom={2}
              disableDefaultUI={true}
              gestureHandling="none"
              keyboardShortcuts={false}
              disableDoubleClickZoom={true}
              clickableIcons={false}
              mapTypeId="roadmap"
              style={{ width: '100%', height: '100%', pointerEvents: 'none' }}
            >
              <MapPreview regionType={regionType} regionName={selectedRegion} />
              <RegionBorder regionType={regionType} regionName={selectedRegion} />
            </Map>
          </div>
        </div>

        {/* Game Info */}
        <div className="bg-gray-800/40 rounded-xl p-6 mb-10 border border-gray-700/50">
          <h3 className="text-white font-semibold mb-4">How to Play</h3>
          <ul className="text-gray-400 text-sm space-y-2.5">
            <li className="flex items-start gap-3">
              <span className="text-emerald-400 mt-0.5">•</span>
              <span>You'll be dropped at a random location anywhere in the world</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-emerald-400 mt-0.5">•</span>
              <span>All locations have official Google Street View coverage</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-emerald-400 mt-0.5">•</span>
              <span>Explore and find clues to determine your location</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-emerald-400 mt-0.5">•</span>
              <span>Click on the map to place your guess</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-emerald-400 mt-0.5">•</span>
              <span>Score up to 5,000 points per round based on accuracy</span>
            </li>
          </ul>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-6">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* Start Button */}
        <button
          onClick={handleStartGame}
          disabled={isGenerating}
          className="w-full py-4 px-6 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-white font-semibold text-lg rounded-xl transition-all duration-200 transform hover:scale-[1.02] hover:shadow-lg hover:shadow-emerald-500/25 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none cursor-pointer"
        >
          {isGenerating ? 'Generating Locations...' : 'Start Game'}
        </button>

        {/* Points Info */}
        <p className="text-center text-gray-500 text-sm mt-4 mb-4">
          Maximum possible score: {(rounds * 5000).toLocaleString()} points
        </p>
      </div>
    </div>
  );
};

export default GameSetup;
