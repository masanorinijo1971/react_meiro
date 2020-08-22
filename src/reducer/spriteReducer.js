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

/**
 * 相対的に動く
 */
export const ActionBy = createAction("action_by");

/**
 * 絶対的に動く
 */
export const ActionTo = createAction("action_To");

export const defaultState = {
  x: 0,
  y: 0,
  rot: 1,
  scale: 0.5,
  step: 1,
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
      step: action.payload.step || state.step,
    };
  },
  [ActionTo]: (state, action) => {
    return {
      ...state,
      x: action.payload.x || state.x,
      y: action.payload.y || state.y,
      rot: action.payload.rot || state.rot,
      scale: action.payload.scale || state.scale,
      step: action.payload.step || state.step,
    };
  },
  [ActionBy]: (state, action) => {
    var dx = action.payload.x || 0;
    var dy = action.payload.y || 0;
    var drot = action.payload.rot || 0;
    var dscale = action.payload.scale || 0;

    return {
      ...state,
      x: state.x + dx,
      y: state.y + dy,
      rot: state.rot + drot,
      scale: state.scale + dscale,
      step: action.payload.step || state.step,
    };
  },
};

export default handleActions(handlers, defaultState);
