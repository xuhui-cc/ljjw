// pages/t_stuwork/t_stuwork.js
const app = getApp()
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
    var i = 0
    var sid = options.sid
    that.setData({
      sid: sid
    })
    var params = {
      "token": wx.getStorageSync("token"),
      "uid": wx.getStorageSync("uid"),
      "sid": sid
    }
    console.log(params)
    app.ljjw.jwViewScheduleCheckOn(params).then(d => {
      console.log(d)
      if (d.data.status == 1) {
        that.setData({
          cutschool: d.data.data.cutschool,
          later: d.data.data.later,
          normal: d.data.data.normal,
          leaveschool: d.data.data.leaveschool,
          askforleave: d.data.data.askforleave,
        })

      }
      
    })
  },

  look_stu_datail:function(){
    let that = this
    that.setData({
      stu_detail: true
    })
  },

  clo_mask:function(){
    let that = this
    that.setData({
      stu_detail : false
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