export interface ActionCreator<Constraint extends string, Input, Payload> {
  (input: Input): { type: Constraint, payload: Payload };
}

export interface Reducer<State> {
  (state: State, action: any): State;
  get: () => Reducer<State>;
  case<Constraint extends string, Input, Payload>(
    actionFunc: ActionCreator<Constraint, Input, Payload>,
    callback: (state: State, payload: Payload) => State
  ): Reducer<State>;
}

export const buildActionCreator: (opt: { prefix?: string; }) => {
  createAction<Constraint extends string, Input, Payload>(
    t: Constraint,
    fn: (input: Input) => Payload
  ): ActionCreator<Constraint, Input, Payload>,
  createSimpleAction<Constraint extends string>(
    t: Constraint
  ): ActionCreator<Constraint, void, void>,
  createPromiseAction<Constraint extends string, Input, Payload>(
    t: Constraint,
    fn: (input: Input) => Promise<Payload>
  ): ActionCreator<Constraint, Input, Payload>,
};

export const createReducer: <T>(t: T) => Reducer<T>;

