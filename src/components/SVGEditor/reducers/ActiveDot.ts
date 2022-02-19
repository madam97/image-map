export enum EAction {
  DESELECT = 'DESELECT',
  SELECT = 'SELECT',
  MOVE = 'MOVE'
};

type TState = {
  key: number | null,
  moved: boolean
};

type TAction = {
  type: EAction,
  payload?: any
};

export const initState: TState = { key: null, moved: false };

export function reducer(state: TState, action: TAction): TState {
  //console.log('ActiveDotReducer', action);
  switch(action.type) {
    case EAction.DESELECT:
      return initState;
    case EAction.SELECT:
      return { ...initState, key: action.payload };
    case EAction.MOVE:
      return { ...state, moved: true };
  }
}