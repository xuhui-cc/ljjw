// pages/task/task.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    role:4,
    add:false,
    stu_class: ['西安国考集训营逻辑班', '西安国考集训营逻辑班', '西安国考集训营逻辑班', '西安国考集训营逻辑班', '西安国考集训营逻辑班'],
    stu_class_index: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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

  to_detail_news: function () {
    wx.navigateTo({
      url: '../../pages/detail-news/detail-news',
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