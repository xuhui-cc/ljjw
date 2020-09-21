// pages/courseAppointment/stu_courseAppointmentList/stu_courseAppointmentList.js
let app = getApp()
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
    // 选中的顶部菜单索引
    selectedMenuIndex: 0,

    /**
     * 课程预约列表
     * cateData: 二级列表
     *     user_yueke_state: 当前用户约课状态 0-未约课 1-审核中 2-已约课 & 取消申请中
    */
    apponintmentList: [],

    /**
     * 我的预约列表
     * addtime：提交时间 10位时间戳
     * state：状态 1-审核中 2-审核通过 3-驳回 4-申请取消 5-已取消
     * cate_title：二级标题
     * title：一级标题
     * state_list: 状态列表
     * update_list: 修改后 子类的报名信息 及 状态列表
    */
    myAppointmentList: [
      {
        title:'2020事业单位',
        subList:[
          {
            timeStr: '提交时间：2020.9.20  15:35',
            title: '2020事业单位  10.20 第二期',
            isMe: true,
            note: '这里是备注信息，这里是备注信息。'
          },
          {
            timeStr: '审核时间：2020.9.20  15:35',
            dealName: '陈文锦',
            isMe: false,
            note: '这里是���注信息，这里是备注信息，这里是备注信息，这里是备注信息，这里是备注信息，这里是备注信息，这里是备注信息。'
          },
          {
            timeStr: '提交时间：2020.9.20  15:35',
            title: '2020事业单位  10.20 第二期',
            isMe: true,
            note: '这里是备注信息，这里是备注信息。'
          }
        ],
      },
      {
        title:'2020事业单位',
        subList:[
          {
            timeStr: '提交时间：2020.9.20  15:35',
            title: '2020事业单位  10.20 第二期',
            isMe: true,
            note: '这里是备注信息，这里是备注信息。'
          },
          {
            timeStr: '审核时间：2020.9.20  15:35',
            dealName: '陈文锦',
            isMe: false,
            note: '这里是���注信息，这里是备注信息，这里是备注信息，这里是备注信息，这里是备注信息，这里是备注信息，这里是备注信息。',
            dealName: '陈文锦'
          },
          {
            timeStr: '提交时间：2020.9.20  15:35',
            title: '2020事业单位  10.20 第二期',
            isMe: true,
            note: '这里是备注信息，这里是备注信息。'
          }
        ]
      }
    ],

    // 是否展示预约备注弹框
    infoDetail: null,

    // 将要取消的预约
    cancelAppointment: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getSystemSize()
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
    this.pageData.page = 1
    if (this.data.selectedMenuIndex == 0) {
      this.getAppointmentList()
    } else {
      this.getMyCourseAppointmentList()
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

  //-----------------------------------------------------接口-----------------------------------------------------
  /**
   * 获取课程预约列表
  */
  getAppointmentList: function() {
    let stuinfo = wx.getStorageSync('stuinfo')
    let params = {
      token: wx.getStorageSync('token'),
      stu_id: stuinfo.id,
      limit: this.pageData.perpage,
      page: this.pageData.page
    }
    let that = this
    app.ljjw.courseAppointmentList(params).then(d=>{
      if (d.data.status == 1) {
        let appointmentList = d.data.data
        // for (var i = 0; i < appointmentList.length; i++) {

        // }
        // 分页数据处理
        let newList = []
        if (that.pageData.page == 1) {
          newList = appointmentList
        } else {
          newList = that.data.apponintmentList.concat(appointmentList)
        }
        // 判断是否可以加载下一页
        if (appointmentList.length < that.pageData.perpage) {
          that.pageData.canLoadNextPage = false
        } else {
          that.pageData.canLoadNextPage = true
        }
        that.setData({
          apponintmentList: newList
        })
      } else {
        if (that.pageData.page == 1) {
          that.setData({
            apponintmentList: []
          })
        }
      }
    })
  },

  /**
   * 获取我的课程预约列表
  */
  getMyCourseAppointmentList: function() {
    let stuinfo = wx.getStorageSync('stuinfo')
    let params = {
      token: wx.getStorageSync('token'),
      stu_id: stuinfo.id,
      page: this.pageData.page,
      limit: this.pageData.perpage,
    }
    app.ljjw.myCourseAppointmentList(params).then(d=>{
      if (d.data.status == 1) {
        let appointmentList = d.data.data

      }
    })
  },

  //----------------------------------------------------交互事件--------------------------------------------------
  /**
   * 顶部菜单 点击事件
  */
  topMenuClicked: function(e) {
    let index = e.currentTarget.dataset.index
    if (index == this.data.selectedMenuIndex) {
      return
    }
    this.setData({
      selectedMenuIndex: index
    })
    this.pageData.page = 1
    if (index == 0) {
      this.getAppointmentList()
    } else {
      this.getMyCourseAppointmentList()
    }
  },

  /**
   * 导航栏 返回按钮 点击事件
  */
  naviBackItemClciked : function() {
    wx.navigateBack()
  },

  /**
   * 查看简介按钮 点击事件
  */
  showIntroButtonClciked: function(e) {
    let courseIndex = e.currentTarget.dataset.courseindex
    let appointmentIndex = e.currentTarget.dataset.appointmentindex
    let appointment = this.data.apponintmentList[courseIndex].cateData[appointmentIndex]
    wx.navigateTo({
      url: '/packages/courseAppointment/courseAppointment_detail/courseAppointment_detail',
      success (res) {
        res.eventChannel.emit('showCourseIntro', {url: app.ljjw.courseAppointmentDetail_h5(appointment.id)})
      },
      fail (res) {
        console.log(res)
      }
    })
  },

  /**
   * 去预约按钮 点击事件
  */
  appointmentButtonClicked: function(e) {
    let courseIndex = e.currentTarget.dataset.courseindex
    let appointmentIndex = e.currentTarget.dataset.appointmentindex
    let course = this.data.apponintmentList[courseIndex]
    let appointment = course.cateData[appointmentIndex]
    if(appointment.user_yueke_state != 0) {
      return
    }
    wx.navigateTo({
      url: '/packages/courseAppointment/add_courseAppointment/add_courseAppointment',
      success (res) {
        res.eventChannel.emit('toAppointmentCourse', {type: 1, first_id: course.id, second_id: appointment.id, title: course.title + ' ' + appointment.title})
      }
    })
  },

  /**
   * 预约申请 备注弹框 关闭按钮 点击事件
  */
  infoDetailCloseButtonClciked: function() {
    this.setData({
      infoDetail: null,
    })
  },

  /**
   * 修改预约按钮 点击事件
  */
  appointmentChangeButtonClicked: function(e) {
    let index = e.currentTarget.dataset.index
    // let course = 
    wx.navigateTo({
      url: '/packages/courseAppointment/add_courseAppointment/add_courseAppointment',
      success (res){
        res.eventChannel.emit('toAppointmentCourse', {type: 2})
      }
    })
  },

  /**
   * 取消按钮 点击事件
  */
  cancelButtonClicked: function(e) {
    let index = e.currentTarget.dataset.index
    this.setData({
      cancelAppointment: {}
    })
  },

  /**
   * 取消弹框 确认事件
  */
  cancelViewSure: function(e) {
    let content = e.detail.content
    console.log(e)
    this.setData({
      cancelAppointment: null
    })
  },

  /**
   * 取消弹框 关闭
  */
  cancelViewClose: function() {
    this.setData({
      cancelAppointment: null
    })
  }
})