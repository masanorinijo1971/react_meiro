import React, { Component } from "react";
import { Animated, Image } from "react-native";
import { Easing } from "react-native-reanimated";
import baseStyle from "../style/baseStyle";

class Loading extends Component {
  constructor(props) {
    super(props);
    this.state = {
      deg: new Animated.Value(0),
    };
  }

  componentWillMount() {}

  componentDidMount() {
    this._rotate();
  }

  _rotate() {
    Animated.timing(this.state.deg, {
      toValue: 1,
      duration: 10000,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start(() => {
      this.setState({ deg: new Animated.Value(0) });
      this._rotate();
    });
  }

  render() {
    var deg_ = this.state.deg.interpolate({
      inputRange: [0, 1],
      outputRange: ["0deg", "3600deg"],
    });
    var img = require("../image/map.png");
    return (
      <Animated.View style={{ transform: [{ rotate: deg_ }] }}>
        <Image style={baseStyle.btn} source={img} />
      </Animated.View>
    );
  }
}

export default Loading;
