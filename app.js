//app.js
const ljjw = require('./utils/ljjw.js')
const util = require('./utils/util.js')
App({

  ljjw: ljjw,
  util: util,
  onLaunch: function () {
    // 展示本地存储能力

    let that = this
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        that.globalData.wxLoginCode = res.code
      },
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })

    this.setTaskItemDot()
  },
  globalData: {
    userInfo: null,
    wxLoginCode: null,
  },

  // 微信登录code
  getWxLoginCode () {
    return this.globalData.wxLoginCode
  },
  updateWxLoginCode (code) {
    this.globalData.wxLoginCode = code
  },

  /**
   * 获取tabbar任务item小红点是否显示
  */
  setTaskItemDot () {
    let role = wx.getStorageSync('role')
    if (!role || role == -1 || role == 3) {
      return
    }
    let uid = wx.getStorageSync('uid')
    let token = wx.getStorageSync('token')
    let params = {
      uid: uid,
      token: token
    }
    ljjw.jwTaskBarRedPoint(params).then(d=>{
      if (d.data.status == 1) {
        if (d.data.data == 1) {
          wx.showTabBarRedDot({
            index: 2,
          })
        } else {
          wx.showTabBarRedDot({
            index: 2,
          })
        }
      }
    })
  }
})