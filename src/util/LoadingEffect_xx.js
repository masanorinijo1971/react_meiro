import { Platform } from "react-native";
import SensitiveInfo from "react-native-sensitive-info";
import { takeEvery, all, select } from "redux-saga/effects";
import ProgressBar from "./progressBar";
import { loadStart, loadEnd } from "../reducer/commonReducer";

function onLoadStart() {
  console.log("ProgressBar.show();");
  ProgressBar.show();
}

function onLoadEnd() {
  console.log("xx");
  ProgressBar.hide();
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

export function loading(dispatch, fetchingProcess) {
  dispatch(loadStart());
  try {
    const ret = fetchingProcess();
    dispatch(loadEnd());
    return ret;
  } catch (error) {
    dispatch(loadEnd());
    throw error;
  }
}
