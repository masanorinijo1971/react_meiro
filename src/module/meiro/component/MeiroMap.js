import React, { Component } from "react";
import { connect } from "react-redux";
import { View, Image, TouchableOpacity, Text } from "react-native";
import Wall from "./Wall";
import Line from "./Line";
import Point from "../../../util/point";

export default class MeiroMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      offset_x: props.width / 2,
      offset_y: props.width / 2,
      path: props.drawPath,
      line: props.playPath,
      color: props.color ? props.color : "#ffffff",
      width: props.width,
      length: props.length,
      views: [],
    };
  }

  componentDidMount() {}

  componentWillReceiveProps(props) {
    console.log("MeiroMap_componentWillReceiveProps");
    this.setState({
      path: props.drawPath,
      line: props.playPath,
      views: this._renderMap(props.drawPath, props.playPath),
    });
  }
  shouldComponentUpdate(nextProps, nextState) {
    return true;
  }
  componentWillUpdate(nextProps, nextState) {
    console.log("MeiroMap_componentWillUpdate");
    // console.log("componentWillUpdate");
    // this._renderMap();
  }

  _renderMap(path_, line_) {
    console.log("MeiroMap_renderMap");
    // console.log(line_);
    var view_ = [];
    if (path_.length > 0) {
      path_.forEach((ms, y_) => {
        ms.forEach((m, x_) => {
          view_.push(
            <Wall
              type={m}
              x={this.state.length * x_ + this.state.offset_x}
              y={this.state.length * y_ + this.state.offset_y}
              width={this.state.width}
              length={this.state.length}
              color={this.state.color}
            />
          );
        });
      });
    }

    view_.push(
      <Line
        x={3}
        y={3}
        points={line_}
        type={"0000"}
        color={"#ff00ff"}
        width={this.state.width + 6}
        length={this.state.length}
      />
    );

    return view_;
  }

  render() {
    return this.state.views;
  }
}
