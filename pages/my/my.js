// pages/my/my.js

const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // role:0,
    stu_class: ['西安国考集训营逻辑班', '西安国考集训营逻辑班', '西安国考集训营逻辑班', '西安国考集训营逻辑班', '西安国考集训营逻辑班'],
    stu_class_index: 0,
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
      userInfo: userInfo
      // name: userInfo.name,
    })

    if(that.data.role == 4){
      var params = {
        "token": wx.getStorageSync("token"),
        "uid": wx.getStorageSync("uid"),
      }
      console.log(params)
      app.ljjw.jwGetStudentMainPage(params).then(d => {
        if(d.data.status == 1){
          that.setData({
            mydata: d.data.data
          })
          console.log("我的主页接口获取成功")
        }
        
        
      })
    } else if (that.data.role == 1){
      var params = {
        "token": wx.getStorageSync("token"),
        "uid": wx.getStorageSync("uid"),
      }
      console.log(params)
      app.ljjw.jwTeacherMyPage(params).then(d => {
        console.log(d)
        // if (d.data.status == 1) {
        //   that.setData({
        //     mydata: d.data.data
        //   })
        //   console.log("我的主页接口获取成功")
        // }


      })
      console.log("我是老师")
    }
    else if (that.data.role == 2) {
      console.log("我是教务")
    }
    else if (that.data.role == 3) {
      console.log("我是管理员")
    }
    
  },

  stu_class_picker: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      stu_class_index: e.detail.value
    })
  },

  to_stu_info:function(){
    wx.navigateTo({
      url: '../../pages/stu-info/stu-info',
    })

  },

  
  to_class_data: function () {
    wx.navigateTo({
      url: '../../pages/class_data/class_data',
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

  iscollect:function(){
    let that = this
    that.setData({
      iscollect: !that.data.iscollect
    })
    var params = {
      "token": wx.getStorageSync("token"),
      "uid": wx.getStorageSync("uid"),
      "type":2,  //1-添加，2-取消
      "fileid":1
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
                  wx.setStorageSync('role', d.data.role)
                  
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