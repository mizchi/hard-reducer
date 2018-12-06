// Actions

export type Action<Payload> = {
  type: string;
  payload: Payload;
};

// Action Creator

export type ActionCreator<Input, Payload = Input> = {
  (input: Input): Action<Payload>;
  type: string;
};

type AsyncCallable<Input, Payload> = Input extends void
  ? () => Promise<Payload>
  : (input: Input) => Promise<Payload>;

export type AsyncActionCreator<Input, Payload> = {
  started: ActionCreator<Input, void>;
  resolved: ActionCreator<Input, Payload>;
  rejected: ActionCreator<Input, Error>;
} & AsyncCallable<Input, Payload>;

export type ThunkActionCreator<Input, A = any, R = any> = {
  started: ActionCreator<Input, void>;
  resolved: ActionCreator<Input, R>;
  rejected: ActionCreator<Input, Error>;
} & AsyncCallable<Input, void>;

// Reducer helper
export type Reducer<State> = {
  (state: State, action: any): State;
  get: () => Reducer<State>;
  case<Input, Payload>(
    actionFunc: ActionCreator<Input, Payload>,
    reducer: (state: State, payload: Payload) => State
  ): Reducer<State>;
  else(fn: (s: State, a: Action<any>) => State): Reducer<State>;
};

// API

export const buildActionCreator: (
  opt?: { prefix?: string }
) => {
  createAction<Input, Payload>(
    t?: string | void,
    fn?: (input: Input) => Payload
  ): ActionCreator<Input, Payload>;

  createAsyncAction<Input, Payload>(
    t: string | void,
    fn: (input: Input) => Promise<Payload>
  ): AsyncActionCreator<Input, Payload>;

  createThunkAction<Input, A = any, S = any, R = any>(
    t: string | void,
    fn: (input: Input, dispatch: (a: A) => any, getState: () => S) => Promise<R>
  ): ThunkActionCreator<Input, A, R>;
};

export const createReducer: <T>(t: T) => Reducer<T>;
