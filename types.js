/* @flow */
export type ActionCreator<Constraint: string, Input, Payload> = {
  (Input): { type: Constraint, payload: Payload }
}

export type Reducer<State> = {
  (State, any): State,
  get: () => Reducer<State>,
  case<Constraint, Input, Payload>(
    ActionCreator<Constraint, Input, Payload>,
    (State, Payload) => State
  ): Reducer<State>
}
