import React, { useEffect, useRef } from 'react';
import { Map, AdvancedMarker, useMap } from '@vis.gl/react-google-maps';
import type { RoundResult, RegionType } from '../types/game';
import { MAX_SCORE_PER_ROUND } from '../types/game';
import { formatDistance } from '../utils/scoring';
import { getRegionBounds } from '../utils/randomLocation';

// RegionMask component to draw outline of selected region
const RegionMask: React.FC<{
  regionType?: RegionType;
  regionName?: string;
  mapId: string;
}> = ({ regionType, regionName, mapId }) => {
  const map = useMap(mapId);
  const polygonRef = useRef<google.maps.Polygon | null>(null);

  useEffect(() => {
    let isMounted = true;

    if (!map || !regionType || regionType === 'world' || !regionName) {
      if (polygonRef.current) {
        polygonRef.current.setMap(null);
        polygonRef.current = null;
      }
      return;
    }

    const bounds = getRegionBounds(regionType, regionName);
    if (!bounds) {
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
    if (isMounted) {
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
    }

    return () => {
      isMounted = false;
      if (polygonRef.current) {
        polygonRef.current.setMap(null);
        polygonRef.current = null;
      }
    };
  }, [map, regionType, regionName]);

  return null;
};

// Component to auto-fit map bounds to show all markers
const MapBoundsFitter: React.FC<{
  results: RoundResult[];
}> = ({ results }) => {
  const map = useMap();
  const fitTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // Clear any pending fit operation
    if (fitTimeoutRef.current) {
      clearTimeout(fitTimeoutRef.current);
      fitTimeoutRef.current = null;
    }

    if (!map) return;

    // Collect all points from results
    const bounds = new google.maps.LatLngBounds();
    let hasPoints = false;

    results.forEach((result) => {
      // Always include the actual location
      bounds.extend(result.actualLocation);
      hasPoints = true;
      
      // Include guessed location only if a guess was made
      if (!(result.distance === 0 && result.score === 0)) {
        bounds.extend(result.guessedLocation);
      }
    });

    // Fit the map to the bounds if we have points
    if (hasPoints) {
      // Use a slight delay to ensure map is ready
      fitTimeoutRef.current = setTimeout(() => {
        if (map) {
          map.fitBounds(bounds, { top: 50, right: 50, bottom: 50, left: 50 }); // Add padding
        }
      }, 100);
    }

    return () => {
      if (fitTimeoutRef.current) {
        clearTimeout(fitTimeoutRef.current);
        fitTimeoutRef.current = null;
      }
    };
  }, [map, results]);

  return null;
};

// Component to draw all polylines for the results
const ResultsPolylines: React.FC<{
  results: RoundResult[];
}> = ({ results }) => {
  const map = useMap();
  const polylinesRef = useRef<google.maps.Polyline[]>([]);

  useEffect(() => {
    if (!map) {
      return;
    }

    // Clear existing polylines to prevent memory leaks
    polylinesRef.current.forEach(polyline => {
      polyline.setMap(null);
    });
    polylinesRef.current = [];

    // Create polylines for each round
    const colors = ['#ef4444', '#f59e0b', '#6d6e1a', '#3b82f6', '#8b5cf6', '#ec4899'];
    
    results.forEach((result, index) => {
      // Skip rounds where no guess was made
      if (result.distance === 0 && result.score === 0) return;

      const color = colors[index % colors.length];
      const path = [
        { lat: result.actualLocation.lat, lng: result.actualLocation.lng },
        { lat: result.guessedLocation.lat, lng: result.guessedLocation.lng }
      ];

      const polyline = new google.maps.Polyline({
        path,
        geodesic: true,
        strokeColor: color,
        strokeOpacity: 0.8,
        strokeWeight: 3,
        map,
        zIndex: 1,
      });

      polylinesRef.current.push(polyline);
    });

    // Cleanup function to remove all polylines when component unmounts or results change
    return () => {
      polylinesRef.current.forEach(polyline => {
        polyline.setMap(null);
      });
      polylinesRef.current = [];
    };
  }, [map, results]);

  return null;
};

interface GameResultsProps {
  results: RoundResult[];
  totalRounds: number;
  onPlayAgain: () => void;
  onChangeRules: () => void;
  onMainMenu: () => void;
  regionName?: string;
  regionType?: RegionType;
  mapId: string;
}

const GameResults: React.FC<GameResultsProps> = ({
  results,
  totalRounds,
  onPlayAgain,
  onChangeRules,
  onMainMenu,
  regionName,
  regionType,
  mapId,
}) => {
  const totalScore = results.reduce((sum, r) => sum + r.score, 0);
  const maxPossibleScore = totalRounds * MAX_SCORE_PER_ROUND;
  const percentage = Math.round((totalScore / maxPossibleScore) * 100);
  const averageDistance = results.reduce((sum, r) => sum + r.distance, 0) / results.length;

  // Handle Enter key to play again
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        onPlayAgain();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [onPlayAgain]);

  const getGrade = () => {
    if (percentage >= 90) return { grade: 'S', color: 'text-yellow-400', message: 'Perfect!' };
    if (percentage >= 80) return { grade: 'A', color: 'text-emerald-400', message: 'Excellent!' };
    if (percentage >= 70) return { grade: 'B', color: 'text-cyan-400', message: 'Great job!' };
    if (percentage >= 60) return { grade: 'C', color: 'text-blue-400', message: 'Good effort!' };
    if (percentage >= 50) return { grade: 'D', color: 'text-orange-400', message: 'Keep practicing!' };
    return { grade: 'F', color: 'text-red-400', message: 'Better luck next time!' };
  };

  const { grade, color, message } = getGrade();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0f] via-[#12121a] to-[#0a0a0f] px-4 py-8 overflow-auto">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          {regionName && (
            <p className="text-emerald-400 text-lg font-bold mb-4 mt-2">
              {regionName}
            </p>
          )}
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Game Complete!
          </h1>
          <p className="text-gray-400 text-lg">{message}</p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 mb-8">
          <button
            onClick={onPlayAgain}
            className="w-full py-4 px-6 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-white font-semibold text-lg rounded-xl transition-all duration-200 transform hover:scale-[1.02] hover:shadow-lg hover:shadow-emerald-500/25 active:scale-[0.98] cursor-pointer"
          >
            Play Again
          </button>
          
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={onChangeRules}
              className="py-3 px-6 bg-gray-800/60 hover:bg-gray-700/60 text-white font-semibold rounded-xl transition-all border border-gray-700/50 cursor-pointer"
            >
              Change Rules
            </button>
            <button
              onClick={onMainMenu}
              className="py-3 px-6 bg-gray-800/60 hover:bg-gray-700/60 text-white font-semibold rounded-xl transition-all border border-gray-700/50 cursor-pointer"
            >
              Main Menu
            </button>
          </div>
        </div>

        {/* Score Card */}
        <div className="bg-gray-800/40 rounded-2xl p-8 mb-8 border border-gray-700/50 text-center">
          <div className="mb-6">
            <div className={`text-8xl font-bold ${color} mb-2`}>{grade}</div>
            <div className="text-gray-400">Grade</div>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-900/50 rounded-xl p-4">
              <div className="text-2xl md:text-3xl font-bold text-white">
                {totalScore.toLocaleString()}
              </div>
              <div className="text-gray-400 text-sm">Total Score</div>
            </div>
            <div className="bg-gray-900/50 rounded-xl p-4">
              <div className="text-2xl md:text-3xl font-bold text-emerald-400">
                {percentage}%
              </div>
              <div className="text-gray-400 text-sm">Accuracy</div>
            </div>
            <div className="bg-gray-900/50 rounded-xl p-4">
              <div className="text-2xl md:text-3xl font-bold text-cyan-400">
                {formatDistance(averageDistance)}
              </div>
              <div className="text-gray-400 text-sm">Avg Distance</div>
            </div>
          </div>

          <div className="text-gray-500 text-sm">
            {totalScore.toLocaleString()} / {maxPossibleScore.toLocaleString()} points possible
          </div>
        </div>

        {/* Map Summary */}
        <div className="bg-gray-800/40 rounded-2xl p-6 mb-8 border border-gray-700/50">
          <h2 className="text-xl font-semibold text-white mb-5">Game Summary</h2>
          <div className="relative w-full h-[400px] rounded-lg overflow-hidden">
            <Map
              id={mapId}
              mapId={mapId}
              defaultCenter={{ lat: 0, lng: 0 }}
              defaultZoom={1.5}
              disableDefaultUI={true}
              gestureHandling="greedy"
              clickableIcons={false}
              style={{ width: '100%', height: '100%' }}
            >
              {/* Draw region outline */}
              <RegionMask regionType={regionType} regionName={regionName} mapId={mapId} />
              
              {/* Auto-fit bounds to show all markers */}
              <MapBoundsFitter results={results} />
              
              {/* Draw all polylines */}
              <ResultsPolylines results={results} />
              
              {/* Draw markers for all locations */}
              {results.map((result, index) => {
                const noGuessMade = result.distance === 0 && result.score === 0;
                const roundNumber = String(index + 1);
                
                return (
                  <React.Fragment key={`markers-${index}`}>
                    {/* Actual location marker (green) - always show */}
                    <AdvancedMarker
                      position={{ lat: result.actualLocation.lat, lng: result.actualLocation.lng }}
                      title={`Round ${roundNumber}: Actual Location`}
                      zIndex={10}
                      anchorLeft='-50%'
                      anchorTop='-50%'
                    >
                      <div style={{
                        width: '28px',
                        height: '28px',
                        backgroundColor: '#10b981',
                        borderRadius: '50%',
                        border: '3px solid white',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '14px',
                        fontWeight: 'bold'
                      }}>
                        {roundNumber}
                      </div>
                    </AdvancedMarker>
                    
                    {/* Guessed location marker (red) - only show if guess was made */}
                    {!noGuessMade && (
                      <AdvancedMarker
                        position={{ lat: result.guessedLocation.lat, lng: result.guessedLocation.lng }}
                        title={`Round ${roundNumber}: Your Guess`}
                        zIndex={10}
                        anchorLeft='-50%'
                        anchorTop='-50%'
                      >
                        <div style={{
                          width: '28px',
                          height: '28px',
                          backgroundColor: '#ef4444',
                          borderRadius: '50%',
                          border: '3px solid white',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontSize: '14px',
                          fontWeight: 'bold'
                        }}>
                          {roundNumber}
                        </div>
                      </AdvancedMarker>
                    )}
                  </React.Fragment>
                );
              })}
            </Map>
          </div>
          <div className="mt-4 flex items-center justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
              <span className="text-gray-400">Actual Location</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span className="text-gray-400">Your Guess</span>
            </div>
          </div>
        </div>

        {/* Round Breakdown */}
        <div className="bg-gray-800/40 rounded-2xl p-6 mb-8 border border-gray-700/50">
          <h2 className="text-xl font-semibold text-white mb-5">Round Breakdown</h2>
          <div className="space-y-3">
            {results.map((result, index) => {
              // Check if no guess was made (distance and score both 0)
              const noGuessMade = result.distance === 0 && result.score === 0;
              
              return (
                <div
                  key={index}
                  className="flex items-center justify-between bg-gray-900/50 rounded-lg p-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center text-sm font-semibold text-white">
                      {result.round}
                    </div>
                    <div>
                      <div className="text-white text-sm font-medium mb-0.5">
                        {result.actualLocation.name || `Location ${result.round}`}
                      </div>
                      <div className="text-gray-500 text-xs">
                        {noGuessMade ? 'No guess made' : `${formatDistance(result.distance)} away`}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-emerald-400 font-semibold">
                      {result.score.toLocaleString()}
                    </div>
                    <div className="text-gray-500 text-xs">
                      / {MAX_SCORE_PER_ROUND.toLocaleString()}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameResults;
