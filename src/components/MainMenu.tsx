import React from 'react';

interface MainMenuProps {
  onSelectSinglePlayer: () => void;
}

const MainMenu: React.FC<MainMenuProps> = ({ onSelectSinglePlayer }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#0a0a0f] via-[#12121a] to-[#0a0a0f] px-4">
      {/* Logo and Title */}
      <div className="text-center mb-16">
        <div className="mb-6">
          <div className="w-24 h-24 mx-auto rounded-2xl bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <svg className="w-14 h-14 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
        </div>
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-3 tracking-tight">
          Map Guess
        </h1>
        <p className="text-gray-400 text-lg md:text-xl">
          Explore the world. Test your geography.
        </p>
      </div>

      {/* Game Mode Buttons */}
      <div className="w-full max-w-sm space-y-4">
        <button
          onClick={onSelectSinglePlayer}
          className="w-full py-4 px-6 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-white font-semibold text-lg rounded-xl transition-all duration-200 transform hover:scale-[1.02] hover:shadow-lg hover:shadow-emerald-500/25 active:scale-[0.98]"
        >
          <div className="flex items-center justify-center gap-3">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Single Player
          </div>
        </button>

        <button
          disabled
          className="w-full py-4 px-6 bg-gray-800/50 text-gray-500 font-semibold text-lg rounded-xl cursor-not-allowed border border-gray-700/50"
        >
          <div className="flex items-center justify-center gap-3">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Multiplayer
            <span className="text-xs bg-gray-700 px-2 py-0.5 rounded-full">Coming Soon</span>
          </div>
        </button>
      </div>

      {/* Footer */}
      <div className="absolute bottom-6 text-gray-600 text-sm">
        Powered by Google Street View
      </div>
    </div>
  );
};

export default MainMenu;
