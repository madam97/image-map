import { IObject } from '../../../interfaces/MainInterfaces';

export enum EAction {
  ADD = 'ADD',
  CHANGE = 'CHANGE',
  REMOVE = 'REMOVE'
};

type TState = IObject[];

type TAction = {
  type: EAction,
  index?: number,
  payload?: any
};

export function reducer(state: TState, action: TAction): TState {
  console.log('ShapesReducer', action);
  switch(action.type) {
    case EAction.ADD:
      return [...state, action.payload];
    case EAction.CHANGE:
      if (action.index !== undefined) {
        state[action.index] = action.payload;
      }
      return state;
    case EAction.REMOVE:
      return state.filter((shape, index) => index !== action.index);
    default:
      return state;
  }
};