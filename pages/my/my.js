// pages/my/my.js

const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // role:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    var role = wx.getStorageSync("role")
    var userInfo = wx.getStorageSync("userInfo")
    
    if(!role){
      that.setData({
        role: -1
      })
    }else{
      that.setData({
        role: role
      })
    }
    that.setData({
      avatar: userInfo.avatar,
      name: userInfo.name,
    })
    
  },

  to_stu_info:function(){
    wx.navigateTo({
      url: '../../pages/stu-info/stu-info',
    })

  },

  

  

  

  to_stu_rea:function(){
    wx.navigateTo({
      url: '../../pages/stu-rearch/stu-rearch',
    })
  },

  to_tea_data:function(){
    wx.navigateTo({
      url: '../../pages/tea_data/tea_data',
    })
  },

  to_tea_sinfo: function () {
    wx.navigateTo({
      url: '../../pages/tea_sinfo/tea_sinfo',
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
      console.log('my_onshow')
      this.getTabBar().setData({
        selected: 3
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

  },

  //获取微信绑定手机号登录
  getPhoneNumber: function (e) {
    var that = this
    wx.login({
      success: res => {

        if (e.detail.errMsg == "getPhoneNumber:ok") {
          wx.showLoading({
            title: '登录中...',
          })
          wx.login({
            success(res) {
              console.log("cccs.code" + res.code)

              let iv = encodeURIComponent(e.detail.iv);
              let encryptedData = encodeURIComponent(e.detail.encryptedData);
              let code = res.code
              var params = {
                "code": code,
                "iv": iv,
                "encryptedData": encryptedData
              }
              console.log(params)
              app.ljjw.xcxjwlogin(params).then(d => {
                
                if (d.data.status == 0) {
                  console.log("登录成功")
                  wx.setStorageSync('token', d.data.token);
                  wx.setStorageSync('uid', d.data.uid);
                  wx.setStorageSync('userInfo', d.data.userInfo)
                  wx.setStorageSync('role', 1)
                  
                  that.onLoad()


                } else {
                  wx.showToast({
                    title: "登陆失败",
                    icon: 'none',
                    duration: 1000
                  })
                  console.log(d.data.msg)
                }
              })
              wx.hideLoading()
            }
          })
        }
      }
    })
  },

})