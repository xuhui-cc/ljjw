// pages/stu_mornread/stu_mornread.js
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

  },

  
  to_stu_rearch:function(){
    var type = 1
    wx.navigateTo({
      url: '../../pages/stu-rearch/stu-rearch?type=' + type,
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
    setTimeout(() => {
      wx.startPullDownRefresh()//通过方法调用刷新
    }, 1000)
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
    let that = this
    var params = {
      "token": wx.getStorageSync("token"),
      "uid": wx.getStorageSync("uid"),
      "page":1
    }
    console.log(params)
    app.ljjw.jwGetMorningReadMore(params).then(d => {
      // console.log(d)
      if (d.data.status == 1) {
        // console.log(d.data.data)
        that.setData({
          morningRead: d.data.data
        })

        for (var i = 0; i < that.data.morningRead.length; i++) {
          var cs = 'morningRead[' + i + '].pics'
          that.setData({
            [cs]: that.data.morningRead[i].pics.split(",")
          })
        }

        that.setData({
          csmorningRead: that.data.morningRead
        })



        console.log(that.data.morningRead)

        
    
        console.log("每日晨读获取成功")
      }


    })

    wx.stopPullDownRefresh()//结束刷新
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let that = this
    // 显示加载图标
    wx.showLoading({
      title: '玩命加载中',
    })
    var params = {
      "token": wx.getStorageSync("token"),
      "uid": wx.getStorageSync("uid"),
      "page": 2
    }
    console.log(params)
    app.ljjw.jwGetMorningReadMore(params).then(d => {
      console.log(d)
      // if (d.data.status == 1) {
      //   console.log(d.data.data)
      //   that.setData({
      //     stu_class: d.data.data
      //   })
      //   console.log("学生任务班级获取成功")
      // }

      // 隐藏加载框
      wx.hideLoading();
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})