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
          tea_class: d.data.data.classes,
          files: d.data.data.files
        })
        console.log("老师的班级资料获取成功")
      }
      
    })
  },

  open_file:function(e){
    let that = this
    var file_xb = e.currentTarget.dataset.file_xb
    console.log(file_xb)
    console.log(that.data.files[file_xb].fileurl)
    wx.downloadFile({
      url: that.data.files[file_xb].fileurl, //仅为示例，并非真实的资源
      success(res) {
        // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
        

        var filePath = res.tempFilePath
        console.log(filePath)
        wx.showLoading({
          title: '资料打开中...',
        })

        wx.openDocument({

          filePath: filePath,

          success: function (res) {

            console.log('打开文档成功')
            wx.hideLoading()

          }

        })
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
        that.setData({
          files: d.data.data.files
        })
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
      "class_id": that.data.tea_class[that.data.tea_class_index].id,
      "keyword": that.data.input_tltle
    }
    console.log(params)
    app.ljjw.jwTeacherClassFiles(params).then(d => {
      console.log(d)
      if (d.data.status == 1) {
        that.setData({
          files: d.data.data.files
        })
        console.log("老师搜索班级资料获取成功")
      }
      // console.log("我是老师的班级资料")

    })
  },

  go_back:function(){
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