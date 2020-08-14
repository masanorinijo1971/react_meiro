/**
 * 壁のタイプを定義
 */
export const KabeType = {
  OUT: "-1", //迷路の外
  SPACE: "0", //空間、Createrにより、壁に変換される場合もある。
  KABE_OUT_GENE: "1", //壁が生成される外壁。Generatorにより壁が生成される
  KABE_IN_GENE: "2", //壁が生成される内壁。Generatorにより壁が生成される
  KABE_END: "3", //完了した壁。この壁からは、新たに壁が生成されていかない
  CREATOR: "4", //壁クリエータの現在位置
  //**迷路生成後のタイプ */
  START_POINT: "5", //スタートポイント
  GOAL_POINT: "6", //ゴールポイント
  PLAYER_POINT: "7", //プレイヤーの現在値
  ANS_POINT: "x", //道しるべポイント
};

/**
 * 方向のタイプを定義Ï
 */
export const DirectionType = {
  up: 0,
  right: 1,
  down: 2,
  left: 3,
  non: -1, //方向定義なし
};

/**
 * 方向のタイプを定義Ï
 */
export const meiroState = {
  /**
   * 何もない状態
   */
  non: 0,

  /**
   * 初期化外枠のみの状態
   */
  init: 1,

  /**
   * 迷路生成中
   */
  underConstruct: 2,

  /**
   * スタンバイ
   */
  ready: 3,

  /**
   * プレイ中
   */
  play: 4, //方向定義なし

  /**
   * ゴール
   */
  goal: 5, //方向定義なし
};
