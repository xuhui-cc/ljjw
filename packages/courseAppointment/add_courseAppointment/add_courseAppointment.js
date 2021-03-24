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
     * text_type: 当type=1时：1-单行文本 2-多行文本； 当type=2时：1-单选  2-多选
     * required： 1-必填  2-非必填
     * value: 自定义参数 值
     * change: 不返回或者0可以修改 1-不可修改
     * type：1-文本题  2-选择题
     * options：选项 当type=2时使用
     *     id：选项ID
     *     title：选项标题
     *     selected: 是否选中 自定义参数
     * selectedIndex: 在type == 2 && text_type == 1时有值 当前被选中option的索引 自定义参数
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

    // 预约须知
    notice: null,
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
        let selecteQuestionNum = 0
        for (let i = 0; i < itemList.length; i++) {
          let item = itemList[i]
          if (item.type == 2) {
            // 选择题
            selecteQuestionNum += 1
            // 选择题 序号
            item.selectNum = selecteQuestionNum
            if(!item.options) {
              item.options = []
            }
            for (let j = 0; j < item.options.length; j++) {
              let option = item.options[j]
              // 默认未选中
              option.selected = false
            }
            if (item.text_type == 1) {
              // 单选题 默认选中索引为null
              item.selectedIndex = null
            }
          }
        }
        if (!itemList || itemList == '') {
          itemList = []
        }
        that.setData({
          itemList: itemList
        })
        that.canSubmitStatusChange()
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
        valueArray.push({id: item.type_id, value: item.value})
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
        
        let pages = getCurrentPages()
        if (pages.length >= 2) {
          let lastPage = pages[pages.length - 2]
          lastPage.appointmentSubmitSuccess()
        }
        wx.navigateBack()
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
        // 处理选择题选项
        for(let i = 0; i< itemList.length; i++) {
          let item = itemList[i]
          if (item.type == 2) {
            // 选择题
            let selectedOptionIDArr = item.value.split(',')
            for (let i = 0; i < item.options.length; i++) {
              let option = item.options[i]
              option.selected = false
            }
            for (let j = 0; j< selectedOptionIDArr.length; j++) {
              let selectedID = selectedOptionIDArr[j]
              for (let k = 0; k < item.options.length; k++) {
                let option = item.options[k]
                if (option.id == selectedID) {
                  option.selected = true
                  if (item.text_type == 1) {
                    // 单选题
                    item.selectedIndex = k
                  }
                  break
                }
              }
            }
          }
        }
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
        valueArray.push({id: item.type_id, value: item.value})
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

  /**
   * 获取期 预约须知
  */
  getCateNotice: function(cate_id) {
    let that = this
    let params = {
      cate_id: cate_id,
      token: wx.getStorageSync('token')
    }
    app.ljjw.getCourseAppointmentNotice(params).then(d=>{
      if (d.data.status == 1) {
        let notice = d.data.data.notice
        let replaceStr = "<img style=\"max-width:100%\""
        notice = notice.replace(/<img /g, replaceStr)
        console.log(notice)
        that.setData({
          notice: notice
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
    let cate_id = ''
    if (this.data.type == 1) {
      cate_id = this.second_id
    } else if (this.data.type == 2) { 
      let selected_cate = this.data.appointmentTitleList[this.data.appointmentSelectedCateIndex]
      cate_id = selected_cate.cate_id
    }
    this.getCateNotice(cate_id)
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
  },

  /**
   * 课程预约须知弹框 关闭按钮 点击事件
  */
  noticeViewCloseButtonClicked: function() {
    this.setData({
      notice: null
    })
  },

  /**
   * 课程预约须知弹框 确认并提交按钮 点击事件
  */
  noticeViewSureButtonClciked: function() {
    if (this.data.type == 1) {
      this.submitAppointment()
    } else if (this.data.type == 2) { 
      this.submitChange()
    }
  },

  /**
   * 选择题选项 点击事件
  */
  itemOptionClciked: function(e) {
    let itemIndex = e.currentTarget.dataset.itemindex
    let optionIndex = e.currentTarget.dataset.optionindex
    let item = this.data.itemList[itemIndex]
    let newSelectedOption = item.options[optionIndex]
    if (item.text_type == 1) {
      // 单选
      if(item.selectedIndex != null) {
        if (item.selectedIndex == optionIndex) {
          return
        }
        let oldSelectedOption = item.options[item.selectedIndex]
        oldSelectedOption.selected = false
      }
      newSelectedOption.selected = true
      item.selectedIndex = optionIndex
      item.value = newSelectedOption.id
    } else if (item.text_type == 2) {
      // 多选
      newSelectedOption.selected = !newSelectedOption.selected
      let value = ''
      for (let i = 0; i< item.options.length; i++) {
        let option = item.options[i]
        if (option.selected) {
          if (value.length == 0) {
            value = option.id
          } else {
            value = value + ',' + option.id
          }
        }
      }
      item.value = value
    }
    let itemStr = "itemList[" + itemIndex + "]"
    this.setData({
      [itemStr]: item
    })
    this.canSubmitStatusChange()
  }
})