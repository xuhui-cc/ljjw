// pages/stu_mornread/stu_mornread.js
const app = getApp()
Page({

  /**
   * 分页数据
  */
  pageData: {
    page: 1,
    perpage: 10,
    canLoadNextPage: true
  },

  /**
   * 页面的初始数据
   */
  data: {
    page :1,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 设置导航栏尺寸
    this.setUpNaviSize()

    let that = this
    var class_id = options.class_id
    that.setData({
      class_id: class_id
    })
    var role = wx.getStorageSync("role")
    if (!role) {
      that.setData({
        role: -1
      })
    } else {
      that.setData({
        role: role
      })
    }

    // 加载数据
    this.loadData(function(success, msg){
      if(!success) {
        wx.showToast({
          title: msg,
          icon: 'none'
        })
      }
    })
  },

  back: function () {
    wx.navigateBack({
      delta: 1  // 返回上一级页面。
    })
  },

  
  to_stu_rearch:function(){
    let that = this
    var type = 1
    wx.navigateTo({
      url: '../../pages/stu-rearch/stu-rearch?type=' + type + '&class_id=' + that.data.class_id,
    })
  },

  previewImg:function(e){
    let that = this
    var xb = e.currentTarget.dataset.xb
    var dxb = e.currentTarget.dataset.dxb
    console.log(dxb)
    var imgs = that.data. csmorningRead[dxb].pics
    wx.previewImage({
      current: that.data.csmorningRead[dxb].pics[xb],
      urls: imgs
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
    // setTimeout(() => {
    //   wx.startPullDownRefresh()//通过方法调用刷新
    // }, 1000)
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
    // 加载第一页
    let oldPage = this.pageData.page
    this.pageData.page = 1
    let that = this
    this.loadData(function(success, msg){
      wx.stopPullDownRefresh({
        complete: (res) => {
          if(!success){
            wx.showToast({
              title: msg,
              icon: 'none'
            })
          } else {
            that.pageData.page = oldPage
          }
        },
      })
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    // 加载下一页
    if (this.pageData.canLoadNextPage) {
      let oldPage = this.pageData.page
      this.pageData.page = oldPage + 1
      let that = this
      this.loadData(function(success, msg){
        if(!success) {
          wx.showToast({
            title: msg,
            icon: 'none'
          })
        } else {
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

  /**
   * 设置自定义导航栏尺寸
  */
  setUpNaviSize: function () {
    var menuButtonRect = wx.getMenuButtonBoundingClientRect()
    let naviBarHeight = menuButtonRect.bottom+10
    let naviBarWidth = wx.getSystemInfoSync().screenWidth
    this.setData ({
      naviBarHeight: naviBarHeight,
      naviBarWidth: naviBarWidth,
      naviBarSelectSub_Height: menuButtonRect.height,
      naviBarSelectSub_Top: menuButtonRect.top
    })
  },

  /**
   * 加载每日晨读数据
  */
  loadData: function(cb) {
    let that = this
    if (that.data.role == 4) {
      var params = {
        "token": wx.getStorageSync("token"),
        "uid": wx.getStorageSync("uid"),
        "class_id": that.data.class_id,
        "page": that.pageData.page,
        "limit": that.pageData.perpage,
      }
      console.log(params)
      app.ljjw.jwGetMorningReadMore(params).then(d => {
        // console.log(d)
        if (d.data.status == 1) {
          // console.log(d.data.data)
          // that.setData({
          //   morningRead: d.data.data
          // })

          var data = d.data.data

          // 图片地址处理
          for (var i = 0; i < data.length; i++) {
            var item = data[i]
            item.pics = item.pics.split(",")
          }

          // 分页数据处理
          var newData = []
          if (that.pageData.page == 1) {
            newData = data
          } else {
            newData = that.data.csmorningRead.concat(data)
          }

          // 是否可以加载下一页
          if (data.length < that.pageData.perpage) {
            that.pageData.canLoadNextPage = false
          } else {
            that.pageData.canLoadNextPage = true
          }

          // 更新界面数据
          that.setData({
            csmorningRead: newData
          })
          console.log("学生每日晨读获取成功")
          typeof cb == "function" && cb(true, "加载成功")
        } else {
          typeof cb == "function" && cb(false, d.msg ? d.msg : "加载失败")
        }
      })
    } else if (that.data.role <= 2) {
      var params = {
        "token": wx.getStorageSync("token"),
        "uid": wx.getStorageSync("uid"),
        "page": that.pageData.page,
        "limit": that.pageData.perpage,
        "class_id": that.data.class_id
      }
      console.log(params)
      app.ljjw.jwTeacherMorningReadMore(params).then(d => {
        // console.log(d)
        if (d.data.status == 1) {
          // console.log(d.data.data)

          var data = d.data.data
          for (var i = 0; i < data.length; i++) {
            var item = data[i]
            item.pics = data.pics.split(",")
          }

          // 分页数据处理
          var newData = []
          if (that.pageData.page == 1) {
            newData = data
          } else {
            newData = that.data.csmorningRead.concat(data)
          }

          // 是否可以加载下一页
          if (data.length < that.pageData.perpage) {
            that.pageData.canLoadNextPage = false
          } else {
            that.pageData.canLoadNextPage = true
          }
          that.setData({
            csmorningRead: newData
          })
          console.log("老师每日晨读获取成功")
        }
      })
    }
  }
})