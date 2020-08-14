class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  set_x(x_) {
    this.x = x_;
  }

  set_y(y_) {
    this.y = y_;
  }

  /**
   * 指定のポイントからの距離を計算
   * @param {*} point
   */
  lengthFrom(point) {
    return Math.sqrt(
      Math.pow(this.x - point.x, 2) + Math.pow(this.y - point.y, 2)
    );
  }

  /**
   * 自身の長さ
   */
  length() {
    return Math.pow(Math.pow(this.x, 2) + Math.pow(this.y, 2), 0.5);
  }

  /**
   * 指定のポイントを追加する
   * @param {} point
   */
  add_point(point) {
    this.x += point.x;
    this.y += point.y;
    return this;
  }

  /**
   * x,yを指定して追加する
   * @param {*} x_
   * @param {*} y_
   */
  add_xy(x_, y_) {
    this.x += x_;
    this.y += y_;
    return this;
  }

  /**
   * x成分を追加する
   * @param {*} x_
   */
  add_x(x_) {
    this.x += x_;
    return this;
  }

  /**
   * y成分を追加する
   * @param {*} y_
   */
  add_y(y_) {
    this.y += y_;
    return this;
  }

  x() {
    return this.x;
  }

  y() {
    return this.y;
  }

  /**
   * 指定の角度(°）で、反時計回りに回転する
   * @param {*} kaku
   */
  rot(kaku) {
    var rad = (Math.PI * kaku) / 180;
    var x_ = Math.cos(rad) * this.x - Math.sin(rad) * this.y;
    var y_ = Math.sin(rad) * this.x + Math.cos(rad) * this.y;
    this.x = x_;
    this.y = y_;
    return this;
  }

  /**
   * コピーする
   */
  copy() {
    return new Point(this.x, this.y);
  }
}

class Line {
  constructor() {}

  /**
   * ポイントを簡略化する
   * @param {*} points_
   */
  _recalcPoint(points_) {
    var newPoints_ = [];
    var point1_;
    var point2_;
    points_.forEach((point_, ind, points_) => {
      if (!point1_) {
        point1_ = point_;
        newPoints_.push(point_);
      } else {
        if (!point2_) {
          point2_ = point_;
        } else {
          if (this.isOneLine(point1_, point2_, point_)) {
            point2_ = point_;
          } else {
            newPoints_.push(point2_);
            point1_ = point2_;
            point2_ = point_;
          }
        }
      }
      if (ind == points_.length - 1) {
        newPoints_.push(point_);
      }
    });
    return newPoints_;
  }

  /**
   * 四角のコネクションの循環グループを生成する。
   * @param {*} point_
   * @param {*} width_
   */
  _generatePointConnects(point_, width_) {
    const rotPtrn = [
      { x: 1, y: 1 },
      { x: -1, y: 1 },
      { x: -1, y: -1 },
      { x: 1, y: -1 },
    ];
    var conGrp_ = [];
    rotPtrn.forEach((rot_, i) => {
      var pt_ = new Point(point_.x, point_.y);
      pt_.add_xy((rot_.x * width_) / 2, (rot_.y * width_) / 2);
      var con_ = new Connector(pt_.x, pt_.y);
      conGrp_.push(con_);
      if (i > 0) {
        conGrp_[i - 1].connect_to(conGrp_[i]);
      }
    });
    conGrp_[conGrp_.length - 1].connect_to(conGrp_[0]);
    return conGrp_;
  }

  /**
   * pathポイントを生成する
   * @param {*} point_
   */
  _madePathPoints(point_) {
    var new_pt_ = this._recalcPoint(point_);
    var conGrps_ = [];
    new_pt_.forEach((pt_) => {
      var conGrp_ = this._generatePointConnects(pt_, 2);
      conGrps_.push(conGrp_);
      if (conGrps_.length > 1) {
        // connector同士を再結合する。
        var conGrp1_ = conGrps_[conGrps_.length - 2];
        var conGrp2_ = conGrps_[conGrps_.length - 1];
        var nearPear = [];
        var nearLength = 0;
        conGrp1_.forEach((con1) => {
          conGrp2_.forEach((con2) => {
            if (nearLength == 0) {
              nearPear.push(con1);
              nearPear.push(con2);
              nearLength = con1.myPoint().lengthFrom(con2.myPoint());
            } else {
              var sel_Length = con1.myPoint().lengthFrom(con2.myPoint());
              if (sel_Length < nearLength) {
                nearLength = sel_Length;
                nearPear.splice(0);
                nearPear.push(con1);
                nearPear.push(con2);
              }
            }
          });
        });
        if (
          this.isOneLine(
            nearPear[0].myPoint(),
            nearPear[0].conPoint(),
            nearPear[1].myPoint()
          )
        ) {
          var con1_1 = nearPear[0];
          var con2_1 = nearPear[1];
          var con1_2 = nearPear[0].conby;
          var con2_2 = nearPear[1].con;
          con2_1.connect_to(con1_1);
          con1_2.connect_to(con2_2);
          return;
        }
        if (
          this.isOneLine(
            nearPear[1].myPoint(),
            nearPear[1].conPoint(),
            nearPear[0].myPoint()
          )
        ) {
          var con1_1 = nearPear[1];
          var con2_1 = nearPear[0];
          var con1_2 = nearPear[1].conby;
          var con2_2 = nearPear[0].con;
          con2_1.connect_to(con1_1);
          con1_2.connect_to(con2_2);
          return;
        }
      }
    });

    var path = [];
    var con_ = conGrps_[0][0];
    var firstPoint = con_.myPoint();
    do {
      path.push(con_.myPoint());
      con_ = con_.con;
    } while (firstPoint !== con_.myPoint());
    return this._recalcPoint(path);
  }

  /**
   * 直進性を考慮してpointを追加
   * @param {*} points_
   * @param {*} point_
   */
  addPointLikeLine(points_, point_) {}

  /**
   * 3つのポイントが一直線上に並ぶかどうか判定
   * @param {*} pt1_
   * @param {*} pt2_
   * @param {*} pt3_
   */
  isOneLine(pt1_, pt2_, pt3_) {
    var dx1_ = pt2_.x - pt1_.x;
    var dy1_ = pt2_.y - pt1_.y;
    var dx2_ = pt3_.x - pt1_.x;
    var dy2_ = pt3_.y - pt1_.y;

    if (dx1_ == 0) {
      return dx2_ == 0;
    } else {
      if (dx2_ == 0) {
        return false;
      } else {
        if (dy1_ / dx1_ == dy2_ / dx2_) {
          return true;
        } else {
          return false;
        }
      }
    }
  }
}

class Connector {
  constructor(x, y) {
    this.myPt = new Point(x, y);
  }

  /**
   * 指定のコネクターに結合する
   * 結合先の元々結合されていたコネクタを返す。
   * @param {*} connector_
   */
  connect_to(connector_) {
    this.con = connector_;
    return connector_.connect_by(this);
  }

  /**
   * 指定のコネクターに結合される。
   * 元々結合されていたコネクタを返す
   * @param {*} connector_
   */
  connect_by(connector_) {
    var motocon = this.conby;
    this.conby = connector_;
    return motocon;
  }

  myPoint() {
    return this.myPt;
  }

  /**
   *  結合している先
   */
  con() {
    if (this.con) {
      return this.con;
    } else {
      return null;
    }
  }

  /**
   * 結合しているコネクトポイント
   */
  conPoint() {
    if (this.con) {
      return this.con.myPoint();
    } else {
      return null;
    }
  }

  /**
   * 結合されているコネクション
   */
  conby() {
    return this.conby;
  }

  /**
   * 指定のコネクションが、現在のコネクション先直線上にありかつ、より距離が長い場合に
   * 指定のコネクションに切り替える
   * @param {*} connector_
   */
  liner_connect(connector_) {
    if (this.con) {
      if (this.isOneLine(this.myPoint, this.con.myPoint, connector_.myPoint)) {
        if (
          this.myPoint.lengthFrom(this.con.myPoint) <
          this.myPoint.lengthFrom(connector_.myPoint)
        ) {
          this.connect_to(connector_);
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    } else {
      this.connect_to(connector_);
      return true;
    }
  }

  /**
   * 3つのポイントが一直線上に並ぶかどうか判定
   * @param {*} pt1_
   * @param {*} pt2_
   * @param {*} pt3_
   */
  isOneLine(pt1_, pt2_, pt3_) {
    var dx1_ = pt2_.x - pt1_.x;
    var dy1_ = pt2_.y - pt1_.y;
    var dx2_ = pt3_.x - pt1_.x;
    var dy2_ = pt3_.y - pt1_.y;

    if (dx1 == 0) {
      return dx2_ == 0;
    } else {
      if (dx2_ == 0) {
        return false;
      } else {
        if (dy1_ / dx1_ == dy2_ / dx2_) {
          return true;
        } else {
          return false;
        }
      }
    }
  }
}

const line_ = new Line();
const testPoints = [];
testPoints.push(new Point(0, 0));
testPoints.push(new Point(5, 0));
testPoints.push(new Point(5, 0));
testPoints.push(new Point(5, 3));
testPoints.push(new Point(5, 5));
testPoints.push(new Point(5, 7));
var ans = line_._madePathPoints(testPoints);
console.log(ans);
