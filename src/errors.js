/* eslint-disable import/prefer-default-export */
export class InvalidCardValueError extends Error {
  constructor(value: any) {
    super(`Invalid card value: ${value}`);
  }
}
