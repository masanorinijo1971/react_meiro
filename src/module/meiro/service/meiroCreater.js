import kabeCreater from "./kabeCreater";
import {
  KabeType as kType,
  DirectionType as dictType,
  meiroState,
} from "./meiroTypes";

import point from "../../../util/point";

class meiroCreater {
  constructor() {
    this.state = meiroState.non;
  }

  /**
   * 初期化
   * @param {*} w_
   * @param {*} h_
   * @param {*} c_
   */
  init(w_, h_, c_) {
    console.log("meiro_init()");
    this.map = new Array();
    this.w = w_;
    this.h = h_;
    this.c = c_;
    this.cs = new Array();
    this.initMap(this.w, this.h);
    this.madeWaku(this.map, this.w, this.h);
    this.initCreater(this.c, this.map);
    this.state = meiroState.init;
  }

  /**
   * 迷路マップの初期化
   * @param {me} w_
   * @param {*} h_
   * @param {*} c_
   */
  initMap(w_, h_) {
    this.map = new Array();
    for (var i = 0; i < h_; i++) {
      this.map.push(new Array(w_).fill(kType.SPACE));
    }
  }

  /**
   * 外周壁を生成する
   * @param {*} map_
   */
  madeWaku(map_, w_, h_) {
    for (var y = 0; y < h_; y++) {
      for (var x = 0; x < w_; x++) {
        if (y == 0 || y == h_ - 1) {
          if (x % 2 == 1) {
            map_[y][x] = kType.KABE_END;
          } else {
            map_[y][x] = kType.KABE_OUT_GENE;
          }
        } else if (x == 0 || x == w_ - 1) {
          if (y % 2 == 1) {
            map_[y][x] = kType.KABE_END;
          } else {
            map_[y][x] = kType.KABE_OUT_GENE;
          }
        }
      }
    }
    //四隅は、KABE_END
    map_[0][0] = kType.KABE_END;
    map_[h_ - 1][0] = kType.KABE_END;
    map_[0][w_ - 1] = kType.KABE_END;
    map_[h_ - 1][w_ - 1] = kType.KABE_END;
  }

  /**
   * Createrをセットする
   * @param {*} c_
   */
  initCreater(c_, map_) {
    this.cs = new Array();
    for (i = 0; i < c_; i++) {
      var c = new kabeCreater(map_);
      this.cs.push(c);
    }
  }

  /**迷路の幅を取得 */
  getWidth() {
    return this.w;
  }

  /**迷路の高さを取得 */
  getHeight() {
    return this.h;
  }

  /**迷路クリエータの数を取得 */
  getCnt() {
    return this.c;
  }

  /**
   * 壁クリエーターを移動させる
   * @param {*} turn_
   */
  moveCreater(turn_) {
    var endFlg = false;
    this.cs.forEach((c) => {
      if (c.createWall(turn_)) {
        endFlg = true;
      }
    });
    if (endFlg) {
      this.staßte = meiroState.ready;
    } else {
      this.state = meiroState.underConstruct;
    }
    return endFlg;
  }

  /**
   * 現在の状態を返す
   */
  getStatus() {
    return this.state;
  }

  /**
   * 現在のマップを取得する。
   */
  getMap() {
    return this.map;
  }

  /**
   * 描写用pathデータに変換する。
   */
  drawPath() {
    var maps_new = new Array();
    this.map.forEach((ms, indy) => {
      if (indy % 2 === 0) {
        var m_new = new Array();
        ms.forEach((m, indx) => {
          if (indx % 2 === 0) {
            m_new.push(this.generateDrawType(this.map, indx, indy));
          }
        });
        maps_new.push(m_new);
      }
    });
    // console.log(maps_new);
    return maps_new;
  }

  /**
   * 指定の位置の迷路描写タイプを生成する
   * @param {*} map_
   * @param {*} x_
   * @param {*} y_
   */
  generateDrawType(map_, x_, y_) {
    var up_ = this.checkCondition(dictType.up, map_, this.w, this.h, x_, y_, 1);
    var right_ = this.checkCondition(
      dictType.right,
      map_,
      this.w,
      this.h,
      x_,
      y_,
      1
    );
    var down_ = this.checkCondition(
      dictType.down,
      map_,
      this.w,
      this.h,
      x_,
      y_,
      1
    );
    var left_ = this.checkCondition(
      dictType.left,
      map_,
      this.w,
      this.h,
      x_,
      y_,
      1
    );

    var code_ = this.convertKey(right_);
    code_ += this.convertKey(down_);
    code_ += this.convertKey(left_);
    code_ += this.convertKey(up_);

    // console.log(code_);
    return code_;
    // return "1001";
  }

  /**
   * kTypeを0,1に変換するÏ
   * @param {*} ktype_
   */
  convertKey(ktype_) {
    var key = "0";
    if (ktype_ == kType.KABE_END || ktype_ == kType.CREATOR) {
      key = "1";
    }

    return key;
  }

  /**
   * 指定の方向の状態を確認する。
   * @param {*} dict_
   * @param {*} offset_
   */
  checkCondition(dict_, map_, w_, h_, x_, y_, offset_) {
    switch (dict_) {
      case dictType.up:
        if (0 <= y_ - offset_) {
          return map_[y_ - offset_][x_];
        } else {
          return false;
        }

      case dictType.right:
        if (w_ > x_ + offset_) {
          return map_[y_][x_ + offset_];
        } else {
          return false;
        }

      case dictType.down:
        if (h_ > y_ + offset_) {
          return map_[y_ + offset_][x_];
        } else {
          return false;
        }

      case dictType.left:
        if (0 <= x_ - offset_) {
          return map_[y_][x_ - offset_];
        } else {
          return false;
        }
      default:
        return false;
    }
  }

  /**
   * マップを表示する
   */
  showMap() {
    console.log("\nmapshow:");
    this.map.forEach((ms) => {
      var str = "";
      ms.forEach((m) => {
        if (m === "0") {
          str += " ";
        } else {
          str += m;
        }
      });
      console.log(str);
    });
  }

  //*********** 迷路を解くロジック　********

  /** スタート地点を設定する */
  setStartPoint(x, y) {
    this.startPt = new point(x, y);
  }

  /** ゴール地点を設定する */
  setGoalPoint(x, y) {
    this.goalPt = new point(x, y);
  }
}

export default new meiroCreater();
