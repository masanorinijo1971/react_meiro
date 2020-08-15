import {
  KabeType as kType,
  DirectionType as dictType,
  meiroState,
} from "./meiroTypes";

import point from "../../../util/point";

/**
 * 常に進行方向に対して左側の壁に沿って進むパターンリスト
 */
const chkLists = [
  {
    dict: dictType.right,
    chkls: [dictType.up, dictType.right, dictType.down, dictType.left],
  },
  {
    dict: dictType.up,
    chkls: [dictType.left, dictType.up, dictType.right, dictType.down],
  },
  {
    dict: dictType.left,
    chkls: [dictType.down, dictType.left, dictType.up, dictType.right],
  },
  {
    dict: dictType.down,
    chkls: [dictType.right, dictType.down, dictType.left, dictType.up],
  },
];

class meiroPlayer {
  constructor() {}

  /**
   * 初期設定する。
   * @param {*} map_
   */
  set_map(map_) {
    this.map = map_;
    console.log("meiroPlayer_set_map");

    //プレイヤーをスタートポイントに設置(スタート地点が設定されていない場合は、x:1,y:1をスタート地点に設定する)
    var pt_ = this.getPointByType(kType.START_POINT);
    if (pt_ != null) {
      this.pt = pt_;
    } else {
      this.map[1][1] = kType.START_POINT;
      this.pt = new point(1, 1);
    }
    this.his = [];
    this.his.push({ x: this.pt.x, y: this.pt.y });

    //初期の進む方向
    this.dct = dictType.right;
    this.backFlg = false; //戻るフラグ
    console.log("meiroPlayer_set_map2");
  }

  /**
   * スタート地点をセットする
   * @param {*} point_
   */
  setStartPoint(point_) {
    //既存のスタートポイントを消去する
    console.log("meiroPlayer_setStartPoint");
    var pt_ = this.getPointByType(kType.START_POINT);
    if (pt_ != null) {
      this.map[pt_.y][pt_.x] = kType.SPACE;
    }
    console.log("meiroPlayer_setStartPoint2");
    this.map[point_.y][point_.x] = kType.START_POINT;
    console.log("meiroPlayer_setStartPoint3");
    this.pt = new point(point_.x, point_.y);
    this.his = [];
    this.his.push({ x: this.pt.x, y: this.pt.y });
  }

  /**
   * ゴール地点をセットする
   * @param {*} point_
   */
  setGoalPoint(point_) {
    //既存のゴールポイントを消去する
    var pt_ = this.getPointByType(kType.GOAL_POINT);
    if (pt_ != null) {
      this.map[pt_.y][pt_.x] = kType.SPACE;
    }
    this.map[point_.y][point_.x] = kType.GOAL_POINT;
  }

  /**
   * 移動する
   * @param {*} turn_
   */
  move_meiro(turn_) {
    if (turn_ == 0) {
      return;
    }
    var dcts = this.checkCanDict(this.pt, this.dct);
    // console.log("move_meiro(turn_)");
    // console.log(dcts);
    if (dcts.length) {
      // console.log(dcts);
      this.dct = dcts[0].Dict;
      this.move_point(this.dct, this.map, this.pt, 1, kType.ANS_POINT);
      this.registHis(this.pt);
      this.move_point(this.dct, this.map, this.pt, 1, kType.ANS_POINT);
      this.registHis(this.pt);
    }
    // console.log("move_meiro x:" + this.pt.x + " y:" + this.pt.y);
    // console.log(this.his);
    this.move_meiro(turn_ - 1);
  }
  /**
   * ゴールまでのルートを生成する
   * @param {*} turn_
   */
  move_meiro_to_goal(point_) {
    var dcts = this.checkCanDict(this.pt, this.dct);
    // console.log("move_meiro(turn_)");
    // console.log(dcts);
    if (dcts.length) {
      // console.log(dcts);
      this.dct = dcts[0].Dict;
      this.move_point(this.dct, this.map, this.pt, 1, kType.ANS_POINT);
      this.registHis(this.pt);
      this.move_point(this.dct, this.map, this.pt, 1, kType.ANS_POINT);
      this.registHis(this.pt);
    }
    if (this.pt.x != point_.x || this.pt.y != point_.y) {
      this.move_meiro_to_goal(point_);
    }
  }

  /**
   * 指定の方向へ移動し、異動先の状態を変更する。
   * @param {*} dict_ 方向
   * @param {*} offset_　移動量
   */
  move_point(dict_, map_, point_, offset_, kType_) {
    var w_ = map_[0].length;
    var h_ = map_.length;
    var x_ = point_.x;
    var y_ = point_.y;
    switch (dict_) {
      case dictType.up:
        if (0 <= y_ - offset_) {
          map_[y_ - offset_][x_] = kType_;
          point_.add_y(-offset_);
        }
        break;
      case dictType.right:
        if (w_ > x_ + offset_) {
          map_[y_][x_ + offset_] = kType_;
          point_.add_x(offset_);
        }
        break;
      case dictType.down:
        if (h_ > y_ + offset_) {
          map_[y_ + offset_][x_] = kType_;
          point_.add_y(offset_);
        }
        break;
      case dictType.left:
        if (0 <= x_ - offset_) {
          map_[y_][x_ - offset_] = kType_;
          point_.add_x(-offset_);
        }
        break;
      default:
        return;
    }
  }

  /**
   * 現在のポイントで移動できる方向を配列返す
   * @param {*} point_
   */
  checkCanDict(point_, dict_) {
    // console.log("point_:" + point_);
    // console.log("dict_:" + dict_);
    var dictList = [];
    chkLists.forEach((ls) => {
      // console.log(ls);
      if (ls.dict == dict_) {
        dictList = ls.chkls;
      }
    });
    // console.log("dictList");
    // console.log(dictList);
    // console.log("point_.x:" + point_.x);
    var canDict = [];
    dictList.forEach((dct_) => {
      var kType_ = this.check_kType(dct_, this.map, point_.x, point_.y, 1);
      if (
        kType_ == kType.SPACE ||
        kType_ == kType.ANS_POINT ||
        kType_ == kType.START_POINT ||
        kType_ == kType.GOAL_POINT ||
        kType_ == kType.START_POINT
      ) {
        canDict.push({
          kType: kType_,
          Dict: dct_,
        });
      }
    });
    return canDict;
  }

  /**
   * 指定の方向の状態を確認する。
   * @param {*} dict_ 方向
   * @param {*} offset_　移動量
   */
  check_kType(dict_, map_, x_, y_, offset_) {
    var w_ = map_[0].length;
    var h_ = map_.length;
    switch (dict_) {
      case dictType.up:
        if (0 <= y_ - offset_) {
          return map_[y_ - offset_][x_];
        } else {
          return kType.OUT;
        }
      case dictType.right:
        if (w_ > x_ + offset_) {
          return map_[y_][x_ + offset_];
        } else {
          return kType.OUT;
        }
      case dictType.down:
        if (h_ > y_ + offset_) {
          return map_[y_ + offset_][x_];
        } else {
          return kType.OUT;
        }
      case dictType.left:
        if (0 <= x_ - offset_) {
          return map_[y_][x_ - offset_];
        } else {
          return kType.OUT;
        }
      default:
        return kType.OUT;
    }
  }

  /**
   * 指定のタイプのポイントを取得する
   * @param {*} type_
   */
  getPointByType(type_) {
    var point_ = new point(0, 0);
    this.map.forEach((mxs, indy) => {
      mxs.forEach((x, indx) => {
        if (x == type_) {
          point_.set_x(indx);
          point_.set_y(indy);
          return point_;
        }
      });
    });
    return null;
  }

  /**
   * hisに登録する
   * @param {} point_
   */
  registHis(point_) {
    // if (this.backFlg) {
    // } else {
    if (
      this.his.length > 1 &&
      this.his[this.his.length - 2].x == point_.x &&
      this.his[this.his.length - 2].y == point_.y
    ) {
      this.map[this.his[this.his.length - 1].y][
        this.his[this.his.length - 1].x
      ] = kType.SPACE;
      this.his.pop();
      this.backFlg = true;
      // console.log("registHis_pop");
    } else {
      this.his.push({ x: point_.x, y: point_.y });
      // console.log("registHis_push");
    }
    // }
  }

  /**
   * 現在の経路を返す
   */
  moveHis() {
    return this.his;
  }

  /**
   * 経路をリセットする
   */
  resetHis() {
    this.his = [];
  }
}

export default new meiroPlayer();
