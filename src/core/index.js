import OpenSeadragon from 'openseadragon'
import { handleEvent } from './utils'

let opts = null
let timeoutTimer = null
let intervalTimer = null
let viewer = null
let currentIndex = 0
let eventLists = []

const defaultOptions = {
  id: 'openSeadragon1',
  // scale options
  zoomPerClick: 2.0,
  zoomPerScroll: 1.2,
  zoomPerSecond: 1,
  defaultZoomLevel: 0,

  // move options
  pixelsPerArrowPress: 1,

  // navigator options
  showNavigationControl: false,
  showNavigator: false,
  navigatorPosition: 'BOTTOM_RIGHT',

  // other options
  prefixUrl: './images',
  blendTime: 0, // 初始化白屏时间
  immediateRender: false,
  autoResize: true,
  preserveImageSizeOnResize: true
}

/**
 * merge user options & system options
 * @param {object} userOpts 
 */
function mergeOptions(userOpts) {
  Object.keys(defaultOptions).forEach(key => {
    const defaultValue = defaultOptions[key]
    if (
      defaultOptions.hasOwnProperty(key) &&
      !userOpts.hasOwnProperty(key)
    ) {
      userOpts[key] = defaultValue
    }
  })
  opts = Object.assign({}, userOpts)
}

// Methods
/**
 * initViewer
 */
export function initViewer(options) {
  mergeOptions(options)
  viewer = OpenSeadragon(opts)
  return viewer
}

export function mouseWatcher(cb) {
  viewer.innerTracker.setTracking(true); // 开启对目标元素上的事件的追踪
  viewer.innerTracker.clickHandler = event => {
    var viewportPoint = viewer.viewport.pointFromPixel(event.position);
    cb(viewportPoint)
  }
}

/**
 * running animate
 */
export function run(animateArrs) {
  if (
    !animateArrs ||
    !Array.isArray(animateArrs)
    || animateArrs.length === 0
  ) return false

  eventLists = animateArrs
  runEvent()
}

export function runEvent() {
  if (currentIndex >= eventLists.length) {
    console.log('end')
    return
  }
  let currentEvent = handleEvent(eventLists[currentIndex])
  new Promise(resolve => {
    if (currentEvent.event !== 'wait') {
      handleMove(resolve, currentEvent)
    } else {
      timeoutTimer = setTimeout(function() {
        resolve()
      }, currentEvent.timeout)
    }
  }).then(() => {
    clearTimeout(timeoutTimer)
    clearInterval(intervalTimer)
    ++currentIndex
    runEvent()
  })
}

function handleMove(resolve, current) {
  let { timeout, delay, event, value, movePoint } = current
  let i = 0
  console.log(current)
  intervalTimer = setInterval(function() {
    if (i >= timeout) {
      clearInterval(intervalTimer)
      return resolve()
    }

    if (event === 'move') {
      viewer.viewport.panBy(movePoint, false);
    } else {
      viewer.viewport.zoomBy(value, { x: 0.5, y: 0.7 }, false);
    }

    i += delay
  }, delay)
}

export default {
  version: 'Alpha-0.0.7'
}