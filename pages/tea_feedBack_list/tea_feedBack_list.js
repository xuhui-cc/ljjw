// pages/tea_feedBack_list/tea_feedBack_list.js
const app = getApp()
Page({

  /**
   * 分页数据
  */
  pageData: {
    page: 1,
    perpage: 10,
    canLoadNextPage: false
  },

  /**
   * 页面的初始数据
   */
  data: {
    // 顶部菜单选中下标
    menuSelectedIndex: 0,

    // 待处理反馈小红点数量
    notDealCount: 0,

    // 反馈列表
    feedBackList: [],

    // 分类列表
    typeList:[],
    // 选择的关联分类索引
    selectedTypeIndex: null,
    // 是否展示关联分类选择弹框
    showTypePicker: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setUpNaviSize()
    this.teacherGetFeedBackList()
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
    this.teacherGetFeedBackNotiCount()
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

  // ------------------------------------------------私有方法---------------------------------------------------
  /**
   * 设置自定义导航栏尺寸
  */
  setUpNaviSize: function () {
    var menuButtonRect = wx.getMenuButtonBoundingClientRect()
    var systemInfo = wx.getSystemInfoSync()
    let naviBarHeight = menuButtonRect.bottom+10
    let naviBarWidth = systemInfo.screenWidth
    let saveBottom = systemInfo.screenHeight-systemInfo.safeArea.bottom
    
    this.setData ({
      naviBarHeight: naviBarHeight,
      naviBarWidth: naviBarWidth,
      navibar_content_height: naviBarHeight - systemInfo.statusBarHeight,
      statusBar_height: systemInfo.statusBarHeight,
      saveBottom: saveBottom,
      screenWidth: systemInfo.screenWidth
    })
  },

  /**
   * 获取 已评价 流程对象
  */
  getDealObject: function (timestamp, content, type) {
    switch(type*1){
      case 4: {
        // 学生提交归还
        return {
          timestamp: timestamp,
          time: app.util.customFormatTimeByTimestamp(timestamp*1000, 'yyyy-MM-dd hh:mm'),
          role: 1,
          type: 4,
          timeColor: '#8D8D8D',
          statusColor: '#272727',
          contentColor: '#272727',
          status: "提交归还"
        }
        break
      }
      case 7: {
        // 评论
        return {
          content :content,
          timestamp: timestamp,
          time: app.util.customFormatTimeByTimestamp(timestamp*1000, 'yyyy-MM-dd hh:mm'),
          role: 1,
          type: 7,
          timeColor: '#8D8D8D',
          contentColor: '#272727'
        }
        break
      }
    }
  },

  // -------------------------------------------------接口-----------------------------------------------------
  /**
   * 获取老师待处理反馈数量
  */
  teacherGetFeedBackNotiCount: function () {
    let that = this
    let prarms = {
      "token": wx.getStorageSync("token"),
      "uid": wx.getStorageSync("uid"),
    }
    app.ljjw.getTeacherUnreadCount(prarms).then(d=>{
      let status = d.data.status
      if (status == 1) {
        let data = d.data.data

        that.setData({
          notDealCount: data
        })
      } else {
        that.setData({
          notDealCount: 0
        })
      }
    })
  },

  /**
   * 老师获取反馈列表
  */
  teacherGetFeedBackList: function(type, cb) {
    let that = this
    let params = {
      "token": wx.getStorageSync("token"),
      "uid": wx.getStorageSync("uid"),
      type: type ? type : (this.data.menuSelectedIndex*1+1), // 1-待处理 2-已处理
      page: this.pageData.page,
      limit: this.pageData.perpage
    }
    app.ljjw.getTeacherFeedbackList(params).then(d=>{
      let status = d.data.status
      if (status == 1) {
        let feedBackList = d.data.data
        
        for (var i = 0; i < feedBackList.length; i++) {
          let feedBack = feedBackList[i]
          // 默认收起
          feedBack.open = false
          // 创建时间
          feedBack.time = app.util.customFormatTimeByTimestamp(feedBack.subtime*1000, 'yyyy.MM.dd hh:mm')
          // 反馈图片处理
          feedBack.pics = (feedBack.pics && feedBack.pics != '') ? feedBack.pics.split(',') : []
          // 是否已评分
          feedBack.evaluated = (!feedBack.marked || feedBack.marked == '' || feedBack.marked == 0) ? false : true
          // 流程列表 处理
          let dealList = []
          for(var j = 0; j < feedBack.process_list.length; j++) {
            let process = feedBack.process_list[j]
            let deal = {
              pics : (process.images && process.images != '') ? process.images.split(',') : [],
              content : process.content,
              name : process.procuser,
              role : 2,
              timestamp: process.createtime,
              time: process.proctime
            }
            if (process.tid == 1) {
              // 有处理结果
              if (process.procstate == 3) {
                // 已处理
                deal.type = 2
                deal.timeColor = '#8D8D8D'
                deal.statusColor = '#46A1FB'
                deal.contentColor = '#272727'
                deal.status = "已处理"
              } else {
                // 驳回
                deal.type = 3
                deal.timeColor = '#F14444'
                deal.statusColor = '#F14444'
                deal.contentColor = '#F14444'
                deal.status = "已驳回"
              }
            } else {
              // 无处理结果
              deal.type = 1
              deal.timeColor = '#8D8D8D'
              deal.contentColor = '#272727'
            }
            dealList.push(deal)
          }

          for (var j = 0; j < feedBack.apply_return.length; j++) {
            let apply = feedBack.apply_return[j]
            let deal = {}
            if (apply.type == 1) {
              // 学员提交归还
              deal = that.getDealObject(apply.deal_time, '', 4)
            } else {
              // 确认归还
              if(apply.status == 1) {
                // 老师确认归还
                deal = {
                  pics : (apply.images && apply.images != '') ? apply.images.split(',') : [],
                  content : apply.content,
                  name : apply.proc_user,
                  timestamp: apply.deal_time,
                  time: app.util.customFormatTimeByTimestamp(apply.deal_time*1000, 'yyyy.MM.dd hh:mm'),
                  role: 2,
                  type: 5,
                  timeColor: '#272727',
                  statusColor: '#272727',
                  contentColor: '#272727',
                  status: "确认归还"
                }
              } else {
                // 老师驳回归还
                deal = {
                  pics : (apply.images && apply.images != '') ? apply.images.split(',') : [],
                  content : apply.content,
                  name : apply.proc_user,
                  timestamp: apply.deal_time,
                  time: app.util.customFormatTimeByTimestamp(apply.deal_time*1000, 'yyyy.MM.dd hh:mm'),
                  role: 2,
                  type: 6,
                  timeColor: '#F14444',
                  statusColor: '#F14444',
                  contentColor: '#F14444',
                  status: "驳回归还"
                }
              }
            }
            dealList.push(deal)
          }
          if(feedBack.evaluated) {
            // 已评价 添加评价记录到流程列表
            let deal = that.getDealObject(feedBack.comment_time, feedBack.comment, 7)
            dealList.push(deal)
          }
          dealList.sort(function(a,b){
            let a_timestamp = a.timestamp
            let b_timestamp = b.timestamp
            return (a_timestamp - b_timestamp)
          })
          feedBack.dealList = dealList
        }

        // 分页数据处理
        var newList = []
        if (that.pageData.page == 1) {
          newList = feedBackList
        } else {
          newList = that.data.feedBackList.concat(feedBackList)
        }

        // 判断是否可以加载下一页
        if (feedBackList.length < that.pageData.perpage) {
          that.pageData.canLoadNextPage = false
        } else {
          that.pageData.canLoadNextPage = true
        }

        that.setData({
          feedBackList: newList,
          menuSelectedIndex: params.type-1
        })
        typeof cb == "function" && cb(true, "加载成功")
      } else {
        typeof cb == "function" && cb(false, "加载失败")
      }
    })
  },

  /**
   * 获取关联分类列表
  */
  getTypeList: function(cb) {
    let that = this
    let params = {
      "token": wx.getStorageSync("token"),
      "uid": wx.getStorageSync("uid"),
    }
    app.ljjw.getTeacherAttachSort(params).then(d=>{
      let status = d.data.status
      if (status == 1) {
        typeof cb == "function" && cb(true, "加载成功", d.data.data)
      } else {
        typeof cb == "function" && cb(false, "加载失败", null)
      }
    })
  },

  // ------------------------------------------------交互事件---------------------------------------------------
  /**
   * 顶部菜单 点击事件
  */
  menu_selected: function (e) {
      
    let index = e.currentTarget.dataset.index
    if (index == this.data.menuSelectedIndex) {
      return
    }
    let that = this
    this.teacherGetFeedBackList(index*1+1, function(success, msg) {
      if (success) {
        that.setData({
          menuSelectedIndex: index
        })
      }
    })
    this.teacherGetFeedBackNotiCount()
  },

  /**
   * 导航栏返回按钮
  */
  back: function() {
    wx.navigateBack({
      complete: (res) => {},
    })
  },

  /**
   * 反馈列表 单元格 展开/收起 点击事件
  */
  feedBackOpenButton: function(e) {
    // console.log(e)
    let that = this
    let index = e.currentTarget.dataset.index
    let feedBack = this.data.feedBackList[index]
    let setData = "feedBackList["+index+"].open"
    this.setData({
      [setData]: !feedBack.open
    })
  },

  /**
   * 顶部类型按钮 点击事件
  */
  showTypePicker: function () {
    let that = this
    if(!this.data.typeList || this.data.typeList == '' || this.data.typeList.length == 0) {
      this.getTypeList(function(success, msg, typeList){
        if (success) {
          if (typeList && typeList != '' && typeList.length != 0) {
            that.setData({
              typeList: typeList,
              showTypePicker: true
            })
          } else {
            wx.showToast({
              title: '暂无关联分类',
              icon: 'none'
            })
          }
        }
      })
    } else {
      this.setData({
        showTypePicker: true
      })
    }
  },

  /**
   * 展示大图
  */
  showBigImage: function(e) {
    console.log(e)
    let type = e.currentTarget.dataset.type
    let feedBack_index = e.currentTarget.dataset.feedbackindex
    let image_index = e.currentTarget.dataset.imageindex

    let feedBack = this.data.feedBackList[feedBack_index]
    
    if (type == 1) {
      // 反馈图片
      let urls = feedBack.pics
      let current = urls[image_index]
      wx.previewImage({
        urls: urls,
        current: current
      })
    } else {
      // 流程处理图片
      let processIndex = e.currentTarget.dataset.dealindex
      let process = feedBack.dealList[processIndex]
      let urls = process.pics
      let current = urls[image_index]
      wx.previewImage({
        urls: urls,
        current: current
      })
    }
  }
})