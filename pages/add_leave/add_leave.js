// pages/add_leave/add_leave.js
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
    var date = new Date()
    var cur_year = date.getFullYear()
    var cur_month = date.getMonth() + 1
    var cur_day = date.getDate()
    var cur_date = cur_year + '-' + (cur_month < 10 ? '0' + (cur_month) : cur_month) + '-' + (cur_day < 10 ? '0' + (cur_day) : cur_day)
    console.log(cur_date)
    that.setData({
      cur_date: cur_date
    })
  },

  leave_stu_time: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      leave_stu_time: e.detail.value
    })
  },

  lea_sel:function(){
    let that = this
    that.setData({
      lea_sel : !that.data.lea_sel
    })
  },

  lea_for:function(e){
    let that = this
    console.log(e.detail.value)
    that.setData({
      lea_for: e.detail.value
    })

  },

  lea_submit:function(){
    wx.showToast({
      title: '提交成功',
      duration:2000
    })
    wx.navigateBack({
      url: "../../pages/index/index"
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