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
import { KabeType } from "../module/meiro/service/meiroTypes";
import { waitAsync } from "../util/waitAsync";
import Point from "../util/point";
class Play extends Component {
  // var className="Play"
  constructor(props) {
    console.log("play_constructor");
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
    // this.initMeiro();
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
    this.initMeiro();
  }

  onLoading() {
    this.props.onLoading();
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    console.log("play_getDerivedStateFromProps");
    return {
      map: nextProps.map, //ex[[3333333],[3000003],,,]
      drawPath: nextProps.drawPath, //ex[[1100],[1001],,,]
      ans: nextProps.ans,
      isLoading: nextProps.isLoading,
    };
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
    this.props.onInitMeiro();
  }

  createMeiro() {
    // this.onLoading();
    // this.props.onCreateMeiro();
  }

  moveMeiro() {
    console.log("play_moveMeiro");
    this.props.onMoveMeiro();
  }

  ansMeiro() {
    console.log("play_ansMeiro");
    this.props.onAnsMeiro();
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
    // const isLoading = this.state.isLoading;

    const { isLoading } = this.state;
    return (
      <View style={baseStyle.play}>
        {isLoading ? (
          <View style={baseStyle.play2}>
            {/* <Ld></Ld> */}
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
              <TouchableOpacity onPress={this.moveMeiro.bind(this)}>
                <Image
                  style={baseStyle.btn}
                  source={require("../image/modoru_btn.png")}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={this.ansMeiro.bind(this)}>
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
    dispatch(loadStart());
    dispatch(initMeiro({}));
    dispatch(createMeiroAll({}));
    dispatch(setStGlMeiro({}));
    // dispatch(updateMeiro({}));
    dispatch(loadEnd());
  },
  onMoveMeiro: () => {
    console.log("play_onMoveMeiro");
    // dispatch(loadStart());
    mp.move_meiro(10);
    // dispatch(setAnsMeiro({}));
    dispatch(updateMeiro({}));
    dispatch(loadEnd());
    mc.showMap();
  },
  onAnsMeiro: () => {
    console.log("play_onAnsMeiro");
    // dispatch(loadStart());
    var type_ = KabeType.GOAL_POINT;
    // var point_ = mp.getPointByType(type_);
    // mp.move_meiro_to(point_);
    mp.calc_max_move(true);
    dispatch(updateMeiro({}));
    dispatch(loadEnd());
    mc.showMap();
  },
  onSetLoading: () => {
    dispatch(loadStart());
  },
  onUpdateMeiro: () => {
    console.log("play_onUpdateMeiro");
    dispatch(updateMeiro({}));
    dispatch(loadEnd());
  },
  onCreateMeiro: () => {
    dispatch(createMeiro({}));
    dispatch(updateMeiro({}));
  },
  onCreateMeiroAll: () => {
    dispatch(createMeiroAll({}));
  },
  onLoading: () => {
    console.log("play_onLoading");
    dispatch(loadStart());
    mc.init(
      dispatchProps.width,
      dispatchProps.height,
      dispatchProps.createrCnt
    );
    while (!mc.moveCreater(dispatchProps.createrCnt));
    mp.set_map(mc.map);
    mc.showMap();
    console.log("play_onLoading_promise_then");
    console.log("result:" + result);
    dispatch(updateMeiro({}));
    dispatch(loadEnd());
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
      dispatchProps.onInitMeiro(stateProps);
    },
    onMoveMeiro: () => {
      dispatchProps.onMoveMeiro();
    },
    onLoading_promise: () => {
      console.log("play_onLoading");
      var syori = new Promise((resolve, reject) => {
        dispatch(loadStart());
        mc.init(
          dispatchProps.width,
          dispatchProps.height,
          dispatchProps.createrCnt
        );
        while (!mc.moveCreater(dispatchProps.createrCnt));
        mp.set_map(mc.map);
        mc.showMap();
        console.log("play_onLoading_promise_1");
        resolve("OK:" + dispatchProps.width + "_" + dispatchProps.height);
      }).then((result) => {
        console.log("play_onLoading_promise_then");
        console.log("result:" + result);
        dispatch(updateMeiro({}));
        dispatch(loadEnd());
      });
      return syori;
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Play);
