// pages/graduation_school/graduation_school.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    value:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  selsct_school:function(e){
    let that = this
    var xb = e.currentTarget.dataset.xb
    console.log(xb)
    that.setData({
      value: that.data.school[xb].school_name
    })
    wx.setStorageSync("input_school", that.data.value)
    wx.navigateBack({
      delta: 1  // 返回上一级页面。
    })
  },

  input_school: function (e) {
    let that = this
    console.log(e.detail.value)
    that.setData({
      input_school: e.detail.value
    })
    
    var params = {
      "token": wx.getStorageSync("token"),
      "keyword": that.data.input_school
    }
    console.log(params)
    app.ljjw.jwGetSchoolList(params).then(d => {
      if (d.data.status == 1) {
        if(d.data.data != ''){
          that.setData({
            school:d.data.data
          })
        }
        else{
          wx.setStorageSync("input_school", that.data.input_school)
        }
        
        
      }
      

    })
    // wx.navigateBack({
    //   url: '../../pages/stu-info/stu-info',
    // })
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