import React, { Component } from "react";
import { View, Image } from "react-native";
import { connect } from "react-redux";
import componentStyles from "../style/baseStyle";

class LoadingView extends Component {
  render() {
    return this.props.isLoading ? null : (
      <View style={componentStyles.background}>
        <View style={componentStyles.loadingBackground}>
          <Image
            style={componentStyles.loading}
            source={require("../image/loading.gif")}
          />
        </View>
      </View>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({});

const mapStateToProps = (state) => ({
  isLoading: state.common.isLoading,
});

export default connect(mapStateToProps, mapDispatchToProps)(LoadingView);
