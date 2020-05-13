// pages/record/record.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type: 1,
    aud: 1,
    tea_class_index:0,
    stu_class_index: 0,
    // role: 4,  //role：4 -学生；1 -老师；2 -教务；3 -管理员
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    // 获取导航栏尺寸
    this.setUpNaviSize()
    
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
      "class_id": that.data.tea_class[that.data.tea_class_index].id
    }
    console.log(params)
    app.ljjw.jwTeacherScoreMainPage(params).then(d => {
      console.log(d)
      if (d.data.status == 1) {
        console.log(d.data.data)
        that.setData({
          tea_class: d.data.data.classes,
          tea_mock_list: d.data.data.mock_list
        })
        console.log("老师成绩首页获取成功")
      }


    })
  },

  stu_class_picker: function (e) {
    let that = this
    console.log('picker发送选择改变，携带值为', e.detail.value)
    that.setData({
      stu_class_index: e.detail.value
    })
    var params = {
      "token": wx.getStorageSync("token"),
      "uid": wx.getStorageSync("uid"),
      "class_id": that.data.stu_class[that.data.stu_class_index].class_id
    }
    console.log(params)
    app.ljjw.jwGetStudentScore(params).then(d => {
      console.log(d)
      if (d.data.status == 1) {
        console.log(d.data.data)
        that.setData({
          stu_score: d.data.data.list,
          // stu_class: d.data.data.classes
        })
        console.log("学生成绩获取成功")
      }


    })
  },


  to_stu_record:function(e){
    let that = this
    var xb = e.currentTarget.dataset.xb
    console.log(that.data.stu_score[xb].score_id)
    wx.navigateTo({
      url: '../../pages/stu-record/stu-record?sid=' + that.data.stu_score[xb].score_id,
    })

  },

  to_tea_record:function(e){
    let that = this
    var xb = e.currentTarget.dataset.xb 
    console.log(e.currentTarget.dataset.xb)
    wx.navigateTo({
      url: '../../pages/tea-record/tea-record?mid=' + that.data.tea_mock_list[xb].id,
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
    let that = this
    // if (typeof that.getTabBar === 'function' &&
    //   that.getTabBar()) {
    //   console.log('record_onshow')
    //   that.getTabBar().setData({
    //     selected: 1
    //   })
    // }
    // else {
    //   console.log('未执行')
    // }

    // 获取登录状态及角色
    that.setUpLogInStatus()

    // 加载数据
    that.reloadData()
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

  /**
   * 设置自定义导航栏尺寸
  */
  setUpNaviSize: function () {
    var menuButtonRect = wx.getMenuButtonBoundingClientRect()
    let naviBarHeight = menuButtonRect.bottom+10
    this.setData ({
      naviBarHeight: naviBarHeight,
      naviBarSelectSub_Height: menuButtonRect.height,
      naviBarSelectSub_Top: menuButtonRect.top
    })
  },

  /**
   * 判断登录状态
  */
  setUpLogInStatus: function () {
    let that = this
    var role = wx.getStorageSync("role")
    if (!role) {
      that.setData({
        role: -1,
        login: false
      })

    } else {
      that.setData({
        role: role,
        login: true
      })
    }
  },

  /**
   * 加载数据
  */
  reloadData: function() {
    let that = this

    switch(that.data.role * 1) {
      case 1: 
        // 老师
      case 2: {
        // 教务
        var params = {
          "token": wx.getStorageSync("token"),
          "uid": wx.getStorageSync("uid"),
        }
        if (that.data.tea_class && that.data.tea_class_index && that.data.tea_class.length > that.data.tea_class_index) {
          params.class_id = that.data.tea_class[that.data.tea_class_index].id
        }
        app.ljjw.jwTeacherScoreMainPage(params).then(d => {
          // console.log(d)
          if (d.data.status == 1) {
            // console.log(d.data.data)
            that.setData({
              tea_class: d.data.data.classes,
              tea_mock_list: d.data.data.mock_list
            })
            console.log("老师成绩首页获取成功")
          }
        })
        break
      }
      case 3: {
        // 管理员
        break
      }
      case 4: {
        // 学生
        var params = {
          "token": wx.getStorageSync("token"),
          "uid": wx.getStorageSync("uid"),
        }
        if (that.data.stu_class && that.data.stu_class_index && that.data.stu_class.length > that.data.stu_class_index) {
          params.class_id = that.data.stu_class[that.data.stu_class_index].class_id
        }
        // console.log(params)
        app.ljjw.jwGetStudentScore(params).then(d => {
          // console.log(d)
          if (d.data.status == 1) {
            that.setData({
              stu_score: d.data.data.list,
              stu_class: d.data.data.classes
            })
            console.log("学生成绩获取成功")
          }
  
  
        })
        break
      }
    }
  }
})