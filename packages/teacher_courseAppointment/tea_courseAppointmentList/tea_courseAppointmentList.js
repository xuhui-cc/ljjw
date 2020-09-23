// packages/teacher_courseAppointment/tea_courseAppointmentList/tea_courseAppointmentList.js
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
     * 待审核列表
     * addtime：提交时间 10位时间戳
     * state：状态 1-待审核 2-已审核通过 3-已驳回  4-取消申请  5-已取消
     * realname：申请人姓名
     * name：申请人昵称
     * phone：申请人手机号
     * checked：学生基础信息审核状态 1-通过审核
     * yk_title：一级标题
     * cate_title：二级标题
     * update_list: 流程列表
    */
    apponintmentList: [],

    /**
     * 预约详情列表
    */
    appointmentDetailList: [],

    // 是否展示预约备注弹框
    infoDetail: null,

    // 待审核数量
    waitCount: 0,

    // 将要驳回的预约申请
    rejectAppointment: null,

    // 将要通过的预约申请
    passAppointment: null,
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
    // 获取小红点数量
    this.teacherGetCourseAppointmentCount()

    this.pageData.page = 1
    if (this.data.selectedMenuIndex == 0) {
      // 待审核
      this.getWaitDealList()
    } else {
      this.getAppointmentDetail()
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
    this.pageData.page = 1
    if (this.data.selectedMenuIndex == 0) {
      // 待审核
      this.getWaitDealList(function(success){
        wx.stopPullDownRefresh({
          success: (res) => {},
        })
      })
    } else {
      // 预约详情
      this.getAppointmentDetail(function(success){
        wx.stopPullDownRefresh({
          success: (res) => {},
        })
      })
    }
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (!this.pageData.canLoadNextPage) {
      return
    }
    let oldPage = this.pageData.page
    this.pageData.page += 1
    let taht = this
    if (this.data.selectedMenuIndex == 0) {
      // 待审核
      this.getWaitDealList(function(success){
        if (!success) {
          that.pageData.page = oldPage
        }
      })
    } else {
      // 预约详情
      this.getAppointmentDetail(function(success){
        if (!success) {
          that.pageData.page = oldPage
        }
      })
    }
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

  //--------------------------------------------------------------接口--------------------------------------------------
  /**
   * 老师获取 课程预约模块小红点数量
  */
  teacherGetCourseAppointmentCount: function() {
    let params = {
      token: wx.getStorageSync('token'),
      teacher_id: wx.getStorageSync('uid')
    }
    let that = this
    app.ljjw.teacherGetCourseAppointmentRedCount(params).then(d=>{
      if (d.data.status == 1) {
        let count = d.data.data.count
        that.setData({
          waitCount: count
        })
      } else {
        that.setData({
          waitCount: 0
        })
      }
    })
  },

  /**
   * 老师获取待审核列表
  */
  getWaitDealList: function(callback) {
    let params = {
      token: wx.getStorageSync('token'),
      teach_id: wx.getStorageSync('uid'),
      page: this.pageData.page,
      limit: this.pageData.perpage
    }
    let that = this
    app.ljjw.teacherGetCourseAppointmentList(params).then(d=>{
      if (d.data.status == 1) {
        let appointmentList = d.data.data
        for (var i = 0; i < appointmentList.length; i++) {
          let appointment = appointmentList[i]
          switch(appointment.state * 1) {
            case 1: {
              // 审核中
              appointment.status_img = './resource/appointment_appointmenting.png'
              break
            }
            case 2: {
              // 审核通过
              appointment.status_img = './resource/appointment_pass.png'
              break
            }
            case 3: {
              // 驳回
              appointment.status_img = './resource/appointment_reject.png'
              break
            }
            case 4: {
              // 申请取消
              appointment.status_img = './resource/appointment_appointmenting.png'
              break
            }
            case 5: {
              // 已取消
              appointment.status_img = './resource/appointment_cancel.png'
              break
            }
          }
          for (var j = 0; j < appointment.update_list.length; j++) {
            let process = appointment.update_list[j]
            process.timeStr = app.util.customFormatTimeByTimestamp(process.handle_time*1000, 'yyyy-M-dd  hh:mm')
            switch(process.type * 1) {
              case 1: {
                // 学生初次提交
                process.isStu = true
                process.status_text = ''
                process.timeStr = '提交时间：' + process.timeStr
                process.subTitle_key = '课程预约：'
                process.subTitle_value = process.yk_title + '  '+process.cate_title
                break
              }
              case 2: {
                // 老师审核通过
                process.isStu = false
                process.status_text = '已通过'
                process.status_color = '#46BF6A'
                process.timeStr = '审核时间：' + process.timeStr
                process.subTitle_key = '审核人：'
                process.subTitle_value = process.handle_name
                break
              }
              case 3: {
                // 老师审核驳回
                process.isStu = false
                process.status_text = '已驳回'
                process.status_color = '#F14444'
                process.timeStr = '审核时间：' + process.timeStr
                process.subTitle_key = '审核人：'
                process.subTitle_value = process.handle_name
                break
              }
              case 4: {
                // 学生重新提交
                process.isStu = true
                process.status_text = ''
                process.timeStr = '提交时间：' + process.timeStr
                process.subTitle_key = '课程预约修改：'
                process.subTitle_value = process.yk_title + '  '+process.cate_title
                break
              }
              case 5: {
                // 学生申请取消
                process.isStu = true
                process.status_text = ''
                process.timeStr = '取消时间：' + process.timeStr
                break
              }
              case 6: {
                // 老师审核取消通过
                process.isStu = false
                process.status_text = '已取消'
                process.status_color = '#CFCFCF'
                process.timeStr = '审核时间：' + process.timeStr
                process.subTitle_key = '审核人：'
                process.subTitle_value = process.handle_name
                break
              }
              case 7: {
                // 老师审核取消驳回
                process.isStu = false
                process.status_text = '已驳回'
                process.status_color = '#F14444'
                process.timeStr = '审核时间：' + process.timeStr
                process.subTitle_key = '审核人：'
                process.subTitle_value = process.handle_name
              }
            }
          }
        }
        // 分页数据处理
        let newList = []
        if (that.pageData.page == 1) {
          newList = appointmentList
        } else {
          newList = that.data.apponintmentList.concat(newList)
        }
        if (appointmentList.length < that.pageData.perpage) {
          that.pageData.canLoadNextPage = false
        } else {
          that.pageData.canLoadNextPage = true
        }
        that.setData({
          apponintmentList: newList
        })
        typeof callback == 'function' && callback(true)
      } else {
        if (that.pageData.page == 1) {
          that.setData({
            apponintmentList: []
          })
        }
        typeof callback == 'function' && callback(false)
      }
    })
  },

  /**
   * 老师 获取预约详情
  */
  getAppointmentDetail: function(callBack){
    let params = {
      token: wx.getStorageSync('token'),
      teach_id: wx.getStorageSync('uid'),
      page: this.pageData.page,
      limit: this.pageData.perpage
    }
    let that = this
    app.ljjw.teacherGetCourseAppointmentAnalysis(params).then(d=>{
      if (d.data.status == 1) {
        let infoList = d.data.data
        // 分页数据处理
        let newList = []
        if (that.pageData.page == 1) {
          newList = infoList
        } else {
          newList = that.data.appointmentDetailList.concat(infoList)
        }
        if (infoList.length < that.pageData.perpage) {
          that.pageData.canLoadNextPage = false
        } else {
          that.pageData.canLoadNextPage = true
        }
        that.setData({
          appointmentDetailList: newList
        })
        typeof callBack == 'function' && callBack(true) 
      } else {
        if (that.pageData.page == 1) {
          that.setData({
            appointmentDetailList: []
          })
        }
        typeof callBack == 'function' && callBack(false) 
      }
    })
  },

  /**
   * 获取提交信息详情
  */
  getAppointmentDetailInfo: function(process){
    let params ={
      token: wx.getStorageSync('token'),
      process_id: process.id
    }
    let that = this
    app.ljjw.getCourseAppointmentDetailInfo(params).then(d=>{
      if (d.data.status == 1) {
        let infoDetail = d.data.data
        that.setData({
          infoDetail: infoDetail
        })
      }
    })
  },

  /**
   * 老师审批
   * state: 2-通过 3-驳回
  */
  courseAppointmentDeal: function(state, bm_id, callback) {
    let params = {
      token: wx.getStorageSync('token'),
      teach_id: wx.getStorageSync('uid'),
      state: state,
      bm_id: bm_id
    }
    let that = this
    app.ljjw.teacherDealCourseAppointment(params).then(d=>{
      if (d.data.status == 1) {
        typeof callback == 'function' && callback(true)
      } else {
        typeof callback == 'function' && callback(false)
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
      this.getWaitDealList()
    } else {
      this.getAppointmentDetail()
    }
  },

  /**
   * 导航栏 返回按钮 点击事件
  */
  naviBackItemClciked : function() {
    wx.navigateBack()
  },

  /**
   * 查看备注信息 按钮 点击事件
  */
  showProcessDetail: function(e) {
    let index = e.currentTarget.dataset.index
    let subIndex = e.currentTarget.dataset.subindex
    let appointment = this.data.apponintmentList[index]
    let process = appointment.update_list[subIndex]
    this.getAppointmentDetailInfo(process)
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
   * 驳回按钮 点击事件
  */
  rejectButtonClicked: function(e) {
    let index = e.currentTarget.dataset.index
    let appointment = this.data.apponintmentList[index]
    this.setData({
      rejectAppointment: appointment
    })
  },

  /**
   * 驳回弹框 确认按钮点击事件
  */
  rejectViewSure: function() {
    this.courseAppointmentDeal(3, this.data.rejectAppointment.id, function(success){
      if (success) {
        that.data.apponintmentList.remove(that.data.rejectAppointment)
        that.setData({
          appointmentList: that.data.apponintmentList,
          rejectAppointment: null
        })
      }
    })
  },

  /**
   * 驳回弹框 关闭事件
  */
  rejectViewClose: function() {
    this.setData({
      rejectAppointment: null
    })
  },

  /**
   * 通过按钮 点击事件
  */
  passButtonClicked: function(e) {
    let index = e.currentTarget.dataset.index
    let appointment = this.data.apponintmentList[index]
    this.setData({
      passAppointment: appointment
    })
  },

  /**
   * 通过确认弹框 确认按钮 点击事件
  */
  passViewSure: function() {
    this.courseAppointmentDeal(2, this.data.passAppointment.id, function(success){
      if (success) {
        that.data.apponintmentList.remove(that.data.passAppointment)
        that.setData({
          appointmentList: that.data.apponintmentList,
          passAppointment: null
        })
      }
    })
  },

  /**
   * 通过确认弹框 关闭事件
  */
  passViewClose: function() {
    this.setData({
      passAppointment: null
    })
  },
})