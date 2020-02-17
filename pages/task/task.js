// pages/task/task.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // role:4,
    add:false,
    stu_class: [],
    stu_class_index: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    var role = wx.getStorageSync("role")
    if (!role) {
      that.setData({
        role: -1
      })
    } else {
      that.setData({
        role: role
      })
    }
    var params = {
      "token": wx.getStorageSync("token"),
      "uid": wx.getStorageSync("uid"),
    }
    console.log(params)
    app.ljjw.jwGetStudentTaskMain(params).then(d => {
      if (d.data.status == 1) {
        console.log(d.data.data)
        that.setData({
          message: d.data.data.messages,
          morning: d.data.data.morning_read,
          stu_class:d.data.data.classes
        })
        that.data.morning.pics = that.data.morning.pics.split(",")
        for (var j = 0; j < that.data.message.length; j++) {
          var cscs = 'message[' + j + '].pics'
          that.setData({
            [cscs]: that.data.message[j].pics.split(",")
          })
        }

        that.setData({
          csmorningRead: that.data.morning,
          new_message:that.data.message
        })
        console.log(that.data.stu_class)
        console.log(that.data.csmorningRead)
        console.log("学生任务首页获取成功")
      }


    })
  },

  stu_class_picker: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      stu_class_index: e.detail.value
    })
  },

  add_layout:function(){
    let that = this
    that.setData({
      add : !that.data.add
    })

  },

  to_stu_task:function(){
    let that = this
    console.log("to_stu_task")
    if(that.data.role == 4){
      wx.navigateTo({
        url: '../../pages/stu-task/stu-task',
      })
    } else if (that.data.role <= 2){
      wx.navigateTo({
        url: '../../pages/tea-task/tea-task',
      })
    }
    
  },

  to_add_read:function(){
    wx.navigateTo({
      url: '../../pages/add_read/add_read',
    })
  },

  to_stu_mornread: function () {
    wx.navigateTo({
      url: '../../pages/stu_mornread/stu_mornread',
    })
  },

  to_detail_news: function (e) {
    let that = this
    var xb = e.currentTarget.dataset.xb
    console.log(xb)
    console.log(that.data.new_message[xb])
    wx.navigateTo({
      url: '../../pages/detail-news/detail-news?content=' + that.data.new_message[xb].content + '&date=' + that.data.new_message[xb].createtime + '&pics=' + that.data.new_message[xb].pics,
    })
    // url: '../live/live?video_id=' + this.data.video_id + '&lesson_id=' + this.data.lesson_id,
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
    if (typeof this.getTabBar === 'function' &&
      this.getTabBar()) {
      console.log('task_onshow')
      this.getTabBar().setData({
        selected: 2
      })
    }
    else {
      console.log('未执行')
    }
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