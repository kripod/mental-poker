// @flow

import BigInt from 'bn.js';

export type BetTypeValue = 0 | 1 | 2 | 3;
export type GameStateValue = 0 | 1 | 2 | 3 | 4 | 5;

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
  type: string,
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
  state: string,
  players: PlayerJSON[],
  actingPlayerIndex: number,
  points?: PointJSON[],
};
