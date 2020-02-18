// pages/tea_data/tea_data.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tea_class_index:0,
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
    app.ljjw.jwTeacherClassFiles(params).then(d => {
      console.log(d)
      if (d.data.status == 1) {
        that.setData({
          tea_class: d.data.data.classes
        })
        console.log("老师的班级资料获取成功")
      }
      
    })
  },

  tea_class_picker: function (e) {
    let that = this
    console.log('picker发送选择改变，携带值为', e.detail.value)
    that.setData({
      tea_class_index: e.detail.value
    })
    var params = {
      "token": wx.getStorageSync("token"),
      "uid": wx.getStorageSync("uid"),
      "class_id": that.data.tea_class[that.data.tea_class_index].id,
    }
    console.log(params)
    app.ljjw.jwTeacherClassFiles(params).then(d => {
      console.log(d)
      if (d.data.status == 1) {
        // that.setData({
        //   tea_class: d.data.data.classes
        // })
        console.log("老师更换班级资料获取成功")
      }
      // console.log("我是老师的班级资料")

    })
  },

  search_tea_data:function(e){
    let that = this 
    console.log(e.detail.value)
    that.setData({
      input_tltle: e.detail.value
    })
    if(that.data.input_tltle != '')
    var params = {
      "token": wx.getStorageSync("token"),
      "uid": wx.getStorageSync("uid"),
      "keyword": that.data.input_tltle
    }
    console.log(params)
    app.ljjw.jwTeacherClassFiles(params).then(d => {
      console.log(d)
      if (d.data.status == 1) {
        // that.setData({
        //   tea_class: d.data.data.classes
        // })
        console.log("老师搜索班级资料获取成功")
      }
      // console.log("我是老师的班级资料")

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