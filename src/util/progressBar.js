import React, { Component } from "react";
import { View, Animated, Dimensions, Easing, Text, Image } from "react-native";
import baseStyle from "../style/baseStyle";
class Loading extends Component {
  constructor(props) {
    console.log("Loading_constructor(props)");
    super(props);
    this.state = {
      deg: new Animated.Value(0),
      isLoading: true,
      cnt: 0,
    };
    this._rotate();
  }

  componentDidMount() {
    console.log("Loading_componentDidMount()");
    this._rotate();
    Loading.instance = this;
  }

  componentWillUnmount() {
    console.log("Loading_componentWillUnmount()");
    delete Loading.instance;
  }

  componentWillReceiveProps(object, nextProps) {
    console.log("Loading_componentWillReceiveProps(object, nextProps)");
    this.setState({ isLoading: nextProps.isLoading });
  }

  shouldComponentUpdate(nextProps, nextState) {
    console.log("Loading_shouldComponentUpdate");

    return true;
  }

  start() {
    console.log("Loading_start()");
    this.setState({
      isLoading: true,
      cnt: 0,
    });
    this._rotate();
  }

  stop() {
    console.log("Loading_stop()");
    this.setState({
      isLoading: false,
      cnt: 0,
    });
  }

  _rotate() {
    console.log("Loading__rotate()");
    var cnt_ = this.state.cnt + 1;
    this.setState({
      cnt: cnt_,
    });
    if (this.state.isLoading) {
      Animated.timing(this.state.deg, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      }).start(() => {
        this.setState({ deg: new Animated.Value(0) });
        this._rotate();
      });
    }
  }

  render() {
    console.log("Loading_render()");
    var deg_ = this.state.deg.interpolate({
      inputRange: [0, 1],
      outputRange: ["0deg", "360deg"],
    });
    var img = require("../image/map.png");
    return (
      <Animated.View style={{ transform: [{ rotate: deg_ }] }}>
        <Text>cnt:{this.state.cnt}</Text>
        <Image style={baseStyle.btn} source={img} />
      </Animated.View>
    );
  }
}

const ProgressBar = {
  Component: Loading,
  start() {
    const { instance } = Loading;
    instance && instance.start();
  },
  stop() {
    const { instance } = Loading;
    instance && instance.stop();
  },
};

export default ProgressBar;
