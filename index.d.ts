export interface ActionCreator<Input, Payload> {
  (input: Input): { type: string; payload: Payload }
}

export interface Reducer<State> {
  (state: State, action: any): State
  get: () => Reducer<State>
  case<Input, Payload>(
    actionFunc: ActionCreator<Input, Payload>,
    callback: (state: State, payload: Payload) => State
  ): Reducer<State>
}

export const buildActionCreator: (
  opt: { prefix?: string }
) => {
  createAction<Input, Payload>(
    t: string,
    fn: (input: Input) => Payload
  ): ActionCreator<Input, Payload>
  createSimpleAction(t: string): ActionCreator<void, void>
  createPromiseAction<Input, Payload>(
    t: string,
    fn: (input: Input) => Promise<Payload>
  ): ActionCreator<Input, Payload>
}

export const createReducer: <T>(t: T) => Reducer<T>
