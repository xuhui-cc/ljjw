// pages/detail-news/detail-news.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this

    that.setUpNaviSize()

    console.log(options.content)
    console.log(options.date)
    console.log(options.pics)
    that.setData({
      content: options.content,
      date: options.date,
      pics: (options.pics && options.pics != '' && options.pics != 'null') ? options.pics.split(",") : []
    })

  },

  previewImg: function (e) {
    let that = this
    var xb = e.currentTarget.dataset.xb
    
    
    console.log(xb)
    var imgs = that.data.pics
    wx.previewImage({
      current: that.data.pics[xb],
      urls: imgs
    })

  },

  back: function () {
    wx.navigateBack({
      delta: 1  // 返回上一级页面。
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

  /**
   * 设置自定义导航栏尺寸
  */
  setUpNaviSize: function () {
    let menuButtonRect = wx.getMenuButtonBoundingClientRect()
    let systemInfo = wx.getSystemInfoSync()
    let naviBarHeight = menuButtonRect.bottom+10
    let naviBarWidth = systemInfo.screenWidth
    this.setData ({
      naviBarHeight: naviBarHeight,
      naviBarWidth: naviBarWidth,
      naviBarSelectSub_Height: menuButtonRect.height,
      naviBarSelectSub_Top: menuButtonRect.top,
      bottomButton_Height: systemInfo.screenHeight-systemInfo.safeArea.bottom+(80.0/750*naviBarWidth),
      statusBarHeight: systemInfo.statusBarHeight
    })
  },

  /**
   * 获取页面辅助尺寸
  */
  // setUpNaviSize: function () {
  //   let menuButtonRect = wx.getMenuButtonBoundingClientRect()

  // }
})