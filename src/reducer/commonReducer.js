import { handleActions, createAction } from "redux-actions";

export const setWinSize = createAction("set_win_size");

export const gameStart = createAction("game_Start");
export const gameEnd = createAction("game_End");

export const loadStart = createAction("loading_start");
export const loadEnd = createAction("loading_end");

const defaultState = {
  winWidth: 100,
  winHeight: 200,
  gameStart: false,
  gameEnd: false,
  loading: true,
};

const handlers = {
  [setWinSize]: (state, action) => ({
    ...state,
    winWidth: action.payload.winWidth,
    winHeight: action.payload.winHeight,
  }),
  [gameStart]: (state, action) => ({
    ...state,
    gameStart: action.payload,
  }),
  [gameEnd]: (state, action) => ({
    ...state,
    gameEnd: action.payload,
  }),
  [loadStart]: (state, action) => {
    console.log("loadStart_act");
    return {
      ...state,
      loading: true,
    };
  },
  [loadEnd]: (state, action) => {
    console.log("loadEnd_act");
    return {
      ...state,
      loading: false,
    };
  },
};

export default handleActions(handlers, defaultState);
