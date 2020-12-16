// pages/tea-task/tea-task.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  back: function () {
    wx.navigateBack({
      delta: 1  // 返回上一级页面。
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setUpNaviSize()
    let that = this
    that.setData({
      class_id:options.class_id
    })
    var params = {
      "token": wx.getStorageSync("token"),
      "uid": wx.getStorageSync("uid"),
      "class_id":that.data.class_id
    }
    // console.log(params)
    app.ljjw.jwTeacherTasks(params).then(d => {
      // console.log(d)
      if (d.data.status == 1) {
        // console.log(d.data.data)

        var data = d.data.data
        for (var i = 0; i < data.length; i++) {
          let task = data[i]
          var finished_name = ''
          for (var j = 0; j < task.finished_students.length; j++) {
            let student = task.finished_students[j]
            if (finished_name == '') {
              finished_name = student.realname
            } else {
              finished_name += ', ' + student.realname
            }
          }
          task.finished_name = finished_name
          var notFinished_name = ''
          for (var j = 0; j < task.notfinished_students.length; j++) {
            let student = task.notfinished_students[j]
            if (notFinished_name == '') {
              notFinished_name = student.realname
            } else {
              notFinished_name += ', ' + student.realname
            }
          }
          task.notFinished_name = notFinished_name
        }
        that.setData({
          task: data
        })
        console.log("老师任务获取成功")
      }


    })
  },

  previewImg: function (e) {
    let that = this
    var xb = e.currentTarget.dataset.xb
    var dxb = e.currentTarget.dataset.dxb
    console.log(dxb)
    console.log(xb)
    var imgs = that.data.task[dxb].attach
    wx.previewImage({
      current: that.data.task[dxb].attach[xb],
      urls: imgs
    })

  },

  fold:function(e){
    let that = this
    var xb = e.currentTarget.dataset.xb
    var task = that.data.task[xb]
    var cs = "task[" + xb + "].fold"
    that.setData({
      [cs]:!task.fold
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
    var menuButtonRect = wx.getMenuButtonBoundingClientRect()
    let systemInfo = wx.getSystemInfoSync()
    let naviBarHeight = menuButtonRect.bottom+10
    let naviBarWidth = systemInfo.screenWidth
    
    this.setData ({
      naviBarHeight: naviBarHeight,
      naviBarWidth: naviBarWidth,
      stateBarHeight: systemInfo.statusBarHeight
    })
  },
})