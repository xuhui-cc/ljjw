// pages/radioList/radioList.js
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
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getSystemSize()
    this.setData({
      role: wx.getStorageSync('role')
    })

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

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    if (this.innerAudioContext) {
      this.innerAudioContext.destroy()
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
        [playStr]: true
      })
    })

    this.innerAudioContext.onPause(function(e){
      console.log('播放暂停', e)
      let playStr = 'radioList['+that.radioSelectedIndex+'].playing'
      that.setData({
        [playStr]: false
      })
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
      }
    })
  },

  //---------------------------------------------------接口-------------------------------------------------
  /**
   * 获取音频广播列表
  */
  getAudioList: function (month, cb) {
    let params = {
      uid: wx.getStorageSync('uid'),
      token: wx.getStorageSync('token'),
      page: this.pageData.page,
      limit: this.pageData.perpage,
    }
    if (month && month != '' && month != null) {
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
    app.ljjw.jwGetUserAudioTime(params).then(d=>{
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
    if (this.innerAudioContext) {
      this.innerAudioContext.destroy()
      this.innerAudioContext = null
    }
    this.radioSelectedIndex =null
    this.getAudioList(null, function(success){
      that.setData({
        pullDownRefresh: false
      })
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
      this.innerAudioContext.destroy()
      this.innerAudioContext = null
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

  }
})