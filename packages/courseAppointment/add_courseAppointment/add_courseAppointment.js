// packages/courseAppointment/add_courseAppointment/add_courseAppointment.js
let app = getApp()
Page({

  // 一级id
  first_id: null,

  // 二级id
  second_id: null,

  /**
   * 页面的初始数据
   */
  data: {
    // 导航栏标题（课程+期）
    title: '',

    // 类型 1-提交课程预约信息 2-修改课程预约信息
    type: 1,

    /**
     * 动态内容类型列表
     * title：条目标题
     * text_type: 1-单行文本 2-多行文本
     * required： 1-必填  2-非必填
     * value: 自定义参数 值
    */
    itemList: [],

    // 是否可以提交
    canSubmit: false,

    // 姓名
    name: '',

    // 岗位
    wordStation: '',

    // 进面线
    score: '',

    // 是否展示预约期列表视图
    showAppointmentListView: false,

    // 预约期列表标题
    appointmentListTitle: '2020事业单位',

    // 预约期标题列表
    appointmentTitleList: ['9.20  第一期', '10.20  第二期', '11.20 第三期'],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getSystemSize()

    let that = this
    let eventChannel = this.getOpenerEventChannel()
    eventChannel.on('toAppointmentCourse', function(data){
      let type = data.type
      that.setData({
        type: type,
        title: data.title
      })
      that.first_id = data.first_id
      that.second_id = data.second_id
      if (type == 1) {
        // 初次提交预约
        that.getAppointmentItemList()
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

  // ---------------------------------------------私有方法------------------------------------------------
  /**
   * 获取系统辅助尺寸
  */
  getSystemSize: function () {
    let systemInfo = wx.getSystemInfoSync()
    let menuBoundingRect = wx.getMenuButtonBoundingClientRect()
    let naviHeight = menuBoundingRect.bottom + 10
    let naviContentHeight = naviHeight - systemInfo.statusBarHeight
    let safeArarBottom = systemInfo.screenHeight - systemInfo.safeArea.bottom
    this.setData({
      naviHeight: naviHeight,
      naviContentHeight: naviContentHeight,
      safeArarBottom: safeArarBottom,
      screenHeight: systemInfo.screenHeight,
      screenWidth: systemInfo.screenWidth,
      statusBarHeight: systemInfo.statusBarHeight
    })
  },

  /**
   * 判断是否可以提交
  */
  canSubmitStatusChange: function() {
    let canSubmit = true
    if (!this.data.itemList || this.data.itemList.length == 0) {
      canSubmit = false
    }
    for (var i = 0; i < this.data.itemList.length; i++) {
      let item = this.data.itemList[i]
      if (item.required == 1 && (!item.value || item.value == '')) {
        canSubmit = false
        break
      }
    }
    this.setData({
      canSubmit: canSubmit
    })
  },

  // -----------------------------------------------接口----------------------------------------------
  /**
   * 获取预约条目列表
  */
  getAppointmentItemList: function() {
    let param = {
      token: wx.getStorageSync('token'),
      id: this.first_id,
    }
    let that = this
    app.ljjw.getCourseAppointmentItemList(param).then(d=>{
      if (d.data.status == 1) {
        let itemList = d.data.data
        if (!itemList || itemList == '') {
          itemList = []
        }
        that.setData({
          itemList: itemList
        })
      }
    })
  },

  /**
   * 提交预约
  */
  submitAppointment: function() {
    let valueArray = []
    for (var i = 0; i < this.data.itemList.length; i++) {
      let item = this.data.itemList[i]
      if (item.value && item.value != '') {
        valueArray.push({id: item.id, value: item.value})
      }
    }
    let valueStr = JSON.stringify(valueArray)
    let stuinfo = wx.getStorageSync('stuinfo')
    let params = {
      token: wx.getStorageSync('token'),
      cate_id: this.second_id,
      stu_id: stuinfo.id,
      data: valueStr,
    }
    app.ljjw.submitCourseAppointment(params).then(d=>{
      if (d.data.status == 1) {
        wx.showToast({
          title: '提交成功',
          icon: 'none'
        })
        wx.navigateBack({
          delta: 0,
        })
      }
    })
  },

  // ----------------------------------------------交互事件-------------------------------------------
  /**
   * 导航栏 返回按钮 点击事件
  */
  naviBackItemClciked : function() {
    wx.navigateBack()
  },

  /**
   * input输入框 输入
  */
  inputValueChange: function (e) {
    let value = e.detail.value
    if (value == ' ') {
      value = ''
    }
    // console.log(e)
    let index = e.currentTarget.dataset.index
    let itemValueStr = 'itemList['+index+'].value'
    this.setData({
      [itemValueStr]: value
    })
    this.canSubmitStatusChange()
  },

  textareaValueChange: function (e) {
    let value = e.detail.value
    if (value == ' ') {
      value = ''
    }
    // console.log(e)
    let index = e.currentTarget.dataset.index
    let itemValueStr = 'itemList['+index+'].value'
    this.setData({
      [itemValueStr]: value
    })

    this.canSubmitStatusChange()
  },


  /**
   * 提交按钮 点击事件
   */
  submitButtonClciked: function() {
    if (!this.data.canSubmit) {
      return
    }
    this.submitAppointment()
  },

  /**
   * 课程条目 点击事件
  */
  appointmentItemClciked: function(){
    this.setData({
      showAppointmentListView: true
    })
  },

  /**
   * 期选择列表 选项点击事件
  */
  appointmentListOptionClciked: function(e) {
    // console.log(e)
    let index = e.detail.index
    this.setData({
      showAppointmentListView: false
    })
  },

  /**
   * 期选择列表 关闭
  */
  appointmentListViewClose: function() {
    this.setData({
      showAppointmentListView: false
    })
  }
})