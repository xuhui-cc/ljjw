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
    console.log(options.content)
    console.log(options.date)
    console.log(options.pics)
    that.setData({
      content: options.content,
      date: options.date,
      pics: options.pics.split(",")
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

  }
})