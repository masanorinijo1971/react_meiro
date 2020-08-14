import React, { Component } from "react";
import {
  Surface,
  ClippingRectangle,
  Shape,
  Path,
} from "@react-native-community/art";
import Point from "../../../util/point";

class Wall extends Component {
  constructor(props) {
    super(props);
    this.state = {
      x: props.x,
      y: props.y,
      path_points: new Array(),
      type: props.type ? props.type : "0000",
      color: props.color ? props.color : "#ffffff",
      width: props.width,
      length: props.length,
      path: this._madePath(
        props.type,
        props.x,
        props.y,
        props.width,
        props.length
      ),
    };
  }

  componentWillReceiveProps(props) {
    // console.log("Wall_componentWillReceiveProps");
    if (this.state.type !== props.type) {
      this.setState({
        path_points: new Array(),
        type: props.type ? props.type : "0000",
        path: this._madePath(
          props.type ? props.type : "0000",
          this.state.x,
          this.state.y,
          this.state.width,
          this.state.length
        ),
      });
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return true;
  }

  _madePath(type_, x_, y_, width_, length_) {
    const path = Path();
    if (type_ == "0000") {
      return path;
    }
    var centerPt = new Point(x_, y_);
    var pt_ = new Point(0, 0);
    var Pt1 = pt_.copy().add_xy(width_ / 2, -width_ / 2);
    var Pt2 = pt_.copy().add_xy(width_ / 2, width_ / 2);
    var Pt1_ = pt_.copy().add_xy(length_ / 2, -width_ / 2);
    var Pt2_ = pt_.copy().add_xy(length_ / 2, width_ / 2);

    var types = String(type_).split("");
    var path_points = [];

    types.forEach((type) => {
      path_points.push(Pt1.copy().add_point(centerPt));
      if (type == "1") {
        path_points.push(Pt1_.copy().add_point(centerPt));
        path_points.push(Pt2_.copy().add_point(centerPt));
      }
      path_points.push(Pt2.copy().add_point(centerPt));
      Pt1.rot(90);
      Pt2.rot(90);
      Pt1_.rot(90);
      Pt2_.rot(90);
    });

    var fstFlg = true;
    path_points.forEach((point) => {
      if (fstFlg) {
        path.moveTo(point.x, point.y);
        fstFlg = false;
      } else {
        path.lineTo(point.x, point.y);
      }
    });

    return path;
  }

  _madePathpath_points() {
    if (this.state.type == "0000") {
      return;
    }
    var centerPt = new Point(this.state.x, this.state.y);
    var pt_ = new Point(0, 0);
    var Pt1 = pt_.copy().add_xy(this.state.width / 2, -this.state.width / 2);
    var Pt2 = pt_.copy().add_xy(this.state.width / 2, this.state.width / 2);
    var Pt1_ = pt_.copy().add_xy(this.state.length / 2, -this.state.width / 2);
    var Pt2_ = pt_.copy().add_xy(this.state.length / 2, this.state.width / 2);

    var types = String(this.state.type).split("");

    types.forEach((type) => {
      this.state.path_points.push(Pt1.copy().add_point(centerPt));
      if (type == "1") {
        this.state.path_points.push(Pt1_.copy().add_point(centerPt));
        this.state.path_points.push(Pt2_.copy().add_point(centerPt));
      }
      this.state.path_points.push(Pt2.copy().add_point(centerPt));
      Pt1.rot(90);
      Pt2.rot(90);
      Pt1_.rot(90);
      Pt2_.rot(90);
    });
  }

  render() {
    return (
      <Shape d={this.state.path} fill={this.state.color} strokeWidth={1000} />
    );
  }
}

export default Wall;
