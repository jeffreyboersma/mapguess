import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Map, AdvancedMarker, useMap } from '@vis.gl/react-google-maps';
import type { Location, RoundResult } from '../types/game';
import { MAX_SCORE_PER_ROUND } from '../types/game';
import { calculateDistance, calculateScore, formatDistance } from '../utils/scoring';

interface GamePlayProps {
  locations: Location[];
  currentRound: number;
  totalRounds: number;
  onRoundComplete: (result: RoundResult) => void;
  onGameComplete: () => void;
  mapId: string;
}

const GamePlay: React.FC<GamePlayProps> = ({
  locations,
  currentRound,
  totalRounds,
  onRoundComplete,
  onGameComplete,
  mapId,
}) => {
  const [guessedLocation, setGuessedLocation] = useState<Location | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [roundResult, setRoundResult] = useState<RoundResult | null>(null);
  const [mapExpanded, setMapExpanded] = useState(false);
  const streetViewRef = useRef<HTMLDivElement>(null);
  const panoramaRef = useRef<google.maps.StreetViewPanorama | null>(null);

  const currentLocation = locations[currentRound - 1];

  // Initialize Street View
  useEffect(() => {
    if (!streetViewRef.current || !currentLocation) return;

    const initStreetView = () => {
      if (!window.google || !window.google.maps) {
        setTimeout(initStreetView, 100);
        return;
      }

      panoramaRef.current = new google.maps.StreetViewPanorama(streetViewRef.current!, {
        position: { lat: currentLocation.lat, lng: currentLocation.lng },
        pov: { heading: Math.random() * 360, pitch: 0 },
        zoom: 1,
        addressControl: false,
        showRoadLabels: false,
        enableCloseButton: false,
        fullscreenControl: false,
        motionTracking: false,
        motionTrackingControl: false,
      });
    };

    initStreetView();
  }, [currentLocation]);

  // Reset state when round changes
  useEffect(() => {
    setGuessedLocation(null);
    setHasSubmitted(false);
    setRoundResult(null);
    setMapExpanded(false);
  }, [currentRound]);

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
