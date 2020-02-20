// pages/tea_xsda/tea_xsda.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    aud : 2,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    var params = {
      "token": wx.getStorageSync("token"),
      "uid": wx.getStorageSync("uid"),    //老师uid
      "stu_id":7
    }
    console.log(params)
    app.ljjw.jwViewStudentScores(params).then(d => {
      console.log(d)
      if (d.data.status == 1) {
        that.setData({
          student_score: d.data.data
        })
        console.log(that.data.student_score[0].mock_date.length)
        

        console.log("学生档案——成绩获取成功")
      }

    })
  },


  aud_select: function (e) {
    let that = this
    var aud = e.currentTarget.dataset.aud
    that.setData({
      aud: aud
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