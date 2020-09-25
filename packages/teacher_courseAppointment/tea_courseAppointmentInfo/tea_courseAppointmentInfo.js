// packages/teacher_courseAppointment/tea_courseAppointmentInfo/tea_courseAppointmentInfo.js
const app = getApp()
Page({

  cate_id: null,
  bm_id: null,
  /**
   * 页面的初始数据
   */
  data: {
    // 导航栏标题
    title: '',

    // 预约总数
    total_count: 0,

    // 学员列表
    studentList: [],

    // 分组后的学员列表
    dataarr: [],

    // 当前字母的索引
    isActive:0,

    // 字母据顶部高度数组
    headerTopArray:[],

    // 将展示的流程数组
    processList: null,

    // 流程备注信息
    infoDetail: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this.getSystemSize()

    let that = this
    let eventChannel = this.getOpenerEventChannel()
    eventChannel.on('courseAppointmentInfo', function(data){
      that.setData({
        title: data.title,
      })
      that.bm_id = data.bm_id
      that.cate_id = data.cate_id
      that.getStudentList()
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

  /**
   * 页面滑动时触发
  */
  onPageScroll: function (e) {
    let scrollTopConstant = e.detail.scrollTop
    let selectMinus = this.data.headerTopArray[this.data.isActive]
    var minConstant = Math.abs(scrollTopConstant - selectMinus)
    var newSelected = this.data.isActive
    for (var i = 0; i < this.data.headerTopArray.length; i++) {
      let headerTop = this.data.headerTopArray[i]
      let minuts = Math.abs(scrollTopConstant - headerTop)
      if (minuts < minConstant) {
        minConstant = minuts
        newSelected = i
      }
    }
    if (newSelected != this.data.isActive) {
      this.setData({
        isActive: newSelected
      })
    }
  },

  // ---------------------------------------------私有方法------------------------------------------------
  /**
   * 获取系统辅助尺寸
  */
  getSystemSize: function () {
    let menuButtonRect = wx.getMenuButtonBoundingClientRect()
    let systemInfo = wx.getSystemInfoSync()
    let naviHeight = menuButtonRect.bottom + 10
    let saveBottom = systemInfo.screenHeight-systemInfo.safeArea.bottom
    this.setData({
      naviBarHeight: naviHeight,
      statusBarHeight: systemInfo.statusBarHeight,
      naviBarContentHeight: naviHeight - systemInfo.statusBarHeight,
      contentHeight: systemInfo.screenHeight - naviHeight,
      safeAreaBottom: saveBottom,
      screenWidth: systemInfo.screenWidth
    })
  },

  /**
   * 分局拼音分组
  */
  setDataGroup: function (){
    let groupList = app.pinyin.groupByFirstChar(this.data.studentList, 'stu_name')
    this.setData({
      dataarr: groupList,
    })
  },

  /**
   * 获取字母分区头顶部高度
  */
  getSectionHeaderTop: function () {
    let that = this
    let query = wx.createSelectorQuery()
    query.selectAll(".address_top").boundingClientRect(function (rects) {
      let headerArray = []
      rects.forEach(function (rect) {
        let top = rect.top-that.data.naviBarHeight
        headerArray.push(top)
      })
      that.setData({
        headerTopArray: headerArray
      })
    }).exec()
  },

  //--------------------------------------------接口-----------------------------------------------
  /**
   * 获取预约的学员列表
  */
  getStudentList: function() {
    let params = {
      token: wx.getStorageSync('token'),
      cate_id: this.cate_id,
      bm_id: this.bm_id,
    }
    let that=  this
    app.ljjw.teacherGetCourseAppointmentStudentList(params).then(d=>{
      if (d.data.status == 1) {
        let count = d.data.data.count
        let list = d.data.data.list
        for (var i = 0; i < list.length; i++){
          let student = list[i]
          student.stu_name = student.realname && student.realname != '' ? student.realname : student.name
        }
        that.setData({
          total_count: count,
          studentList: list
        })
        that.setDataGroup()
        that.getSectionHeaderTop()
      }
    })
  },

  /**
   * 根据报名ID 获取流程列表
  */
  getProcessListByID: function(bm_id) {
    let params = {
      token: wx.getStorageSync('token'),
      bm_id: bm_id
    }
    let that = this
    app.ljjw.getAppointmentProcessListByID(params).then(d=>{
      if (d.data.status == 1) {
        let processList = d.data.data.process_list
        for (var j = 0; j < processList.length; j++) {
          let process = processList[j]
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
        that.setData({
          processList: processList
        })
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

  //-------------------------------------------交互事件------------------------------------
  /**
   * 导航栏 返回item 点击事件
  */
  naviBackItemClciked: function() {
    wx.navigateBack({
      delta: 0,
    })
  },

  /**
   * 点击右侧字母导航定位触发
  */
  scrollToViewFn: function (e) {
    var that = this;
    var _id = e.target.dataset.id;
    if (_id == that.data.isActive) {
      return
    }
    // let group = that.data.dataarr[_id]
    that.setData({
      isActive: _id,
      toView: 'inToView' + _id
    })
  },

  /**
   * 复制按钮 点击事件
  */
  copyButtonClicked: function() {

  },

  /**
   * 学生单元格点击事件
  */
  studentCellClicked: function(e) {
    let groupIndex = e.currentTarget.dataset.group_index
    let userIndex = e.currentTarget.dataset.user_index
    let group = this.data.dataarr[groupIndex]
    let student = group.users[userIndex]
    this.getProcessListByID(student.id)
  },

  /**
   * 流程弹框 关闭按钮 点击事件
  */
  processViewCloseButtonClciked: function() {
    this.setData({
      processList: null
    })
  },


  /**
   *审核流程 查看备注信息 点击事件
  */
  showProcessDetail: function(e) {
    let index = e.currentTarget.dataset.index
    let process = this.data.processList[index]
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
})