/* @flow */
type ActionCreator<Constraint: string, Input, Payload> = {
  (Input): { type: Constraint, payload: Payload }
}

type Reducer<State> = {
  (State, any): State,
  get: () => Reducer<State>,
  case<Constraint, Input, Payload>(
    ActionCreator<Constraint, Input, Payload>,
    (State, Payload) => State
  ): Reducer<State>
}

export function buildActionCreator(opts: { prefix?: string }) {
  const prefix = opts.prefix || ''

  function createAction<Constraint: string, Input, Payload>(
    t: Constraint,
    fn: Input => Payload
  ): ActionCreator<Constraint, Input, Payload> {
    const type = prefix + t
    const fsaFn: any = (input: Input) => {
      return {
        type,
        payload: fn && fn(input)
      }
    }
    fsaFn._t = type
    return fsaFn
  }

  function createPromiseAction<Constraint: string, Input, Payload>(
    t: Constraint,
    fn: Input => Promise<Payload> | Payload
  ): ActionCreator<Constraint, Input, Payload> {
    const type = prefix + t
    const fsaFn: any = (input: Input) => {
      return {
        type,
        payload: Promise.resolve(fn(input))
      }
    }
    fsaFn._t = type
    return fsaFn
  }

  function createSimpleAction<Constraint: string>(
    t: Constraint
  ): ActionCreator<Constraint, void, void> {
    const type = prefix + t
    const fsaFn: any = () => ({ type })
    fsaFn._t = type
    return fsaFn
  }

  return { createAction, createSimpleAction, createPromiseAction }
}

export function createReducer<State>(initialState: State): Reducer<State> {
  let freezed = false
  const map = new Map()

  const reducer: any = (state: any = initialState, action: any) => {
    const handler = map.get(action.type)
    return handler ? handler(state, action.payload) : state
  }

  reducer.case = (actionFunc, callback) => {
    map.set(actionFunc._t, callback)
    return reducer
  }
  return reducer
}
