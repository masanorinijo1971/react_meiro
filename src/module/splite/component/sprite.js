import React, { Component } from "react";
import { View, Animated, LayoutAnimation, Image } from "react-native";
import { Easing } from "react-native-reanimated";
import { connect } from "react-redux";
import baseStyle from "../../../style/baseStyle";

class Sprite extends Component {
  constructor(props) {
    super(props);
    this.state = {
      x: new Animated.Value(10),
      y: new Animated.Value(10),
      rot: new Animated.Value(0),
      scale: new Animated.Value(0.3),
      isMoving: false,
      offset: props.offset,
      drawWidth: props.drawWidth, //描写幅
      drawLength: props.drawLength, //ブロック長さ
    };
  }

  componentWillMount() {}

  componentDidMount() {}

  componentWillReceiveProps(nextProps) {
    // Propsの変更をstateに反映する場合はここに記述
    // this._actionPlay(nextProps);
    if (nextProps.his) {
      this._madeAnimesByHis(nextProps.his);
    }
    console.log("splite_componentWillReceiveProps");
  }

  shouldComponentUpdate(nextProps, nextState) {
    console.log("splite_shouldComponentUpdate");
    return true;
  }

  _madeAnimesByHis(his) {
    if (!his.length) {
      return;
    }
    var animes = [];
    his.forEach((pt) => {
      // console.log(pt);
      // x += pt.x * 1;
      // y += pt.y * 1;
      var anime = [];
      anime.push(
        Animated.timing(this.state.x, {
          toValue: (pt.x * this.state.drawLength) / 2 + this.state.offset.x,
          duration: 100,
          easing: Easing.linear,
          useNativeDriver: false,
        })
      );
      anime.push(
        Animated.timing(this.state.y, {
          toValue: (pt.y * this.state.drawLength) / 2 + this.state.offset.y,
          duration: 100,
          easing: Easing.linear,
          useNativeDriver: false,
        })
      );
      animes.push(Animated.parallel(anime));
    });
    // console.log(animes);
    Animated.sequence(animes).start(this.setState({ isMoving: false }));
  }

  _actionPlay(nextProps) {
    // if (!this.isMoving) {
    this.setState({ isMoving: true });
    Animated.parallel([
      Animated.timing(this.state.x, {
        toValue: nextProps.x,
        duration: 1000,
        easing: Easing.linear,
      }),
      Animated.timing(this.state.y, {
        toValue: nextProps.y,
        duration: 1000,
        easing: Easing.linear,
      }),
      Animated.timing(this.state.rot, {
        toValue: nextProps.rot,
        duration: 1000,
        easing: Easing.linear,
      }),
      Animated.timing(this.state.scale, {
        toValue: nextProps.scale,
        duration: 1000,
        easing: Easing.linear,
      }),
    ]).start(this.setState({ isMoving: false }));
    // }
  }

  render() {
    var { x, y, rot, scale } = this.state;
    var deg_ = rot.interpolate({
      inputRange: [0, 4],
      outputRange: ["0deg", "360deg"],
    });
    var img = require("../../../image/ball.png");
    return (
      <Animated.Image
        style={{
          position: "absolute",
          left: x,
          top: y,
          transform: [{ scale: scale }, { rotate: deg_ }],
        }}
        source={img}
      />
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    // onActionPlay: () => {
    //   dispatch(actionCreator)
    // }
  };
};

const mapStateToProps = (state) => ({
  x: state.sprite.x,
  y: state.sprite.y,
  rot: state.sprite.rot,
  scale: state.sprite.scale,
  step: state.sprite.step,
  his: state.meiro.ans,
  offset: state.meiro.offset,
  drawWidth: state.meiro.drawWidth, //描写幅
  drawLength: state.meiro.drawLength, //ブロック長さ
});

const mergeProps = (stateProps, dispatchProps, ownProps) => {
  return {
    ...ownProps,
    ...stateProps,
    ...dispatchProps,
  };
};

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(Sprite);
