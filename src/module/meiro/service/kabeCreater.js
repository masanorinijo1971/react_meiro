import { KabeType as kType, DirectionType as dictType } from "./meiroTypes";

export default class kabeCreater {
  constructor(map_) {
    this.map = map_;
    this.w = map_[0].length - 1;
    this.h = map_.length - 1;
    this.x = 0;
    this.y = 0;
    this.stn = false; //スタンバイ中かどうか？

    /**
     * 直進する割合
     */
    this.p_tyoku = 0.8; //直進する割合

    /**
     * 現在の方向
     */
    this.dict = dictType.non;

    /**
     * 他の壁への回り込みが起動する割合
     */
    this.p_para = 1;

    /**
     *  右巻きかどうか？
     */
    this.p_lefty = true;

    /**
     * 回り込み起動中かどうか
     */
    this.p_paraFlg = false;

    /**
     * 外壁からスタートする割合
     */
    this.p_out = 0.5;

    /**
     * 最大連続壁生成回数
     */
    this.p_ren = 100; //最大連続動作回数

    /**
     * 現在の生成回数
     */
    this.p_ren_ = 0; //現在の動作回数
  }

  /**
   * 指定タイプの位置へ移動する。
   * @param {*} type
   */
  setPoint(type) {
    var sel_ = [];
    this.map.forEach((ms, y_) => {
      ms.forEach((m, x_) => {
        if (m === type) {
          sel_.push(y_ + " " + x_);
        }
      });
    });

    if (!sel_.length) {
      return false;
    }

    //ランダムに選択する
    var rnd_ = this.rndX(sel_.length);

    prms = sel_[rnd_].split(" ");

    this.x = parseInt(prms[1]);
    this.y = parseInt(prms[0]);
    this.setStanby();
    return true;
  }

  /**
   * 現在位置をマップに登録し、スタンバイ状態にする。
   */
  setStanby() {
    this.map[this.y][this.x] = kType.CREATOR;
    this.stn = true;
    this.p_paraFlg = false;
  }

  /**
   * 指定のターン回数分壁を生成する。再起
   * @param {*} turnCnt_
   */
  createWall(turnCnt_) {
    if (!turnCnt_) {
      return false;
    }

    //現在の位置壁の終了状態を更新する。
    this.checkKabeEnd([{ x: this.x, y: this.y }]);

    //別の壁生成場所へ移動するかどうか判定
    this.p_ren_ += 1;
    if (this.p_ren == this.p_ren_) {
      if (this.isTrue(this.p_out)) {
        if (!this.setPoint(kType.KABE_OUT_GENE)) {
          this.setPoint(kType.KABE_IN_GENE);
        }
      } else {
        if (!this.setPoint(kType.KABE_IN_GENE)) {
          this.setPoint(kType.KABE_OUT_GENE);
        }
      }
      this.p_ren_ = 0;
    }

    if (!this.stn) {
      if (this.isTrue(this.p_out)) {
        if (!this.setPoint(kType.KABE_OUT_GENE)) {
          this.setPoint(kType.KABE_IN_GENE);
        }
      } else {
        if (!this.setPoint(kType.KABE_IN_GENE)) {
          this.setPoint(kType.KABE_OUT_GENE);
        }
      }
    }

    //スタンバイにならない場合は、迷路が完成しているため、trueを返す。
    if (!this.stn) {
      return true;
    }

    //進む方向を決定する
    var dct = this.decideDict();
    if (dct != dictType.non) {
      this.moveDict(dct);
    } else {
      this.map[this.y][this.x] = kType.KABE_END;
      this.stn = false;
    }

    this.createWall(turnCnt_ - 1);
  }

  /**
   *  現在の場所から進む方向を決定する。
   */
  decideDict() {
    var darr_;
    //回り込み起動中かどうかで分岐
    if (this.p_paraFlg) {
      if (this.p_lefty) {
        darr_ = this.geneLeftTurnArr(this.dict);
      } else {
        darr_ = this.geneRightTurnArr(this.dict);
      }
      if (this.isMoveDict(darr_[1])) {
        //指定の方向に行けた場合
        this.dict = darr_[1];
        return darr_[1];
      } else {
        if (this.p_lefty) {
          darr_ = this.geneRightTurnArr(this.dict);
        } else {
          darr_ = this.geneLeftTurnArr(this.dict);
        }
        var ansDct = dictType.non;
        darr_.forEach((d) => {
          if (this.isMoveDict(d)) {
            if (ansDct === dictType.non) {
              ansDct = d;
            }
            return;
          }
        });
        this.dict = ansDct;
        return ansDct;
      }
    }

    //直進属性を反映させる
    if (!this.isTrue(this.p_tyoku)) {
      this.dict = dictType.non;
    }

    if (this.isMoveDict(this.dict)) {
      //指定の方向に行けた場合
      return this.dict;
    } else {
      //指定の方向に行けなかった場合。壁にぶつかった場合
      //回り込みを起動するか判定
      if (this.dict !== dictType.non && this.isTrue(this.p_para)) {
        if (this.isTrue(0.5)) {
          this.p_lefty = !this.p_lefty;
        }
        this.p_paraFlg = true;
        return this.decideDict();
      }

      //進む方向をシャッフルする
      var darr_ = [dictType.up, dictType.right, dictType.down, dictType.left];
      this.shuffleArray(darr_);
      var ansDct = dictType.non;
      darr_.forEach((d) => {
        if (this.isMoveDict(d)) {
          ansDct = d;
        }
      });
    }
    this.dict = ansDct;
    return ansDct;
  }

  /**
   *  指定の方向へ移動する。
   * @param {*} dict_
   */
  moveDict(dict_) {
    if (!this.isMoveDict(dict_)) {
      return false;
    }
    this.map[this.y][this.x] = kType.KABE_IN_GENE;
    switch (dict_) {
      case dictType.up:
        this.map[this.y - 1][this.x] = kType.KABE_END;
        this.map[this.y - 2][this.x] = kType.CREATOR;
        this.checkKabeEnd([{ x: this.x, y: this.y }]);
        this.y -= 2;
        this.checkKabeEnd([{ x: this.x, y: this.y }]);
        break;

      case dictType.right:
        this.map[this.y][this.x + 1] = kType.KABE_END;
        this.map[this.y][this.x + 2] = kType.CREATOR;
        this.checkKabeEnd([{ x: this.x, y: this.y }]);
        this.x += 2;
        this.checkKabeEnd([{ x: this.x, y: this.y }]);
        break;

      case dictType.down:
        this.map[this.y + 1][this.x] = kType.KABE_END;
        this.map[this.y + 2][this.x] = kType.CREATOR;
        this.checkKabeEnd([{ x: this.x, y: this.y }]);
        this.y += 2;
        this.checkKabeEnd([{ x: this.x, y: this.y }]);
        break;

      case dictType.left:
        this.map[this.y][this.x - 1] = kType.KABE_END;
        this.map[this.y][this.x - 2] = kType.CREATOR;
        this.checkKabeEnd([{ x: this.x, y: this.y }]);
        this.x -= 2;
        this.checkKabeEnd([{ x: this.x, y: this.y }]);
        break;
    }
  }

  /**
   * 指定の方向に進めるか？(指定の方向の２マスがスペースの状態であるか)
   * @param {site} dict
   */
  isMoveDict(dict_) {
    return (
      this.checkCondition(dict_, 1) === kType.SPACE &&
      this.checkCondition(dict_, 2) === kType.SPACE
    );
  }

  /**
   * 指定の方向の状態を確認する。
   * @param {*} dict_
   * @param {*} offset_
   */
  checkCondition(dict_, offset_) {
    switch (dict_) {
      case dictType.up:
        if (0 <= this.y - offset_) {
          return this.map[this.y - offset_][this.x];
        } else {
          return false;
        }

      case dictType.right:
        if (this.w > this.x + offset_) {
          return this.map[this.y][this.x + offset_];
        } else {
          return false;
        }

      case dictType.down:
        if (this.h > this.y + offset_) {
          return this.map[this.y + offset_][this.x];
        } else {
          return false;
        }

      case dictType.left:
        if (0 <= this.x - offset_) {
          return this.map[this.y][this.x - offset_];
        } else {
          return false;
        }
      default:
        return false;
    }
  }

  /**
   * 指定の方向の状態を確認する。
   * @param {*} dict_
   * @param {*} offset_
   */
  checkCondition2(pt_, dict_, offset_) {
    switch (dict_) {
      case dictType.up:
        if (0 <= pt_.y - offset_) {
          return this.map[pt_.y - offset_][pt_.x];
        } else {
          return false;
        }

      case dictType.right:
        if (this.w > pt_.x + offset_) {
          return this.map[pt_.y][pt_.x + offset_];
        } else {
          return false;
        }

      case dictType.down:
        if (this.h > pt_.y + offset_) {
          return this.map[pt_.y + offset_][pt_.x];
        } else {
          return false;
        }

      case dictType.left:
        if (0 <= pt_.x - offset_) {
          return this.map[pt_.y][pt_.x - offset_];
        } else {
          return false;
        }
    }
  }

  /**
   * 指定の場所の壁のEnd状態を更新する
   * @param {*} points
   */
  checkKabeEnd(points) {
    points.forEach((pt) => {
      if (
        this.checkCondition2(pt, dictType.up, 2) === kType.SPACE ||
        this.checkCondition2(pt, dictType.right, 2) === kType.SPACE ||
        this.checkCondition2(pt, dictType.down, 2) === kType.SPACE ||
        this.checkCondition2(pt, dictType.left, 2) === kType.SPACE
      ) {
        //何もしない
      } else {
        this.map[pt.y][pt.x] = kType.KABE_END;
      }
    });
  }

  // ************ utill *************

  /**
   * 0以上ー指定の数x_未満の整数をランダム生成
   * @param {s} x_
   */
  rndX(x_) {
    var ans_ = Math.floor(Math.random() * x_);
    if (ans_ == x_) {
      ans_ = 0;
    }
    return ans_;
  }

  /**
   * 指定の確率で,Trueを返す。
   * @param {} rnd_
   */
  isTrue(rate_) {
    return Math.random() < rate_;
  }

  /**
   * 配列を混ぜる
   * @param {*} arr_
   */
  shuffleArray(arr_) {
    for (var i = 0; i < arr_.length; i++) {
      var buf = arr_[i];
      var ind = this.rndX(arr_.length);
      arr_[i] = arr_[ind];
      arr_[ind] = buf;
    }
  }

  /**
   * 左回りの方向配列を生成する。
   * @param {*} dct_
   */
  geneLeftTurnArr(dct_) {
    switch (dct_) {
      case dictType.up:
        return [dictType.up, dictType.left, dictType.down, dictType.right];
      case dictType.left:
        return [dictType.left, dictType.down, dictType.right, dictType.up];
      case dictType.down:
        return [dictType.down, dictType.right, dictType.up, dictType.left];
      case dictType.right:
        return [dictType.right, dictType.up, dictType.left, dictType.down];
    }
  }

  /**
   * 右回りの方向配列を生成する。
   * @param {*} dct_
   */
  geneRightTurnArr(dct_) {
    switch (dct_) {
      case dictType.up:
        return [dictType.up, dictType.right, dictType.down, dictType.left];
      case dictType.left:
        return [dictType.left, dictType.up, dictType.right, dictType.down];
      case dictType.down:
        return [dictType.down, dictType.left, dictType.up, dictType.right];
      case dictType.right:
        return [dictType.right, dictType.down, dictType.left, dictType.up];
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

  // ********* 使用しない ***********

  /**
   * Createrのスタート地点を登録する。
   * @param {*} outerRate
   */
  setStart(outerRate) {
    //外壁からスタートする割合分岐
    if (this.isTrue(outerRate)) {
      if (this.setPoint(kType.KABE_OUT_GENE)) {
        return true;
      } else {
        if (this.setPoint(kType.KABE_IN_GENE)) {
          return true;
        } else {
          return false;
        }
      }
    } else {
      if (this.setPoint(kType.KABE_IN_GENE)) {
        return true;
      } else {
        if (this.setPoint(kType.KABE_OUT_GENE)) {
          return true;
        } else {
          return false;
        }
      }
    }
  }
}
