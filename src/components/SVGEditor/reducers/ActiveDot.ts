export enum EAction {
  SELECT = 'SELECT',
  DESELECT = 'DESELECT',
  MOVE = 'MOVE'
};

type TState = {
  key: number | null,
  moved: boolean
};

type TAction = {
  type: EAction,
  payload?: {
    key?: number | null
  }
};

export const initState: TState = { key: null, moved: false };

export function reducer(state: TState, action: TAction): TState {
  //console.log('ActiveDotReducer', action);

  if (!action.payload) {
    action.payload = {};
  }
  
  switch(action.type) {
    case EAction.DESELECT:
      return initState;

    case EAction.SELECT:
      return { ...initState, key: action.payload.key !== undefined ? action.payload.key : null};

    case EAction.MOVE:
      return { ...state, moved: true };
  }
}