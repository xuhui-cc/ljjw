// pages/feedBack_list/feedBack_list.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 顶部菜单选中下标
    menuSelectedIndex: 0,
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
      saveBottom: saveBottom
    })
  },
  // ------------------------------------------------私有方法---------------------------------------------------
  /**
   * 顶部菜单 点击事件
  */
  menu_selected: function (e) {
    console.log(e)
    let index = e.currentTarget.dataset.index
    if (index == this.data.menuSelectedIndex) {
      return
    }
    this.setData({
      menuSelectedIndex: index
    })
  }
})