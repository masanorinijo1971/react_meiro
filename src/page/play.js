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
import BasePage from "./hoc/BasePage";
import Ld from "../element/loading";
import {
  initMeiro,
  updateMeiro,
  setStGlMeiro,
  setAnsMeiro,
  createMeiro,
  createMeiroAll,
  setOffset,
} from "../reducer/meiroReducer";
import { ActionBy, ActionTo } from "../reducer/spriteReducer";
import { loadEnd, loadStart } from "../reducer/commonReducer";
import { defaultState as meiroDef } from "../reducer/meiroReducer";
import mc from "../module/meiro/service/meiroCreater";
import mp from "../module/meiro/service/meiroPlayer";
import { KabeType } from "../module/meiro/service/meiroTypes";
import { waitAsync } from "../util/waitAsync";
import Point from "../util/point";
import { loading } from "../util/sideEffects";
import Sprite from "../module/splite/component/sprite";
import { MENU_HEIGHT } from "../module/common/const";
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
      drawWidth: props.drawWidth,
      drawLength: props.drawLength,
      drawPath: props.drawPath, //ex[[1100],[1001],,,]
      ans: props.ans,
      ansWidth: props.ansWidth,
      isLoading: props.isLoading,
      offset: props.offset || { x: 10, y: 10 },
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
    this.props.onSpriteInit();
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
      offset: nextProps.offset,
    };
  }

  componentWillReceiveProps(nextProps) {
    // Propsの変更をstateに反映する場合はここに記述
    this.setState({
      map: nextProps.map, //ex[[3333333],[3000003],,,]
      drawPath: nextProps.drawPath, //ex[[1100],[1001],,,]
      ans: nextProps.ans,
      isLoading: nextProps.isLoading,
      offset: nextProps.offset,
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
    this.props.onSetOffset();
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

  _onSpriteInit() {
    this.props.onSpriteInit();
  }

  _onMoveLeft() {
    this.props.onMoveLeft();
  }

  _onMoveRight() {
    this.props.onMoveRight();
  }

  _onMoveUp() {
    this.props.onMoveUp();
  }

  _onMoveDown() {
    this.props.onMoveDown();
  }

  render() {
    console.log("play_render()");
    // const isLoading = this.state.isLoading;
    const { isLoading } = this.state;
    return (
      <BasePage>
        <View style={baseStyle.play}>
          <Text>{"x:" + this.state.width + " y:" + this.state.height}</Text>
          <Surface
            width={this.state.winWidth}
            height={this.state.winHeight - MENU_HEIGHT}
          >
            <MeiroMap
              style={baseStyle.play}
              drawPath={this.state.drawPath}
              playPath={this.state.ans}
              width={this.state.drawWidth}
              ansWidth={this.state.ansWidth}
              length={this.state.drawLength}
              color={"#ffffff"}
              offset={this.state.offset}
            />
          </Surface>
          <Sprite />
          <View style={baseStyle.play2}>
            <TouchableOpacity onPress={this.backHome}>
              <Image
                style={baseStyle.btn}
                source={require("../image/modoru_btn.png")}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={this.initMeiro.bind(this)}>
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
          <View style={baseStyle.play2}>
            <TouchableOpacity onPress={this._onMoveRight.bind(this)}>
              <Image
                style={baseStyle.btn}
                source={require("../image/howto_btn.png")}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={this._onMoveLeft.bind(this)}>
              <Image
                style={baseStyle.btn}
                source={require("../image/howto_btn.png")}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={this._onMoveUp.bind(this)}>
              <Image
                style={baseStyle.btn}
                source={require("../image/howto_btn.png")}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={this._onMoveDown.bind(this)}>
              <Image
                style={baseStyle.btn}
                source={require("../image/howto_btn.png")}
              />
            </TouchableOpacity>
          </View>
        </View>
      </BasePage>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  onSetOffset: (props) => {
    var off_x =
      props.winWidth / 2 -
      (((props.width - 1) / 2) * props.drawLength) / 2 -
      props.drawWidth;
    var off_y =
      (props.winHeight - MENU_HEIGHT) / 2 -
      (((props.height - 1) / 2) * props.drawLength) / 2 -
      props.drawWidth;
    var offset_ = { x: off_x, y: off_y };
    console.log("meiro_offset");
    console.log(offset_);
    dispatch(setOffset({ offset: offset_ }));
  },
  onInitMeiro: (meiro) => {
    console.log("play_onInitMeiro!!!");
    loading(
      dispatch,
      () => {
        var process = new Promise((resolve, reject) => {
          try {
            // waitAsync(100000);
            var w_ = meiro.width || meiroDef.width;
            var h_ = meiro.height || meiroDef.height;
            var c_ = meiro.createrCnt || meiroDef.createrCnt;
            var st_ = meiro.createStep || meiroDef.createStep;
            console.log("meiro");
            // console.log(meiro);
            // var w_ = 49;
            // var h_ = 65;
            // var c_ = 3;
            // var st_ = 20;
            mc.init(w_, h_, c_);
            mp.resetHis();
            while (!mc.moveCreater(st_));
            mc.showMap();
            mp.set_map(mc.getMap());
            mp.resetHis();
            mp.setStartPoint(meiro.start);
            mp.setGoalPoint(meiro.goal); // dispatch(initMeiro({}));            // dispatch(createMeiroAll({}));
            // dispatch(setStGlMeiro({}));
          } catch (err) {
            console.log(err);
            reject(err);
          } finally {
            console.log("OK");
            resolve("OK");
          }
        }).then((result) => {
          dispatch(updateMeiro({}));
          console.log(result + "play_onInitMeiro_finProsess");
        });
        return process;
      },
      () => {
        // dispatch(updateMeiro({}));
        // console.log("play_onInitMeiro_finProsess");
      }
    );
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
    dispatch(loadStart());
    var type_ = KabeType.GOAL_POINT;
    var point_ = mp.getPointByType(type_);
    mp.move_meiro_to(point_);
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
  onSpriteInit: () => {
    dispatch(ActionTo({ x: 10, y: 10, scale: 0.5, rot: 0 }));
  },
  onMoveLeft: () => {
    dispatch(ActionBy({ x: 5, y: 0, scale: 0, rot: 0 }));
  },
  onMoveRight: () => {
    dispatch(ActionBy({ x: -5, y: 0, scale: 0, rot: 0 }));
  },
  onMoveUp: () => {
    dispatch(ActionBy({ x: 0, y: -5, scale: 0, rot: 0 }));
  },
  onMoveDown: () => {
    dispatch(ActionBy({ x: 0, y: 5, scale: 0, rot: 0 }));
  },
});

const mapStateToProps = (state) => ({
  winWidth: state.common.winWidth,
  winHeight: state.common.winHeight,
  isLoading: state.common.loading,
  map: state.meiro.map, //ex[[3333333],[3000003],,,]
  drawWidth: state.meiro.drawWidth,
  drawLength: state.meiro.drawLength,
  drawPath: state.meiro.drawPath, //ex[[1100],[1001],,,]
  ans: state.meiro.ans,
  ansWidth: state.meiro.ansWidth,
  width: state.meiro.width,
  height: state.meiro.height,
  createrCnt: state.meiro.createrCnt,
  meiro: state.meiro,
  offset: state.meiro.offset,
});

const mergeProps = (stateProps, dispatchProps, ownProps) => {
  return {
    ...ownProps,
    ...stateProps,
    ...dispatchProps,
    onSetOffset: () => {
      dispatchProps.onSetOffset(stateProps);
    },
    onInitMeiro: async () => {
      // console.log(stateProps.meiro);
      dispatchProps.onInitMeiro(stateProps.meiro);
    },
    onMoveMeiro: () => {
      dispatchProps.onMoveMeiro(stateProps.meiro);
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

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(Play);
