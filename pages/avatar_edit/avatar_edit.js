// pages/avatar_edit/avatar_edit.js
Page({

  //  是否正在执行中
  submiting: false,
  /**
   * 页面的初始数据
   */
  data: {
    imagePath: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getPageSize()

    //获取到image-cropper实例
    this.cropper = this.selectComponent("#image-cropper");

    this.setData({
      imagePath: options.path
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

  // ----------------------------------------------私有方法-------------------------------------------
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
        screenWidth: systemInfo.screenWidth,
      }
    })
  },

  // ------------------------------------------------event---------------------------------------------------
  /**
   * 导航栏 返回按钮 点击事件
  */
  naviBackClicked: function() {
    wx.navigateBack()
  },

  /**
   * cropper初始化完成回调
  */
  cropperload: function(e) {
    console.log("cropper初始化完成");
  },

  /**
   * cropper图片加载完成
  */
  loadimage(e){
    console.log("图片加载完成",e.detail);
    //重置图片角度、缩放、位置
    this.cropper.imgReset();
  },

  /**
   * cropper预览裁剪框图片
  */
  clickcut(e) {
      console.log(e.detail);
      //点击裁剪框阅览图片
      wx.previewImage({
          current: e.detail.url, // 当前显示图片的http链接
          urls: [e.detail.url] // 需要预览的图片http链接列表
      })
  },

  /**
   * 底部 取消按钮 点击事件
  */
  cancelButtonClciked: function() {
    this.naviBackClicked()
  },

  /**
   * 底部 确定按钮 点击事件
  */
  sureButtonClciked: function() {
    if(this.submiting) {
      return
    }
    this.submiting = true
    let that = this
    this.cropper.getImg(function(res){
      console.log(res)
      let path = res.url
      let pages = getCurrentPages();
      if (pages.length >= 2) {
        let prePage = pages[pages.length-2]
        prePage.uploadAvatar(path)
      }
      that.naviBackClicked()
      that.submiting = false
    })
  }
})