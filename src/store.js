import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import commonReducer from "./reducer/commonReducer";
import meiroReducer from "./reducer/meiroReducer";
import createSagaMiddleware from "redux-saga";
import createSaga from "./util/sideEffects";

const createMiddlewares = (sagaMiddleware) => {
  const middlewares = [];
  if (sagaMiddleware) {
    middlewares.push(sagaMiddleware);
  }
  return applyMiddleware.apply({}, middlewares);
};

const createReducers = (reducers) => {
  return combineReducers({
    common: commonReducer,
    meiro: meiroReducer,
    ...reducers,
  });
};

const buildStore = (reducers, initialState) => {
  const sagaMiddleware = createSagaMiddleware();
  const store = createStore(
    createReducers(reducers),
    initialState,
    compose(createMiddlewares(sagaMiddleware))
  );

  sagaMiddleware.run(createSaga(store.getState));
  //   store.reducers = createReducers(reducers)

  return store;
};

export default buildStore();
