// pages/task/task.js
const app = getApp()
Page({

  // class选择器选中的索引
  classPickerSelectIndex: 0,

  isClassPickerScrollStart: false,
  isClassPickerScrollEnd: false,
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
    showClassPicker: false, // 是否展示班级选择器
    showTopClassDot: false // 是否在导航栏班级 展示小红点
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
    this.readNoti(xb)
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
    this.reloadData(1, function(success, msg){
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
 
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

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
          "limit": 3,
        }
        
        if (that.data.tea_class && that.data.tea_class.length > that.data.tea_class_index) {
          params.class_id = that.data.tea_class[that.data.tea_class_index].id
        }
        // console.log("jwTeacherTasksMainPage\n请求参数：")
        // console.log(params)
        app.ljjw.jwTeacherTasksMainPage(params).then(d => {
          wx.stopPullDownRefresh({
            complete: (res) => {},
          })
          // console.log("请求结果：")
          // console.log(d.data)
          let status = d.data.status
          var pageData = d.data.data
          if (status == 1) {
            if (pageData.morning_read != '' && pageData.morning_read.pics != '') {
              pageData.morning_read.pics = pageData.morning_read.pics.split(",")
            }
            var newMessages = pageData.messages

            var showNoData = false
            // if (newMessages.length == 0) {
            //   showNoData = true
            // }
            if (!(pageData.classes && pageData.classes.length != 0)) {
              showNoData = true
            }
            var showTopClasssDot = false
            for (var i = 0; i < pageData.classes.length; i++) {
              let aclass = pageData.classes[i]
              if (aclass.redpoint == 1) {
                showTopClasssDot = true
                break
              }
            }
            that.setData({
              message: newMessages,
              csmorningRead: pageData.morning_read,
              tea_class: pageData.classes,
              showNoData: showNoData,
              unreadmsg: pageData.unreadmsg,
              showTopClassDot: showTopClasssDot
            })
            typeof cb == "function" && cb(true, "加载成功")
          } else {
            that.setData({
              showNoData: true,
              showTopClassDot: false,
            })
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
          "limit": 3,
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
            // 判断是否加载空页面
            var showNoData = false
            // if (newMessages.length == 0) {
            //   showNoData = true
            // }
            var showTopClasssDot = false
            if (!(pageData.classes && pageData.classes.length != 0)) {
              showNoData = true
            } else {
              for (var i = 0; i < pageData.classes.length; i++) {
                let aclass = pageData.classes[i]
                if (aclass.redpoint == 1) {
                  showTopClasssDot = true
                  break
                }
              }
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
              unreadmsg: pageData.unreadmsg,
              showTopClassDot: showTopClasssDot
            })
            typeof cb == "function" && cb(true, "加载成功")
          } else if(status == -1){
            that.setData({
              stu_info:false,
              showNoData: false,
            })
            typeof cb == "function" && cb(false, "请先完善个人信息")
          } else {
            typeof cb == "function" && cb(false, msg)
          }
        })
        break
    }
  },

  /**
   * 将消息通知改为已读状态
  */
  readNoti: function (index) {
    let noti = this.data.message[index]
    if (noti.isread == 1) {
      return
    }

    let params = {
      uid: wx.getStorageSync('uid'),
      token: wx.getStorageSync('token'),
      msgid: noti.id
    }

    app.ljjw.jwReadMsg(params).then(d=>{

    })
  },

  /**
   * 学生班级选定事件
  */
  stu_class_picker: function (e) {
    console.log("选中改变")
    console.log(e)
    let index = e.detail.value[0]
    this.classPickerSelectIndex = index
  },

  classPickerScrollStart: function (e) {
    this.isClassPickerScrollStart = true
    this.isClassPickerScrollEnd = false
  },
  classPickerScrollEnd: function(e) {
    this.isClassPickerScrollEnd = true
    this.isClassPickerScrollStart = false
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
    this.reloadData(1, function(success, msg){
      if(!success) {
        wx.showToast({
          title: msg,
          icon: 'none',
        })
      }
    })
  },

  /**
   * 历史消息 点击事件
  */
  showNotiList: function(e) {
    wx.navigateTo({
      url: '../../pages/noti_list/noti_list?class_id='+ (this.data.role == 4 ? this.data.stu_class[this.data.stu_class_index].class_id : this.data.tea_class[this.data.tea_class_index].id),
    })
  },

  /**
   * 导航栏班级选择 点击事件
  */
  showClassPickerView: function (e) {
    wx.hideTabBar({
      animation: false,
    })
    this.setData({
      showClassPicker: true
    })
  },

  /**
   * 班级选择器 取消按钮 点击事件
  */
  classPickerViewCancel: function (e) {
    wx.showTabBar({
      animation: false,
    })
    this.setData({
      showClassPicker: false
    })
  },

  /**
   * 班级选择器 确定按钮 点击事件
  */
  classPickerViewSure: function (e) {
    
    if (this.isClassPickerScrollStart) {
      return
    }
    this.classPickerViewCancel()

    if(this.data.role == 4) {
      if (this.classPickerSelectIndex == this.data.stu_class_index) {
        return
      }
      this.setData({
        stu_class_index: this.classPickerSelectIndex
      })
    } else {
      if (this.classPickerSelectIndex == this.data.tea_class_index) {
        return
      }
      this.setData({
        tea_class_index: this.classPickerSelectIndex
      })
    }
    

    let that = this
    
    that.reloadData(1, function(success,msg){
      if(!success) {
        wx.showToast({
          title: msg,
          icon: 'none',
        })
      }
    })
  }

})