export enum EAction {
  INIT = 'INIT',
  CHOOSE = 'CHOOSE',
  MOVE = 'MOVE'
};

type TState = {
  index: number | null,
  moved: boolean
};

type TAction = {
  type: EAction,
  payload?: any
};

export const initState: TState = { index: null, moved: false };

export function reducer(state: TState, action: TAction): TState {
  console.log(action);
  switch(action.type) {
    case EAction.INIT:
      return initState;
      break;
    case EAction.CHOOSE:
      return { ...initState, index: action.payload };
      break;
    case EAction.MOVE:
      return { ...state, moved: true };
      break;
  }
}