/* @flow */
export type ActionCreator<Input, Payload> = {
  (Input): { type: string, payload: Payload }
}

export type Reducer<State> = {
  (State, any): State,
  get: () => Reducer<State>,
  case<Input, Payload>(
    ActionCreator<Input, Payload>,
    (State, Payload) => State
  ): Reducer<State>
}
