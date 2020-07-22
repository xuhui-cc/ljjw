// pages/detail-news/detail-news.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 是否展示特殊字符串列表
    showSpecialStringList: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this

    that.setUpNaviSize()

    // console.log(options.content)
    // console.log(options.date)
    // console.log(options.pics)

    let content = options.content
    // let specialArray = this.checkPhone(content)
    // console.log(phoneArray)
    that.setData({
      content: content,
      date: options.date,
      pics: (options.pics && options.pics != '' && options.pics != 'null') ? options.pics.split(",") : [],
      // specialArray: specialArray
    })

  },

  previewImg: function (e) {
    let that = this
    var xb = e.currentTarget.dataset.xb
    
    
    console.log(xb)
    var imgs = that.data.pics
    wx.previewImage({
      current: that.data.pics[xb],
      urls: imgs
    })

  },

  back: function () {
    wx.navigateBack({
      delta: 1  // 返回上一级页面。
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

  //------------------------------------------------------------------私有方法----------------------------------------------------------
  /**
   * 设置自定义导航栏尺寸
  */
  setUpNaviSize: function () {
    let menuButtonRect = wx.getMenuButtonBoundingClientRect()
    let systemInfo = wx.getSystemInfoSync()
    let naviBarHeight = menuButtonRect.bottom+10
    let naviBarWidth = systemInfo.screenWidth
    this.setData ({
      naviBarHeight: naviBarHeight,
      naviBarWidth: naviBarWidth,
      naviBarSelectSub_Height: menuButtonRect.height,
      naviBarSelectSub_Top: menuButtonRect.top,
      bottomButton_Height: systemInfo.screenHeight-systemInfo.safeArea.bottom+(80.0/750*naviBarWidth),
      statusBarHeight: systemInfo.statusBarHeight
    })
  },

  /**
   * 查找文本中的电话号码
  */
  checkPhone: function (text) {
    var specialArray = []
    let numberArray = text.match(/((((13[0-9])|(15[^4])|(18[0,1,2,3,5-9])|(17[0-8])|(147))\d{8}))/g);
    if (numberArray && numberArray != '' && numberArray.length != 0) {
      for (var i = 0; i < numberArray.length; i++) {
        let phone = numberArray[i]
        specialArray.push({
          string: phone,
          type: 1, // 1-电话号码
        })
      }
    }
    let urlArray = text.match(/(((https|http|ftp|rtsp|mms):\/\/)[^\s]+)/g)
    if (urlArray && urlArray != '' && urlArray.length != 0) {
      for (var i = 0; i < urlArray.length; i++) {
        let url = urlArray[i]
        specialArray.push({
          string: url,
          type: 2, // 2-网址
        })
      }
    }
    return specialArray
  },

  //------------------------------------------------- 交互事件----------------------------------------------------
  /**
   * 点击详情文本
  */
  showSpecialString: function () {
    if (!this.data.specialArray || this.data.specialArray == '' || this.data.specialArray.length == 0) {
      return
    }
    this.setData({
      showSpecialStringList: true
    })
  },

  /**
   * 关闭特殊字符串弹框
  */
  closeSpecialStringView: function() {
    this.setData({
      showSpecialStringList: false
    })
  },

  /**
   * 特殊字符串单元格 点击事件
  */
  spectialStringClicked: function(e) {
    // console.log(e)
    let index = e.currentTarget.dataset.index
    let specticalItem = this.data.specialArray[index]
    let spacticalString = specticalItem.string
    switch(specticalItem.type) {
      case 1: {
        // 电话号码
        wx.makePhoneCall({
          phoneNumber: spacticalString,
        })
        break
      }
      case 2: {
        // 网址
        break
      }
    }
  }
})