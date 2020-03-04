// pages/class_data/class_data.js
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
    var params = {
      "token": wx.getStorageSync("token"),
      "uid": wx.getStorageSync("uid"),
      
    }
    console.log(params)
    app.ljjw.jwGetMyCollection(params).then(d => {
      if (d.data.status == 1) {
        that.setData({
          mydata: d.data.data
        })
        console.log("我的收藏搜索接口获取成功")
      } else {
        wx.showToast({
          title: d.data.msg,
          icon: "none",
          duration: 2000
        })
      }


    })
  },

  search_collect:function(e){
    let that = this
    console.log(e.detail.value)
    that.setData({
      input_title: e.detail.value
    })

    var params = {
      "token": wx.getStorageSync("token"),
      "uid": wx.getStorageSync("uid"),
      "keyword": that.data.input_title
    }
    console.log(params)
    app.ljjw.jwGetMyCollection(params).then(d => {
      if (d.data.status == 1) {
        that.setData({
          mydata: d.data.data
        })
        console.log("我的收藏搜索接口获取成功")
      } else {
        wx.showToast({
          title: d.data.msg,
          icon: "none",
          duration: 2000
        })
      }


    })
  

  },

  cancel_collect:function(){
    let that = this
    var params = {
      "token": wx.getStorageSync("token"),
      "uid": wx.getStorageSync("uid"),
      "type": 2,  //1-添加，2-取消
      "fileid": 1
    }
    console.log(params)
    app.ljjw.jwStudentAddCollection(params).then(d => {
      if (d.data.status == 1) {
        console.log(d.data.msg)
        that.onLoad();
        console.log("收藏与取消收藏接口获取成功")
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