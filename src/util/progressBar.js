"use strict";

import React, { Component } from "react";
import { View, Animated, Dimensions, Easing } from "react-native";
import componentStyles from "../../styles/widgets/ProgressBar";

class ProgressBarComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isShow: false,
      progress: new Animated.Value(0.99),
      blocking: props.blocking || DEFAULT_BLOCKING_MODE,
    };
    this.windowWidth = Dimensions.get("window").width;
  }

  componentDidMount() {
    const { global } = this.props;
    if (global) {
      ProgressBarComponent.instance = this;
    }
  }

  componentWillUnmount() {
    const { global } = this.props;
    if (global) {
      delete ProgressBarComponent.instance;
    }
  }

  show(blocking) {
    const { progress } = this.state;
    progress.setValue(0.99);
    this.setState({
      isShow: true,
      blocking,
    });
    Animated.timing(progress, {
      easing: Easing.bezier(0.04, 0.9, 0.11, 0.9),
      duration: ANIMATED_DURATION,
      toValue: ANIMATION_TO_VALUE,
    }).start();
  }

  hide() {
    const { progress } = this.state;
    Animated.timing(progress, {
      easing: Easing.inOut(Easing.ease),
      duration: FAST_ANIMATED_DURATION,
      toValue: ANIMATION_TO_VALUE,
    }).start(() =>
      this.setState({
        isShow: false,
        blocking: DEFAULT_BLOCKING_MODE,
      })
    );
  }

  onLayout(event) {
    if (this.windowWidth !== event.nativeEvent.layout.width) {
      this.windowWidth = event.nativeEvent.layout.width;
    }
  }

  render() {
    const { isShow, blocking } = this.state;
    const fillWidth = this.state.progress.interpolate({
      inputRange: [0, 1],
      outputRange: [0 * this.windowWidth, 1 * this.windowWidth],
    });

    if (!isShow) {
      return null;
    }

    return (
      <View
        style={componentStyles.background}
        onLayout={(event) => this.onLayout(event)}
      >
        {isShow && blocking && <View style={componentStyles.overlay} />}
        <Animated.View
          style={[componentStyles.fill, { marginRight: fillWidth }]}
        />
      </View>
    );
  }
}

const ANIMATED_DURATION = 12000;
const FAST_ANIMATED_DURATION = 300;
const ANIMATION_TO_VALUE = 0;
const DEFAULT_BLOCKING_MODE = true;

const ProgressBar = {
  Component: ProgressBarComponent,
  start(blocking = DEFAULT_BLOCKING_MODE) {
    const { instance } = ProgressBarComponent;
    instance && instance.show(blocking);
  },
  stop() {
    const { instance } = ProgressBarComponent;
    instance && instance.hide();
  },
};

export default ProgressBar;
