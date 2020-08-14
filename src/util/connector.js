import Point from "./point";

export default class Connector {
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
