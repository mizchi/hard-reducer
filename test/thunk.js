/* @flow */
import { applyMiddleware, createStore } from "redux";
import reduxThunk from "redux-thunk";
import { buildActionCreator, createReducer } from "../";

const { createThunkAction, createAction } = buildActionCreator();

const inc = createAction("inc", (val: number) => val);

const thunked = createThunkAction(
  "thunked",
  async (input, dispatch, getState) => {
    dispatch(inc(input.value));
    return { ret: true };
  }
);

type Status = "ready" | "started" | "resolved" | "rejected";
type State = { status: Status, payload: ?{ p: number } };

const r = createReducer({ status: "ready", payload: null })
  .case(inc, (state, payload) => {
    return { state: "ready", payload };
  })
  .case(thunked.started, state => {
    return { state: "started", payload: null };
  })
  .case(thunked.resolved, (state, payload) => {
    return { state: "resolve", payload };
  })
  .case(thunked.rejected, (state, error) => {
    return { state: "ready", payload: null };
  });

const store = createStore(r, undefined, applyMiddleware(reduxThunk));

store.subscribe((...args) => {
  console.log("store", store.getState());
});

const test = async () => {
  store.dispatch(thunked({ value: 1 }));
};

test();
