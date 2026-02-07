import { useState, useEffect, useCallback } from 'react';
import { APIProvider } from '@vis.gl/react-google-maps';
import MainMenu from './components/MainMenu';
import GameSetup from './components/GameSetup';
import GamePlay from './components/GamePlay';
import GameResults from './components/GameResults';
import ApiKeyInput from './components/ApiKeyInput';
import type { GameScreen, RoundResult, Location } from './types/game';
import { getRandomLocations } from './data/locations';
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

  const handleStartGame = (rounds: number) => {
    setTotalRounds(rounds);
    setCurrentRound(1);
    setLocations(getRandomLocations(rounds));
    setResults([]);
    setScreen('game');
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

  const handlePlayAgain = () => {
    setCurrentRound(1);
    setLocations(getRandomLocations(totalRounds));
    setResults([]);
    setScreen('game');
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
          <GameSetup 
            onStartGame={handleStartGame} 
            onBack={handleBack}
          />
        )}
        
        {screen === 'game' && locations.length > 0 && (
          <GamePlay
            key={currentRound}
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
