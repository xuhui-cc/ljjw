
class Timer {
  second=0
  timer=null
  _triggerSecond = null
  _callback = null
  _pause = false
  startTimer(triggerSecond, callback){
    if (this.timer) {
      return
    }
    if (triggerSecond) {
      this._triggerSecond = triggerSecond
    }
    if (callback) {
      this._callback = callback
    }
    
    let that = this
    this.timer = setInterval(function(){
      that.second += 1
      console.log('计时一次: ', that.second)
      if (triggerSecond && that.second == triggerSecond && callback && typeof callback == 'function') {
        that.clearTimer()
        console.log('触发定时事件')
        callback()
      }
    }, 1000)
  }
  clearTimer(){
    console.log('销毁计时器')
    clearInterval(this.timer)
    this.timer = null
    this.second = 0
  }
  pause(){
    if (this._pause) {
      return
    }
    console.log('暂停计时器')
    this._pause = true
    clearInterval(this.timer)
    this.timer = null
  }
  resume(){
    if (!this._pause) {
      return
    }
    console.log('恢复计时器')
    this._pause = false
    this.startTimer(this._triggerSecond, this._callback)
  }
}

export{
  Timer
}