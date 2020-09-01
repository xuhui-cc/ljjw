// pages/noti_list/noti_list.js
const app = getApp()
Page({

  pageData: {
    perpage: 10,
    page: 1,
    canLoadNextPage: true,
  },

  class_id: "",
  /**
   * 页面的初始数据
   */
  data: {
    notiList: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.class_id = options.class_id
    this.reloadData(1, function(success, msg) {
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
    
    this.pageData.page = 1
    this.reloadData(1, function(success, msg) {
      wx.stopPullDownRefresh({
        complete: (res) => {},
      })
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let that = this
    if (this.pageData.canLoadNextPage) {
      let oldPage = this.pageData.page
      this.pageData.page = this.pageData.page + 1
      this.reloadData(this.pageData.page, function(success, msg) {
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

  //----------------------------------接口------------------------------------------
  /**
   * 刷新数据
  */
  reloadData: function (page, cb) {
    let that = this
    let role = wx.getStorageSync('role')*1
   
    switch (role) 
    {
      case 1:
        // 老师
      case 2: {
        // 教务
        var params = {
          "token": wx.getStorageSync("token"),
          "uid": wx.getStorageSync("uid"),
          "page": page,
          "limit": that.pageData.perpage,
          "class_id": that.class_id
        }
        
        app.ljjw.jwTeacherTasksMainPage(params).then(d => {

          let status = d.data.status
          
          if (status == 1) {
            var data = d.data.data
            var newMessages = data.messages

            // 是否可以加载下一页
            if (newMessages.length < that.pageData.perpage) {
              that.pageData.canLoadNextPage = false
            } else {
              that.pageData.canLoadNextPage = true
            }

            // 分页数据处理
            if (page > 1) {
              newMessages = that.data.notiList.concat(newMessages)
            }
            var showNoData = false

            if (!newMessages || newMessages.length == 0) {
              showNoData = true
            }
            that.setData({
             notiList: newMessages,
             showNoData: showNoData
            })
            typeof cb == "function" && cb(true, "加载成功")
          } else {
            let msg = d.data.msg
            that.pageData.canLoadNextPage = false
            typeof cb == "function" && cb(false, msg)
          }
        })
        break
      }
      case 3: 
        // 管理员
        console.log("我是管理员任务onLoad")
        break
      
      case 4: {
        // 学生
        var params = {
          "token": wx.getStorageSync("token"),
          "uid": wx.getStorageSync("uid"),
          "page": page,
          "limit": that.pageData.perpage,
          "class_id": that.class_id
        }
        app.ljjw.jwGetStudentTaskMain(params).then(d => {
          let status = d.data.status
          
          let msg = d.data.msg
          if (status == 1) {
            var pageData = d.data.data
            var newMessages = pageData.messages
            // 判断是否可以上啦加载
            if (newMessages.length < that.pageData.perpage) {
              that.pageData.canLoadNextPage = false
            } else {
              that.pageData.canLoadNextPage = true
            }
            // 分页数据处理
            if (page > 1) {
              newMessages = that.data.notiList.concat(newMessages)
            }
            // 判断是否加载空页面
            var showNoData = false
            if (!newMessages || newMessages.length == 0) {
              showNoData = true
            }

            // 更改数据 刷新界面
            that.setData({
              notiList: newMessages,
              showNoData: showNoData
            })
            typeof cb == "function" && cb(true, "加载成功")
          } else if(status == -1){
            that.setData({
              showNoData: false,
            })
            that.pageData.canLoadNextPage = false
            typeof cb == "function" && cb(false, "请先完善个人信息")
          } else {
            that.pageData.canLoadNextPage = false
            typeof cb == "function" && cb(false, msg)
          }
        })
        break
      }
    }
  },

  /**
   * 将消息通知改为已读状态
  */
  readNoti: function (index) {
    let noti = this.data.notiList[index]
    if (noti.isread == 1) {
      return
    }

    let params = {
      uid: wx.getStorageSync('uid'),
      token: wx.getStorageSync('token'),
      msgid: noti.id
    }

    let that = this
    app.ljjw.jwReadMsg(params).then(d=>{
      if (d.data.status == 1) {
        noti.isread = 1
        let command = "notiList["+index+"].isread"
        that.setData({
          [command]: 1 
        })
      }
    })
  },

  // ------------------------------------------------事件-----------------------------------
  /**
   * 消息单元格点击事件
  */
  to_detail_news: function (e) {
    console.log(e)
    let index = e.currentTarget.dataset.index
    let noti = this.data.notiList[index]
    this.readNoti(index)
    wx.navigateTo({
      url: '../../pages/detail-news/detail-news',
      success (res) {
        res.eventChannel.emit('newsDetailData', noti)
      }
    })
  }
})