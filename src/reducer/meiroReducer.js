import { handleActions, createAction } from "redux-actions";
import meiroCreater from "../module/meiro/service/meiroCreater";
import meiroPlayer from "../module/meiro/service/meiroPlayer";

/**
 * 迷路の初期パラメータをセットする
 */
export const initMeiro = createAction("init_meiro");

/**
 * meiroCreaterの状態ををセットする
 */
export const updateMeiro = createAction("update_meiro");

/**
 * 迷路のスタートゴールをセットする
 */
export const setStGlMeiro = createAction("set_start_goal_meiro");

/**
 * スタート→ゴールまでの経路をセットする
 */
export const setAnsMeiro = createAction("set_ans_meiro");

/**
 * 迷路の壁を一定のステップで生成する
 */
export const createMeiro = createAction("create_meiro");

/**
 * 迷路の壁を完成する
 */
export const createMeiroAll = createAction("create_meiro_all");

/**
 * 迷路の状態
 */
export const meiroState = {
  /**パラメータセット完了 */
  init: 0,

  /**外枠生成完了 */
  wakuEnd: 1,

  /**迷路壁生成中 */
  createStart: 2,

  /**迷路完成 */
  createEnd: 3,

  /**迷路スタート */
  meiroStart: 4,

  /** 迷路ゴール*/
  meiroGoal: 5,
};

const defaultState = {
  // meiroCreater: new meiroCreater(31, 31, 2),
  width: 25, //49
  height: 25, //65
  createrCnt: 3, //3
  status: meiroState.wakuEnd,
  createStep: 3, //一回あたりの壁生成ステップ数
  map: [], //ex[[3333333],[3000003],,,]
  drawPath: [], //ex[[1100],[1001],,,]
  ans: [], //start→goalまでの道のり
  start: { x: 1, y: 1 },
  goal: { x: 48, y: 64 },
};

const handlers = {
  /**
   * 迷路の設定を初期化する
   */
  [initMeiro]: (state, action) => {
    console.log("initMeiro_act");
    var w_ = action.payload.width ?? state.width;
    var h_ = action.payload.height ?? state.height;
    var c_ = action.payload.createrCnt ?? state.createrCnt;
    var st_ = action.payload.createStep ?? state.createStep;

    // meiroCreater.init(w_, h_, c_);
    return {
      ...state,
      width: w_,
      height: h_,
      createrCnt: c_,
      status: meiroState.init,
      createStep: st_,
      map: meiroCreater.getMap(),
      drawPath: meiroCreater.drawPath(),
    };
  },

  /**
   * 現在の迷路の形状を更新する
   */
  [updateMeiro]: (state, action) => {
    console.log("action_updateMeiro");
    return {
      ...state,
      status: meiroCreater.getStatus(),
      map: meiroCreater.getMap(),
      drawPath: meiroCreater.drawPath(),
    };
  },

  /**
   * スタートとゴール地点を更新する
   */
  [setStGlMeiro]: (state, action) => {
    console.log("set_start_goal_meiro_act");
    var st_x_ = action.payload.start.x ?? state.start.x;
    var st_y_ = action.payload.start.y ?? state.start.y;
    var gl_x_ = action.payload.goal.x ?? state.goal.x;
    var gl_y_ = action.payload.goal.y ?? state.goal.y;

    return {
      ...state,
      start: { x: st_x_, y: st_y_ },
      goal: { x: gl_x_, y: gl_y_ },
    };
  },

  /**
   * ゴールまでの経路を更新する
   */
  [setAnsMeiro]: (state, action) => {
    console.log("set_ans_meiro_act");
    var moveHis = meiroPlayer.moveHis();
    return {
      ...state,
      ans: moveHis,
    };
  },

  /**
   * 使用しない
   */
  [createMeiro]: (state, action) => {
    var st_ = action.payload.createStep ?? state.createrCnt;
    // var isEnd = meiroCreater.moveCreater(st_);
    // meiroCreater.showMap();
    return {
      ...state,
      status: isEnd ? meiroState.createEnd : meiroState.createStart,
      createStep: st_,
      map: meiroCreater.getMap(),
      drawPath: meiroCreater.drawPath(),
    };
  },
  /**
   * 使用しない
   */
  [createMeiroAll]: (state, action) => {
    var st_ = action.payload.createStep ?? state.createrCnt;
    // while (!meiroCreater.moveCreater(st_));
    // meiroCreater.showMap();
    return {
      ...state,
      createStep: st_,
      map: meiroCreater.getMap(),
      drawPath: meiroCreater.drawPath(),
    };
  },
};

export default handleActions(handlers, defaultState);
