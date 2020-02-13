// pages/stu-record/stu-record.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    aud: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    var params = {
      "token": wx.getStorageSync("token"),
      "uid": wx.getStorageSync("uid"),
      "sid":1,
      "type": 1    //type->1是总分 2是行测分数 3是申论分数
    }
    console.log(params)
    app.ljjw.jwGetStudentSortScore(params).then(d => {
      console.log(d)
      if (d.data.status == 1) {
        console.log(d.data.data)
        that.setData({
          score: d.data.data
        })
        console.log("总成绩获取成功")
      }


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

  aud_select: function (e) {
    let that = this
    var aud = e.currentTarget.dataset.aud
    that.setData({
      aud: aud
    })
    var params = {
      "token": wx.getStorageSync("token"),
      "uid": wx.getStorageSync("uid"),
      "sid": 1,
      "type": aud + 1    //type->1是总分 2是行测分数 3是申论分数
    }
    console.log(params)
    app.ljjw.jwGetStudentSortScore(params).then(d => {
      console.log(d)
      if (d.data.status == 1) {
        console.log(d.data.data)
        that.setData({
          score: d.data.data
        })
        console.log("总成绩获取成功")
      }


    })
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