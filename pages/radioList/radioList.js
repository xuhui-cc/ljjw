// pages/radioList/radioList.js
import {Timer} from '../../utils/timer.js'

const app = getApp()
Page({

  // 分页数据
  pageData:{
    page: 1,
    perpage: 10,
    canLoadNextPage: false
  },

  // 选中的广播索引
  radioSelectedIndex: null,

  // 音频 播放控制对象
  innerAudioContext: null,

  // 跳转播放中
  seeking: false,

  /**
   * 次数计时器
   * 创建时机：点击广播单元格 / 自然播放结束后播放下一个
   * 暂停时机：缓冲中 / 暂停中
   * 销毁时机：30秒触发回调 / 页面卸载 / 自然播放结束 / 非第一次点击广播单元格 / 音频onStop回调 / 下拉刷新
   * 上传数据时机：30s触发回调
  */
  countTimer: null,

  /**
   * 时长计时器
   * 创建时机：onPlay回调
   * 暂停时机：缓冲中
   * 销毁时机：暂停 / 页面卸载 / 自然播放结束 / 非第一次点击广播单元格 / 音频onStop回调 / 下拉刷新
   * 上传数据时机：同销毁时机
  */
  durationTimer: null,

  // 日期选择框 是否正在滚动 0-停止滚动 非0-正在滚动
  datePickerScrolling: 0,

  /**
   * 页面的初始数据
   */
  data: {
    // 广播列表
    radioList:[],

    // 是否郑子啊下拉刷新
    pullDownRefresh: false,

    // 广播详情弹框
    showAudioDetail: false,

    // 选择打开详情的广播
    openDetailRadio: null,

    // 收听小时数
    listenHour: 0,

    // 收听分钟数
    listenMinute: 0,

    // 是否展示选择时间弹框
    showDatePicker: false,

    // 日期选择 年份列表
    datePickerYearList: ['不限时间', '2020'],
    datePickerMonthList: ['1','2','3','4','5','6','7','8','9','10','11','12'],

    // 日期选择器 选中的年
    datePickerSelectedYear: 0,
    datePickerSelectedMonth: 0,

    // 日期选择器 临时过渡 选中的年
    TempDatePickerYearIndex : 0,
    TempDatePickerMonthIndex: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getSystemSize()
    this.setData({
      role: wx.getStorageSync('role')
    })
    this.setDatePickerDate()

    this.getAudioList()
    this.getListenSconds()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // 解决从后台返回时 播放进度不回调问题
    if (this.radioSelectedIndex != null) {
      let selectedRadio = this.data.radioList[this.radioSelectedIndex]
      selectedRadio.readyPlay = false
      selectedRadio.playing = false
      let audioStr = 'radioList['+this.radioSelectedIndex+']'

      this.setData({
        [audioStr]: selectedRadio,
      })
      this.setInnerAudioControl(selectedRadio.audiourl)
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    if (this.innerAudioContext) {
      this.innerAudioContext.pause()
    }
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    // 销毁 音频播放管理对象
    if (this.innerAudioContext) {
      this.innerAudioContext.destroy()
    }
    // 销毁 音频收听次数 计时器
    if (this.countTimer) {
      this.countTimer.clearTimer()
      this.countTimer = null
    }

    // 销毁 收听时长计时器 并上传时长
    if (this.durationTimer) {
      let duration = this.durationTimer.second
      this.durationTimer.clearTimer()
      this.durationTimer = null
      if (duration > 0) {
        this.updateListenTime(duration)
      }
    }
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  //------------------------------------------------私有方法-------------------------------------------------
  /**
   * 获取系统辅助尺寸
  */
  getSystemSize: function() {
    let systemInfo = wx.getSystemInfoSync()
    let menuRect = wx.getMenuButtonBoundingClientRect()
    let naviHeight = menuRect.bottom + 10
    let statusBarHeight = systemInfo.statusBarHeight
    let naviContentHeight = naviHeight - statusBarHeight
    let safeareaBottom = systemInfo.screenHeight - systemInfo.safeArea.bottom
    this.setData({
      naviHeight: naviHeight,
      statusBarHeight: statusBarHeight,
      naviContentHeight: naviContentHeight,
      safeareaBottom: safeareaBottom,
      screenWidth: systemInfo.screenWidth,
      screenHeight: systemInfo.screenHeight
    })
  },

  /**
   * 创建播放管理对象
  */
  setInnerAudioControl: function(url) {
    if (this.innerAudioContext) {
      this.innerAudioContext.destroy()
    }
    let radio = this.data.radioList[this.radioSelectedIndex]
    this.innerAudioContext = wx.createInnerAudioContext()
    this.innerAudioContext.autoplay = true
    // this.innerAudioContext.loop = true
    this.innerAudioContext.src = url
    let that = this
    this.innerAudioContext.onTimeUpdate(function(e){
      // console.log('音频时长：', that.innerAudioContext.duration, that.innerAudioContext.currentTime)
      // console.log('播放进度:\n',e)
      let radio = that.data.radioList[that.radioSelectedIndex]
      let currentTime = Math.ceil(that.innerAudioContext.currentTime)
      let duration = Math.ceil(that.innerAudioContext.duration)
      let totalTime = app.util.formatTImeBySecond(duration, 'hh:mm:ss')
      let currentTimeStr = app.util.formatTImeBySecond(currentTime, 'hh:mm:ss')
      // console.log(totalTime)
      radio.duration = duration
      radio.totalTime = totalTime
      if (currentTime != 0 && !that.seeking) {
        radio.currentTime = currentTime
        radio.currentTimeStr = currentTimeStr
        radio.currentProgressBarWidth = 611 * currentTime / duration
      }

      let radioStr = 'radioList['+that.radioSelectedIndex+']'
      that.setData({
        [radioStr]: radio
      })
    })
    this.innerAudioContext.startTime = radio.currentTime
    this.innerAudioContext.onCanplay(function(){
      // 进入可以播放状态
      console.log('进入可播放状态')
      let radio = that.data.radioList[that.radioSelectedIndex]
      if (radio.readyPlay) {
        return
      }
      radio.readyPlay = true
      if (radio.currentTime != 0) {
        that.innerAudioContext.seek(radio.currentTime)
      }
    })
    this.innerAudioContext.onSeeking(function(e){
      console.log('跳转中',e)
      that.seeking = true
    })
    this.innerAudioContext.onSeeked(function(e){
      console.log('跳转完成',e)
      that.seeking = false
    })
    this.innerAudioContext.onPlay(function(e){
      console.log('开始播放', e)
      // let radio = that.data.radioList[that.radioSelectedIndex]
      let playStr = 'radioList['+that.radioSelectedIndex+'].playing'
      that.setData({
        [playStr]: true,
      })
      // 继续音频播放次数 计时器
      if (that.countTimer) {
        that.countTimer.resume()
      }
      
      if(!that.durationTimer) {
        // 创建收听时长 计时器
        that.durationTimer = new Timer()
        that.durationTimer.startTimer()
      } else {
        // 恢复收听时长 计时器
        that.durationTimer.resume()
      }
    })
    this.innerAudioContext.onStop(function(){
      console.log('音频停止')
      // 销毁音频播放次数 计时器
      if (that.countTimer) {
        that.countTimer.clearTimer()
        that.countTimer = null
      }

      // 销毁收听时长计时器 并上传时长
      if (that.durationTimer) {
        let duration = that.durationTimer.second
        that.durationTimer.clearTimer()
        that.durationTimer = null
        if (duration > 0) {
          that.updateListenTime(duration)
        }
      }
    })
    this.innerAudioContext.onWaiting(function() {
      console.log('缓冲中')
      // 暂停音频播放次数 计时器
      if(that.countTimer) {
        that.countTimer.pause()
      }

      // 暂停收听时长 计时器
      if (that.durationTimer) {
        that.durationTimer.pause()
      }
    })
    this.innerAudioContext.onPause(function(e){
      console.log('播放暂停', e)
      let playStr = 'radioList['+that.radioSelectedIndex+'].playing'
      that.setData({
        [playStr]: false
      })
      // 暂停音频播放次数 计时器
      if(that.countTimer) {
        that.countTimer.pause()
      }

      // 暂停 销毁收听时长 计时器 并 上传收听时长
      if (that.durationTimer) {
        let duration = that.durationTimer.second
        that.durationTimer.clearTimer()
        that.durationTimer = null
        if(duration > 0) {
          that.updateListenTime(duration)
        }
      }
    })
    this.innerAudioContext.onEnded(function(){
      console.log('播放至自然结束')

      let radio = that.data.radioList[that.radioSelectedIndex]
      radio.currentTime = 0
      radio.currentTimeStr = '00:00:00'
      radio.currentProgressBarWidth = 0
      radio.playing = false
      radio.readyPlay = false
      radio.selected = false
      let radioStr = 'radioList['+that.radioSelectedIndex+']'

      that.innerAudioContext.destroy()
      that.innerAudioContext = null

      // 关闭音频播放次数 计时器
      if(that.countTimer) {
        that.countTimer.clearTimer()
        that.countTimer = null
      }

      // 销毁 收听时长计时器 并上传时长
      if (that.durationTimer) {
        let duration = that.durationTimer.second
        that.durationTimer.clearTimer()
        that.durationTimer = null
        if (duration > 0) {
          that.updateListenTime(duration)
        }
      }

      if (that.radioSelectedIndex == that.data.radioList.length -1) {
        // 最后一个
        that.setData({
          [radioStr]: radio
        })
        that.radioSelectedIndex = null
      } else {
        // 不是最后一个
        let newIndex = that.radioSelectedIndex + 1
        let newSelectedRadio = that.data.radioList[newIndex]
        newSelectedRadio.selected = true
        newSelectedRadio.readyPlay = false
        newSelectedRadio.playing = false
        let newAudioStr = 'radioList['+newIndex+']'

        that.setData({
          [radioStr]: radio,
          [newAudioStr]: newSelectedRadio
        })
        that.radioSelectedIndex = newIndex
        that.setInnerAudioControl(newSelectedRadio.audiourl)

        // 打开音频播放次数 计时器
        that.countTimer = new Timer()
        that.countTimer.startTimer(30, function(){
          that.updateAudioListenCount()
          that.countTimer = null
        })
      }
    })
  },

  /**
   * 设置日期选择器数据
  */
  setDatePickerDate: function() {
    let currentYear = (new Date()).getFullYear()
    if (currentYear > 2020) {
      let indexYear = 2021
      let datePickerYearList = this.data.datePickerYearList
      while(indexYear <= currentYear) {
        datePickerYearList.push(String(indexYear))
        indexYear += 1
      }
      this.setData({
        datePickerYearList: datePickerYearList
      })
    }
  },

  //---------------------------------------------------接口-------------------------------------------------
  /**
   * 获取音频广播列表
  */
  getAudioList: function (cb) {
    let params = {
      uid: wx.getStorageSync('uid'),
      token: wx.getStorageSync('token'),
      page: this.pageData.page,
      limit: this.pageData.perpage,
    }
    if (this.data.datePickerSelectedYear != 0) {
      let month = this.data.datePickerYearList[this.data.datePickerSelectedYear] + '-' + (this.data.datePickerSelectedMonth < 9 ? '0' : '') + this.data.datePickerMonthList[this.data.datePickerSelectedMonth]
      params.riqi = month
    }
    let that = this
    app.ljjw.jwGetAudiolist(params).then(d=>{
      if (d.data.status == 1) {
        let radioList = d.data.data
        for(var i = 0; i< radioList.length; i++) {
          let radio = radioList[i]
          // 将标签由字符串拆分为数组
          radio.flags = radio.tags && radio.tags != '' ? radio.tags.split(',') : []
          // 默认未选中
          radio.selected = false
          // 发布时间
          radio.pubtime = app.util.customFormatTimeByTimestamp(radio.createtime*1000, 'yyyy.MM.dd  hh:mm')
          // 修正内容图片
          while (radio.content.indexOf('<img src')>-1) {
            radio.content = radio.content.replace('<img src', '<img style="max-width:100%;" src')
          }
          // 默认播放进度
          radio.currentTime = 0 // 单位s
          radio.currentTimeStr = '00:00:00'
          radio.currentProgressBarWidth = 0 // 单位rps
          radio.totalTime = '00:00:00'
          radio.duration = 0 // 单位s
          radio.playing = false
          radio.readyPlay = false
        }
        // 判断是否可以加载下一页
        if (!radioList || radioList == '' || radioList.length < that.pageData.perpage) {
          that.pageData.canLoadNextPage = false
        } else {
          that.pageData.canLoadNextPage = true
        }
        // 处理分页数据
        let newList = []
        if (that.pageData.page == 1) {
          newList = radioList
        } else {
          newList = that.data.radioList.concat(radioList)
        }
        that.setData({
          radioList: newList
        })
        typeof cb == "function" && cb(true)
      } else {
        if (that.pageData.page == 1) {
          that.setData({
            radioList: []
          })
        }
        typeof cb == "function" && cb(false)
      }
    })
  },

  /**
   * 收藏/取消收藏音频广播 接口
  */
  collectionAudio: function(index) {
    let radio = this.data.radioList[index]
    let params = {
      uid: wx.getStorageSync('uid'),
      token: wx.getStorageSync('token'),
      type: radio.colid == null ? "1" : "2",
      lb: '2',
      fileid: radio.id
    }
    let that = this
    app.ljjw.jwStudentAddCollection(params).then(d=>{
      if (d.data.status == 1) {
        let collectionStr = 'radioList['+index+'].colid'
        that.setData({
          [collectionStr] : radio.colid == null ? '1' : null
        })
      }
    })
  },

  /**
   * 获取收听时长
  */
  getListenSconds: function() {
    let params = {
      uid: wx.getStorageSync('uid'),
      token: wx.getStorageSync('token'),
    }
    let that = this
    app.ljjw.jwGetUserAudioTime(params).then(d=>{
      if (d.data.status == 1) {
        let second = d.data.data
        let hour = parseInt(second/3600)
        let minute = Math.ceil((second - hour*3600)/60)
        that.setData({
          listenHour: hour,
          listenMinute: minute
        })
      }
    })
  },

  /**
   * 更新用户收听时长
  */
  updateListenTime: function(second) {
    let params = {
      uid: wx.getStorageSync('uid'),
      token: wx.getStorageSync('token'),
      thistime: second
    }
    app.ljjw.jwUpdateUserAudioTime(params).then(d=>{
      if(d.data.status == 1) {

      }
    })
  },

  /**
   * 更新音频收听次数
  */
  updateAudioListenCount: function() {
    let audio = this.data.radioList[this.radioSelectedIndex]
    let params = {
      uid: wx.getStorageSync('uid'),
      token: wx.getStorageSync('token'),
      id: audio.id
    }
    let that = this
    app.ljjw.updateAudioPlayCount(params).then(d=>{
      if (d.data.status == 1) {

      }
    })
  },

  //-------------------------------------------------交互事件-----------------------------------------------
  /**
   * 导航栏 返回按钮 点击事件
  */
  naviBackItemClicked: function() {
    wx.navigateBack()
  },

  /**
   * 广播 查看详情按钮 点击事件
  */
  radioShowDetail: function(e) {
    // console.log(e)
    let index = e.currentTarget.dataset.index
    let radio = this.data.radioList[index]
    this.setData({
      showAudioDetail: true,
      openDetailRadio: radio
    })
  },

  /**
   * 广播 收藏按钮 点击事件
  */
  radioCollectionButtonClciked: function(e) {
    // console.log(e)
    let index = e.currentTarget.dataset.index
    this.collectionAudio(index)
    
  },

  /**
   * 下拉刷新 触发
  */
  refreshList: function() {
    this.pageData.page = 1
    let that = this

    // 销毁音频播放管理对象
    if (this.innerAudioContext) {
      this.innerAudioContext.destroy()
      this.innerAudioContext = null
    }
    // 销毁 次数计时器
    if(this.countTimer) {
      this.countTimer.clearTimer()
      this.countTimer = null
    }
    // 销毁 时长计时器 并上传时长
    if (this.durationTimer) {
      let duration = this.durationTimer.second
      this.durationTimer.clearTimer()
      this.durationTimer = null
      if (duration > 0) {
        this.updateListenTime(duration)
      }
    }
    this.radioSelectedIndex =null
    this.getAudioList(function(success){
      that.setData({
        pullDownRefresh: false
      })
    })
  },

  /**
   * scrollView 上拉到底部
  */
  scrollReachBottom: function() {
    if (!this.pageData.canLoadNextPage) {
      return
    }
    let oldPage = this.pageData.page
    this.pageData.page += 1;
    let that = this
    this.getAudioList(function(success){
      if (!success) {
        that.pageData.page = oldPage
      }
    })
  },

  /**
   * 广播单元格 点击事件
  */
  radioCellClicked: function(e) {
    let index = e.currentTarget.dataset.index
    let audio = this.data.radioList[index]
    let that = this
    if (this.radioSelectedIndex != null) {
      if (index == this.radioSelectedIndex) {
        return
      }
      // 销毁 音频管理对象
      this.innerAudioContext.destroy()
      this.innerAudioContext = null

      // 销毁 收听时长计时器 并上传时长
      if (this.durationTimer) {
        let duration = this.durationTimer.second
        this.durationTimer.clearTimer()
        this.durationTimer = null
        if (duration > 0) {
          this.updateListenTime(duration)
        }
      }
      audio.selected = true
      audio.readyPlay = false
      audio.playing = false
      // audio.currentTime = this.innerAudioContext.currentTime
      // radio.currentProgressBarWidth = this.data.progressBarWidth
      let radioSelectedStr = 'radioList['+index+']'
      let oldSelectedAudio = this.data.radioList[this.radioSelectedIndex]
      let radioOldSelectedStr = 'radioList['+this.radioSelectedIndex+'].selected'
      this.setData({
        [radioSelectedStr]: audio,
        [radioOldSelectedStr]: false,
        // progressBarWidth: oldSelectedAudio.progressBarWidth,
      })
      this.radioSelectedIndex = index
      this.setInnerAudioControl(audio.audiourl)
      
    } else {
      let radioSelectedStr = 'radioList['+index+'].selected'
      this.setData({
        [radioSelectedStr]: true,
        // progressBarWidth: 0,
      })
      this.radioSelectedIndex = index
      this.setInnerAudioControl(audio.audiourl)
    }
    // 关闭音频播放次数 计时器
    if (this.countTimer) {
      this.countTimer.clearTimer()
      this.countTimer = null
    }
    // 打开新的 音频播放次数计时器
    this.countTimer = new Timer()
    this.countTimer.startTimer(30, function(){
      that.updateAudioListenCount()
      that.countTimer = null
    })
  },

  /**
   * 拖动进度条 进度回调
  */
  changeProgress: function(e) {
    if (e.detail.source == '') {
      // setData导致的回调
      return
    }
    let index = e.currentTarget.dataset.index
    let radio = this.data.radioList[index]
    // console.log('拖动进度条:\n',e)
    let moveX = e.detail.x*750.0/this.data.screenWidth
    // console.log(moveX)
    radio.currentProgressBarWidth = moveX
    
    let currentTime = Math.ceil(moveX * radio.duration/611)
    radio.currentTime = currentTime
    
    let radioMoveXStr = 'radioList['+index+']'
    this.setData({
      [radioMoveXStr]: radio
    })
  },

  /**
   * 拖动进度条结束
  */
  changeProgressEnd: function(e) {
    console.log('拖动结束', e)
    let radio = this.data.radioList[this.radioSelectedIndex]
    this.innerAudioContext.seek(radio.currentTime)
    this.innerAudioContext.play()
    // radio.playing = false
    // radio.readyPlay = false
    // this.setInnerAudioControl(radio.audiourl)
  },

  /**
   * 拖动进度条开始
  */
  changeProgressStart: function(e){
    console.log('拖动开始', e)
    this.innerAudioContext.pause()
  },

  /**
   * 播放/暂停按钮 点击事件
  */
  audioPlayButtonClciked: function(e) {
    let index = e.currentTarget.dataset.index
    let audio = this.data.radioList[index]
    if (audio.playing) {
      this.innerAudioContext.pause()
    } else {
      this.innerAudioContext.play()
    }
  },

  /**
   * 广播详情弹框
  */
  closeAudioDetailView: function() {
    this.setData({
      showAudioDetail: false,
      openDetailRadio: null
    })
  },

  detailViewClciked: function(){

  },

  /**
   * 时间筛选按钮 点击事件
  */
  dateButtonClciked: function() {
    this.setData({
      showDatePicker: true
    })
  },

  /**
   * 日期选择框 选中值改变
  */
  datePickerChanged: function(e){
    let selectedIndex = e.detail.value
    // console.log(e)
    this.setData({
      TempDatePickerYearIndex: selectedIndex[0],
      TempDatePickerMonthIndex: selectedIndex[1],
    })
  },

  /**
   * 日期选择框 开始滚动
  */
  datePickerScrollStart: function() {
    this.datePickerScrolling += 1
  },

  /**
   * 日期选择框 结束滚动
  */
  datePickerScrollEnd: function() {
    this.datePickerScrolling -= 1
  },

  /**
   * 日期选择框 取消按钮 点击事件
  */
  datePiackerCloseButtonClciekd: function() {
    this.setData({
      TempDatePickerYearIndex: this.data.datePickerSelectedYear,
      TempDatePickerMonthIndex: this.data.datePickerSelectedMonth,
      showDatePicker: false
    })
  },

  /**
   * 日期选择框 确定按钮 点击事件
  */
  datePickerSureButtonClciked: function() {
    if (this.datePickerScrolling > 0) {
      return
    }
    if (this.data.TempDatePickerYearIndex == this.data.datePickerSelectedYear && this.data.TempDatePickerMonthIndex == this.data.datePickerSelectedMonth) {
      this.setData({
        showDatePicker: false
      })
      return
    }
    this.setData({
      datePickerSelectedYear: this.data.TempDatePickerYearIndex,
      datePickerSelectedMonth: this.data.TempDatePickerMonthIndex,
      showDatePicker: false
    })
    this.pageData.page = 1
    this.getAudioList()
  },

  /**
   * 搜索框 点击事件
  */
  searchBarClciked: function() {
    wx.navigateTo({
      url: '../../pages/audio_search/audio_search',
    })
  }
})