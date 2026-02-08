export interface Location {
  lat: number;
  lng: number;
  name?: string;
}

export interface RoundResult {
  round: number;
  actualLocation: Location;
  guessedLocation: Location;
  distance: number;
  score: number;
}

export type RegionType = 'world' | 'continent' | 'country';

export interface Region {
  type: RegionType;
  name: string;
}

export interface GameState {
  currentRound: number;
  totalRounds: number;
  locations: Location[];
  results: RoundResult[];
  isComplete: boolean;
  timeLimit: number | null; // Time limit in seconds per round, null for no limit
  region?: Region; // Selected region for the game
}

export type GameScreen = 'menu' | 'setup' | 'game' | 'results';

export const MAX_SCORE_PER_ROUND = 5000;
export const SCORE_DECAY_RATE = 0.0005; // Score decreases with distance
