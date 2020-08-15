import React, { Component } from "react";
import { Shape, Path } from "@react-native-community/art";
import Point from "../../../util/point";
import Connector from "../../../util/connector";

class Line extends Component {
  constructor(props) {
    super(props);
    this.state = {
      x: props.x,
      y: props.y,
      points: props.points,
      type: props.type ? props.type : "0000",
      color: props.color ? props.color : "#ff00ff",
      width: props.width,
      length: props.length,
      path: this._madePath(
        props.points,
        props.x,
        props.y,
        props.width,
        props.length
      ),
    };
  }

  componentWillReceiveProps(props) {
    console.log("Line_componentWillReceiveProps");
    this.setState({
      points: props.points,
      path: this._madePath(
        props.points,
        this.state.x,
        this.state.y,
        this.state.width,
        this.state.length
      ),
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    return true;
  }

  /**
   * Pathにポイントをセットする
   * @param {*} type_
   * @param {*} x_
   * @param {*} y_
   * @param {*} width_
   * @param {*} length_
   */
  _madePath(points_, x_, y_, width_, length_) {
    const path = Path();
    var path_points = this._madePathPoints(points_, length_, width_);

    if (path_points.length) {
      var fstFlg = true;
      path_points.forEach((point) => {
        if (fstFlg) {
          path.moveTo(point.x, point.y);
          fstFlg = false;
        } else {
          path.lineTo(point.x, point.y);
        }
      });
    }

    return path;
  }

  /**
   * pointをスケーリングする
   * @param {*} points_
   * @param {*} x_
   * @param {*} y_
   * @param {*} width_
   * @param {*} length_
   */
  _scalePoints(points_, length_) {
    return points_.map((pt) => {
      return {
        x: ((pt.x - 1) * length_) / 2 + length_ / 2,
        y: ((pt.y - 1) * length_) / 2 + length_ / 2,
      };
    });
  }

  /**
   * pathポイントを生成する
   * @param {*} point_
   */
  _madePathPoints(point_, length_, width_) {
    var scale_pt = this._scalePoints(point_, length_);
    var new_pt_ = this._recalcPoint(scale_pt);
    if (new_pt_ !== undefined && new_pt_ !== null && new_pt_.length == 0) {
      return [];
    }
    var conGrps_ = [];
    new_pt_.forEach((pt_) => {
      var conGrp_ = this._generatePointConnects(pt_, width_);
      conGrps_.push(conGrp_);
      if (conGrps_.length > 1) {
        // connector同士を再結合する。
        var conGrp1_ = conGrps_[conGrps_.length - 2];
        var conGrp2_ = conGrps_[conGrps_.length - 1];
        var nearPear = [];
        var nearLength = 0;
        conGrp1_.forEach((con1) => {
          conGrp2_.forEach((con2) => {
            if (
              this.isOneLine(con1.myPoint(), con1.conPoint(), con2.myPoint()) ||
              this.isOneLine(con2.myPoint(), con2.conPoint(), con1.myPoint())
            ) {
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

    // return path;
    return this._recalcPoint(path);
  }

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

  render() {
    return (
      <Shape d={this.state.path} fill={this.state.color} strokeWidth={1000} />
    );
  }
}

export default Line;
