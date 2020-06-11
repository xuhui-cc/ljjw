// pages/feedBack_submit/feedBack_submit.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 页面尺寸
    pageSize: {},
    // 反馈类型
    feedBackTypeModel: {},

    // 反馈内容
    content: '',

    // 反馈照片
    imageArray: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取页面辅助尺寸
    this.getPageSize()

    // 反馈类型
    this.getFeedBackTypeModle(options)
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

  // --------------------------------------------------私有方法----------------------------------------------
  /**
   * 获取页面辅助尺寸
  */
  getPageSize: function() {
    let systemInfo = wx.getSystemInfoSync()
    let menuBounding = wx.getMenuButtonBoundingClientRect()
    let naviHeight = menuBounding.bottom + 10
    let statusBarHeight = systemInfo.statusBarHeight
    let safeareaBottom = systemInfo.windowHeight - systemInfo.safeArea.bottom

    this.setData({
      pageSize: {
        naviHeight: naviHeight,
        statusBarHeight: statusBarHeight,
        naviContentHeight: naviHeight - statusBarHeight,
        safeareaBottom: safeareaBottom,
      }
    })
  },

  /**
   * 获取反馈类型
  */
  getFeedBackTypeModle: function(options) {
    // console.log(options)
    this.setData({
      feedBackTypeModel: {
        type: options.type,
        title: options.title
      }
    })
  },

  // -----------------------------------------------交互事件---------------------------------------
  /**
   * 导航返回按钮 点击事件
  */
  naviBackClicked: function(e) {
    wx.navigateBack()
  },

  /**
   * 反馈内容 文本输入 回调
  */
  textareaInput: function (e) {
    // console.log(e)
    let newContent = e.detail.value
    this.setData({
      content: newContent
    })
  },

  /**
   * 上传图片 按钮 点击事件
  */
  insertImage: function () {
    this.data.imageArray.push(this.data.imageArray.length+1)
    this.setData({
      imageArray: this.data.imageArray
    })
  },

  /**
   * 删除图片 按钮 点击事件
  */
  deleteImage: function (e) {
    console.log(e)
    let index = e.currentTarget.dataset.index
    this.data.imageArray.splice(index, 1)
    console.log(this.data.imageArray)
    this.setData({
      imageArray: this.data.imageArray
    })
  }
})