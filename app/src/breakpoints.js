'use strict'

module.exports = {
  debounce: 500,
  onResize (win) {
    let breakpoint = 'xsmall'
    if (win.innerWidth > 414) {
      breakpoint = 'small'
    }
    if (win.innerWidth > 767) {
      breakpoint = 'medium'
    }
    if (win.innerWidth > 920) {
      breakpoint = 'large'
    }
    if (win.innerWidth > 1279) {
      breakpoint = 'xlarge'
    }
    return {breakpoint}
  }
}
