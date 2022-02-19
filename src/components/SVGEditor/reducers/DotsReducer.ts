import { MapArray } from '../../../functions';
import { TCoord } from '../shapes/Dot';

export enum EAction {
  SET = 'SET',
  ADD = 'ADD',
  CHANGE = 'CHANGE',
  REMOVE = 'REMOVE',
  EMPTY = 'EMPTY'
};

type TState = MapArray<TCoord>;

type TAction = {
  type: EAction,
  key?: number,
  payload?: any
};

export const initState: MapArray<TCoord> = new MapArray();

export function reducer(state: TState, action: TAction): TState {
  //console.log('DotReducer', action);

  const newState = new MapArray(action.type === EAction.SET ? initState : state);

  switch(action.type) {
    case EAction.SET:
      newState.fill(action.payload);
      return newState;
    case EAction.EMPTY:
      return new MapArray(initState);
    case EAction.ADD:
      newState.setNext(action.payload);
      return newState;
    case EAction.CHANGE:
      if (action.key !== undefined) {
        newState.set(action.key, action.payload);
      }
      return newState;
    case EAction.REMOVE:
      if (action.key !== undefined) {
        newState.delete(action.key);
      }
      return newState;
    default:
      return state;
  }
};