export default class Point {
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

  ratio(ratio_) {
    return { x: this.x * this.ratio, y: this.y * ratio };
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

  getValue() {
    return {
      x: this.x,
      y: this.y,
    };
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
