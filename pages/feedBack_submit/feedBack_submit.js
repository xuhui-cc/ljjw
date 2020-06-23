// pages/feedBack_submit/feedBack_submit.js
const app = getApp()

Page({

  // 是否正在提交数据
  submiting: false,
  /**
   * 页面的初始数据
   */
  data: {
    // 页面尺寸
    pageSize: {},

    // 反馈类型
    feedBackTypeModel: {},

    // 在校自习申请 开始时间
    zixi_startTime_str: String,
    // 在校自习申请 结束时间
    zixi_endTime_str: String,

    // 今日日期
    today_date_str: String,

    // 反馈内容
    content: '',

    // 反馈照片
    imageArray: [],

    // 最多上传几张图片
    maxPictureCount: 3,

    // 是否可以提交
    canSubmit: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取页面辅助尺寸
    this.getPageSize()

    // 反馈类型
    this.getFeedBackTypeModle(options)
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

  // --------------------------------------------------私有方法----------------------------------------------
  /**
   * 获取页面辅助尺寸
  */
  getPageSize: function() {
    let systemInfo = wx.getSystemInfoSync()
    let menuBounding = wx.getMenuButtonBoundingClientRect()
    let naviHeight = menuBounding.bottom + 10
    let statusBarHeight = systemInfo.statusBarHeight
    let safeareaBottom = systemInfo.windowHeight - systemInfo.safeArea.bottom

    this.setData({
      pageSize: {
        naviHeight: naviHeight,
        statusBarHeight: statusBarHeight,
        naviContentHeight: naviHeight - statusBarHeight,
        safeareaBottom: safeareaBottom,
        screenWidth: systemInfo.screenWidth
      }
    })
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
      console.log(imageData)
      if(success) {
        that.data.imageArray.push(imageData)
        that.setData({
          imageArray: that.data.imageArray
        })

        if (index < pathList.length-1) {
          that.circleUploadImage(pathList, index+1)
        }
      }
    })
  },

  /**
   * 判断是否可以提交
  */
  determineWhetherYouCanSubmit: function () {
    var canSubmit = true
    if (this.data.feedBackTypeModel.type == 4) {
      // 在校自习申请
      if (!this.data.zixi_startTime_str || this.data.zixi_startTime_str == '' || this.data.zixi_startTime_str == String || !this.data.zixi_endTime_str || this.data.zixi_endTime_str == '' || this.data.zixi_endTime_str == String) {
        canSubmit = false
      }
    }

    if (!this.data.content || this.data.content == '') {
      canSubmit = false
    }

    this.setData({
      canSubmit: canSubmit
    })
  },

  /**
   * 获取反馈类型
  */
  getFeedBackTypeModle: function(options) {
    // console.log(options)
    let today_date_str = app.util.formatDate(new Date())
    
    this.setData({
      feedBackTypeModel: {
        type: options.type,
        title: options.title,
        subtitle: options.subtitle,
        today_date_str: today_date_str
      }
    })
  },

  // ------------------------------------------------接口-----------------------------------------
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
   * 问题反馈提交
  */
  submit: function() {
    if (this.submiting) {
      return
    }
    this.submiting = true
    let that = this
    var params = {
      token: wx.getStorageSync('token'),
      stu_id: wx.getStorageSync('uid'),
      sort_id: that.data.feedBackTypeModel.type,
      notes: that.data.content,
    }
    if (that.data.imageArray.length != 0) {
      let paths = that.data.imageArray.join(',')
      params.pics = paths
    }
    if (that.data.feedBackTypeModel.type == 4) {
      params.timeduan = that.data.zixi_startTime_str + " ~ " + that.data.zixi_endTime_str
    }
    app.ljjw.saveFeedback(params).then(d=>{
      let status = d.data.status
      if (status == 1) {
        wx.showToast({
          title: '提交成功',
          icon: 'none'
        })
        wx.navigateBack({
          complete: (res) => {},
        })
      }
      that.submiting = false
    })
  },

  // -----------------------------------------------交互事件---------------------------------------
  /**
   * 导航返回按钮 点击事件
  */
  naviBackClicked: function(e) {
    wx.navigateBack()
  },

  /**
   * 反馈内容 文本输入 回调
  */
  textareaInput: function (e) {
    // console.log(e)
    let newContent = e.detail.value
    this.setData({
      content: newContent
    })
    this.determineWhetherYouCanSubmit()
  },

  /**
   * 上传图片 按钮 点击事件
  */
  insertImage: function () {
    // this.data.imageArray.push(this.data.imageArray.length+1)
    // this.setData({
    //   imageArray: this.data.imageArray
    // })
    let that = this
    let count = this.data.maxPictureCount - this.data.imageArray.length
    wx.chooseImage({
      count: count,
      success: (res)=> {
        let tempFilePaths = res.tempFilePaths;
        that.circleUploadImage(tempFilePaths, 0)
      }
    })
  },

  /**
   * 删除图片 按钮 点击事件
  */
  deleteImage: function (e) {
    // console.log(e)
    let index = e.currentTarget.dataset.index
    this.data.imageArray.splice(index, 1)
    console.log(this.data.imageArray)
    this.setData({
      imageArray: this.data.imageArray
    })
  },

  /**
   * 展示大图
  */
  showBigPicture: function (e) {
    let index = e.currentTarget.dataset.index
    let url = this.data.imageArray[index]
    wx.previewImage({
      urls: this.data.imageArray,
      current: url
    })
  },

  /**
   * 在校自习生情 选择时间
  */
  datePickerChange: function(e) {
    // console.log(e)
    let type = e.currentTarget.dataset.type
    let dateStr = e.detail.value
    if (type == 1) {
      // 开始时间
      this.setData({
        zixi_startTime_str: dateStr
      })
    } else {
      // 结束时间
      this.setData({
        zixi_endTime_str: dateStr
      })
    }

    this.determineWhetherYouCanSubmit()
  },

  /**
   * 提交按钮 点击事件
  */
  submitButtonClciked: function () {
    if (!this.data.canSubmit) {
      return
    }
    this.submit()
  },
})