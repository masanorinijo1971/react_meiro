import React, { Component } from "react";
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Animated,
  TouchableWithoutFeedback,
  LayoutAnimation,
  TouchableOpacity,
  Image,
} from "react-native";
import { Actions } from "react-native-router-flux";
import baseStyle from "../style/baseStyle";

export default class AnimeTest extends Component {
  constructor(props) {
    super(props);
    this.state = {
      greenWidth: 100,
      whiteDegree: new Animated.Value(0),
      yellowScale: new Animated.Value(1),
      backgroundColor: new Animated.Value(0),
      isMove: false,
    };
  }

  componentWillMount() {}

  componentDidMount() {
    this.state.yellowScale.addListener((value) => {
      this._yellowScale = value.value;
    });
    this.state.yellowScale.setValue(1);

    this._changeBackgroundColor();
  }

  _onActionPlay() {
    if (!this.state.isMove) {
      this.setState({
        isMove: true,
      });
      Animated.parallel([
        Animated.timing(this.state.x, {
          toValue: this.props.x,
          duration: 1000,
        }),
        Animated.timing(this.state.y, {
          toValue: this.props.y,
          duration: 1000,
        }),
        Animated.timing(this.state.rot, {
          toValue: this.props.rot,
          duration: 1000,
        }),
        Animated.timing(this.state.scale, {
          toValue: this.props.scale,
          duration: 1000,
        }),
      ]).start(this.setState({ isMove: false }));
    }
  }

  render() {
    var color = this.state.backgroundColor.interpolate({
      inputRange: [0, 150, 300],
      outputRange: [
        "rgba(13, 87, 78, 1.0)",
        "rgba(56, 45, 32, 1.0)",
        "rgba(00, 00, 255, 0.2)",
      ],
    });

    var deg = this.state.whiteDegree.interpolate({
      inputRange: [0, 1],
      outputRange: ["0deg", "600deg"],
    });

    return (
      <Animated.View style={[styles.container, { backgroundColor: color }]}>
        <Animated.View
          style={{
            backgroundColor: "ghostwhite",
            shadowColor: "lightgray",
            borderRadius: 6,
            width: 100,
            height: 100,
            margin: 20,
            transform: [{ rotate: deg }],
          }}
        />

        <TouchableWithoutFeedback onPress={this._onPressGreen.bind(this)}>
          <View
            style={{
              backgroundColor: "green",
              width: this.state.greenWidth,
              height: 100,
              margin: 20,
            }}
          />
        </TouchableWithoutFeedback>

        <TouchableWithoutFeedback onPress={this._onPressYellow.bind(this)}>
          <Animated.View
            style={{
              backgroundColor: "yellow",
              width: 100,
              height: 100,
              transform: [{ scale: this.state.yellowScale }],
            }}
          />
        </TouchableWithoutFeedback>
        <TouchableOpacity onPress={this.backHome} style={baseStyle.btn}>
          <Image
            style={baseStyle.btn}
            source={require("../image/modoru_btn.png")}
          />
        </TouchableOpacity>
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
