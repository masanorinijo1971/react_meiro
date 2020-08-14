import React, { Component } from "react";
import { View, Image, TouchableOpacity, Text } from "react-native";
import baseStyle from "../style/baseStyle";
import { Actions } from "react-native-router-flux";
import Loading_ from "../element/loading";

class Loading extends Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {}

  componentDidMount() {}

  componentWillUpdate(nextProps, nextState) {
    // this.maps = this.props.meiroCreater.convertDrawMap();
    console.log("componentWillUpdate");
  }

  backHome() {
    Actions.home();
  }

  render() {
    return (
      <View style={baseStyle.play}>
        <Loading_ />
      </View>
    );
  }
}

export default Loading;
