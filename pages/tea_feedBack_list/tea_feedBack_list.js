// pages/tea_feedBack_list/tea_feedBack_list.js
const app = getApp()
Page({

  // 是否正在提交数据
  submiting: false,
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
    // 最大上传图片数量
    maxUnloadImageCount: 3,

    // 顶部菜单选中下标
    menuSelectedIndex: 0,

    // 待处理反馈小红点数量
    notDealCount: 0,

    // 反馈列表
    feedBackList: [],

    // 分类列表
    typeList:[],
    // 选择的关联分类索引
    selectedTypeIndex: null,
    // 是否展示关联分类选择弹框
    showTypePicker: false,

    /**
     * 反馈处理数据
     * selectedFeedBackIndex： 将要处理的反馈索引
     * dealType： 处理方式：1-反馈通过 2-反馈驳回 3-归还通过 4-归还驳回
     * dealContent: 处理内容
     * dealImages: 处理图片数组
     * dealTitle： 处理方式标题
     * dealPlacehoulder: 反馈内容 占位字符串
     * canSubmit: 是否可以提交
    */
    dealData: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setUpNaviSize()
    this.teacherGetFeedBackList()
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
    this.teacherGetFeedBackNotiCount()
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
    let oldPage = this.pageData.page
    this.pageData.page = 1
    let that = this
    this.teacherGetFeedBackList(this.data.menuSelectedIndex*1+1, function(success, msg){
      wx.stopPullDownRefresh()
      if (!success) {
        that.pageData.page = oldPage
      }
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (!this.pageData.canLoadNextPage) {
      return
    }
    let oldPage = this.pageData.page
    this.pageData.page = oldPage + 1
    let that = this
    this.teacherGetFeedBackList(this.data.menuSelectedIndex*1+1, function(success, msg){
      if (!success) {
        that.pageData.page = oldPage
      }
    })
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

  /**
   * 获取 已评价 流程对象
  */
  getDealObject: function (timestamp, content, type) {
    switch(type*1){
      case 4: {
        // 学生提交归还
        return {
          timestamp: timestamp,
          time: app.util.customFormatTimeByTimestamp(timestamp*1000, 'yyyy-MM-dd hh:mm'),
          role: 1,
          type: 4,
          timeColor: '#8D8D8D',
          statusColor: '#272727',
          contentColor: '#272727',
          status: "提交归还"
        }
        break
      }
      case 7: {
        // 评论
        return {
          content :content,
          timestamp: timestamp,
          time: app.util.customFormatTimeByTimestamp(timestamp*1000, 'yyyy-MM-dd hh:mm'),
          role: 1,
          type: 7,
          timeColor: '#8D8D8D',
          contentColor: '#272727'
        }
        break
      }
    }
  },

  /**
   * 判断 反馈处理是否可以提交
  */
  setFeedBackDealIfCanSubmit: function () {
    let canSubmit = false
    if (this.data.dealData.dealType == 1 || this.data.dealData.dealType == 3) {
      canSubmit = true
    } else {
      let content = this.data.dealData.dealContent
      if (content && content != '') {
        canSubmit = true
      }
    }

    if (this.data.dealData.canSubmit != canSubmit) {
      let canSubmitChange = "dealData.canSubmit"
      this.setData({
        [canSubmitChange]: canSubmit
      })
    }
  },

  /**
   * 循环上传图片
  */
  circleUploadImage: function(pathList, index) {
    let that = this
    if (pathList.length <= index) {
      return
    }
    let filePath = pathList[index]
    this.uploadImage(filePath, function(success, imageData, errorMsg) {
      // console.log(imageData)
      if(success) {
        that.data.dealData.dealImages.push(imageData)
        let imagesChange = "dealData.dealImages"
        that.setData({
          [imagesChange]: that.data.dealData.dealImages
        })

        if (index < pathList.length-1) {
          that.circleUploadImage(pathList, index+1)
        }
      }
    })
  },

  // -------------------------------------------------接口-----------------------------------------------------
  /**
   * 获取老师待处理反馈数量
  */
  teacherGetFeedBackNotiCount: function () {
    let that = this
    let prarms = {
      "token": wx.getStorageSync("token"),
      "uid": wx.getStorageSync("uid"),
    }
    app.ljjw.getTeacherUnreadCount(prarms).then(d=>{
      let status = d.data.status
      if (status == 1) {
        let data = d.data.data

        that.setData({
          notDealCount: data
        })
      } else {
        that.setData({
          notDealCount: 0
        })
      }
    })
  },

  /**
   * 老师获取反馈列表
   * type： 1-待处理 2-已处理
  */
  teacherGetFeedBackList: function(type, cb) {
    let that = this
    let params = {
      "token": wx.getStorageSync("token"),
      "uid": wx.getStorageSync("uid"),
      type: type ? type : (this.data.menuSelectedIndex*1+1), // 1-待处理 2-已处理
      page: this.pageData.page,
      limit: this.pageData.perpage
    }
    if (type == 2 && this.data.selectedTypeIndex != null) {
      let typeItem = this.data.typeList[this.data.selectedTypeIndex]
      params.sort_id = typeItem.id
    }
    app.ljjw.getTeacherFeedbackList(params).then(d=>{
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
          let dealList = []
          for(var j = 0; j < feedBack.process_list.length; j++) {
            let process = feedBack.process_list[j]
            let deal = {
              pics : (process.images && process.images != '') ? process.images.split(',') : [],
              content : process.content,
              name : process.procuser,
              role : 2,
              timestamp: process.createtime,
              time: process.proctime
            }
            if (process.tid == 1) {
              // 有处理结果
              if (process.procstate == 3) {
                // 已处理
                deal.type = 2
                deal.timeColor = '#8D8D8D'
                deal.statusColor = '#46A1FB'
                deal.contentColor = '#272727'
                deal.status = "已处理"
              } else {
                // 驳回
                deal.type = 3
                deal.timeColor = '#F14444'
                deal.statusColor = '#F14444'
                deal.contentColor = '#F14444'
                deal.status = "已驳回"
              }
            } else {
              // 无处理结果
              deal.type = 1
              deal.timeColor = '#8D8D8D'
              deal.contentColor = '#272727'
            }
            dealList.push(deal)
          }

          for (var j = 0; j < feedBack.apply_return.length; j++) {
            let apply = feedBack.apply_return[j]
            let deal = {}
            if (apply.type == 1) {
              // 学员提交归还
              deal = that.getDealObject(apply.deal_time, '', 4)
            } else {
              // 确认归还
              if(apply.status == 1) {
                // 老师确认归还
                deal = {
                  pics : (apply.images && apply.images != '') ? apply.images.split(',') : [],
                  content : apply.content,
                  name : apply.proc_user,
                  timestamp: apply.deal_time,
                  time: app.util.customFormatTimeByTimestamp(apply.deal_time*1000, 'yyyy.MM.dd hh:mm'),
                  role: 2,
                  type: 5,
                  timeColor: '#272727',
                  statusColor: '#272727',
                  contentColor: '#272727',
                  status: "确认归还"
                }
              } else {
                // 老师驳回归还
                deal = {
                  pics : (apply.images && apply.images != '') ? apply.images.split(',') : [],
                  content : apply.content,
                  name : apply.proc_user,
                  timestamp: apply.deal_time,
                  time: app.util.customFormatTimeByTimestamp(apply.deal_time*1000, 'yyyy.MM.dd hh:mm'),
                  role: 2,
                  type: 6,
                  timeColor: '#F14444',
                  statusColor: '#F14444',
                  contentColor: '#F14444',
                  status: "驳回归还"
                }
              }
            }
            dealList.push(deal)
          }
          if(feedBack.evaluated) {
            // 已评价 添加评价记录到流程列表
            let deal = that.getDealObject(feedBack.comment_time, feedBack.comment, 7)
            dealList.push(deal)
          }
          dealList.sort(function(a,b){
            let a_timestamp = a.timestamp
            let b_timestamp = b.timestamp
            return (a_timestamp - b_timestamp)
          })
          feedBack.dealList = dealList
        }

        // 分页数据处理
        var newList = []
        if (that.pageData.page == 1) {
          newList = feedBackList
        } else {
          newList = that.data.feedBackList.concat(feedBackList)
        }

        // 判断是否可以加载下一页
        if (feedBackList.length < that.pageData.perpage) {
          that.pageData.canLoadNextPage = false
        } else {
          that.pageData.canLoadNextPage = true
        }

        that.setData({
          feedBackList: newList,
          menuSelectedIndex: params.type-1
        })
        typeof cb == "function" && cb(true, "加载成功")
      } else {
        typeof cb == "function" && cb(false, "加载失败")
      }
    })
  },

  /**
   * 获取关联分类列表
  */
  getTypeList: function(cb) {
    let that = this
    let params = {
      "token": wx.getStorageSync("token"),
      "uid": wx.getStorageSync("uid"),
    }
    app.ljjw.getTeacherAttachSort(params).then(d=>{
      let status = d.data.status
      if (status == 1) {
        
        typeof cb == "function" && cb(true, "加载成功", d.data.data)
      } else {
        typeof cb == "function" && cb(false, "加载失败", null)
      }
    })
  },

  /**
   * 上传图片
  */
  uploadImage: function(filePath, cb) {
    let that = this
    var token = wx.getStorageSync('token');
    wx.showLoading({
      title: '上传中',
    })
    wx.uploadFile({
      url: app.ljjw.getUploadFileURI(),
      filePath: filePath,
      name: 'file',
      formData: {
        'file': filePath,
        "token": token,
        "action": "jwUploadAvatar",
      },
      success(r) {
        wx.hideLoading({
          complete: (res) => {
            let hhh = JSON.parse(r.data);
            console.log(hhh)
            if (hhh.status == 1) {
              typeof cb == "function" && cb(true, hhh.data, "加载成功")
            } else {
              let errorMsg = hhh.msg ? hhh.msg : '上传失败'
              wx.showToast({
                title: errorMsg,
                icon: 'none'
              })
              typeof cb == "function" && cb(false, null, errorMsg)
            }
          },
        })
      },
      fail(error) {
        wx.hideLoading({
          complete: (res) => {
            wx.showToast({
              title: '上传失败',
              icon: 'none'
            })
            typeof cb == "function" && cb(false, null, "上传失败")
          },
        })
      }
    })
  },

  /**
   * 提交反馈处理
   * type: 1-通过 2-驳回
  */
  submitFeedBackDeal: function (type) {
    if (this.submiting) {
      return
    }
    this.submiting = true
    let that = this
    let feedBack = this.data.feedBackList[this.data.dealData.selectedFeedBackIndex]
    let params = {
      "token": wx.getStorageSync("token"),
      "uid": wx.getStorageSync("uid"),
      type: type,
      fid: feedBack.id
    }
    if (this.data.dealData.dealContent && this.data.dealData.dealContent != '') {
      params.content = this.data.dealData.dealContent
    }
    if (this.data.dealData.dealImages.length != 0) {
      params.images = this.data.dealData.dealImages.join(",")
    }
    app.ljjw.teacherConfirmFeedback(params).then(d=>{
      let status = d.data.status
      if (status == 1) {
        that.data.feedBackList.splice(that.data.dealData.selectedFeedBackIndex, 1)
        that.setData({
          feedBackList: that.data.feedBackList,
          dealData: null
        })
        that.teacherGetFeedBackNotiCount()
      }
      that.submiting = false
    })
  },

  /**
   * 老师审批归还
   * type: 1-通过 2-驳回
  */
  teacherSubmitReturnDeal: function (type) {
    if (this.submiting) {
      return
    }
    this.submiting = true
    let that = this
    let feedBack = this.data.feedBackList[this.data.dealData.selectedFeedBackIndex]
    let params = {
      "token": wx.getStorageSync("token"),
      "uid": wx.getStorageSync("uid"),
      type: type,
      fid: feedBack.id
    }
    if (this.data.dealData.dealContent && this.data.dealData.dealContent != '') {
      params.content = this.data.dealData.dealContent
    }
    if (this.data.dealData.dealImages.length != 0) {
      params.images = this.data.dealData.dealImages.join(",")
    }
    app.ljjw.teacherConfirmReturn(params).then(d=>{
      let status = d.data.status
      if (status == 1) {
        that.data.feedBackList.splice(that.data.dealData.selectedFeedBackIndex, 1)
        that.setData({
          feedBackList: that.data.feedBackList,
          dealData: null
        })
        that.teacherGetFeedBackNotiCount()
      }
      that.submiting = false
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
    let that = this
    let oldPage = this.pageData.page
    this.pageData.page = 1
    this.teacherGetFeedBackList(index*1+1, function(success, msg) {
      if (!success) {
        that.pageData.page = oldPage
      }
    })
    this.teacherGetFeedBackNotiCount()
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
   * 反馈列表 单元格 展开/收起 点击事件
  */
  feedBackOpenButton: function(e) {
    // console.log(e)
    let that = this
    let index = e.currentTarget.dataset.index
    let feedBack = this.data.feedBackList[index]
    let setData = "feedBackList["+index+"].open"
    this.setData({
      [setData]: !feedBack.open
    })
  },

  /**
   * 顶部类型按钮 点击事件
  */
  showTypePicker: function () {
    let that = this
    if(!this.data.typeList || this.data.typeList == '' || this.data.typeList.length == 0) {
      this.getTypeList(function(success, msg, typeList){
        if (success) {
          if (typeList && typeList != '' && typeList.length != 0) {
            that.setData({
              typeList: typeList,
              showTypePicker: true
            })
          } else {
            wx.showToast({
              title: '暂无关联分类',
              icon: 'none'
            })
          }
        }
      })
    } else {
      this.setData({
        showTypePicker: true
      })
    }
  },

  /**
   * 展示大图
  */
  showBigImage: function(e) {
    console.log(e)
    let type = e.currentTarget.dataset.type
    let image_index = e.currentTarget.dataset.imageindex
    
    if (type == 1) {
      // 反馈图片
      let feedBack_index = e.currentTarget.dataset.feedbackindex
      let feedBack = this.data.feedBackList[feedBack_index]
      let urls = feedBack.pics
      let current = urls[image_index]
      wx.previewImage({
        urls: urls,
        current: current
      })
    } else if (type == 2) {
      // 流程处理图片
      let feedBack_index = e.currentTarget.dataset.feedbackindex
      let feedBack = this.data.feedBackList[feedBack_index]
      let processIndex = e.currentTarget.dataset.dealindex
      let process = feedBack.dealList[processIndex]
      let urls = process.pics
      let current = urls[image_index]
      wx.previewImage({
        urls: urls,
        current: current
      })
    } else if (type == 3) {
      // 处理上传图片
      let urls = this.data.dealData.dealImages
      let current = urls[image_index]
      wx.previewImage({
        urls: urls,
        current: current
      })
    }
  },

  /**
   * 反馈处理 通过按钮 点击事件
  */
  feedBackDealSureButtonClciked: function (e) {
    // console.log(e)
    let index = e.currentTarget.dataset.index
    let dealData = {
      selectedFeedBackIndex: index,
      dealType: 1,
      dealTitle: "处理确认",
      dealPlacehoulder: "请填写处理确认信息（可不填）",
      canSubmit: true,
      dealImages: [],
    }
    this.setData({
      dealData: dealData
    })
  },

  /**
   * 反馈处理 驳回按钮 点击事件
  */
  feedBackDealRejectButtonClicked: function (e) {
    // console.log(e)
    let index = e.currentTarget.dataset.index
    let dealData = {
      selectedFeedBackIndex: index,
      dealType: 2,
      dealTitle: "处理驳回",
      dealPlacehoulder: "请填写驳回原因（必填）",
      canSubmit: false,
      dealImages: [],
    }
    this.setData({
      dealData: dealData
    })
  },

  /**
   * 归还处理 确认通过按钮 点击事件
  */
  feedBackReturnSureButtonClciked: function (e) {
    // console.log(e)
    let index = e.currentTarget.dataset.index
    let dealData = {
      selectedFeedBackIndex: index,
      dealType: 3,
      dealTitle: "归还确认",
      dealPlacehoulder: "请填写归还确认信息（可不填）",
      canSubmit: true,
      dealImages: [],
    }
    this.setData({
      dealData: dealData
    })
  },

  /**
   * 归还处理 驳回按钮 点击事件
  */
  feedBackReturnRejectButtonClicked: function (e) {
    // console.log(e)
    let index = e.currentTarget.dataset.index
    let dealData = {
      selectedFeedBackIndex: index,
      dealType: 4,
      dealTitle: "归还驳回",
      dealPlacehoulder: "请填写驳回原因（必填）",
      canSubmit: false,
      dealImages: [],
    }
    this.setData({
      dealData: dealData
    })
  },

  /**
   * 关联分类选择器 关闭按钮 点击事件
  */
  typePickerCloseButtonClicked: function (e) {
    this.setData({
      showTypePicker: false,
    })
  },

  /**
   * 关联分类选择器 全部分类 按钮 点击事件
  */
  typePickerAllTypeClciked: function (e) {
    if (this.data.selectedTypeIndex == null) {
      return
    }
    let oldSelectedTypeIndex = this.data.selectedTypeIndex
    let oldPage = this.pageData.page
    this.setData({
      selectedTypeIndex: null
    })
    this.pageData.page = 1
    let that = this
    this.teacherGetFeedBackList(this.data.menuSelectedIndex*1+1, function(success, msg){
      if (!success) {
        that.setData({
          selectedTypeIndex: oldSelectedTypeIndex
        })
        that.pageData.page = oldPage
      } else {
        that.typePickerCloseButtonClicked()
      }
    })
  },

  /**
   * 关联分类选择器 选择分类事件
  */
  typePickerOptionSelected: function(e) {
    let index = e.currentTarget.dataset.index
    if (index == this.data.selectedTypeIndex) {
      return
    }
    let oldSelectedTypeIndex = this.data.selectedTypeIndex
    let oldPage = this.pageData.page
    this.setData({
      selectedTypeIndex: index
    })
    this.pageData.page = 1
    let that = this
    this.teacherGetFeedBackList(this.data.menuSelectedIndex*1+1, function(success, msg){
      if (!success) {
        that.setData({
          selectedTypeIndex: oldSelectedTypeIndex
        })
        that.pageData.page = oldPage
      } else {
        that.typePickerCloseButtonClicked()
      }
    })
  },

  /**
   * 反馈弹框 关闭按钮 点击事件
  */
  feedBackDealCloseButtonClicked: function () {
    this.setData({
      dealData: null
    })
  },

  /**
   * 反馈弹框 输入框 输入事件
  */
  feedbackDealTextareaInput: function(e) {
    console.log(e)
    let content = e.detail.value
    let contentCHange = "dealData.dealContent"
    this.setData({
      [contentCHange]: content
    })
    this.setFeedBackDealIfCanSubmit()
  },

  /**
   * 反馈处理 上传图片
  */
  feedBackAddImage: function() {
    let that = this
    let count = this.data.maxUnloadImageCount - this.data.dealData.dealImages.length
    wx.chooseImage({
      count: count,
      success: (res)=> {
        let tempFilePaths = res.tempFilePaths;
        that.circleUploadImage(tempFilePaths, 0)
      }
    })
  },

  /**
   * 反馈处理 删除图片
  */
  feedbackDealDeleteImage: function(e) {
    let index = e.currentTarget.dataset.index
    let images = this.data.dealData.dealImages
    images.splice(index, 1)
    let iamgesChange = "dealData.dealImages"
    this.setData({
      [iamgesChange]: images
    })
  },

  /**
   * 反馈处理 确定按钮 点击事件
  */
  feedbackDealSureButtonClciked: function() {
    
    if (!this.data.dealData.canSubmit) {
      return
    }
    
    switch(this.data.dealData.dealType) {
      case 1: {
        // 审批通过
        this.submitFeedBackDeal(1)
        break
      }
      case 2: {
        // 审批驳回
        this.submitFeedBackDeal(2)
        break
      }
      case 3: {
        // 归还通过
        this.teacherSubmitReturnDeal(1)
        break
      }
      case 4:{
        // 归还驳回
        this.teacherSubmitReturnDeal(2)
        break
      }
    }
  }

})