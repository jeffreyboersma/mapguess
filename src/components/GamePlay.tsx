import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Map, AdvancedMarker, useMap } from '@vis.gl/react-google-maps';
import type { Location, RoundResult } from '../types/game';
import { MAX_SCORE_PER_ROUND } from '../types/game';
import { calculateDistance, calculateScore, formatDistance } from '../utils/scoring';

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
  onRoundComplete: (result: RoundResult) => void;
  onGameComplete: () => void;
  onBackToMenu?: () => void;
  mapId: string;
}

const GamePlay: React.FC<GamePlayProps> = ({
  locations,
  currentRound,
  totalRounds,
  onRoundComplete,
  onGameComplete,
  onBackToMenu,
  mapId,
}) => {
  const [guessedLocation, setGuessedLocation] = useState<Location | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [roundResult, setRoundResult] = useState<RoundResult | null>(null);
  const [mapExpanded, setMapExpanded] = useState(false);
  const [showBackConfirmation, setShowBackConfirmation] = useState(false);
  const streetViewRef = useRef<HTMLDivElement>(null);
  const panoramaRef = useRef<google.maps.StreetViewPanorama | null>(null);

  const currentLocation = locations[currentRound - 1];

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
                  }
                }
              });
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
                  }
                }
              });
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
  }, [currentRound, currentLocation]);

  // Get map instance for resetting zoom
  const map = useMap(mapId);

  // Reset state when round changes
  useEffect(() => {
    setGuessedLocation(null);
    setHasSubmitted(false);
    setRoundResult(null);
    setMapExpanded(false);
    
    // Reset map zoom and center
    if (map) {
      map.setCenter({ lat: 20, lng: 0 });
      map.setZoom(1);
    }
  }, [currentRound, map]);

  const handleMapClick = useCallback((event: google.maps.MapMouseEvent) => {
    if (hasSubmitted || !event.latLng) return;
    
    setGuessedLocation({
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
    });
  }, [hasSubmitted]);

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

  const handleSubmitGuess = () => {
    if (!guessedLocation || !currentLocation) return;

    const distance = calculateDistance(currentLocation, guessedLocation);
    const score = calculateScore(distance);

    const result: RoundResult = {
      round: currentRound,
      actualLocation: currentLocation,
      guessedLocation,
      distance,
      score,
    };

    setRoundResult(result);
    setHasSubmitted(true);
    onRoundComplete(result);

    // Auto-zoom to show both locations
    if (map) {
      const bounds = new google.maps.LatLngBounds();
      bounds.extend(currentLocation);
      bounds.extend(guessedLocation);
      map.fitBounds(bounds, 80);
    }
  };

  const handleNextRound = () => {
    onGameComplete();
  };

  return (
    <div className="h-screen w-screen relative overflow-hidden bg-[#0a0a0f]">
      {/* Street View Container */}
      <div ref={streetViewRef} className="absolute inset-0 w-full h-full z-0" />

      {/* Round Indicator */}
      <div className="absolute top-4 left-4 z-10 bg-black/70 backdrop-blur-sm rounded-lg px-4 py-2 border border-gray-700/50">
        <span className="text-white font-semibold">
          Round {currentRound} / {totalRounds}
        </span>
      </div>

      {/* Back to Menu Button */}
      {onBackToMenu && (
        <button
          onClick={() => setShowBackConfirmation(true)}
          className="absolute top-4 right-4 z-10 bg-black/70 backdrop-blur-sm hover:bg-black/90 rounded-lg px-4 py-2 border border-gray-700/50 transition-all group"
        >
          <span className="text-white font-semibold group-hover:text-emerald-400 transition-colors">
            ← Main Menu
          </span>
        </button>
      )}

      {/* Confirmation Dialog */}
      {showBackConfirmation && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="bg-gray-900 rounded-xl border border-gray-700/50 p-6 max-w-md mx-4 shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-3">
              Return to Main Menu?
            </h3>
            <p className="text-gray-300 mb-6">
              Your current game progress will be lost. Are you sure you want to return to the main menu?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowBackConfirmation(false)}
                className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowBackConfirmation(false);
                  onBackToMenu?.();
                }}
                className="flex-1 py-3 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white font-semibold rounded-lg transition-all"
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
        onMouseEnter={() => !hasSubmitted && setMapExpanded(true)}
        onMouseLeave={() => !hasSubmitted && setMapExpanded(false)}
      >
        <div className="w-full h-full rounded-xl overflow-hidden border-2 border-gray-700/50 shadow-2xl bg-gray-900">
          <Map
            id={mapId}
            mapId={mapId}
            defaultCenter={{ lat: 20, lng: 0 }}
            defaultZoom={1}
            gestureHandling="greedy"
            disableDefaultUI={true}
            style={{ width: '100%', height: '100%' }}
          >
            <MapClickListener />
            
            {/* Draw line between guess and actual location after submission */}
            {hasSubmitted && guessedLocation && currentLocation && (
              <PolylineComponent
                path={[guessedLocation, currentLocation]}
                mapId={mapId}
              />
            )}
            
            {/* User's guess marker */}
            {guessedLocation && (
              <AdvancedMarker 
                position={guessedLocation}
                title="Your Guess"
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
            <div className="absolute bottom-3 left-3 right-3">
              <button
                onClick={handleSubmitGuess}
                disabled={!guessedLocation}
                className={`w-full py-3 rounded-lg font-semibold transition-all ${
                  guessedLocation
                    ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-white shadow-lg'
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
          <div className="absolute -top-32 left-0 right-0 bg-black/90 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-gray-400 text-sm">Distance</p>
                <p className="text-white text-xl font-bold">{formatDistance(roundResult.distance)}</p>
              </div>
              <div className="text-right">
                <p className="text-gray-400 text-sm">Score</p>
                <p className="text-emerald-400 text-xl font-bold">
                  +{roundResult.score.toLocaleString()} / {MAX_SCORE_PER_ROUND.toLocaleString()}
                </p>
              </div>
            </div>
            
            {currentLocation.name && (
              <p className="text-gray-300 text-sm mb-3">
                📍 {currentLocation.name}
              </p>
            )}

            <button
              onClick={handleNextRound}
              className="w-full py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-white font-semibold rounded-lg transition-all"
            >
              {currentRound >= totalRounds ? 'See Results' : 'Next Round →'}
            </button>
          </div>
        )}
      </div>

      {/* Hint text */}
      {!hasSubmitted && !mapExpanded && (
        <div className="absolute bottom-4 left-4 z-10 bg-black/70 backdrop-blur-sm rounded-lg px-4 py-2 border border-gray-700/50">
          <span className="text-gray-300 text-sm">
            Hover over the map to expand • Click to place your guess
          </span>
        </div>
      )}
    </div>
  );
};

export default GamePlay;
