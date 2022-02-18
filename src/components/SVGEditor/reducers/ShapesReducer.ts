import { IObject } from '../../../interfaces/MainInterfaces';

export enum EAction {
  ADD_SHAPE = 'ADD_SHAPE',
  CHANGE_SHAPE = 'CHANGE_SHAPE',
  REMOVE_SHAPE = 'REMOVE_SHAPE'
};

type TState = IObject[];

type TAction = {
  type: EAction,
  index?: number,
  payload?: any
};

export function reducer(state: TState, action: TAction): TState {
  console.log(action);
  switch(action.type) {
    case EAction.ADD_SHAPE:
      return [...state, action.payload];
      break;
    case EAction.CHANGE_SHAPE:
      if (action.index !== undefined) {
        state[action.index] = action.payload;
      }
      return state;
      break;
    case EAction.REMOVE_SHAPE:
      return state.filter((shape, index) => index !== action.index);
      break;
    default:
      return state;
      break;
  }
};