// constants
export const directions = [{
  label: '上',
  value: 'top'
}, {
  label: '右',
  value: 'right'
}, {
  label: '下',
  value: 'bottom'
}, {
  label: '左',
  value: 'left'
}, {
  label: '左',
  value: 'left'
}, {
  label: '上左',
  value: 'top-left'
}, {
  label: '上右',
  value: 'top-right'
}, {
  label: '下左',
  value: 'bottom-left'
}, {
  label: '下右',
  value: 'bottom-right'
}, ]

export const timeUnits = [{
  label: '秒',
  value: 's'
}, {
  label: '毫秒',
  value: 'ms'
}]

export const zoomTypes = [{
  label: '放大',
  value: 'in'
}, {
  label: '缩小',
  value: 'out'
}]

/**
 * wait:
 *  event: 'wait',
 *  timeout: number,
 *  timeoutUnit: timeUnits
 * 
 * zoom:
 *  event: 'zoom',
 *  delay: number,
 *  delayUnit: timeUnits,
 *  timeout: number
 *  timeoutUnit: timeUnits,
 *  type: zoomTypes,
 *  value: number,
 *  animate: boolean
 * 
 * move:
 *  event: 'move',
 *  delay: number,
 *  delayUnit: timeUnits,
 *  direction: directions,
 *  timeoutUnit: timeUnits,
 *  timeout: number,
 *  animate: boolean,
 *  point: { x: number, y: number}
 */
export const eventNames = [{
  label: '等待',
  value: 'wait'
}, {
  label: '缩放',
  value: 'zoom'
}, {
  label: '移动',
  value: 'move'
}]

const defaultObj = {
  event: 'wait',
  delay: 100,
  delayUnit: 'ms',
  direction: 'top',
  timeout: 2000,
  timeoutUnit: 'ms',
  type: 'in',
  zoomInValue: 1.01,
  zoomOutValue: 0.99,
  animate: false,
  moveValue: 0.001
}

function stringEvent(eventName) {
  const {
    event,
    delay,
    delayUnit,
    direction,
    timeout,
    timeoutUnit,
    type,
    animate
  } = defaultObj

  const eventObj = {
    event: eventName || event,
    timeout,
    timeoutUnit,
    delay
  }

  if (eventName !== 'wait') {
    eventObj.delay = delay
    eventObj.delayUnit = delayUnit
    eventObj.animate = animate
    if (eventName === 'zoom') {
      eventObj.type = type
      eventObj.value = defaultObj.zoomInValue
    } else {
      eventObj.direction = direction
    }
  }
  return eventObj
}

function handleTime(time, timeUnit) {
  if (timeUnit === 'ms') return parseInt(time)
  return parseInt(time) * 1000
}

export function handleEvent(current) {
  let result = stringEvent(current.event)

  // merge useroptions and system options
  Object.keys(current).forEach(key => {
    const userValue = current[key]
    result[key] = userValue
  })

  // 处理zoom特殊情况
  if (('type' in current) && !('value' in current)) {
    const str = current.type
    result.value = defaultObj[`zoom${str.slice(0,1).toUpperCase() +str.slice(1)}Value`]
  } else if (!('type' in current) && ('value' in current)) {
    result.type = (result.value > 1) ? 'in' : 'out'
  }

  // 处理move特殊情况
  if (
    ('direction' in current) &&
    !('x' in current) &&
    !('y' in current)
  ) {
    let point = null
    switch (current.direction) {
      case 'top':
        point = { x: 0, y: -defaultObj.moveValue }
        break
      case 'bottom':
        point = { x: 0, y: defaultObj.moveValue }
        break
      case 'left':
        point = { x: -defaultObj.moveValue, y: 0 }
        break
      case 'top-left':
        point = { x: -defaultObj.moveValue, y: -defaultObj.moveValue}
        break
      case 'top-right':
        point = { x: defaultObj.moveValue, y: -defaultObj.moveValue}
        break
      case 'bottom-left':
        point = { x: -defaultObj.moveValue, y: defaultObj.moveValue}
        break
      case 'bottom-right':
        point = { x: defaultObj.moveValue, y: defaultObj.moveValue}
        break
      default:
        point = { x: defaultObj.moveValue, y: 0}
    }
    result.movePoint = point
  } else if (!('direction' in current)){
    const { x = 0, y = 0 } = current
    result.movePoint = { x: parseFloat(x), y: parseFloat(y) }
  }

  result.timeout = handleTime(result.timeout, result.timeoutUnit)
  result.delay = handleTime(result.delay, result.delayUnit)

  return result
}