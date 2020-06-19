// pages/tea_feedBack_list/tea_feedBack_list.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 顶部菜单选中下标
    menuSelectedIndex: 0,

    // 待处理反馈小红点数量
    notDealCount: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setUpNaviSize()
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
    this.teacherGetFeedBackNotiCount()
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

  // ------------------------------------------------私有方法---------------------------------------------------
  /**
   * 设置自定义导航栏尺寸
  */
  setUpNaviSize: function () {
    var menuButtonRect = wx.getMenuButtonBoundingClientRect()
    var systemInfo = wx.getSystemInfoSync()
    let naviBarHeight = menuButtonRect.bottom+10
    let naviBarWidth = systemInfo.screenWidth
    let saveBottom = systemInfo.screenHeight-systemInfo.safeArea.bottom
    
    this.setData ({
      naviBarHeight: naviBarHeight,
      naviBarWidth: naviBarWidth,
      navibar_content_height: naviBarHeight - systemInfo.statusBarHeight,
      statusBar_height: systemInfo.statusBarHeight,
      saveBottom: saveBottom,
      screenWidth: systemInfo.screenWidth
    })
  },

  // -------------------------------------------------接口-----------------------------------------------------
  /**
   * 获取老师待处理反馈数量
  */
  teacherGetFeedBackNotiCount: function () {
    let that = this
    let prarms = {
      "token": wx.getStorageSync("token"),
      "uid": wx.getStorageSync("uid"),
    }
    app.ljjw.getTeacherUnreadCount(prarms).then(d=>{
      let status = d.data.status
      if (status == 1) {
        let data = d.data.data

        that.setData({
          notDealCount: data
        })
      } else {
        that.setData({
          notDealCount: 0
        })
      }
    })
  },

  /**
   * 老师获取反馈列表
  */
  teacherGetFeedBackList: function() {

  },

  // ------------------------------------------------交互事件---------------------------------------------------
  /**
   * 顶部菜单 点击事件
  */
  menu_selected: function (e) {
      
    let index = e.currentTarget.dataset.index
    if (index == this.data.menuSelectedIndex) {
      return
    }
    this.setData({
      menuSelectedIndex: index
    })

    this.teacherGetFeedBackNotiCount()
  },

  /**
   * 导航栏返回按钮
  */
  back: function() {
    wx.navigateBack({
      complete: (res) => {},
    })
  },
})