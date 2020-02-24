// pages/tea-task/tea-task.js
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
    var params = {
      "token": wx.getStorageSync("token"),
      "uid": wx.getStorageSync("uid"),
    }
    console.log(params)
    app.ljjw.jwTeacherTasks(params).then(d => {
      console.log(d)
      if (d.data.status == 1) {
        console.log(d.data.data)
        that.setData({
          task: d.data.data
        })
        for(var i=0;i<that.data.task.length;i++){
          var cs1 = "task[" + i + "].finished_students"
          var cs2 = "task[" + i + "].notfinished_students"
          that.setData({
            [cs1]: that.data.task[i].finished_students.join("、"),
            [cs2]: that.data.task[i].notfinished_students.join("、"),
          })
        }
        console.log("老师任务获取成功")
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