// packages/courseAppointment/add_courseAppointment/add_courseAppointment.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 导航栏标题（课程+期）
    title: '2020事业单位  9.20第一期',

    // 类型 1-提交课程预约信息 2-修改课程预约信息
    type: 1,

    // 是否可以提交
    canSubmit: false,

    // 姓名
    name: '',

    // 岗位
    wordStation: '',

    // 进面线
    score: '',

    // 是否展示预约期列表视图
    showAppointmentListView: false,

    // 预约期列表标题
    appointmentListTitle: '2020事业单位',

    // 预约期标题列表
    appointmentTitleList: ['9.20  第一期', '10.20  第二期', '11.20 第三期'],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getSystemSize()

    let that = this
    let eventChannel = this.getOpenerEventChannel()
    eventChannel.on('toAppointmentCourse', function(data){
      let type = data.type
      that.setData({
        type: type
      })
    })
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

  // ---------------------------------------------私有方法------------------------------------------------
  /**
   * 获取系统辅助尺寸
  */
  getSystemSize: function () {
    let systemInfo = wx.getSystemInfoSync()
    let menuBoundingRect = wx.getMenuButtonBoundingClientRect()
    let naviHeight = menuBoundingRect.bottom + 10
    let naviContentHeight = naviHeight - systemInfo.statusBarHeight
    let safeArarBottom = systemInfo.screenHeight - systemInfo.safeArea.bottom
    this.setData({
      naviHeight: naviHeight,
      naviContentHeight: naviContentHeight,
      safeArarBottom: safeArarBottom,
      screenHeight: systemInfo.screenHeight,
      screenWidth: systemInfo.screenWidth,
      statusBarHeight: systemInfo.statusBarHeight
    })
  },

  /**
   * 判断是否可以提交
  */
  canSubmitStatusChange: function() {
    let canSubmit = false
    if (this.data.name && this.data.name != '' && this.data.wordStation && this.data.wordStation != '') {
      canSubmit = true
    }
    this.setData({
      canSubmit: canSubmit
    })
  },

  // ----------------------------------------------交互事件-------------------------------------------
  /**
   * 导航栏 返回按钮 点击事件
  */
  naviBackItemClciked : function() {
    wx.navigateBack()
  },

  /**
   * 姓名输入框 输入
  */
  nameInputChange: function (e) {
    let value = e.detail.value
    if (value == ' ') {
      value = ''
    }
    this.setData({
      name: value
    })
    this.canSubmitStatusChange()
  },

  /**
   * 岗位输入框 输入
  */
  wordTextareaChange: function(e) {
    let value = e.detail.value
    if (value == ' ') {
      value = ''
    }
    this.setData({
      wordStation: value
    })
    this.canSubmitStatusChange()
  },

  /**
   * 进面线输入框 输入
  */
  scoreInputChange: function(e) {
    let value = e.detail.value
    if (value == ' ') {
      value = ''
    }
    this.setData({
      score: value
    })
    this.canSubmitStatusChange()
  },

  /**
   * 提交按钮 点击事件
   */
  submitButtonClciked: function() {
    if (!this.data.canSubmit) {
      return
    }
    wx.navigateBack()
  },

  /**
   * 课程条目 点击事件
  */
  appointmentItemClciked: function(){
    this.setData({
      showAppointmentListView: true
    })
  },

  /**
   * 期选择列表 选项点击事件
  */
  appointmentListOptionClciked: function(e) {
    // console.log(e)
    let index = e.detail.index
    this.setData({
      showAppointmentListView: false
    })
  },

  /**
   * 期选择列表 关闭
  */
  appointmentListViewClose: function() {
    this.setData({
      showAppointmentListView: false
    })
  }
})