// pages/tea_sjcxx/tea_sjcxx.js
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
    var stu_id = options.stu_id
    console.log(stu_id + "stu_id")
    that.setData({
      stu_id: stu_id
    })
    var params = {
      "token": wx.getStorageSync("token"),
      "stuid": that.data.stu_id,
      // "stuid": 2290,   //测试
    }
    console.log(params)
    app.ljjw.jwViewStudentProfile(params).then(d => {
      console.log(d)
      if (d.data.status == 1) {
        that.setData({
          student_info: d.data.data
        })
        var cs = 'student_info.graduate_time'
        that.setData({
          [cs]: that.timestampToTime(that.data.student_info.graduate_time)
        })
    
        console.log("学生基础信息获取成功")
      }

    })
  },

  back: function () {
    wx.navigateBack({
      delta: 1  // 返回上一级页面。
    })
  },

  //时间戳转换为标准时间
  timestampToTime: function (timestamp) {
    var date = new Date(timestamp * 1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
    var Y = date.getFullYear() + '-';
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) ;
    var D = date.getDate() + ' ';
    var h = (date.getHours() < 10 ? '0' + (date.getHours()) : date.getHours()) + ':';
    var m = (date.getMinutes() < 10 ? '0' + (date.getMinutes()) : date.getMinutes());
    var s = date.getSeconds();
    // return Y + M + D + h + m;
    return Y + M;
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