/* @flow */
import type { Reducer } from "../";

export default function createReducer<State>(
  initialState: State
): Reducer<State> {
  const handlerMap = new Map();
  const errorHandlerMap = new Map();
  let defaultFunc: ?Function = null;

  const reducer: Function = (
    state: State | void = initialState,
    action: { type: string, payload: any }
  ) => {
    if (action.payload instanceof Error && errorHandlerMap.has(action.type)) {
      const handler: any = errorHandlerMap.get(action.type);
      return handler(state, action.payload);
    } else if (handlerMap.has(action.type)) {
      const handler: any = handlerMap.get(action.type);
      return handler(state, action.payload);
    } else if (defaultFunc) {
      return defaultFunc(state, action);
    } else {
      return state;
    }
  };

  reducer.case = (actionFunc: string | Function, _reducer) => {
    const type = typeof actionFunc === "string" ? actionFunc : actionFunc.type;
    if (handlerMap.has(type)) {
      throw new Error(`hard-reducer: ${type} already exists in cases`);
    }
    handlerMap.set(type, _reducer);
    return reducer;
  };

  reducer.else = _reducer => {
    if (defaultFunc) {
      throw new Error(`hard-reducer: default func already exsits`);
    }
    defaultFunc = _reducer;
    return reducer;
  };

  return reducer;
}
