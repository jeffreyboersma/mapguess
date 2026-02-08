import { useState, useCallback } from 'react';
import { APIProvider } from '@vis.gl/react-google-maps';
import MainMenu from './components/MainMenu';
import GameSetup from './components/GameSetup';
import GamePlay from './components/GamePlay';
import GameResults from './components/GameResults';
import type { GameScreen, RoundResult, Location } from './types/game';
import { generateRandomLocations } from './utils/randomLocation';
import './index.css';

// Use environment variables - required for the app to work
const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const GOOGLE_MAP_ID = import.meta.env.VITE_GOOGLE_MAP_ID || '8ca3f3544775b7836936abfc';

if (!GOOGLE_MAPS_API_KEY) {
  console.error('VITE_GOOGLE_MAPS_API_KEY is not set. Please add it to your .env.local file.');
}

function App() {
  const [screen, setScreen] = useState<GameScreen>('menu');
  const [totalRounds, setTotalRounds] = useState(10);
  const [currentRound, setCurrentRound] = useState(1);
  const [locations, setLocations] = useState<Location[]>([]);
  const [results, setResults] = useState<RoundResult[]>([]);
  const [isLoadingLocations, setIsLoadingLocations] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  const handleSelectSinglePlayer = () => {
    setScreen('setup');
  };

  const handleStartGame = async (rounds: number) => {
    setTotalRounds(rounds);
    setCurrentRound(1);
    setResults([]);
    setIsLoadingLocations(true);
    setLocationError(null);

    try {
      const generatedLocations = await generateRandomLocations(rounds);
      setLocations(generatedLocations);
      setScreen('game');
    } catch (error) {
      console.error('Failed to generate locations:', error);
      setLocationError('Failed to generate random locations. Please try again.');
      setScreen('setup');
    } finally {
      setIsLoadingLocations(false);
    }
  };

  const handleRoundComplete = useCallback((result: RoundResult) => {
    setResults(prev => [...prev, result]);
  }, []);

  const handleNextRound = useCallback(() => {
    if (currentRound >= totalRounds) {
      setScreen('results');
    } else {
      setCurrentRound(prev => prev + 1);
    }
  }, [currentRound, totalRounds]);

  const handlePlayAgain = async () => {
    setCurrentRound(1);
    setResults([]);
    setIsLoadingLocations(true);
    setLocationError(null);
    setScreen('setup'); // Show setup screen while generating

    try {
      const generatedLocations = await generateRandomLocations(totalRounds);
      setLocations(generatedLocations);
      setScreen('game');
    } catch (error) {
      console.error('Failed to generate locations:', error);
      setLocationError('Failed to generate random locations. Please try again.');
    } finally {
      setIsLoadingLocations(false);
    }
  };

  const handleChangeRules = () => {
    setScreen('setup');
  };

  const handleMainMenu = () => {
    setScreen('menu');
  };

  const handleBack = () => {
    setScreen('menu');
  };

  // Show error if API key is not configured
  if (!GOOGLE_MAPS_API_KEY) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#0a0a0f] via-[#12121a] to-[#0a0a0f] px-4">
        <div className="w-full max-w-md text-center">
          <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-red-400 to-orange-500 flex items-center justify-center shadow-lg shadow-red-500/20 mb-6">
            <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white mb-3">Configuration Error</h1>
          <p className="text-gray-400 mb-6">
            Google Maps API key not found. Please add it to your <code className="text-emerald-400">.env.local</code> file.
          </p>
          <div className="bg-gray-800/40 rounded-xl p-6 border border-gray-700/50 text-left">
            <h3 className="text-white font-semibold mb-3">Required environment variables:</h3>
            <pre className="text-gray-300 text-sm">
              <code>VITE_GOOGLE_MAPS_API_KEY=your_key_here{'\n'}VITE_GOOGLE_MAP_ID=your_map_id_here</code>
            </pre>
          </div>
        </div>
      </div>
    );
  }

  return (
    <APIProvider apiKey={GOOGLE_MAPS_API_KEY} libraries={['places', 'marker']}>
      <div className="min-h-screen bg-[#0a0a0f]">
        {screen === 'menu' && (
          <MainMenu onSelectSinglePlayer={handleSelectSinglePlayer} />
        )}
        
        {screen === 'setup' && (
          <>
            {isLoadingLocations ? (
              <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#0a0a0f] via-[#12121a] to-[#0a0a0f] px-4">
                <div className="text-center">
                  <div className="mb-6">
                    <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2">
                    Generating Random Locations
                  </h2>
                  <p className="text-gray-400">
                    Finding places with Street View coverage...
                  </p>
                </div>
              </div>
            ) : (
              <GameSetup 
                onStartGame={handleStartGame} 
                onBack={handleBack}
                error={locationError}
              />
            )}
          </>
        )}
        
        {screen === 'game' && locations.length > 0 && (
          <GamePlay
            locations={locations}
            currentRound={currentRound}
            totalRounds={totalRounds}
            onRoundComplete={(result) => {
              handleRoundComplete(result);
            }}
            onGameComplete={handleNextRound}
            onBackToMenu={handleMainMenu}
            mapId={GOOGLE_MAP_ID}
          />
        )}
        
        {screen === 'results' && (
          <GameResults
            results={results}
            totalRounds={totalRounds}
            onPlayAgain={handlePlayAgain}
            onChangeRules={handleChangeRules}
            onMainMenu={handleMainMenu}
          />
        )}
      </div>
    </APIProvider>
  );
}

export default App;
