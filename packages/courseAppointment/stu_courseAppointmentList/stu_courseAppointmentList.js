// pages/courseAppointment/stu_courseAppointmentList/stu_courseAppointmentList.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 选中的顶部菜单索引
    selectedMenuIndex: 0,

    // 课程预约列表
    apponintmentList: [
      {
        title:'2020事业单位',
        subList:[1,2,3]
      },
      {
        title:'2020事业单位',
        subList:[1,2,3]
      }
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getSystemSize()
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

  //-----------------------------------------------------接口-----------------------------------------------------
  /**
   * 获取课程预约列表
  */
  getAppointmentList: function() {

  },


  //----------------------------------------------------交互事件--------------------------------------------------
  /**
   * 顶部菜单 点击事件
  */
  topMenuClicked: function(e) {
    let index = e.currentTarget.dataset.index
    if (index == this.data.selectedMenuIndex) {
      return
    }
    this.setData({
      selectedMenuIndex: index
    })
  },

  /**
   * 导航栏 返回按钮 点击事件
  */
  naviBackItemClciked : function() {
    wx.navigateBack()
  },

  /**
   * 查看简介按钮 点击事件
  */
  showIntroButtonClciked: function(e) {
    let courseIndex = e.currentTarget.dataset.courseindex
    let appointmentIndex = e.currentTarget.dataset.appointmentindex
    let appointment = this.data.apponintmentList[courseIndex].subList[appointmentIndex]
    wx.navigateTo({
      url: '/packages/courseAppointment_detail/courseAppointment_detail',
      success (res) {
        res.eventChannel.emit('showCourseIntro', {url: 'http://www.baidu.com'})
      }
    })
  }
})