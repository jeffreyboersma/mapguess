import React, { useState } from 'react';

interface GameSetupProps {
  onStartGame: (rounds: number) => void;
  onBack: () => void;
  error?: string | null;
}

const GameSetup: React.FC<GameSetupProps> = ({ onStartGame, onBack, error }) => {
  const [rounds, setRounds] = useState(10);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState({ current: 0, total: 0 });

  const roundOptions = [3, 5, 10, 15, 20];

  const handleStartGame = () => {
    setIsGenerating(true);
    setGenerationProgress({ current: 0, total: rounds });
    onStartGame(rounds);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#0a0a0f] via-[#12121a] to-[#0a0a0f] px-4">
      {/* Back Button */}
      <button
        onClick={onBack}
        disabled={isGenerating}
        className="absolute top-6 left-6 text-gray-400 hover:text-white flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-800/60 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back
      </button>

      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-12">
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
                className={`py-3 px-4 rounded-lg font-semibold text-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
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
          className="w-full py-4 px-6 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-white font-semibold text-lg rounded-xl transition-all duration-200 transform hover:scale-[1.02] hover:shadow-lg hover:shadow-emerald-500/25 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {isGenerating ? 'Generating Locations...' : 'Start Game'}
        </button>

        {/* Points Info */}
        <p className="text-center text-gray-500 text-sm mt-4">
          Maximum possible score: {(rounds * 5000).toLocaleString()} points
        </p>
      </div>
    </div>
  );
};

export default GameSetup;
