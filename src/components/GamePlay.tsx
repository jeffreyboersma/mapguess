import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Map, AdvancedMarker, useMap } from '@vis.gl/react-google-maps';
import type { Location, RoundResult, RegionType } from '../types/game';
import { MAX_SCORE_PER_ROUND } from '../types/game';
import { calculateDistance, calculateScore, formatDistance } from '../utils/scoring';
import { getRegionMapView, getRegionBounds } from '../utils/randomLocation';

// RegionMask component to grey out areas outside selected region
const RegionMask: React.FC<{
  regionType?: RegionType;
  regionName?: string;
  mapId: string;
}> = ({ regionType, regionName, mapId }) => {
  const map = useMap(mapId);
  const polygonRef = useRef<google.maps.Polygon | null>(null);

  useEffect(() => {
    if (!map || !regionType || regionType === 'world' || !regionName) return;

    const bounds = getRegionBounds(regionType, regionName);
    if (!bounds) return;

    // Create a rectangle outlining the selected region
    const regionBorder = [
      { lat: bounds.latMax, lng: bounds.lngMin },
      { lat: bounds.latMax, lng: bounds.lngMax },
      { lat: bounds.latMin, lng: bounds.lngMax },
      { lat: bounds.latMin, lng: bounds.lngMin },
      { lat: bounds.latMax, lng: bounds.lngMin },
    ];

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

// Polyline component to draw line between guess and actual location
const PolylineComponent: React.FC<{
  path: google.maps.LatLngLiteral[];
  mapId: string;
}> = ({ path, mapId }) => {
  const map = useMap(mapId);
  const polylineRef = useRef<google.maps.Polyline | null>(null);

  useEffect(() => {
    if (!map || path.length < 2) return;

    // Create polyline
    polylineRef.current = new google.maps.Polyline({
      path,
      geodesic: true,
      strokeColor: '#000000',
      strokeOpacity: 0.9,
      strokeWeight: 3,
      map,
    });

    return () => {
      if (polylineRef.current) {
        polylineRef.current.setMap(null);
        polylineRef.current = null;
      }
    };
  }, [map, path]);

  return null;
};

interface GamePlayProps {
  locations: Location[];
  currentRound: number;
  totalRounds: number;
  timeLimit: number | null;
  onRoundComplete: (result: RoundResult) => void;
  onGameComplete: () => void;
  onBackToMenu?: () => void;
  mapId: string;
  regionType?: RegionType;
  regionName?: string;
}

const GamePlay: React.FC<GamePlayProps> = ({
  locations,
  currentRound,
  totalRounds,
  timeLimit,
  onRoundComplete,
  onGameComplete,
  onBackToMenu,
  mapId,
  regionType = 'world',
  regionName,
}) => {
  const [guessedLocation, setGuessedLocation] = useState<Location | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [roundResult, setRoundResult] = useState<RoundResult | null>(null);
  const [mapExpanded, setMapExpanded] = useState(false);
  const [showBackConfirmation, setShowBackConfirmation] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [isStreetViewLoaded, setIsStreetViewLoaded] = useState(false);
  const streetViewRef = useRef<HTMLDivElement>(null);
  const panoramaRef = useRef<google.maps.StreetViewPanorama | null>(null);
  const mapCollapseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const countdownTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const currentLocation = locations[currentRound - 1];

  const collapseMap = useCallback(() => {
    if (!hasSubmitted) {
      setMapExpanded(false);
    }
  }, [hasSubmitted]);

  // Initialize Street View
  useEffect(() => {
    if (!streetViewRef.current || !currentLocation) return;

    let statusListener: google.maps.MapsEventListener | null = null;

    const initStreetView = () => {
      if (!window.google || !window.google.maps) {
        setTimeout(initStreetView, 100);
        return;
      }

      // Destroy existing panorama completely
      if (panoramaRef.current) {
        try {
          if (statusListener) {
            google.maps.event.removeListener(statusListener);
            statusListener = null;
          }
          panoramaRef.current.setVisible(false);
          panoramaRef.current = null;
        } catch (e) {
          // Ignore errors during cleanup
        }
      }

      // Clear the container
      if (streetViewRef.current) {
        streetViewRef.current.innerHTML = '';
      }

      // Small delay to ensure DOM is cleared
      setTimeout(() => {
        if (!streetViewRef.current) return;

        // Create Street View Service to find nearest panorama
        const streetViewService = new google.maps.StreetViewService();
        const position = { lat: currentLocation.lat, lng: currentLocation.lng };

        streetViewService.getPanorama(
          { location: position, radius: 100, source: google.maps.StreetViewSource.OUTDOOR },
          (data, status) => {
            if (!streetViewRef.current) return;

            if (status === google.maps.StreetViewStatus.OK && data?.location?.latLng) {
              // Create new panorama with verified location
              panoramaRef.current = new google.maps.StreetViewPanorama(streetViewRef.current, {
                position: data.location.latLng,
                pov: { heading: Math.random() * 360, pitch: 0 },
                zoom: 1,
                addressControl: false,
                showRoadLabels: false,
                enableCloseButton: false,
                fullscreenControl: false,
                motionTracking: false,
                motionTrackingControl: false,
              });

              // Listen for status changes to ensure it loads
              statusListener = panoramaRef.current.addListener('status_changed', () => {
                if (panoramaRef.current) {
                  const currentStatus = panoramaRef.current.getStatus();
                  if (currentStatus === google.maps.StreetViewStatus.OK) {
                    // Panorama is loaded and ready
                    panoramaRef.current.setVisible(true);
                    setIsStreetViewLoaded(true);
                  }
                }
              });

              // Add listeners for user interactions to collapse the map
              if (panoramaRef.current) {
                panoramaRef.current.addListener('pov_changed', collapseMap);
                panoramaRef.current.addListener('position_changed', collapseMap);
                panoramaRef.current.addListener('pano_changed', collapseMap);
              }
            } else {
              // Fallback: try original position
              panoramaRef.current = new google.maps.StreetViewPanorama(streetViewRef.current, {
                position: position,
                pov: { heading: Math.random() * 360, pitch: 0 },
                zoom: 1,
                addressControl: false,
                showRoadLabels: false,
                enableCloseButton: false,
                fullscreenControl: false,
                motionTracking: false,
                motionTrackingControl: false,
              });

              statusListener = panoramaRef.current.addListener('status_changed', () => {
                if (panoramaRef.current) {
                  const currentStatus = panoramaRef.current.getStatus();
                  if (currentStatus === google.maps.StreetViewStatus.OK) {
                    panoramaRef.current.setVisible(true);
                    setIsStreetViewLoaded(true);
                  }
                }
              });

              // Add listeners for user interactions to collapse the map
              if (panoramaRef.current) {
                panoramaRef.current.addListener('pov_changed', collapseMap);
                panoramaRef.current.addListener('position_changed', collapseMap);
                panoramaRef.current.addListener('pano_changed', collapseMap);
              }
            }
          }
        );
      }, 50);
    };

    initStreetView();

    // Cleanup
    return () => {
      if (statusListener) {
        google.maps.event.removeListener(statusListener);
      }
      if (panoramaRef.current) {
        try {
          panoramaRef.current.setVisible(false);
          panoramaRef.current = null;
        } catch (e) {
          // Ignore cleanup errors
        }
      }
    };
  }, [currentRound, currentLocation, collapseMap]);

  // Get map instance for resetting zoom
  const map = useMap(mapId);

  // Reset state when round changes
  useEffect(() => {
    setGuessedLocation(null);
    setHasSubmitted(false);
    setRoundResult(null);
    setMapExpanded(false);
    setIsStreetViewLoaded(false);
    setTimeRemaining(timeLimit);
    
    // Clear any pending collapse timer
    if (mapCollapseTimerRef.current) {
      clearTimeout(mapCollapseTimerRef.current);
      mapCollapseTimerRef.current = null;
    }
    
    // Clear any existing countdown timer
    if (countdownTimerRef.current) {
      clearInterval(countdownTimerRef.current);
      countdownTimerRef.current = null;
    }
    
    // Reset map zoom and center based on selected region
    if (map) {
      const regionView = getRegionMapView(regionType, regionName);
      if (regionView) {
        map.setCenter(regionView.center);
        map.setZoom(regionView.zoom);
      } else {
        // Default world view - use zoom 2 instead of 1 to fix fitBounds issues
        map.setCenter({ lat: 20, lng: 0 });
        map.setZoom(1.5);
      }
    }
  }, [currentRound, map, timeLimit, regionType, regionName]);

  // Countdown timer effect
  useEffect(() => {
    // Only start timer if:
    // 1. Time limit is set
    // 2. Street view is loaded
    // 3. Round hasn't been submitted yet
    if (timeLimit !== null && isStreetViewLoaded && !hasSubmitted && timeRemaining !== null) {
      countdownTimerRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev === null || prev <= 0) {
            if (countdownTimerRef.current) {
              clearInterval(countdownTimerRef.current);
              countdownTimerRef.current = null;
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => {
        if (countdownTimerRef.current) {
          clearInterval(countdownTimerRef.current);
          countdownTimerRef.current = null;
        }
      };
    }
  }, [timeLimit, isStreetViewLoaded, hasSubmitted, timeRemaining]);

  const handleMapClick = useCallback((event: google.maps.MapMouseEvent) => {
    if (hasSubmitted || !event.latLng) return;
    
    setGuessedLocation({
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
    });
  }, [hasSubmitted]);

  const handleSubmitGuess = useCallback(() => {
    if (!currentLocation) return;

    let distance: number;
    let score: number;
    let finalGuessedLocation: Location;

    if (guessedLocation) {
      // User made a guess
      distance = calculateDistance(currentLocation, guessedLocation);
      
      // Get region bounds if a region is selected
      const regionBounds = regionType && regionType !== 'world' && regionName
        ? getRegionBounds(regionType, regionName)
        : null;
      
      // Calculate score with region bounds if available
      score = calculateScore(
        distance, 
        guessedLocation, 
        regionBounds || undefined
      );
      finalGuessedLocation = guessedLocation;
    } else {
      // No guess made (time ran out) - give 0 points
      distance = 0;
      score = 0;
      // Use a dummy location (won't be shown on map)
      finalGuessedLocation = currentLocation;
    }

    const result: RoundResult = {
      round: currentRound,
      actualLocation: currentLocation,
      guessedLocation: finalGuessedLocation,
      distance,
      score,
    };

    setRoundResult(result);
    setHasSubmitted(true);
    onRoundComplete(result);

    // Clear countdown timer
    if (countdownTimerRef.current) {
      clearInterval(countdownTimerRef.current);
      countdownTimerRef.current = null;
    }

    // Only auto-zoom if user made a guess
    if (guessedLocation && map) {
      // Use setTimeout to ensure map is ready
      setTimeout(() => {
        if (!map) return;
        
        // Calculate the exact midpoint between the two locations
        const midpoint = {
          lat: (currentLocation.lat + guessedLocation.lat) / 2,
          lng: (currentLocation.lng + guessedLocation.lng) / 2
        };
        
        // Set the center to the midpoint first
        map.setCenter(midpoint);
        
        // Then fit bounds to show both points with uniform padding
        const bounds = new google.maps.LatLngBounds();
        bounds.extend(currentLocation);
        bounds.extend(guessedLocation);
        
        map.fitBounds(bounds);
      }, 150);
    } else if (!guessedLocation && map) {
      // No guess - just center on actual location
      setTimeout(() => {
        if (!map) return;
        map.setCenter(currentLocation);
        map.setZoom(8);
      }, 150);
    }
  }, [currentLocation, guessedLocation, currentRound, onRoundComplete, map, regionType, regionName]);

  // Auto-submit when time runs out
  useEffect(() => {
    if (timeRemaining === 0 && !hasSubmitted) {
      handleSubmitGuess();
    }
  }, [timeRemaining, hasSubmitted, handleSubmitGuess]);

  // Handle Enter key to submit guess or continue to next round
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        if (hasSubmitted) {
          // After submission, Enter goes to next round/results
          handleNextRound();
        } else if (guessedLocation) {
          // Before submission, Enter submits the guess
          handleSubmitGuess();
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [guessedLocation, hasSubmitted, handleSubmitGuess]);

  // Map click listener component
  const MapClickListener: React.FC = () => {
    const map = useMap(mapId);

    useEffect(() => {
      if (!map) return;

      const listener = map.addListener('click', handleMapClick);

      return () => {
        google.maps.event.removeListener(listener);
      };
    }, [map]);

    return null;
  };

  const handleNextRound = () => {
    onGameComplete();
  };

  const handleMapMouseEnter = () => {
    if (hasSubmitted) return;
    
    // Clear any pending collapse timer
    if (mapCollapseTimerRef.current) {
      clearTimeout(mapCollapseTimerRef.current);
      mapCollapseTimerRef.current = null;
    }
    
    setMapExpanded(true);
  };

  const handleMapMouseLeave = () => {
    // Map stays expanded until user interacts with Street View
    // No action needed on mouse leave
  };

  return (
    <div className="h-screen w-screen relative overflow-hidden bg-[#0a0a0f]">
      {/* Street View Container */}
      <div ref={streetViewRef} className="absolute inset-0 w-full h-full z-0" />

      {/* Round Indicator */}
      <div className="absolute top-4 right-4 z-10 bg-black/70 backdrop-blur-sm rounded-lg px-5 py-3 border border-gray-700/50">
        <span className="text-white font-semibold">
          Round {currentRound} / {totalRounds}
        </span>
        {regionName && (
          <div className="text-emerald-400 font-bold text-sm mt-1">
            {regionName}
          </div>
        )}
      </div>

      {/* Countdown Timer */}
      {timeLimit !== null && !hasSubmitted && timeRemaining !== null && (
        <div className={`absolute top-4 left-1/2 -translate-x-1/2 z-10 rounded-lg px-6 py-3 border ${
          timeRemaining <= 10 
            ? 'bg-red-600/90 border-red-400/50 animate-pulse' 
            : 'bg-black/70 backdrop-blur-sm border-gray-700/50'
        }`}>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-white font-bold text-lg">
              {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}
            </span>
          </div>
        </div>
      )}

      {/* Back to Menu Button */}
      {onBackToMenu && (
        <button
          onClick={() => setShowBackConfirmation(true)}
          className="absolute top-4 left-4 z-10 bg-black/70 backdrop-blur-sm hover:bg-black/90 rounded-lg px-5 py-3 border border-gray-700/50 transition-all group cursor-pointer"
        >
          <span className="text-white font-semibold group-hover:text-emerald-400 transition-colors">
            ← Main Menu
          </span>
        </button>
      )}

      {/* Confirmation Dialog */}
      {showBackConfirmation && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="bg-gray-900 rounded-xl border border-gray-700/50 p-8 max-w-md mx-4 shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-4">
              Return to Main Menu?
            </h3>
            <p className="text-gray-300 mb-8 leading-relaxed">
              Your current game progress will be lost. Are you sure you want to return to the main menu?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowBackConfirmation(false)}
                className="flex-1 py-3 px-4 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowBackConfirmation(false);
                  onBackToMenu?.();
                }}
                className="flex-1 py-3 px-4 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white font-semibold rounded-lg transition-all cursor-pointer"
              >
                Leave Game
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mini Map Container */}
      <div
        className={`absolute z-10 transition-all duration-300 ease-in-out ${
          mapExpanded
            ? 'bottom-4 right-4 w-[600px] h-[450px]'
            : 'bottom-4 right-4 w-80 h-48'
        } ${hasSubmitted ? 'w-[600px] h-[450px]' : ''}`}
        onMouseEnter={handleMapMouseEnter}
        onMouseLeave={handleMapMouseLeave}
      >
        <div className="w-full h-full rounded-xl overflow-hidden border-2 border-gray-700/50 shadow-2xl bg-gray-900">
          <Map
            id={mapId}
            mapId={mapId}
            defaultCenter={{ lat: 20, lng: 0 }}
            defaultZoom={1.5}
            gestureHandling="greedy"
            disableDefaultUI={true}
            restriction={{
              latLngBounds: {
                north: 85,
                south: -85,
                west: -180,
                east: 180,
              },
              strictBounds: false,
            }}
            style={{ width: '100%', height: '100%', cursor: hasSubmitted ? 'default' : 'pointer' }}
          >
            <MapClickListener />
            
            {/* Grey out areas outside selected region */}
            <RegionMask regionType={regionType} regionName={regionName} mapId={mapId} />
            
            {/* Draw line between guess and actual location after submission */}
            {hasSubmitted && guessedLocation && currentLocation && (
              <PolylineComponent
                path={[guessedLocation, currentLocation]}
                mapId={mapId}
              />
            )}
            
            {/* User's guess marker - show if user made a guess (hide if time expired with no guess) */}
            {guessedLocation && (
              <AdvancedMarker 
                position={guessedLocation}
                title="Your Guess"
                anchorLeft='-50%'
                anchorTop='-50%'
              >
                <div style={{
                  width: '24px',
                  height: '24px',
                  backgroundColor: '#ef4444',
                  borderRadius: '50%',
                  border: '2px solid white',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <div style={{
                    width: '8px',
                    height: '8px',
                    backgroundColor: 'white',
                    borderRadius: '50%'
                  }} />
                </div>
              </AdvancedMarker>
            )}

            {/* Actual location marker (shown after submit) */}
            {hasSubmitted && currentLocation && (
              <AdvancedMarker 
                position={currentLocation}
                title="Actual Location"
                anchorLeft='-50%'
                anchorTop='-50%'
              >
                <div style={{
                  width: '24px',
                  height: '24px',
                  backgroundColor: '#10b981',
                  borderRadius: '50%',
                  border: '2px solid white',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <div style={{
                    width: '8px',
                    height: '8px',
                    backgroundColor: 'white',
                    borderRadius: '50%'
                  }} />
                </div>
              </AdvancedMarker>
            )}
          </Map>

          {/* Submit Button Overlay */}
          {!hasSubmitted && (
            <div className="absolute bottom-4 left-4 right-4">
              <button
                onClick={handleSubmitGuess}
                disabled={!guessedLocation}
                className={`w-full py-3 px-4 rounded-lg font-semibold transition-all ${
                  guessedLocation
                    ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-white shadow-lg cursor-pointer'
                    : 'bg-gray-700/80 text-gray-400 cursor-not-allowed'
                }`}
              >
                {guessedLocation ? 'Submit Guess' : 'Click map to guess'}
              </button>
            </div>
          )}
        </div>

        {/* Results Panel */}
        {hasSubmitted && roundResult && (
          <div className="absolute -top-52 left-0 right-0 bg-black/90 backdrop-blur-sm rounded-xl p-5 border border-gray-700/50">
            {guessedLocation ? (
              <>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Distance</p>
                    <p className="text-white text-xl font-bold">{formatDistance(roundResult.distance)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-400 text-sm mb-1">Score</p>
                    <p className={`text-xl font-bold ${roundResult.score > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      {roundResult.score > 0 ? '+' : ''}{roundResult.score.toLocaleString()} / {MAX_SCORE_PER_ROUND.toLocaleString()}
                    </p>
                  </div>
                </div>
                
                {currentLocation.name && (
                  <p className="text-gray-300 text-sm mb-4">
                    📍 {currentLocation.name}
                  </p>
                )}
              </>
            ) : (
              <div className="mb-4">
                <p className="text-red-400 text-lg font-bold mb-2">Time's Up!</p>
                <p className="text-gray-300 text-sm mb-2">
                  You didn't make a guess in time.
                </p>
                {currentLocation.name && (
                  <p className="text-gray-300 text-sm mb-2">
                    📍 The location was: {currentLocation.name}
                  </p>
                )}
                <p className="text-gray-400 text-sm">
                  Score: <span className="text-red-400 font-bold">0 / {MAX_SCORE_PER_ROUND.toLocaleString()}</span>
                </p>
              </div>
            )}

            <button
              onClick={handleNextRound}
              className="w-full py-3 px-4 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-white font-semibold rounded-lg transition-all cursor-pointer"
            >
              {currentRound >= totalRounds ? 'See Results' : 'Next Round →'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default GamePlay;
