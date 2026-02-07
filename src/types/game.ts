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

export interface GameState {
  currentRound: number;
  totalRounds: number;
  locations: Location[];
  results: RoundResult[];
  isComplete: boolean;
}

export type GameScreen = 'menu' | 'setup' | 'game' | 'results';

export const MAX_SCORE_PER_ROUND = 5000;
export const SCORE_DECAY_RATE = 0.0005; // Score decreases with distance
