// pages/feedBack_list/feedBack_list.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 顶部菜单选中下标
    menuSelectedIndex: 0,

    // 反馈处理数量
    feedBackNotiCount: 0,
    
    /**
     * item列表
     * id: 类型id
     * title：类型标题
     * child：二级分类（字段 id， title）
    */
    itemArray: [],

    // 反馈列表
    feedBackList:[
      {
        isread: 1, 
        time: '2019.09.04 09:20', 
        type: '软件使用', 
        dealType:1, // 1-处理中 2-已处理 3-被驳回
        content: "我再使用小程序的时候，班级资料中的pdf格式文件打开有问题，如下图所示，打开后，是空白，或者是提示文件类型错误。问题：我再使用小程序的时候，班级资料中的pdf格式文件打开有问题，如下图所示，打开后，是空白，或者是提示文件类型错误。",
        open: false,
        pics: ['','']
      },
      {
        isread: 0, 
        time: '2019.09.04 09:20', 
        type: '软件使用', 
        dealType: 2,
        content: "我再使用小程序的时候，班级资料中的pdf格式文件打开有问题，打开后，是空白，或者是提示。",
        open: false,
        pics: ['',''],
        dealTime: '2019.06.07 09:15',
        dealContent: '这个问题已经修复，建议重新打开小程序即可解决。',
        dealPics: ['', '', '', ''],
        evaluated: false, // 是否已评价
        score: 0,
        evaluate_content: '',
        canEvaluateSubmit: false, // 是否可以提交评分
      },
      {
        isread: 0, 
        time: '2019.09.04 09:20', 
        type: '软件使用', 
        dealType: 3,
        content: "我再使用小程序的时候，班级资料中的pdf格式文件打开有问题，打开后，是空白，或者是提示错误打开后，是空白，或者是提示错误或者是提示错误打开后。",
        open: false,
        pics: ['', '', '', ''],
        dealTime: '2019.06.07 09:15',
        dealContent: '这个问题已经修复，建议重新打开小程序即可解决。',
        dealPics: ['', ''],
        evaluated: true,
        score: 3,
        evaluate_content: "回复不是很清楚，但是可以勉强接受。"
      }],

      // 反馈类型 圆圈颜色
      typeColor: ['#6D9DEE', '#FB895E', '#74BB71', '#FC7878', '#E1CB3C'],
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
      saveBottom: saveBottom
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
      if (status == 1) {
        let data = d.data.data
        let count = data.allcount
        if (count && count != '') {
          that.setData({
            feedBackNotiCount: count
          })
        } else {
          that.setData({
            feedBackNotiCount: 0
          })
        }
      } else {
        that.setData({
          feedBackNotiCount: 0
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
    feedBack.score = score
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

    let change = "feedBackList["+index+"].evaluate_content"
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