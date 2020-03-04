// pages/t_stuwork/t_stuwork.js
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
    var i = 0
    var sid = options.sid
    var classname = options.classname
    that.setData({
      sid: sid,
      classname:classname
    })
    var params = {
      "token": wx.getStorageSync("token"),
      "uid": wx.getStorageSync("uid"),
      "sid": sid
    }
    console.log(params)
    app.ljjw.jwViewScheduleCheckOn(params).then(d => {
      console.log(d)
      if (d.data.status == 1) {
        that.setData({
          stu_totle: d.data.data.stucount,
          cutschool: d.data.data.cutschool,
          later: d.data.data.later,
          normal: d.data.data.normal,
          leaveschool: d.data.data.leaveschool,
          askforleave: d.data.data.askforleave,
          
        })
        // console.log(that.data.normal.length)
        if (that.data.normal){
          that.setData({
            normal_num: that.data.normal.length,
          })
        }
        if (that.data.cutschool) {
          that.setData({
            cutschool_num: that.data.cutschool.length,
          })
        }
        if (that.data.later) {
          that.setData({
            later_num: that.data.later.length,
          })
        }
        if (that.data.leaveschool) {
          that.setData({
            leaveschool_num: that.data.leaveschool.length,
          })
        }
        if (that.data.askforleave) {
          that.setData({
            askforleave_num: that.data.askforleave.length,
          })
        }

      }
      
    })
  },

  look_stu_datail:function(e){
    let that = this
    var askfor_xb = e.currentTarget.dataset.askfor_xb
    console.log(askfor_xb)
    that.setData({
      askforleave_info: that.data.askforleave[askfor_xb].askforleave_info,
      askforleave_avatar: that.data.askforleave[askfor_xb].avatar,
      stu_detail: true
    })
  },

  clo_mask:function(){
    let that = this
    that.setData({
      stu_detail : false
    })
  },

  // 返回上一页
  go_back: function () {
    wx.navigateBack({
      delta: 1  // 返回上一级页面。
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