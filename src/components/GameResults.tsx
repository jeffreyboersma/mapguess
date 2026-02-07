import React from 'react';
import type { RoundResult } from '../types/game';
import { MAX_SCORE_PER_ROUND } from '../types/game';
import { formatDistance } from '../utils/scoring';

interface GameResultsProps {
  results: RoundResult[];
  totalRounds: number;
  onPlayAgain: () => void;
  onChangeRules: () => void;
  onMainMenu: () => void;
}

const GameResults: React.FC<GameResultsProps> = ({
  results,
  totalRounds,
  onPlayAgain,
  onChangeRules,
  onMainMenu,
}) => {
  const totalScore = results.reduce((sum, r) => sum + r.score, 0);
  const maxPossibleScore = totalRounds * MAX_SCORE_PER_ROUND;
  const percentage = Math.round((totalScore / maxPossibleScore) * 100);
  const averageDistance = results.reduce((sum, r) => sum + r.distance, 0) / results.length;

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
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
            Game Complete!
          </h1>
          <p className="text-gray-400 text-lg">{message}</p>
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

        {/* Round Breakdown */}
        <div className="bg-gray-800/40 rounded-2xl p-6 mb-8 border border-gray-700/50">
          <h2 className="text-xl font-semibold text-white mb-5">Round Breakdown</h2>
          <div className="space-y-3">
            {results.map((result, index) => (
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
                      {formatDistance(result.distance)} away
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
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={onPlayAgain}
            className="w-full py-4 px-6 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-white font-semibold text-lg rounded-xl transition-all duration-200 transform hover:scale-[1.02] hover:shadow-lg hover:shadow-emerald-500/25 active:scale-[0.98]"
          >
            Play Again
          </button>
          
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={onChangeRules}
              className="py-3 px-6 bg-gray-800/60 hover:bg-gray-700/60 text-white font-semibold rounded-xl transition-all border border-gray-700/50"
            >
              Change Rules
            </button>
            <button
              onClick={onMainMenu}
              className="py-3 px-6 bg-gray-800/60 hover:bg-gray-700/60 text-white font-semibold rounded-xl transition-all border border-gray-700/50"
            >
              Main Menu
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameResults;
