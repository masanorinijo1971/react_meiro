import React from "react";
import { TouchableOpacity } from "react-native";
import { playButtonTouch } from "./sfx";
import PropTypes from "prop-types";

export default class TouchableOpacitySfx extends React.Component {
  static propTypes = {
    onPress: PropTypes.func,
    // TODO Add other TouchableOpacity's properties
  };

  render() {
    return (
      <TouchableOpacity
        {...this.props}
        onPress={() => {
          playButtonTouch();
          this.props.onPress && this.props.onPress();
        }}
      >
        {this.props.children}
      </TouchableOpacity>
    );
  }
}
