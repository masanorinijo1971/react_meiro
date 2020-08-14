import React from "react";
// import { BackAndroid } from 'react-native'
import { connect, Provider } from "react-redux";
import { Scene, Router, Actions, ActionConst } from "react-native-router-flux";
import store from "./store";
import baseStyle from "./style/baseStyle";
import initial from "./page/Initial";
import home from "./page/home";
import play from "./page/play";
import game_setting from "./page/game_setting";
import anime_test from "./page/anime_test";
import loading from "./page/loading";

const RouterWithRedux = connect()(Router);

class App extends React.Component {
  constructor(props) {
    super(props);
    // this.handleBackAndroid = () => Actions.pop()
  }

  componentDidMount() {
    // BackAndroid.addEventListener('hardwareBackPress', this.handleBackAndroid)
  }

  componentWillMount() {
    // BackAndroid.addEventListener('hardwareBackPress', this.handleBackAndroid)
  }

  render() {
    return (
      <Provider store={store}>
        <RouterWithRedux
          duration={0}
          animation="fade"
          backAndroidHandler={() => true}
        >
          <Scene key="root" style={baseStyle.base}>
            <Scene
              key="initial"
              type={ActionConst.RESET}
              component={initial}
              initial
            ></Scene>
            <Scene key="home" type={ActionConst.RESET} component={home}></Scene>
            <Scene key="play" type={ActionConst.RESET} component={play}></Scene>
            <Scene
              key="game_setting"
              type={ActionConst.RESET}
              component={game_setting}
            ></Scene>
            <Scene
              key="anime_test"
              type={ActionConst.RESET}
              component={anime_test}
            ></Scene>
            <Scene
              key="loading"
              type={ActionConst.RESET}
              component={loading}
            ></Scene>
          </Scene>
        </RouterWithRedux>
      </Provider>
    );
  }
}

export default App;
