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
    let that = this;
    var role = wx.getStorageSync("role")
    if (!role) {
      that.setData({
        role: -1,
        login: flase
      })

    } else {
      that.setData({
        role: role,
        login: true
      })
    }
    if(that.data.role == 4){
      var params = {
        "token": wx.getStorageSync("token"),
        "uid": wx.getStorageSync("uid"),
      }
      console.log(params)
      app.ljjw.jwGetStudentScore(params).then(d => {
        console.log(d)
        if (d.data.status == 1) {
          console.log(d.data.data)
          that.setData({
            stu_score: d.data.data.list,
            stu_class: d.data.data.classes
          })
          console.log("学生成绩获取成功")
        }


      })
    }else if(that.data.role <= 2){
      var params = {
        "token": wx.getStorageSync("token"),
        "uid": wx.getStorageSync("uid"),
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
    }
    
    
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
    if (typeof that.getTabBar === 'function' &&
      that.getTabBar()) {
      console.log('record_onshow')
      that.getTabBar().setData({
        selected: 1
      })
    }
    else {
      console.log('未执行')
    }
    that.setData({
      stu_class_index:0,
      tea_class_index: 0
    })
    if (that.data.role == 4) {
      var params = {
        "token": wx.getStorageSync("token"),
        "uid": wx.getStorageSync("uid"),
        // "class_id": that.data.stu_class[that.data.stu_class_index].class_id
      }
      console.log(params)
      app.ljjw.jwGetStudentScore(params).then(d => {
        console.log(d)
        if (d.data.status == 1) {
          console.log(d.data.data)
          that.setData({
            stu_score: d.data.data.list,
            stu_class: d.data.data.classes
          })
          console.log("学生成绩获取成功")
        }


      })
    } else if (that.data.role <= 2) {
      var params = {
        "token": wx.getStorageSync("token"),
        "uid": wx.getStorageSync("uid"),
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

  }
})