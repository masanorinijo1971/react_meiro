import React, { Component } from "react";
import { connect } from "react-redux";
import { View, Image, TouchableOpacity, Text, TextInput } from "react-native";
import baseStyle from "../style/baseStyle";
import { Actions } from "react-native-router-flux";
import { initMeiro, createMeiro } from "../reducer/meiroReducer";

class GameSetting extends Component {
  constructor(props) {
    super(props);
    this.state = {
      winWidth: props.winWidth,
      winHeight: props.winHeight,
      meiroCreater: props.meiroCreater,
    };
  }

  componentWillMount() {}

  onSubmit() {
    // Actions.play();
  }

  backHome() {
    Actions.home();
  }

  render() {
    return (
      <View style={baseStyle.setting}>
        <Text>setting</Text>
        <Text>
          {" width:" +
            Math.floor(this.state.winWidth) +
            "height:" +
            Math.floor(this.state.winHeight)}
        </Text>
        <TextInput></TextInput>
        <View style={baseStyle.play2}>
          <TouchableOpacity onPress={this.backHome}>
            <Image
              style={baseStyle.btn}
              source={require("../image/modoru_btn.png")}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={this.onSubmit}>
            <Image
              style={baseStyle.btn}
              source={require("../image/modoru_btn.png")}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={this.onSubmit}>
            <Image
              style={baseStyle.btn}
              source={require("../image/modoru_btn.png")}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  onInitMeiro: () => {
    console.log("onInitMeiro:");
    dispatch(initMeiro({}));
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
    onInitMeiro: () => {
      dispatchProps.onInitMeiro({});
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(GameSetting);
