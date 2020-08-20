import React, { Component } from "react";
import { View, Image } from "react-native";
import { connect } from "react-redux";
import componentStyles from "../style/baseStyle";

class LoadingView extends Component {
  constructor(props) {
    console.log("Loading_constructor");
    super(props);
    this.state = {
      isLoading: props.isLoading,
    };
  }

  componentWillMount() {
    console.log("Loading_componentWillMount()");
  }

  componentDidMount() {
    console.log("Loading_componentDidMount()");
  }

  componentWillReceiveProps(nextProps) {
    // Propsの変更をstateに反映する場合はここに記述
    this.setState({
      isLoading: nextProps.isLoading,
    });
    console.log("Loading_componentWillReceiveProps");
  }

  shouldComponentUpdate(nextProps, nextState) {
    console.log("Loading_shouldComponentUpdate");
    return true;
  }

  componentWillUpdate(nextProps, nextState) {
    // 注意:
    // このメソッド内でthis.setState()を使用することは出来ません。
    // propの変更によりstateを更新する必要がある場合は、代わりにcomponentWillReceivePropsを使用して下さい。
    console.log("Loading_componentWillUpdate");
  }

  componentDidUpdate(prevProps, prevState) {
    // コンポーネントが更新されDOMが一新された直後に実行されます。 このメソッドは初期描画では呼び出されません。
    // コンポーネントが更新された際にDOMを操作したい場合にはこれを使用して下さい。

    console.log("Loading_componentDidUpdate");
  }

  render() {
    return !this.state.isLoading ? null : (
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
