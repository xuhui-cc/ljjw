// pages/feedBack_list/feedBack_list.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 顶部菜单选中下标
    menuSelectedIndex: 0,
    // item列表
    itemArray: [
      {
        title: "学习反馈",
        type: 0
      },
      {
        title: "生活反馈",
        type: 1
      },
      {
        title: "软件使用",
        type: 2
      },
      {
        title: "其他问题",
        type: 3
      }],

    // 反馈列表
    feedBackList:[
      {
        isread: 1, 
        time: '2019.09.04 09:20', 
        type: '软件使用', 
        dealType:1, // 1-处理中 2-已处理 3-被驳回
        content: "问题：我再使用小程序的时候，班级资料中的pdf格式文件打开有问题，如下图所示，打开后，是空白，或者是提示文件类型错误。问题：我再使用小程序的时候，班级资料中的pdf格式文件打开有问题，如下图所示，打开后，是空白，或者是提示文件类型错误。",
        open: false,
        pics: ['','']
      },
      {
        isread: 0, 
        time: '2019.09.04 09:20', 
        type: '软件使用', 
        dealType: 2,
        content: "问题：我再使用小程序的时候，班级资料中的pdf格式文件打开有问题，打开后，是空白，或者是提示。",
        open: false,
        pics: ['',''],
        dealTime: '2019.06.07 09:15',
        dealContent: '这个问题已经修复，建议重新打开小程序即可解决。',
        dealPics: ['', '', '', '']
      },
      {
        isread: 0, 
        time: '2019.09.04 09:20', 
        type: '软件使用', 
        dealType: 3,
        content: "问题：我再使用小程序的时候，班级资料中的pdf格式文件打开有问题，打开后，是空白，或者是提示错误打开后，是空白，或者是提示错误或者是提示错误打开后。",
        open: false,
        pics: ['', '', '', ''],
        dealTime: '2019.06.07 09:15',
        dealContent: '这个问题已经修复，建议重新打开小程序即可解决。',
        dealPics: ['', '']
      }],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setUpNaviSize()
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
   * 反馈列表 每个单元格 展开/收起 点击事件
  */
  feedBackOpenButton: function(e) {
    // console.log(e)
    let index = e.currentTarget.dataset.index
    let feedBack = this.data.feedBackList[index]
    let setData = "feedBackList["+index+"].open"
    this.setData({
      [setData]: !feedBack.open
    })
  }
})