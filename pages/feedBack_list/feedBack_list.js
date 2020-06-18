// pages/feedBack_list/feedBack_list.js
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

    // 页面红点
    redDotCount: {
      // 反馈处理 未读消息数量
      feedBackNotiCount: 0,
      // 待归还 未读消息数
      feedBackNotReturn: 0,
      // 已完成 未读消息数量
      feedBackFinished: 0,
    },
    
    /**
     * item列表
     * id: 类型id
     * title：类型标题
     * child：二级分类（字段 id， title）
    */
    itemArray: [],

    // 反馈类型 圆圈颜色
    typeColor: ['#6D9DEE', '#FB895E', '#74BB71', '#FC7878', '#E1CB3C'],

    /**
     * 反馈列表
     * sort_id: 二级分类ID
     * notes: 反馈内容
     * pics: 反馈图片，以','隔开
     * usetime: 申请试用自习室的时间段
     * marked: 学员评分
     * comment: 学员评价内容
     * comment_time: 学员评分时间
     * subtime: 学员提交反馈时间 10位时间戳
     * dispose_user: 关联处理人
     * operate_uid: 操作人
     * feed_state: 处理状态 1-未处理 2-处理中 3-已处理 4-已驳回
     * return_state: 申请归还状态 0-无归还状态 1-未归还 2-待确认 3-已归还 4-已驳回
     * saw: 反馈处理后学员是否已读 0-未读 10已读
     * parent: 一级分类名
     * soncount: 二级分类数量
     * 
     * 自定义
     * time：创建时间 0000-00-00 00:00
     * canEvaluateSubmit：是否可以提交评论
    */
    feedBackList:[],

    // 反馈处理 类型 1-未处理 2-待归还 3-已完结
    feedBackListType: 1,
    feedBackListMenu: [
      {
        title: "待处理",
        type: 1,
      }, 
      {
        title: "待归还",
        type: 2,
      }, 
      {
        title: "已完成",
        type: 3
      }
    ],

    // 选中要评价的反馈的索引
    evaluateIndex: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options)
    if (options.menu == 1) {
      this.setData({
        menuSelectedIndex: options.menu
      })
    }
    this.setUpNaviSize()
    this.getFeedBackTypeList()
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
    this.studentGetFeedBackNotiCount()
    if (this.data.menuSelectedIndex == 1) {
      this.pageData.page = 1
      this.studentGetFeedBackList()
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

  // --------------------------------------------------接口-----------------------------------------------------
  /**
   * 获取反馈类型列表
  */
  getFeedBackTypeList: function() {
    let that = this
    let params = {
      "token": wx.getStorageSync("token")
    }
    app.ljjw.getFeedbackType(params).then(d=>{
      let status = d.data.status
      if (status == 1) {
        let data = d.data.data
        for (var i = 0; i < data.length; i++) {
          let type = data[i]
          type.open = false
        }
        that.setData({
          itemArray: data
        })
      }
    })
  },

  /**
   * 学生获取未读反馈消息数量
  */
  studentGetFeedBackNotiCount: function () {
    let that = this
    let prarms = {
      "token": wx.getStorageSync("token"),
      "uid": wx.getStorageSync("uid"),
    }
    app.ljjw.getUnreadCount(prarms).then(d=>{
      let status = d.data.status
      let redDotCount = {
        feedBackNotiCount: 0,
        feedBackNotReturn: 0,
        feedBackFinished: 0,
      }
      if (status == 1) {
        let data = d.data.data
        var allCount = data.allcount
        var notReturnCount = data.daiguihuan
        var finishedCount = data.yiwanjie
        if (allCount && allCount != '') {
          redDotCount.feedBackNotiCount = allCount
        }
        if (notReturnCount && notReturnCount != '') {
          redDotCount.feedBackNotReturn = notReturnCount
        }
        if (finishedCount && finishedCount != '') {
          redDotCount.feedBackFinished = finishedCount
        }
        this.setData({
          redDotCount: redDotCount
        })
      } else {
        that.setData({
          redDotCount: redDotCount
        })
      }
    })
  },

  /**
   * 学生获取反馈列表
   * params:
   * type=1 未处理  type=2 待归还 type=3 已完结
  */
  studentGetFeedBackList: function (type) {
    let that = this
    let params = {
      "token": wx.getStorageSync("token"),
      "uid": wx.getStorageSync("uid"),
      type: type ? type : this.data.feedBackListType,
      page: this.pageData.page,
      limit: this.pageData.perpage,
    }
    app.ljjw.getFeedBackList(params).then(d=>{
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
          for(var j = 0; j < feedBack.process_list.length; j++) {
            let process = feedBack.process_list[j]
            // 处理图片
            process.images = (process.images && process.images != '') ? process.images.split(',') : []
          }
          if(feedBack.evaluated) {
            // 已评价 添加评价记录到流程列表
            feedBack.process_list.push({
              proctime: '0000-00-00 00:00',
              content: feedBack.comment,
            })
          }
        }
        that.setData({
          feedBackList: feedBackList,
          feedBackListType: params.type
        })
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
    this.setData({
      menuSelectedIndex: index
    })

    this.studentGetFeedBackNotiCount()
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
   * 一级反馈类型 单元格 点击事件
  */
  feedBackTypeClicked: function(e) {
    let index = e.currentTarget.dataset.index
    let item = this.data.itemArray[index]
    if (!item.child || !(item.child.constructor === Array) || item.child.length == 0) {
      wx.showToast({
        title: '没有二级分类',
        icon: 'none'
      })
      return
    }
    if (item.child.length == 1) {
      let childItem = item.child[0]
      wx.navigateTo({
        url: '../../pages/feedBack_submit/feedBack_submit?type=' + childItem.id + '&title=' + item.title,
      })
    } else {
      let itemOpenStr = "itemArray["+index+"].open"
      this.setData({
        [itemOpenStr]: !item.open
      })
    }
  },

  /**
   * 二级反馈类型 点击事件
  */
  feedBackSecondTypeClicked: function (e) {
    // console.log(e)
    let firstIndex = e.currentTarget.dataset.firstindex
    let secondIndex = e.currentTarget.dataset.secondindex

    let firstTypeItem = this.data.itemArray[firstIndex]
    let secondTypeItem = firstTypeItem.child[secondIndex]

    wx.navigateTo({
      url: '../../pages/feedBack_submit/feedBack_submit?type=' + secondTypeItem.id + '&title=' + firstTypeItem.title + '&subtitle=' + secondTypeItem.title,
    })
  },

  /**
   * 反馈处理 菜单 点击事件
  */
  feedBackListMenuClicked: function (e) {
    let type = e.currentTarget.dataset.type
    if (type == this.data.feedBackListType) {
      return
    }
    this.studentGetFeedBackList(type)
  },

  /**
   * 反馈列表 单元格 展开/收起 点击事件
  */
  feedBackOpenButton: function(e) {
    // console.log(e)
    let index = e.currentTarget.dataset.index
    let feedBack = this.data.feedBackList[index]
    let setData = "feedBackList["+index+"].open"
    this.setData({
      [setData]: !feedBack.open
    })
  },

  /**
   * 评分星星 点击事件
  */
  startClicked: function (e) {
    // console.log(e)
    let feedBackIndex = e.detail.tag
    let score = e.detail.score
    
    let feedBack = this.data.feedBackList[feedBackIndex]
    feedBack.marked = score
    feedBack.canEvaluateSubmit = true

    let change = 'feedBackList['+feedBackIndex+']'
    this.setData({
      [change]: feedBack
    })
  },

  /**
   * textarea文本输入
  */
  textareaInput: function(e) {
    // console.log(e)
    let newcontent = e.detail.value
    let index = e.currentTarget.dataset.index

    let change = "feedBackList["+index+"].comment"
    this.setData({
      [change]: newcontent
    })

  },

  /**
   * 评价 提价按钮
  */
  evaluateSubmit: function(e) {
    console.log(e)
  }
})