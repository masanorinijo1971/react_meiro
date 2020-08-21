import { handleActions, createAction } from "redux-actions";
import meiroCreater from "../module/meiro/service/meiroCreater";
import meiroPlayer from "../module/meiro/service/meiroPlayer";

/**
 * x方向へ移動する
 */
export const moveX = createAction("move_x");

/**
 * y方向へ移動する
 */
export const moveY = createAction("move_y");

/**
 * 回転radする
 */
export const rot = createAction("rot");

/**
 * スケーリング
 */
export const scale = createAction("scale");

/**
 * アクションする
 */
export const playAction = createAction("play_action");

export const defaultState = {
  x: 0,
  y: 0,
  rot: 1,
  scale: 0.5,
};

const handlers = {
  [moveX]: (state, action) => {
    return {
      ...state,
      x: action.payload.x,
    };
  },
  [moveY]: (state, action) => {
    return {
      ...state,
      y: action.payload.y,
    };
  },
  [rot]: (state, action) => {
    return {
      ...state,
      rot: action.payload.rot,
    };
  },
  [scale]: (state, action) => {
    return {
      ...state,
      scale: action.payload.scale,
    };
  },
  [playAction]: (state, action) => {
    return {
      ...state,
      x: action.payload.x || state.x,
      y: action.payload.y || state.y,
      rot: action.payload.rot || state.rot,
      scale: action.payload.scale || state.scale,
    };
  },
};

export default handleActions(handlers, defaultState);
