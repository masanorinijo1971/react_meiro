import React, { Component } from "react";
import { connect } from "react-redux";
import { View, Image, TouchableOpacity, Text } from "react-native";
import baseStyle from "../style/baseStyle";
import { Actions } from "react-native-router-flux";
import { initMeiro, createMeiro } from "../reducer/meiroReducer";
import { loading } from "../util/LoadingEffect";
// import { TouchableOpacitySfx } from "../util/TouchableOpacitySfx";

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      winWidth: props.winWidth,
      winHeight: props.winHeight,
    };
  }

  componentWillMount() {}

  gameStart() {
    // this.props.go_play();
    Actions.play();
  }

  anime_test() {
    Actions.anime_test();
  }

  gotoSetting() {
    Actions.game_setting();
  }

  gotoLoading() {
    Actions.loading();
  }

  render() {
    return (
      <View style={baseStyle.home}>
        <Text>home</Text>
        <Text>
          {" width:" +
            Math.floor(this.state.winWidth) +
            "height:" +
            Math.floor(this.state.winHeight)}
        </Text>
        <Image style={baseStyle.logo} source={require("../image/title4.png")} />
        <TouchableOpacity onPress={this.gameStart.bind(this)}>
          <Image
            style={baseStyle.btn_long}
            source={require("../image/start_btn.png")}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={this.gotoLoading}>
          <Image
            style={baseStyle.btn_long}
            source={require("../image/start_btn.png")}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={this.anime_test}>
          <Image
            style={baseStyle.btn_long}
            source={require("../image/start_btn.png")}
          />
        </TouchableOpacity>
      </View>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  go_play: () => {
    loading(
      dispatch,
      function () {
        dispatch(initMeiro({}));
      },
      function () {
        // Actions.play();
      }
    );
  },
});

const mapStateToProps = (state) => ({
  winWidth: state.common.winWidth,
  winHeight: state.common.winHeight,
  width: state.meiro.width,
  height: state.meiro.height,
  createrCnt: state.meiro.createrCnt,
});

const mergeProps = (stateProps, dispatchProps, ownProps) => {
  return {
    ...ownProps,
    ...stateProps,
    ...dispatchProps,
  };
};

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(Home);
