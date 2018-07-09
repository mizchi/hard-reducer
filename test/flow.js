/* @flow */
import assert from "assert";
import { buildActionCreator, createReducer, type ActionCreator } from "../";

const { createAction, createAsyncAction } = buildActionCreator({
  prefix: "counter/"
});

const reset = createAction();
const inc = createAction("inc", (val: number) => val);
const dec = createAction("dec", (val: number) => val);
const incAsync = createAsyncAction("inc-async", (val: number) => {
  return Promise.resolve(val);
});
// typed with ActionCreator
const foo: ActionCreator<{ foo: number }> = createAction("foo");

// $ExpectError
const _type: number = inc.type;

type State = { value: number };
const initialState = { value: 0 };
const r = createReducer(initialState)
  .case(inc, (state, payload) => {
    // $ExpectError
    const p: string = payload;
    return {
      value: state.value + payload
    };
  })
  .case(dec, (state, payload) => {
    return {
      value: state.value - payload
    };
  })
  // require redux-thunk
  .case(incAsync.started, (state, payload) => {
    return initialState;
  })
  .case(incAsync.resolved, (state, payload) => {
    // $ExpectError
    const p: string = payload;
    return initialState;
  })
  .case(incAsync.rejected, (state, error) => {
    return initialState;
  })
  .case(reset, state => {
    return initialState;
  })
  .case(foo, (state, payload) => {
    // $ExpectError
    const pe: { foo: string } = payload;
    return initialState;
  })
  .case("nop", (state, payload) => {
    return state;
  })
  .else((state, action) => {
    // console.log(action)
    return state;
  });
const ret0 = r({ value: 0 }, inc(3));
const ret1 = r(ret0, reset());
const ret2 = r(ret1, dec(2));
const ret3 = r(ret1, { type: "nop", payload: null });

assert(ret0.value === 3);
assert(ret1.value === 0);
assert(ret2.value === -2);
assert(inc(1).type === "counter/inc");
assert(reset().type.indexOf("counter/") > -1);
