export enum EAction {
  SET = 'SET',
  SELECT = 'SELECT',
  DESELECT = 'DESELECT',
  SET_TYPE = 'SET_TYPE'
};

type TState = {
  key: number | null,
  type: 'rect' | 'circle' | 'poly'
};

type TAction = {
  type: EAction,
  payload?: any
};

export const initState: TState = { key: null, type: 'rect' };

export function reducer(state: TState, action: TAction): TState {
  //console.log('ActiveShapeReducer', action);
  switch (action.type) {
    case EAction.SET:
      return {
        ...state,
        ...action.payload
      };
    case EAction.SELECT:
      return {
        ...state,
        key: action.payload
      };
    case EAction.DESELECT:
      return {
        ...state,
        key: null
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