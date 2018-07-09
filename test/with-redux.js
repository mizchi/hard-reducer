/* @flow */
import assert from "assert";
import { buildActionCreator, createReducer } from "../";
import { combineReducers } from "redux";

// type and initialState
type State = {
  value: number
};

const initialState: State = { value: 0 };

// plane
const planeAdd = (val: number) => ({ type: "plane/add", payload: val });

type PlaneAction = {
  type: "plane/add",
  payload: number
};

const plane = (state: State = initialState, action: PlaneAction) => {
  switch (action.type) {
    case "plane/add": {
      return { value: state.value + action.payload };
    }
    default: {
      return state;
    }
  }
};

// typed
const { createAction } = buildActionCreator({ prefix: "typed/" });
const typedAdd = createAction("add", (val: number) => val);
const typed = createReducer(initialState).case(typedAdd, (state, payload) => {
  return { value: state.value + payload };
});

const combined = combineReducers({ plane, typed });
const init = combined(undefined, { type: "noop" });

assert.deepEqual(init, {
  plane: {
    value: 0
  },
  typed: {
    value: 0
  }
});

const updated = combined(init, typedAdd(1));
assert.deepEqual(updated, {
  plane: {
    value: 0
  },
  typed: {
    value: 1
  }
});
