import React, { Component } from "react";
import { connect } from "react-redux";
import { View, Image, Text } from "react-native";
import baseStyle from "../style/baseStyle";
import PropTypes from "prop-types";
import { Actions } from "react-native-router-flux";
import { setWinSize } from "../reducer/commonReducer";
import { waitAsync } from "../util/waitAsync";
import { getWinsize } from "../util/ComponentDefinitions";

class Initial extends Component {
  constructor(props) {
    super(props);
    this.state = {
      winWidth: 100,
      winHeight: 200,
    };
  }

  async componentWillMount() {
    this.props.onInit();
    await waitAsync(1000);
  }
  async componentDidMount() {
    await waitAsync(1000);
    Actions.home();
  }

  render() {
    return (
      <View style={baseStyle.initial}>
        <Text>Initilal</Text>
        <Image
          style={baseStyle.title}
          source={require("../image/kotokotobokanmark.png")}
        />
      </View>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  onInit: () => {
    var size = getWinsize();
    dispatch(
      setWinSize({
        winWidth: size.x,
        winHeight: size.y,
      })
    );
  },
});

const mapStateToProps = (state) => ({
  winWidth: state.winWidth,
  winHeight: state.winHeight,
});

const mergeProps = (stateProps, dispatchProps, ownProps) => {
  return {
    ...ownProps,
    ...stateProps,
    ...dispatchProps,
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(Initial);
