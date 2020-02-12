// pages/record/record.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type: 1,
    aud: 1,
    role: 4,  //role：4 -学生；1 -老师；2 -教务；3 -管理员
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
    app.ljjw.jwGetStudentScore(params).then(d => {
      console.log(d)
      // if (d.data.status == 1) {
      //   console.log(d.data.data)
      //   that.setData({
      //     stu_class: d.data.data
      //   })
      //   console.log("所有班级获取成功")
      // }


    })
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