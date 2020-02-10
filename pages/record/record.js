// pages/record/record.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type: 1,
    aud: 1,
    role: 3,  //role：0 -学生；1 -老师；2 -教务；3 -管理员
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },


  to_stu_record:function(){
    wx.navigateTo({
      url: '../../pages/stu-record/stu-record',
    })

  },

  to_tea_recors:function(){
    wx.navigateTo({
      url: '../../pages/tea-record/tea-record',
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
    let that = this
    if (typeof that.getTabBar === 'function' &&
      that.getTabBar()) {
      console.log('record_onshow')
      that.getTabBar().setData({
        selected: 1
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