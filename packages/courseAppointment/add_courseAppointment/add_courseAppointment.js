// packages/courseAppointment/add_courseAppointment/add_courseAppointment.js
let app = getApp()
Page({

  // 一级id type为1时有值
  first_id: null,

  // 二级id  type为1时有值
  second_id: null,

  // 预约id  type为2时有值
  appointment_id: null,

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

    // 原课程标题 type为2时可用
    oldCateTilte: '',

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
    appointmentListTitle: '',

    // 预约期标题列表
    appointmentTitleList: [],

    // 选中的期 为null代表未选择
    appointmentSelectedCateIndex: null,
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
      that.appointment_id = data.appointment_id
      if (type == 1) {
        // 初次提交预约
        that.getAppointmentItemList()
      } else if (type == 2) {
        // 修改
        that.getNewAppointmentInfo()
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
    if (this.data.type == 2 && this.data.appointmentSelectedCateIndex == null) {
      canSubmit = false
    }
    if (canSubmit) {
      for (var i = 0; i < this.data.itemList.length; i++) {
        let item = this.data.itemList[i]
        if (item.required == 1 && (!item.value || item.value == '')) {
          canSubmit = false
          break
        }
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
   * 提交预约 type==1
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
    let params = {
      token: wx.getStorageSync('token'),
      cate_id: this.second_id,
      uid: wx.getStorageSync('uid'),
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

  /**
   * 获取用户最新提交的信息
  */
  getNewAppointmentInfo: function() {
    let params = {
      token: wx.getStorageSync('token'),
      uid: wx.getStorageSync('uid'),
      bm_id: this.appointment_id
    }
    let that = this
    app.ljjw.getNewCourseAppointmentDetail(params).then(d=>{
      if (d.data.status == 1) {
        let result = d.data.data
        let itemList = result.type_list
        let cateList = result.cate_list
        let appointment_info = result.bm_info
        that.setData({
          itemList: itemList,
          appointmentTitleList: cateList,
          appointmentListTitle: appointment_info.yk_title,
          oldCateTilte: appointment_info.yk_title + '  ' + appointment_info.cate_title
        })
      }
    })
  },

  /**
   * type为2
   * 修改提交接口
  */
  submitChange: function() {
    let selected_cate = this.data.appointmentTitleList[this.data.appointmentSelectedCateIndex]
    let valueArray = []
    for (var i = 0; i < this.data.itemList.length; i++) {
      let item = this.data.itemList[i]
      if (item.value && item.value != '') {
        valueArray.push({id: item.id, value: item.value})
      }
    }
    let valueStr = JSON.stringify(valueArray)
    let params = {
      token: wx.getStorageSync('token'),
      bm_id: this.appointment_id,
      cate_id: selected_cate.cate_id,
      data: valueStr
    }
    let that = this
    app.ljjw.submitChangeCourseAppointment(params).then(d=>{
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

  /**
   * 判断 选择的期 是否可用
  */
  checkSelectCateCanUse: function(cate_id, callback) {
    let params = {
      token: wx.getStorageSync('token'),
      cate_id: cate_id,
    }
    let that = this
    app.ljjw.checkAppointmentCateCanUse(params).then(d=>{
      if (d.data.status == 1) {
        typeof callback == 'function' && callback(true)
      } else {
        typeof callback == 'function' && callback(false)
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

  /**
   * textarea输入框 输入
  */
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
    if (this.data.type == 1) {
      this.submitAppointment()
    } else if (this.data.type == 2) { 
      this.submitChange()
    }
    
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
    let cate = this.data.appointmentTitleList[index]
    this.setData({
      showAppointmentListView: false
    })
    let that = this
    this.checkSelectCateCanUse(cate.cate_id, function(success){
      if (success) {
        that.setData({
          appointmentSelectedCateIndex: index
        })
        that.canSubmitStatusChange()
      }
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