import ErrorBase from 'es6-error';

/* eslint-disable import/prefer-default-export */
export class InvalidCardValueError extends ErrorBase {
  constructor(value: any) {
    super(`Invalid card value: ${value}`);
  }
}
