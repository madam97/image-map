export enum EAction {
  CHOOSE = 'CHOOSE',
  SET_TYPE = 'SET_TYPE'
};

type TState = {
  index: number | null,
  type: 'rect' | 'circle'
};

type TAction = {
  type: EAction,
  payload: any
};

export const initState: TState = { index: null, type: 'rect' };

export function reducer(state: TState, action: TAction): TState {
  console.log(action);
  switch (action.type) {
    case EAction.CHOOSE:
      return {
        ...state,
        index: action.payload
      };
      break;
    case EAction.SET_TYPE:
      return {
        ...state,
        type: action.payload
      };
      break;
    default:
      return state;
      break;
  }
};