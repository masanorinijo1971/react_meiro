import { Platform } from "react-native";
import SensitiveInfo from "react-native-sensitive-info";
import { takeEvery, all, select } from "redux-saga/effects";
import ProgressBar from "./progressBar";
import { loadStart, loadEnd } from "../reducer/commonReducer";
import waitAsync from "../util/waitAsync";

function onLoadStart() {
  console.log("ProgressBar.show();");
  ProgressBar.start();
}

function onLoadEnd() {
  console.log("sideEffects_onloadEnd()");
  ProgressBar.stop();
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
export async function loading(dispatch, anyProcess, finProcess) {
  dispatch(loadStart());
  try {
    const ret = await anyProcess();
    finProcess();
    dispatch(loadEnd());
    return ret;
  } catch (error) {
    dispatch(loadEnd());
    throw error;
  }
}
