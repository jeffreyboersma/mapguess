import { useState, useEffect, useCallback } from 'react';
import { APIProvider } from '@vis.gl/react-google-maps';
import MainMenu from './components/MainMenu';
import GameSetup from './components/GameSetup';
import GamePlay from './components/GamePlay';
import GameResults from './components/GameResults';
import ApiKeyInput from './components/ApiKeyInput';
import type { GameScreen, RoundResult, Location } from './types/game';
import { generateRandomLocations } from './utils/randomLocation';
import './index.css';

const API_KEY_STORAGE_KEY = 'mapguess_google_api_key';
const GOOGLE_MAP_ID = '8ca3f3544775b7836936abfc'; // Replace with your Google Cloud Map ID

function App() {
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [screen, setScreen] = useState<GameScreen>('menu');
  const [totalRounds, setTotalRounds] = useState(10);
  const [currentRound, setCurrentRound] = useState(1);
  const [locations, setLocations] = useState<Location[]>([]);
  const [results, setResults] = useState<RoundResult[]>([]);
  const [isLoadingLocations, setIsLoadingLocations] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  // Load API key from localStorage on mount
  useEffect(() => {
    const storedKey = localStorage.getItem(API_KEY_STORAGE_KEY);
    if (storedKey) {
      setApiKey(storedKey);
    }
  }, []);

  const handleApiKeySubmit = (key: string) => {
    localStorage.setItem(API_KEY_STORAGE_KEY, key);
    setApiKey(key);
  };

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

  const handleGameComplete = () => {
    setScreen('results');
  };

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

  // Show API key input if no key is set
  if (!apiKey) {
    return <ApiKeyInput onApiKeySubmit={handleApiKeySubmit} />;
  }

  return (
    <APIProvider apiKey={apiKey} libraries={['places', 'marker']}>
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
