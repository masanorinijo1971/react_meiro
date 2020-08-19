import React, { Component } from "react";
import { View, StatusBar, Dimensions } from "react-native";
import LoadingView from "../../element/LoadingView";
import PropTypes from "prop-types";
import Modal from "../../element/Modal";

export default class BasePage extends Component {
  static propTypes = {
    showHeader: PropTypes.bool,
    headerProps: PropTypes.object,
    pageName: PropTypes.string,
  };

  constructor(props) {
    super(props);
    this.state = {
      ready: false,
      winWidth: props.winWidth,
      winHeight: props.winHeight,
    };
  }

  _renderChildren() {
    if (this.props.children) {
      const children = this.props.children;
      if (!children.length) {
        return this.props.children;
      } else if (this.props.children.length === 2) {
        return (
          <View
            style={{ flexDirection: "row", alignItems: "stretch", flex: 1 }}
          >
            <View style={{ flex: 1 }}>{this.props.children[0]}</View>
            <View style={{ width: 1, backgroundColor: "#979797" }} />
            <View style={{ flex: 1 }}>{this.props.children[1]}</View>
          </View>
        );
      } else {
        return this.props.children;
      }
    }
    return null;
  }

  render() {
    // 画面サイズに合わせてスケール (defaultWidthの幅前提でデザインされているため)
    const defaultWidth = this.state.winWidth;
    const defaultHeight = this.setState.winHeight;
    const windowSize = Dimensions.get("window");
    const scale = windowSize.width / defaultWidth;

    return (
      <View style={{ width: defaultWidth, height: defaultHeight }}>
        <StatusBar barStyle="light-content" />
        <View
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            alignItems: "stretch",
          }}
        >
          <View style={{ flex: 1 }}>{this._renderChildren()}</View>
        </View>
        <Modal />
        <LoadingView />
      </View>
    );
  }
}
