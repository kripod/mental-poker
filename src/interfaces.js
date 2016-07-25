import BigInt from 'bn.js';

export type BetTypeValue = 1 | 2 | 3 | 4;
export type GameStateValue = 0 | 10 | 20 | 30 | 40 | 50;

export type Hand = {
  cards: [],
};

export type Point = {
  x: BigInt,
  y: BigInt,
};

export type PointJSON = {
  x: string,
  y: string,
};

export type BetJSON = {
  type: number,
  amount?: number,
};

export type DeckJSON = {
  points: PointJSON[],
};

export type PlayerJSON = {
  publicKey?: string,
  points?: PointJSON[],
  secretHashes?: string[],
}

export type GameJSON = {
  state: number,
  players: PlayerJSON[],
  actingPlayerIndex: number,
  points?: PointJSON[],
};
