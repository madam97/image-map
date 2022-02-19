import { TCoord } from '../shapes/Dot';

export enum EAction {
  SET = 'SET',
  ADD = 'ADD',
  CHANGE = 'CHANGE',
  REMOVE = 'REMOVE',
  EMPTY = 'EMPTY'
};

type TState = TCoord[];

type TAction = {
  type: EAction,
  index?: number,
  payload?: any
};

export function reducer(state: TState, action: TAction): TState {
  console.log('DotReducer', action);
  switch(action.type) {
    case EAction.SET:
      return action.payload;
    case EAction.EMPTY:
      return [];
    case EAction.ADD:
      return [...state, action.payload];
    case EAction.CHANGE:
      const newState = state.slice();
      if (action.index !== undefined) {
        newState[action.index] = action.payload;
      }
      return newState;
    case EAction.REMOVE:
      return state.filter((dot, index) => index !== action.index);
    default:
      return state;
  }
};