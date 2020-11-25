// pages/task/task.js
const app = getApp()
Page({

  // class选择器选中的索引
  classPickerSelectIndex: 0,

  isClassPickerScrollStart: false,
  isClassPickerScrollEnd: false,


  // 订阅消息模版列表
  tmplList: [
    {
      mobanID: 'oThZxl4EBVE2ivwEx8HSRPo0WOVF-krqGkmU224AubQ',
      title: '上课时间',
      icon: './resource/orderAuthIcon2.png'
    },
    {
      mobanID: 'r6__flLPw6zHbF4YDEXPag4m-tr5RY0h8RiPZLkYHy4',
      title: '到离校',
      icon: './resource/orderAuthIcon3.png'
    }
  ],

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
    showNoData: true, // 是否展示无数据页面
    showClassPicker: false, // 是否展示班级选择器
    showTopClassDot: false, // 是否在导航栏班级 展示小红点
    showNoPower: false, // 是否无权限

    // 授权未打开的订阅消息模版
    selectedTmplModel: null,

    // 是否展示引导授权订阅消息弹框
    orderAuthSettingShow: false,
    // 订阅消息弹框标题
    orderAuthTitle: null,
    // 订阅消息弹框副标题
    orderAuthSubtitle: null,
    // 订阅消息弹框图表
    orderAuthIconPath: null,


    // 是否展示订阅授权更改教程页
    orderAuthProcessViewShow: false,
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
    this.orderNoti(function(authSuccess, next){
      if (next) {
        var xb = e.currentTarget.dataset.xb
        let noti = that.data.message[xb]
        that.readNoti(xb)
        wx.navigateTo({
          url: '../../pages/detail-news/detail-news',
          success (res) {
            res.eventChannel.emit('newsDetailData', noti)
          }
        })
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
    let that = this
    console.log("进入任务首页")
    app.setTaskItemDot()
    // 判断登录状态
    this.setUpLogInStatus()
    console.log("角色是"+that.data.role)
    if (!this.data.showNoPower) {
      // 刷新数据
      this.reloadData(1, function(success, msg){
        if(!success) {
          wx.showToast({
            title: msg,
            icon: 'none',
          })
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
   * 设置自定义导航栏尺寸
  */
  setUpNaviSize: function () {
    var menuButtonRect = wx.getMenuButtonBoundingClientRect()
    let systemInfo = wx.getSystemInfoSync()
    let naviBarHeight = menuButtonRect.bottom+10
    let windowHeight = systemInfo.windowHeight * 750 / systemInfo.screenWidth
    this.setData ({
      naviBarHeight: naviBarHeight,
      naviBarSelectSub_Height: menuButtonRect.height,
      naviBarSelectSub_Top: menuButtonRect.top,
      windowHeight: windowHeight
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
        showNoData: true,
        message: null,
        stu_class:null,
        newtaskcount: 0,
        csmorningRead: null,
        unreadmsg: 0,
        showTopClassDot: false,

        tea_class: null,
      })
      
    } else {
      var showNoPower = false
      if (role == 4) {
        let stuinfo = wx.getStorageSync('stuinfo')
        if (stuinfo && stuinfo.ifused && stuinfo.ifused == 0) {
          showNoPower = true
        }
      }
      this.setData({
        role: role*1,
        login:true,
        showNoData: role == 3 ? true : this.data.showNoData,
        showNoPower: showNoPower
      })
    }
  },

  /**
   * 订阅消息处理
  */
  orderNoti: function(callback) {
    // 只有学生才开启订阅消息
    if (this.data.role != 4) {
      typeof callback == "function" && callback(false, true)
      return
    }

    let that = this
    wx.showLoading({
      title: '加载中',
    })
    // 获取订阅消息授权信息
    wx.getSetting({
      withSubscriptions: true,
      success(res) {
        console.log('获取订阅消息授权信息成功：')
        console.log(res)
        let subscriptionsSetting = res.subscriptionsSetting
        if (subscriptionsSetting.itemSettings) {
          // 用户已选择过
          wx.hideLoading({
            success: () => {
              if(subscriptionsSetting.mainSwitch) {
                // 订阅消息开关 open
                var rejectCount = 0
                var rejectTempModel = null
                for (var i = 0; i < that.tmplList.length; i++) {
                  let tempModel = that.tmplList[i]
                  let authResult = subscriptionsSetting.itemSettings[tempModel.mobanID]
                  if (!authResult || authResult == 'reject') {
                    rejectCount += 1
                    rejectTempModel = tempModel
                  }
                }
                switch(rejectCount) {
                  case 0: {
                    // 开个都打开
                    that.setData({
                      selectedTmplModel: null
                    })
                    typeof callback == "function" && callback(true, true)
                    break
                  }
                  case 1: {
                    // 打开了一个
                    that.setData({
                      selectedTmplModel: rejectTempModel
                    })
                    that.showSettingOrderNotiView(2, rejectTempModel, callback)
                    break
                  }
                  case 2: {
                    // 两个都关闭
                    that.setData({
                      selectedTmplModel: null
                    })
                    that.showSettingOrderNotiView(1, null, callback)
                    break
                  }
                }
              } else {
                // 订阅消息开关 close
                that.showSettingOrderNotiView(1, null, callback)
              }
            },
          })
        } else {
          // 用户未选择过
          let templIds = []
          for (var i = 0; i < that.tmplList.length; i++) {
            let templModel = that.tmplList[i]
            templIds.push(templModel.mobanID)
          }
          // 请求订阅消息权限
          wx.requestSubscribeMessage({
            tmplIds: templIds,
            success(res2){
              console.log("用户授权订阅消息权限成功")
              console.log(res2)
              wx.hideLoading({
                success: (res) => {
                  typeof callback == "function" && callback(true, true)
                },
              })
            },
            fail(res2) {
              console.log("用户授权订阅消息权限失败")
              console.log(res2)
              wx.hideLoading({
                success: () => {
                  typeof callback == "function" && callback(false, true)
                },
              })
            }
          })
        }
      },
      fail(res) {
        console.log("获取订阅消息授权信息失败：")
        console.log(res)
        wx.hideLoading({
          success: () => {
            typeof callback == "function" && callback(false, true)
          },
        })
      }
    })
  },

  /**
   * 展示引导用户授权订阅消息弹框
   * type: 1-都没授权  2-有一个没授权
  */
  showSettingOrderNotiView: function(type, rejectModel, callback) {
    let orderNotiAuthSettingShowed = wx.getStorageSync('orderNotiAuthSettingShowed')
    if (orderNotiAuthSettingShowed) {
      // 已经展示过授权引导
      typeof callback == "function" && callback(true, true)
    } else{
      // 未展示过授权引导
      wx.setStorageSync('orderNotiAuthSettingShowed', true)
      typeof callback == "function" && callback(true, false)
      if (type == 1) {
        this.setData({
          orderAuthSettingShow: true,
          orderAuthTitle: '小程序',
          orderAuthSubtitle: '上课时间、到离校通知实时掌控',
          orderAuthIconPath: './resource/orderAuthIcon1.png'
        })
      } else {
        this.setData({
          orderAuthSettingShow: true,
          orderAuthTitle: rejectModel.title,
          orderAuthSubtitle: '可能会错过重要通知',
          orderAuthIconPath: rejectModel.icon
        })
      }
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
    let that = this
    this.orderNoti(function(authSuccess, next){
      if (next) {
        wx.navigateTo({
          url: '../../pages/noti_list/noti_list?class_id='+ (that.data.role == 4 ? that.data.stu_class[that.data.stu_class_index].class_id : that.data.tea_class[that.data.tea_class_index].id),
        })
      }
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
  },


  /**
   * 引导授权订阅消息弹框 下次开启按钮 点击事件
  */
  orderAuthSettingCancelButtonClicked: function() {
    this.setData({
      orderAuthIconPath: null,
      orderAuthSubtitle: null,
      orderAuthTitle: null,
      orderAuthSettingShow: false,
    })
  },


  /**
   * 引导授权订阅消息弹框 去开启按钮 点击事件
  */
  orderAuthSettingOpenButtonClicked: function() {
    this.orderAuthSettingCancelButtonClicked()
    if(wx.openSetting) {
      // 微信版本7.0.9及以上
      wx.openSetting({
        withSubscriptions: true,
        success(res) {
          console.log('打开小程序设置页')
          console.log(res)
        },
        fail(res) {
          console.log('打开小程序设置页失败')
          console.log(res)
        }
      })
    } else {
      // 微信版本7.0.9以下
      this.setData({
        orderAuthProcessViewShow: true
      })
    }
  },

  /**
   * 订阅消息授权流程弹框 关闭
  */
  orderAuthProcessViewClose: function() {
    this.setData({
      orderAuthProcessViewShow: false
    })
  },
})