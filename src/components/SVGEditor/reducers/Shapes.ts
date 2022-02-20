import { MapArray } from '../../../functions';
import { IObject } from '../../../interfaces/MainInterfaces';

export enum EAction {
  ADD = 'ADD',
  CHANGE = 'CHANGE',
  REMOVE = 'REMOVE'
};

type TState = MapArray<IObject>;

type TAction = {
  type: EAction,
  payload: {
    key?: number,
    shape?: IObject
  }
};

export const initState: TState = new MapArray();

export function reducer(state: TState, action: TAction): TState {
  //console.log('ShapesReducer', action);
  
  const newState = new MapArray(state);

  switch(action.type) {
    case EAction.ADD:
      if (action.payload.shape) {
        newState.setNext(action.payload.shape);
      }
      return newState;

    case EAction.CHANGE:
      if (action.payload.key !== undefined && action.payload.shape) {
        newState.set(action.payload.key, action.payload.shape);
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