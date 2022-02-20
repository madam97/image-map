export enum EAction {
  SET = 'SET',
  SELECT = 'SELECT',
  DESELECT = 'DESELECT'
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

  const getKey = (key: any): number | null => {
    return typeof key === 'number' && key >= 0 ? key : null;
  }

  switch (action.type) {
    case EAction.SET:
      action.payload.key = getKey(action.payload.key);

      return {
        ...state,
        ...action.payload
      };
    case EAction.SELECT:
      return {
        ...state,
        key: getKey(action.payload)
      };
    case EAction.DESELECT:
      return {
        ...state,
        key: null
      };
    default:
      return state;
  }
};