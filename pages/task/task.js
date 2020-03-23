// pages/task/task.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // role:4,
    add:false,
    stu_class: [],
    stu_class_index: 0,
    tea_class_index: 0,
    stu_info:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    var role = wx.getStorageSync("role")
    if (!role) {
      that.setData({
        role: -1,
        login:flase
      })
      
    } else {
      that.setData({
        role: role,
        login:true
      })
    }
    if(that.data.role == 4){
      var params = {
        "token": wx.getStorageSync("token"),
        "uid": wx.getStorageSync("uid"),
      }
      console.log(params)
      app.ljjw.jwGetStudentTaskMain(params).then(d => {
        if (d.data.status == 1) {
          console.log(d.data.data)
          that.setData({
            message: d.data.data.messages,
            morning: d.data.data.morning_read,
            stu_class:d.data.data.classes,
            newtaskcount: d.data.data.newtaskcount
          })
          if (that.data.morning.pics != ''){
            that.data.morning.pics = that.data.morning.pics.split(",")
          }else{
            console.log("morning.pics空")
          }
          
          

          that.setData({
            csmorningRead: that.data.morning,
            // new_message:that.data.message
          })
          console.log(that.data.stu_class)
          console.log(that.data.csmorningRead)
          console.log("学生任务首页获取成功")
        } else if(d.data.status == -1){
          that.setData({
            stu_info:false
          })
          wx.showToast({
            title: '请先完善个人信息',
            icon:"none",
            duration: 2500,
          })
        }


      })
    }else if(that.data.role == 1){
      var params = {
        "token": wx.getStorageSync("token"),
        "uid": wx.getStorageSync("uid"),
      }
      console.log(params)
      app.ljjw.jwTeacherTasksMainPage(params).then(d => {

        if (d.data.status == 1) {
          that.setData({
            message: d.data.data.messages,
            morning: d.data.data.morning_read,
            tea_class: d.data.data.classes
          })
          that.data.morning.pics = that.data.morning.pics.split(",")
          
          

          that.setData({
            csmorningRead: that.data.morning,
            // new_message: that.data.message
          })
        }

        console.log("我是老师任务onLoad")
      })
      
    }else if(that.data.role == 2){
      var params = {
        "token": wx.getStorageSync("token"),
        "uid": wx.getStorageSync("uid"),
      }
      console.log(params)
      app.ljjw.jwTeacherTasksMainPage(params).then(d => {

        if (d.data.status == 1) {
          that.setData({
            message: d.data.data.messages,
            morning: d.data.data.morning_read,
            tea_class: d.data.data.classes
          })
          that.data.morning.pics = that.data.morning.pics.split(",")



          that.setData({
            csmorningRead: that.data.morning,
            // new_message: that.data.message
          })
        }

        
        console.log("我是教务任务onLoad")
      })
    }else if(that.data.role == 3){
      console.log("我是管理员任务onLoad")
    }
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
    }
    console.log(params)
    app.ljjw.jwGetStudentTaskMain(params).then(d => {
      if (d.data.status == 1) {
        console.log(d.data.data)
        that.setData({
          message: d.data.data.messages,
          morning: d.data.data.morning_read,
          stu_class: d.data.data.classes,
          newtaskcount: d.data.data.newtaskcount
        })
        if (that.data.morning.pics != '') {
          that.data.morning.pics = that.data.morning.pics.split(",")
        } else {
          console.log("morning.pics空")
        }

        that.setData({
          csmorningRead: that.data.morning,
       
        })
        console.log(that.data.stu_class)
        console.log(that.data.csmorningRead)
        console.log("学生任务首页获取成功")
      }


    })
  },

  // 图片预览
  previewImg: function (e) {
    let that = this
    var xb = e.currentTarget.dataset.xb
    // var dxb = e.currentTarget.dataset.dxb
    console.log(xb)
    var imgs = that.data.csmorningRead.pics
    wx.previewImage({
      current: that.data.csmorningRead.pics[xb],
      urls: imgs
    })

  },

  tea_class_picker: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      tea_class_index: e.detail.value
    })
  },

  add_layout:function(){
    let that = this
    that.setData({
      add : !that.data.add
    })

  },

  to_stu_task:function(){
    let that = this
    console.log("to_stu_task")
    if(that.data.role == 4){
      wx.navigateTo({
        url: '../../pages/stu-task/stu-task',
      })
    } else if (that.data.role <= 2){
      wx.navigateTo({
        url: '../../pages/tea-task/tea-task',
      })
    }
    
  },

  to_add_read:function(e){
    let that = this
    var addtype = e.currentTarget.dataset.addtype
    that.setData({
      add:false
    })
    if(addtype == 1){
      wx.navigateTo({
        url: '../../pages/add_read/add_read',
      })
    }else if(addtype == 2){
      wx.navigateTo({
        url: '../../pages/add_message/add_message',
      })
    }
    
  },

  to_stu_mornread: function () {
    let that = this
    if(that.data.role == 4){

      wx.navigateTo({
        url: '../../pages/stu_mornread/stu_mornread?class_id=' + that.data.stu_class[that.data.stu_class_index].id,
      })
    }else if(that.data.role <= 2){
      wx.navigateTo({
        url: '../../pages/stu_mornread/stu_mornread?class_id=' + that.data.tea_class[that.data.tea_class_index].id,
      })
    }
    
  },

  to_detail_news: function (e) {
    let that = this
    var xb = e.currentTarget.dataset.xb
    console.log(xb)
    console.log(that.data.message[xb])
    wx.navigateTo({
      url: '../../pages/detail-news/detail-news?content=' + that.data.message[xb].content + '&date=' + that.data.message[xb].createtime + '&pics=' + that.data.message[xb].pics,
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
      console.log('task_onshow')
      this.getTabBar().setData({
        selected: 2
      })
    }
    else {
      console.log('未执行')
    }
    this.onLoad()
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