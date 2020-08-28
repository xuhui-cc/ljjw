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

    wx.setInnerAudioOption({
      mixWithOther: false,
      obeyMuteSwitch: false,
    })
  },

  onShow() {
    this.removeTempFile()
    this.setTaskItemDot()
    this.getMyUserInfo()
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
      wx.hideTabBarRedDot({
        index: 2,
      })
      return
    }
    if (role == 4) {
      let stuInfo = wx.getStorageSync('stuinfo')
      if (stuInfo && (stuInfo.ifused == 0 || stuInfo.checked == 0)) {
        wx.hideTabBarRedDot({
          index: 2,
        })
        return
      }
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
          wx.hideTabBarRedDot({
            index: 2,
          })
        }
      } else {
        wx.hideTabBarRedDot({
          index: 2,
        })
      }
    })
  },

  /**
   * 刷新用户信息
  */
  getMyUserInfo () {
    let that = this
    let oldRole = wx.getStorageSync('role')
    if (!oldRole || oldRole == "" || oldRole == 0) {
      return
    }
    let params = {
      uid : wx.getStorageSync('uid'),
      token : wx.getStorageSync('token')
    }
    ljjw.jwgetUserinfoByUid(params).then(d=>{
      let status = d.data.status
      if (status == 1) {
        let data = d.data.data
        // 判断角色有没有改变
        var role = data.role.split(",")
        if(role.length == 2){
          role[0] = role[1]
        }
        
        if (role[0] != oldRole) {
          console.log("角色由 " + oldRole + " 变为 " + role[0] + ", 即将清空数据重新登录")
          that.clearLocalInfo()
          return
        }

        // 判断关联班级有没有改变
        if (role && data.class_ids != null) {
          var class_ids = data.class_ids.split(",")
          var oldClassIds = wx.getStorageSync('class_ids')
          if (class_ids.length != oldClassIds.length) {
            console.log("关联的班级由 " + oldClassIds.join(",") + " 变为 " + data.class_ids + ", 即将清空数据重新登录")
            that.clearLocalInfo()
            return
          } else {
            for (var i = 0; i < class_ids.length; i++) {
              let newClass = class_ids[i]
              let oldClass = oldClassIds[i]
              if (newClass != oldClass) {
                that.clearLocalInfo()
                return
              }
            }
          }
        }
        // 判断学生账号可用状态是否改变
        if (role && role == 4) {
          let stuinfo = data.stuinfo
          if (stuinfo) {
            let oldStuInfo = wx.getStorageSync('stuinfo')
            if (stuinfo.ifused == 0) {
              wx.hideTabBarRedDot({
                index: 2,
              })
            }
            if (oldStuInfo && oldStuInfo.ifused && stuinfo.ifused != oldStuInfo.ifused) {
              console.log("学生是否可用状态由 " + oldStuInfo.ifused + " 变为 " + stuinfo.ifused + ", 即将清空数据重新登录")
              that.clearLocalInfo()
              return
            }
            wx.setStorageSync('stuinfo', stuinfo)
          }
        } else {
          try {
            wx.removeStorageSync('stuinfo')
          } catch (e) {
            // Do something when catch error
          }
        }

        let userinfo = data.userInfo
        if (!userinfo.avatar || userinfo.avatar.indexOf('http') == -1) {
          userinfo.avatar = '../../images/avatar_null.png'
        }
        wx.setStorageSync('userInfo', userinfo)
      }
    })
  },

  /**
   * 清除本地数据
  */
  clearLocalInfo () {
    wx.clearStorage({
      fail:function(res) {
        console.log()
      },
      complete: (res) => {
        console.log('清空数据完成，即将跳转至我的')
        wx.showTabBar({
          animation: false,
        })
        wx.switchTab({
          url: '/pages/my/my',
        })
      },
    })
  },

  /**
   * 删除缓存文件
  */
  removeTempFile () {
    let tempFilePath = wx.getStorageSync('openFilePath')
    if (tempFilePath && tempFilePath != '') {
      let fs = wx.getFileSystemManager()
      fs.unlink({
        filePath: tempFilePath,
        success (res) {
          console.log("文件删除成功" + tempFilePath)
          wx.removeStorageSync('openFilePath')
        },
        fail (res) {
          console.log("文件删除失败"+tempFilePath)
          console.log(res)
        }
      })
    }
  }
})