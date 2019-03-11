/* @flow */
import { applyMiddleware, createStore } from "redux";
import reduxThunk from "redux-thunk";
import { buildActionCreator, createReducer } from "../";

const { createAsyncAction } = buildActionCreator();

const incAsync = createAsyncAction("inc-async", async (val: number) => {
  if (val % 2 === 1) {
    throw new Error("error");
  }
  return {
    p: 1
  };
});

type Status = "ready" | "started" | "resolved" | "rejected";
type State = { status: Status, payload: ?{ p: number } };

const r = createReducer({ status: "ready", payload: null })
  .case(incAsync.started, state => {
    return { state: "started" };
  })
  .case(incAsync.resolved, (state, payload) => {
    return { state: "resolve", payload };
  })
  .case(incAsync.rejected, (state, error) => {
    return { state: "ready", payload: null };
  });

const store = createStore(r, undefined, applyMiddleware(reduxThunk));
store.subscribe((...args) => {
  console.log("store", store.getState());
});

const test = async () => {
  await store.dispatch(incAsync(2));
  await store.dispatch(incAsync(4));
  await store.dispatch(
    incAsync(13)
      .catch(err => console.log())
);
};

test();
