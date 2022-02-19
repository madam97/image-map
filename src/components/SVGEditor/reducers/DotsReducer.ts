type TCoord = {
  x: number,
  y: number
};

export enum EAction {
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
    case EAction.ADD:
      return [...state, action.payload];
      break;
    case EAction.CHANGE:
      if (action.index !== undefined) {
        state[action.index] = action.payload;
      }
      return state;
      break;
    case EAction.REMOVE:
      return state.filter((dot, index) => index !== action.index);
      break;
    case EAction.EMPTY:
      return [];
      break;
    default:
      return state;
      break;
  }
};