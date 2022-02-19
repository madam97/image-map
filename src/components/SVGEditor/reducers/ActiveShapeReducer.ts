export enum EAction {
  SET = 'SET',
  CHOOSE = 'CHOOSE',
  SET_TYPE = 'SET_TYPE'
};

type TState = {
  index: number | null,
  type: 'rect' | 'circle' | 'poly'
};

type TAction = {
  type: EAction,
  payload: any
};

export const initState: TState = { index: null, type: 'rect' };

export function reducer(state: TState, action: TAction): TState {
  console.log('ActiveShapeReducer', action);
  switch (action.type) {
    case EAction.SET:
      return {
        ...state,
        ...action.payload
      };
    case EAction.CHOOSE:
      return {
        ...state,
        index: action.payload
      };
    case EAction.SET_TYPE:
      return {
        ...state,
        type: action.payload
      };
    default:
      return state;
  }
};