// pages/stu_jcxx/stu_jcxx.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  timestampToTime: function (timestamp) {
    var date = new Date(timestamp*1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
    var Y = date.getFullYear() + '-';
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
    var D = date.getDate() + ' ';
    var h = (date.getHours() < 10 ? '0' + (date.getHours()) : date.getHours()) + ':';
    var m = (date.getMinutes() < 10 ? '0' + (date.getMinutes()) : date.getMinutes());
    var s = date.getSeconds();
    return Y + M;
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    
    var params = {
      "token": wx.getStorageSync("token"),
      "uid": wx.getStorageSync("uid"),
    }
    console.log(params)
    app.ljjw.jwGetStudentMainPage(params).then(d => {
      if (d.data.status == 1) {
        that.setData({
          mydata: d.data.data
        })
        console.log(that.data.mydata)
        var cs = "mydata.graduate_time"
        that.setData({
          [cs]: that.timestampToTime(that.data.mydata.graduate_time)
        })
        console.log("我的主页接口获取成功")
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