import { Dimensions } from 'react-native'
import point from './point'
export const DEFAULT_DESIGN_WIDTH = 1366
export const DEFAULT_DESIGN_HEIGHT = 1024

let scale = null
export function getWindowScale () {
  if (scale === null) {
    const windowSize = Dimensions.get('window')
    scale = windowSize.width / DEFAULT_DESIGN_WIDTH
  }
  return scale
}

export function getWinsize(){
  const windowSize = Dimensions.get('window')

  return new point(windowSize.width,windowSize.height)
}
