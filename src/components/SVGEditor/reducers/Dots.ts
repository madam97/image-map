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
  payload?: {
    key?: number,
    dot?: TCoord,
    dots?: TCoord[]
  }
};

export const initState: TState = new MapArray();

export function reducer(state: TState, action: TAction): TState {
  //console.log('DotReducer', action);

  if (!action.payload) {
    action.payload = {};
  }

  const newState = new MapArray(action.type === EAction.SET ? initState : state);

  switch(action.type) {
    case EAction.SET:
      if (action.payload.dots) {
        newState.fill(action.payload.dots);
      }
      return newState;

    case EAction.EMPTY:
      return new MapArray(initState);

    case EAction.ADD:
      if (action.payload.dot) {
        newState.setNext(action.payload.dot);
      }
      return newState;

    case EAction.CHANGE:
      if (action.payload.key !== undefined && action.payload.dot) {
        newState.set(action.payload.key, action.payload.dot);
      }
      return newState;

    case EAction.REMOVE:
      if (action.payload.key !== undefined) {
        newState.delete(action.payload.key);
      }
      return newState;
      
    default:
      return state;
  }
};