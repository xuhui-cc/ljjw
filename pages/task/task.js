// pages/task/task.js
const app = getApp()
Page({

  pageData: {
    perpage: 10,
    page: 1,
    canLoadNextPage: true,
  },

  /**
   * 页面的初始数据
   */
  data: {
    // role:4,
    add:false,
    stu_class: [],
    stu_class_index: 0,
    tea_class_index: 0,
    stu_info:true,
    showNoData: false, // 是否展示无数据页面
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    // 设置导航栏尺寸
    this.setUpNaviSize()
    
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
        url: '../../pages/stu-task/stu-task?class_id=' + that.data.stu_class[that.data.stu_class_index].class_id,
      })
    } else if (that.data.role <= 2){
      wx.navigateTo({
        url: '../../pages/tea-task/tea-task?class_id=' + that.data.tea_class[that.data.tea_class_index].id,
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
        url: '../../pages/stu_mornread/stu_mornread?class_id=' + that.data.stu_class[that.data.stu_class_index].class_id,
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
    let that = this
    console.log("进入任务首页")
    app.setTaskItemDot()
    // 判断登录状态
    this.setUpLogInStatus()
    console.log("角色是"+that.data.role)
    // 刷新数据
    this.pageData.page = 1
    this.reloadData(this.pageData.page, function(success, msg){
      if(!success) {
        wx.showToast({
          title: msg,
          icon: 'none',
        })
      }
    })
    
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
    let oldPage = this.pageData.page
    this.pageData.Page = 1
    this.reloadData(this.pageData.page, function(success, msg){
      if(!success) {
        wx.showToast({
          title: msg,
          icon: 'none',
        })
        that.pageData.page = oldPage
      }
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.pageData.canLoadNextPage) {
      let that = this
      let oldPage = this.pageData.page
      this.pageData.page = oldPage + 1
      this.reloadData(this.pageData.page, function(success, msg){
        if(!success) {
          wx.showToast({
            title: msg,
            icon: 'none',
          })
          that.pageData.page = oldPage
        }
      })
    }
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
    var role = wx.getStorageSync("role")
    if (!role) {
      this.setData({
        role: -1,
        login:false,
        showNoData: true
      })
      
    } else {
      this.setData({
        role: role*1,
        login:true,
        showNoData: role == 3 ? true : false,
      })
    }
  },

  /**
   * 刷新数据
  */
  reloadData: function (page, cb) {
    let that = this
    switch (that.data.role) 
    {
      case 1:
        // 老师
      case 2: 
        // 教务
        var params = {
          "token": wx.getStorageSync("token"),
          "uid": wx.getStorageSync("uid"),
          "page": page,
          "limit": that.pageData.perpage,
        }
        
        if (that.data.tea_class && that.data.tea_class.length > that.data.tea_class_index) {
          params.class_id = that.data.tea_class[that.data.tea_class_index].id
        }
        console.log("jwTeacherTasksMainPage\n请求参数：")
        console.log(params)
        app.ljjw.jwTeacherTasksMainPage(params).then(d => {
          wx.stopPullDownRefresh({
            complete: (res) => {},
          })
          console.log("请求结果：")
          console.log(d.data)
          let status = d.data.status
          var pageData = d.data.data
          if (status == 1) {
            if (pageData.morning_read != '' && pageData.morning_read.pics != '') {
              pageData.morning_read.pics = pageData.morning_read.pics.split(",")
            }
            var newMessages = pageData.messages
            if (newMessages.length < that.pageData.perpage) {
              that.pageData.canLoadNextPage = false
            } else {
              that.pageData.canLoadNextPage = true
            }
            if (page > 1) {
              newMessages = that.data.messages.concat(newMessages)
            }
            var showNoData = false
            // if (newMessages.length == 0) {
            //   showNoData = true
            // }
            if (!(pageData.classes && pageData.classes.length != 0)) {
              showNoData = true
            }
            that.setData({
              message: newMessages,
              csmorningRead: pageData.morning_read,
              tea_class: pageData.classes,
              showNoData: showNoData,
            })
            typeof cb == "function" && cb(true, "加载成功")
          } else {
            that.pageData.canLoadNextPage = false
            typeof cb == "function" && cb(false, msg)
          }
        })
        break
      
      case 3: 
        // 管理员
        console.log("我是管理员任务onLoad")
        break
      
      case 4: 
        // 学生
        var params = {
          "token": wx.getStorageSync("token"),
          "uid": wx.getStorageSync("uid"),
          "page": page,
          "limit": that.pageData.perpage,
        }
        if (that.data.stu_class && that.data.stu_class.length > that.data.stu_class_index) {
          params.class_id = that.data.stu_class[that.data.stu_class_index].class_id
        }
        // console.log(params)
        app.ljjw.jwGetStudentTaskMain(params).then(d => {
          wx.stopPullDownRefresh({
            complete: (res) => {},
          })
          let status = d.data.status
          var pageData = d.data.data
          let msg = d.data.msg
          if (status == 1) {
            if (pageData.morning_read != '' && pageData.morning_read.pics != ''){
              pageData.morning_read.pics = pageData.morning_read.pics.split(",")
            }
            var newMessages = pageData.messages
            // 判断是否可以上啦加载
            if (newMessages.length < that.pageData.perpage) {
              that.pageData.canLoadNextPage = false
            } else {
              that.pageData.canLoadNextPage = true
            }
            // 分页数据处理
            if (page > 1) {
              newMessages = that.data.messages.concat(newMessages)
            }
            // 判断是否加载空页面
            var showNoData = false
            // if (newMessages.length == 0) {
            //   showNoData = true
            // }
            if (!(pageData.classes && pageData.classes.length != 0)) {
              showNoData = true
            }
            // if (newMessages.length == 0 && pageData.morning_read.length == 0 && (pageData.newtaskcount == '' || pageData.newtaskcount == 0)) {
            //   showNoData = true
            // }
            // 更改数据 刷新界面
            that.setData({
              message: newMessages,
              stu_class:pageData.classes,
              newtaskcount: pageData.newtaskcount,
              csmorningRead: pageData.morning_read,
              showNoData: showNoData,
            })
            typeof cb == "function" && cb(true, "加载成功")
          } else if(status == -1){
            that.setData({
              stu_info:false,
              showNoData: false,
            })
            that.pageData.canLoadNextPage = false
            typeof cb == "function" && cb(false, "请先完善个人信息")
          } else {
            that.pageData.canLoadNextPage = false
            typeof cb == "function" && cb(false, msg)
          }
        })
        break
    }
  },

  /**
   * 学生班级选定事件
  */
  stu_class_picker: function (e) {
    let that = this
    console.log('picker发送选择改变，携带值为', e.detail.value)
    that.setData({
      stu_class_index: e.detail.value
    })
    this.pageData.page = 1
    that.reloadData(this.pageData.page, function(success,msg){
      if(!success) {
        wx.showToast({
          title: msg,
          icon: 'none',
        })
      }
    })
  },

  /**
   * 老师/教务班级选定事件
  */
  tea_class_picker: function (e) {
    let that = this
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      tea_class_index: e.detail.value
    })
    this.pageData.page = 1
    this.reloadData(this.pageData.page, function(success, msg){
      if(!success) {
        wx.showToast({
          title: msg,
          icon: 'none',
        })
      }
    })
  },

})