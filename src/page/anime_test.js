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

  _changeBackgroundColor() {
    this.state.backgroundColor.setValue(0);
    this.state.whiteDegree.setValue(0);

    Animated.sequence([
      Animated.parallel([
        Animated.timing(this.state.backgroundColor, {
          toValue: 300,
          duration: 20000,
        }),
        Animated.timing(this.state.whiteDegree, {
          toValue: 1,
          duration: 20000,
        }),
      ]),
      Animated.parallel([
        Animated.timing(this.state.backgroundColor, {
          toValue: 0,
          duration: 20000,
        }),
        Animated.timing(this.state.whiteDegree, {
          toValue: 0,
          duration: 20000,
        }),
      ]),
    ]).start(this._changeBackgroundColor.bind(this));
  }

  _onPressGreen() {
    LayoutAnimation.spring();
    this.setState({ greenWidth: this.state.greenWidth + 20 });
  }

  _onPressYellow() {
    Animated.spring(this.state.yellowScale, {
      toValue: this._yellowScale - 0.1,
      friction: 1,
    }).start();
  }

  backHome() {
    Actions.home();
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
