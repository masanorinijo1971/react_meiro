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
 * 画面調整用オフセットを設定する
 */
export const setOffset = createAction("set_offset");

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

export const defaultState = {
  // meiroCreater: new meiroCreater(31, 31, 2),
  width: 49, //49
  height: 65, //65
  createrCnt: 3, //3
  status: meiroState.init,
  createStep: 20, //一回あたりの壁生成ステップ数
  map: [], //ex[[3333333],[3000003],,,]
  drawWidth: 2, //描写幅
  drawLength: 12, //ブロック長さ
  drawPath: [], //ex[[1100],[1001],,,]
  ans: [], //start→goalまでの道のり
  ansWidth: 4, //anserラインの幅
  start: { x: 1, y: 1 },
  goal: { x: 27, y: 33 },
  offset: { x: 0, y: 0 },
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
    var offset_ = action.payload.offset ?? state.offset;

    meiroCreater.init(w_, h_, c_);
    meiroPlayer.resetHis();
    return {
      ...state,
      width: w_,
      height: h_,
      createrCnt: c_,
      status: meiroState.init,
      createStep: st_,
      map: meiroCreater.getMap(),
      drawPath: meiroCreater.drawPath(),
      ans: meiroPlayer.moveHis(),
      offset: offset_,
    };
  },

  /**
   * 現在の迷路の形状を更新する
   */
  [updateMeiro]: (state, action) => {
    console.log("action_updateMeiro");
    var offset_ = action.payload.offset ?? state.offset;
    return {
      ...state,
      status: meiroCreater.getStatus(),
      map: meiroCreater.getMap(),
      drawPath: meiroCreater.drawPath(),
      ans: meiroPlayer.moveHis(),
      offset: offset_,
    };
  },

  /**
   * スタートとゴール地点を更新する
   */
  [setStGlMeiro]: (state, action) => {
    console.log("set_start_goal_meiro_act");
    if (action.payload.start) {
      var st_x_ = action.payload.start.x ?? state.start.x;
      var st_y_ = action.payload.start.y ?? state.start.y;
    } else {
      var st_x_ = state.start.x;
      var st_y_ = state.start.y;
    }
    if (action.payload.goal) {
      var gl_x_ = action.payload.goal.x ?? state.goal.x;
      var gl_y_ = action.payload.goal.y ?? state.goal.y;
    } else {
      var gl_x_ = state.goal.x;
      var gl_y_ = state.goal.y;
    }
    meiroPlayer.set_map(meiroCreater.getMap());
    meiroPlayer.resetHis();
    meiroPlayer.setStartPoint({ x: st_x_, y: st_y_ });
    meiroPlayer.setGoalPoint({ x: gl_x_, y: gl_y_ });
    return {
      ...state,
      start: { x: st_x_, y: st_y_ },
      goal: { x: gl_x_, y: gl_y_ },
      map: meiroCreater.getMap(),
      drawPath: meiroCreater.drawPath(),
      ans: meiroPlayer.moveHis(),
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
   * 迷路を生成する
   */
  [createMeiro]: (state, action) => {
    var st_ = action.payload.createStep ?? state.createrCnt;
    var isEnd = meiroCreater.moveCreater(st_);
    meiroCreater.showMap();
    return {
      ...state,
      status: isEnd ? meiroState.createEnd : meiroState.createStart,
      createStep: st_,
      map: meiroCreater.getMap(),
      drawPath: meiroCreater.drawPath(),
    };
  },
  /**
   * 迷路を完成まで、生成する
   */
  [createMeiroAll]: (state, action) => {
    var st_ = action.payload.createStep ?? state.createrCnt;
    while (!meiroCreater.moveCreater(st_));
    meiroCreater.showMap();
    return {
      ...state,
      createStep: st_,
      map: meiroCreater.getMap(),
      drawPath: meiroCreater.drawPath(),
    };
  },
  /**
   * 画面調整用オフセットを設定する
   */
  [setOffset]: (state, action) => {
    return {
      ...state,
      offset: action.payload.offset,
    };
  },
};

export default handleActions(handlers, defaultState);
