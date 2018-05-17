export type Action<T> = {
  type: string
  payload: T
}

export type ActionCreator<Input, Payload = Input> = {
  (Input): Action<Payload>
  type: string
}

export type Reducer<State> = {
  (state: State, action: any): State
  get: () => Reducer<State>
  case<Input, Payload>(
    actionFunc: ActionCreator<Input, Payload>,
    reducer: (state: State, payload: Payload) => State
  ): Reducer<State>
  else(fn: (s: State, a: Action<any>) => State): Reducer<State>
}

export const buildActionCreator: (
  opt?: { prefix?: string }
) => {
  createAction<Input, Payload>(
    t?: string | void,
    fn?: (input: Input) => Payload
  ): ActionCreator<Input, Payload>
  createAsyncAction<Input, Payload>(
    t: string | void,
    fn: (input: Input) => Promise<Payload>
  ): {
    started: ActionCreator<Input, void>
    resolved: ActionCreator<Input, Payload>
    rejected: ActionCreator<Input, Error>
  } & ((input: Input) => Promise<Payload>)
}

export const createReducer: <T>(t: T) => Reducer<T>
