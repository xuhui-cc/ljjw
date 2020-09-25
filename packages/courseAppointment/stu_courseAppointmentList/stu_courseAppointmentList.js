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
     *     user_yueke_state: 当前用户约课状态 0-未约课 1-审核中 2-审核通过 3-驳回 4-申请取消 5-已取消
     *     peoples: 限制预约人数
     *     people_type：0-不限制人数  1-限制人数
     *     yueke_total： 已预约人数
    */
    apponintmentList: [],

    /**
     * 我的预约列表
     * addtime：提交时间 10位时间戳
     * state：状态 1-审核中 2-审核通过 3-驳回 4-申请取消 5-已取消
     * cate_title：二级标题
     * title：一级标题
     * update_list: 修改后 子类的报名信息 及 状态列表
     *     type: 1 学生提交的 2 老师审核通过 3 老师驳回 4学生重新提交 5学生申请取消  6老师审核取消通过 7老师审核取消驳回
    */
    myAppointmentList: [],

    // 是否展示预约备注弹框
    infoDetail: null,

    // 将要取消的预约
    cancelAppointment: null,

    // 小红点数量
    redCount: 0,
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
    this.studentGetCourseAppointmentCount()
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
      // 课程预约
      this.getAppointmentList(function(success){
        wx.stopPullDownRefresh({
          success: (res) => {},
        })
      })
    } else {
      // 我的预约
      this.getMyCourseAppointmentList(function(success){
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
    let that = this
    if (this.data.selectedMenuIndex == 0) {
      // 课程预约
      this.getAppointmentList(function(success){
        if (!success) {
          that.pageData.page = oldPage
        }
      })
    } else {
      // 我的预约
      this.getMyCourseAppointmentList(function(success){
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

  //-----------------------------------------------------接口-----------------------------------------------------
  /**
   * 学生获取 课程预约小红点数量
  */
  studentGetCourseAppointmentCount: function() {
    let params ={
      token: wx.getStorageSync('token')
    }
    let that = this
    app.ljjw.studentGetCourseAppointmentRedCount(params).then(d=>{
      if (d.data.status == 1) {
        let count = d.data.data
        that.setData({
          redCount: count
        })
      } else {
        that.setData({
          redCount: 0
        })
      }
    })
  },
  
  /**
   * 获取课程预约列表
  */
  getAppointmentList: function(callback) {
    let params = {
      token: wx.getStorageSync('token'),
      uid: wx.getStorageSync('uid'),
      limit: this.pageData.perpage,
      page: this.pageData.page
    }
    let that = this
    app.ljjw.courseAppointmentList(params).then(d=>{
      if (d.data.status == 1) {
        let appointmentList = d.data.data
        for (var i = 0; i < appointmentList.length; i++) {
          let appointment = appointmentList[i]
          appointment.canJoin = true
          for (var j = 0; j < appointment.cateData.length; j++) {
            let cate = appointment.cateData[j]
            if (cate.people_type == 1 && cate.yueke_total >= cate.peoples) {
              cate.full = true
            } else {
              cate.full = false
            }
            if (cate.user_yueke_state == 1 || cate.user_yueke_state == 2 || cate.user_yueke_state == 3 || cate.user_yueke_state == 4 || cate.full) {
              appointment.canJoin = false
              break
            }
          }
        }
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
   * 获取我的课程预约列表
  */
  getMyCourseAppointmentList: function(callback) {
    let params = {
      token: wx.getStorageSync('token'),
      uid: wx.getStorageSync('uid'),
      page: this.pageData.page,
      limit: this.pageData.perpage,
    }
    let that = this
    app.ljjw.myCourseAppointmentList(params).then(d=>{
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
                process.isMe = true
                process.status_text = ''
                process.timeStr = '提交时间：' + process.timeStr
                process.subTitle_key = '课程预约：'
                process.subTitle_value = process.title + '  '+process.cate_title
                break
              }
              case 2: {
                // 老师审核通过
                process.isMe = false
                process.status_text = '已通过'
                process.status_color = '#46BF6A'
                process.timeStr = '审核时间：' + process.timeStr
                process.subTitle_key = '审核人：'
                process.subTitle_value = process.handle_name
                break
              }
              case 3: {
                // 老师审核驳回
                process.isMe = false
                process.status_text = '已驳回'
                process.status_color = '#F14444'
                process.timeStr = '审核时间：' + process.timeStr
                process.subTitle_key = '审核人：'
                process.subTitle_value = process.handle_name
                break
              }
              case 4: {
                // 学生重新提交
                process.isMe = true
                process.status_text = ''
                process.timeStr = '提交时间：' + process.timeStr
                process.subTitle_key = '课程预约修改：'
                process.subTitle_value = process.title + '  '+process.cate_title
                break
              }
              case 5: {
                // 学生申请取消
                process.isMe = true
                process.status_text = ''
                process.timeStr = '取消时间：' + process.timeStr
                break
              }
              case 6: {
                // 老师审核取消通过
                process.isMe = false
                process.status_text = '已取消'
                process.status_color = '#CFCFCF'
                process.timeStr = '审核时间：' + process.timeStr
                process.subTitle_key = '审核人：'
                process.subTitle_value = process.handle_name
                break
              }
              case 7: {
                // 老师审核取消驳回
                process.isMe = false
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
          newList = that.data.myAppointmentList.concat(appointmentList)
        }
        if(appointmentList.length < that.pageData.perpage) {
          that.pageData.canLoadNextPage = false
        } else {
          that.pageData.canLoadNextPage = true
        }
        that.setData({
          myAppointmentList: newList,
          redCount: 0
        })
        typeof callback == 'function' && callback(true)
      } else {
        if (that.pageData.page == 1) {
          that.setData({
            myAppointmentList: []
          })
        }
        typeof callback == 'function' && callback(false)
      }
    })
  },

  /**
   * 取消申请
  */
  cancelAppointment: function(content, callback) {
    let params = {
      token: wx.getStorageSync('token'),
      bm_id: this.data.cancelAppointment.id
    }
    if (content && content != '') {
      params.handle_remark = content
    }
    let that = this
    app.ljjw.cancelCourseAppointment(params).then(d=>{
      if (d.data.status == 1) {
        typeof callback == 'function' && callback(true)
      } else {
        typeof callback == 'function' && callback(false)
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
    let appointment = this.data.myAppointmentList[index]
    wx.navigateTo({
      url: '/packages/courseAppointment/add_courseAppointment/add_courseAppointment',
      success (res){
        res.eventChannel.emit('toAppointmentCourse', {type: 2, appointment_id: appointment.id, title: '课程预约修改'})
      }
    })
  },

  /**
   * 取消按钮 点击事件
  */
  cancelButtonClicked: function(e) {
    let index = e.currentTarget.dataset.index
    let appointment = this.data.myAppointmentList[index]
    this.setData({
      cancelAppointment: appointment
    })
  },

  /**
   * 取消弹框 确认事件
  */
  cancelViewSure: function(e) {
    let content = e.detail.content
    // console.log(e)
    let that = this
    this.cancelAppointment(content, function(success){
      if (success) {
        that.setData({
          cancelAppointment: null
        })
        that.pageData.page = 1
        that.getMyCourseAppointmentList()
      }
    })
  },

  /**
   * 取消弹框 关闭
  */
  cancelViewClose: function() {
    this.setData({
      cancelAppointment: null
    })
  },

  /**
   * 查看备注信息 按钮 点击事件
  */
  showProcessDetail: function(e) {
    let index = e.currentTarget.dataset.index
    let subIndex = e.currentTarget.dataset.subindex
    let appointment = this.data.myAppointmentList[index]
    let process = appointment.update_list[subIndex]
    this.getAppointmentDetailInfo(process)
  },
})