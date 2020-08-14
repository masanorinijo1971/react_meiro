import { takeEvery, all, select } from "redux-saga/effects";
import ProgressBar from "./progressBar";
import { Actions } from "react-native-router-flux";
import { loadStart, loadEnd } from "../reducer/commonReducer";
import { waitAsync } from "../util/waitAsync";

function onLoadStart() {
  console.log("LoadingEffect_onLoadStart");
  // Actions.loading();
}

function onLoadEnd() {
  console.log("LoadingEffect_onLoadEnd");
  //Actions.loading();
}

function* watchLoadStart() {
  yield takeEvery(loadStart.toString(), onLoadStart);
}

function* watchLoadEnd() {
  yield takeEvery(loadEnd.toString(), onLoadEnd);
}

export default (getState) => {
  function* rootSaga() {
    yield all([watchLoadStart(), watchLoadEnd()]);
  }
  return rootSaga;
};

export async function loading_await(dispatch, fetchingProcess) {
  dispatch(loadStart());
  try {
    const ret = await fetchingProcess();
    dispatch(loadEnd());
    return ret;
  } catch (error) {
    dispatch(loadEnd());
    throw error;
  }
}

/**
 * 何かの処理をしている間に、ローデイングアニメーションを表示させる。
 * @param {*} dispatch
 * @param {*} anyProcess　何かの処理
 * @param {*} finProcess　終了後の処理
 */
export function loading(dispatch, anyProcess, finProcess) {
  console.log("LoadingEffect");
  dispatch(loadStart());
  try {
    //Actions.loading();
    anyProcess();
    // Actions.play();
    finProcess();
    dispatch(loadEnd());
    return true;
  } catch (error) {
    dispatch(loadEnd());
    throw error;
  }
}
