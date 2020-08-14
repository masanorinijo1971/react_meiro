import React, { Component } from "react";
import { connect } from "react-redux";
import { View, Image, TouchableOpacity, Text } from "react-native";
import { Surface } from "@react-native-community/art";
import baseStyle from "../style/baseStyle";
import { Actions } from "react-native-router-flux";
import GestureRecognizer, {
  swipeDirections,
} from "react-native-swipe-gestures";
import MeiroMap from "../module/meiro/component/MeiroMap";
import { loading } from "../util/LoadingEffect";
import Ld from "../element/loading";
import {
  initMeiro,
  updateMeiro,
  setStGlMeiro,
  setAnsMeiro,
  createMeiro,
  createMeiroAll,
} from "../reducer/meiroReducer";
import { loadEnd, loadStart } from "../reducer/commonReducer";
import mc from "../module/meiro/service/meiroCreater";
import mp from "../module/meiro/service/meiroPlayer";
import { waitAsync } from "../util/waitAsync";
import Point from "../util/point";
class Play extends Component {
  // var className="Play"
  constructor(props) {
    console.log("play_constructor(props)");
    super(props);
    this.state = {
      gestureName: "none",
      backgroundColor: "#fff",
      winWidth: props.winWidth,
      winHeight: props.winHeight,
      width: props.width,
      height: props.height,
      createrCnt: props.createrCnt,
      map: props.map, //ex[[3333333],[3000003],,,]
      drawPath: props.drawPath, //ex[[1100],[1001],,,]
      ans: props.ans,
      isLoading: props.isLoading,
    };
    // this.onLoading();
    // props.onLoading;
    // console.log(this.state);
    // this.props.onInitMeiro();
    // this.initMeiro.bind(this);
    // this.setState({
    //   isLoading: false,
    // });
  }

  componentWillMount() {
    console.log("play_componentWillMount()");
  }

  componentDidMount() {
    console.log("play_componentDidMount()");
    this.onLoading();
    // this.props.onInitMeiro();
  }

  onLoading() {
    console.log("play_onLoading");
    var syori = new Promise((resolve, reject) => {
      // setTimeout(() => {
      //   resolve();
      // }, 10000);
      mc.init(this.state.width, this.state.height, this.state.createrCnt);
      while (!mc.moveCreater(this.state.createrCnt));
      mp.set_map(mc.map);
      mc.showMap();
      console.log("play_onLoading_promise_1");
      resolve("OK:" + this.state.width + "_" + this.state.height);
    }).then((result) => {
      console.log("play_onLoading_promise_then");
      console.log("result:" + result);
      this.props.onUpdateMeiro();
    });
    return syori;
  }

  componentWillReceiveProps(nextProps) {
    // Propsの変更をstateに反映する場合はここに記述
    this.setState({
      map: nextProps.map, //ex[[3333333],[3000003],,,]
      drawPath: nextProps.drawPath, //ex[[1100],[1001],,,]
      ans: nextProps.ans,
      isLoading: nextProps.isLoading,
    });
    console.log("play_componentWillReceiveProps");
  }

  shouldComponentUpdate(nextProps, nextState) {
    console.log("play_shouldComponentUpdate");

    return true;
  }

  componentWillUpdate(nextProps, nextState) {
    // 注意:
    // このメソッド内でthis.setState()を使用することは出来ません。
    // propの変更によりstateを更新する必要がある場合は、代わりにcomponentWillReceivePropsを使用して下さい。
    console.log("play_componentWillUpdate");
  }

  componentDidUpdate(prevProps, prevState) {
    // コンポーネントが更新されDOMが一新された直後に実行されます。 このメソッドは初期描画では呼び出されません。
    // コンポーネントが更新された際にDOMを操作したい場合にはこれを使用して下さい。
    console.log("play_componentDidUpdate");
  }

  backHome() {
    Actions.home();
  }

  initMeiro() {
    console.log("play_initMeiro");
    this.props.oninitMeiro();
  }

  createMeiro() {
    // this.onLoading();
    // this.props.onCreateMeiro();
  }

  moveMeiro() {
    this.props.onMoveMeiro();
  }
  createMeiroAll() {
    // this.props.onInitMeiro();
    this.setState({
      isLoading: true,
    });
    this.props.onCreateMeiroAll();
    this.setState({
      isLoading: false,
    });
  }
  onSwipe(gestureName, gestureState) {
    const { SWIPE_UP, SWIPE_DOWN, SWIPE_LEFT, SWIPE_RIGHT } = swipeDirections;
    this.setState({ gestureName: gestureName });
    switch (gestureName) {
      case SWIPE_UP:
        this.setState({ backgroundColor: "#ff00ff" });
        break;
      case SWIPE_DOWN:
        this.setState({ backgroundColor: "green" });
        break;
      case SWIPE_LEFT:
        this.setState({ backgroundColor: "blue" });
        break;
      case SWIPE_RIGHT:
        this.setState({ backgroundColor: "yellow" });
        break;
    }
  }
  render() {
    console.log("play_render()");
    const isLoading = this.state.isLoading;

    // const { isLoading } = this.state;
    return (
      <View style={baseStyle.play}>
        {isLoading ? (
          <View style={baseStyle.play2}>
            <Ld></Ld>
            <TouchableOpacity onPress={this.backHome}>
              <Image
                style={baseStyle.btn}
                source={require("../image/modoru_btn.png")}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={this.createMeiro.bind(this)}>
              <Image
                style={baseStyle.btn}
                source={require("../image/modoru_btn.png")}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={this.createMeiroAll.bind(this)}>
              <Image
                style={baseStyle.btn}
                source={require("../image/modoru_btn.png")}
              />
            </TouchableOpacity>
          </View>
        ) : (
          <View>
            <Text>{this.state.gestureName}</Text>
            {/* <Text style={{ backgroundColor: this.state.backgroundColor }}>
              {" width:" +
                Math.floor(this.state.winWidth) +
                "height:" +
                Math.floor(this.state.winHeight)}
            </Text> */}
            {/* <GestureRecognizer
              onSwipe={(direction, state) => this.onSwipe(direction, state)}
              // onSwipeUp={this.createMeiro.bind(this)}
              // onSwipeLeft={this.createMeiro.bind(this)}
              // onSwipeRight={this.createMeiro.bind(this)}
              // onSwipeDown={this.createMeiro.bind(this)}
              config={{
                velocityThreshold: 0.1,
                directionalOffsetThreshold: 30,
              }}
            > */}
            <Surface
              width={this.state.winWidth - 30}
              height={this.state.winHeight - 200}
            >
              <MeiroMap
                drawPath={this.state.drawPath}
                playPath={this.state.ans}
                width={2}
                length={12}
                color={"#ffffff"}
              />
            </Surface>
            {/* </GestureRecognizer> */}

            <View style={baseStyle.play2}>
              <TouchableOpacity onPress={this.backHome}>
                <Image
                  style={baseStyle.btn}
                  source={require("../image/modoru_btn.png")}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={this.createMeiro.bind(this)}>
                <Image
                  style={baseStyle.btn}
                  source={require("../image/modoru_btn.png")}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={this.moveMeiro.bind(this)}>
                <Image
                  style={baseStyle.btn}
                  source={require("../image/modoru_btn.png")}
                />
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  onInitMeiro: () => {
    console.log("onInitMeiro:");
    // waitAsync(10000);
    loading(
      dispatch,
      function () {
        dispatch(initMeiro({}));
      },
      function () {
        // Actions.home();
      }
    );
  },
  onSetLoading: () => {
    dispatch(loadStart());
  },
  onMoveMeiro: () => {
    mp.move_meiro(1);
    dispatch(setAnsMeiro());
    // mc.showMap();
  },
  onUpdateMeiro: () => {
    console.log("play_onUpdateMeiro");
    dispatch(updateMeiro({}));
    dispatch(loadEnd());
  },
  onCreateMeiro: () => {
    dispatch(createMeiro({}));
  },
  onCreateMeiroAll: () => {
    dispatch(createMeiroAll({}));
  },
});

const mapStateToProps = (state) => ({
  winWidth: state.common.winWidth,
  winHeight: state.common.winHeight,
  isLoading: state.common.loading,
  map: state.meiro.map, //ex[[3333333],[3000003],,,]
  drawPath: state.meiro.drawPath, //ex[[1100],[1001],,,]
  ans: state.meiro.ans,
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
      dispatchProps.onInitMeiro();
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(Play);
