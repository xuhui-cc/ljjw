// pages/stu-rearch/stu-rearch.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // type : 1

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
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
    var type = options.type
    var class_id = options.class_id
    that.setData({
      type : type,
      class_id: class_id
    })
  },

  back: function () {
    wx.navigateBack({
      delta: 1  // 返回上一级页面。
    })
  },

  search: function (e) {
    let that = this
    console.log(e.detail.value)
    that.setData({
      input_title: e.detail.value
    })
    if (that.data.input_title == ''){
      that.setData({
        csmorningRead: ''
      })
    }

    if (that.data.type == 1 && that.data.input_title != '' && that.data.role == 4){
      var params = {
        "token": wx.getStorageSync("token"),
        "uid": wx.getStorageSync("uid"),
        "page": 1,
        "keyword": that.data.input_title
      }
      console.log(params)
      app.ljjw.jwGetMorningReadMore(params).then(d => {
        if (d.data.status == 1) {
          that.setData({
            morningRead: d.data.data
          })

          for (var i = 0; i < that.data.morningRead.length; i++) {
            var cs = 'morningRead[' + i + '].pics'
            that.setData({
              [cs]: that.data.morningRead[i].pics.split(",")
            })
          }

          that.setData({
            csmorningRead: that.data.morningRead
          })
          
          console.log(that.data.csmorningRead)
          
        }


      })
    } else if (that.data.type == 1 && that.data.input_title != '' && that.data.role <= 2) {
      var params = {
        "token": wx.getStorageSync("token"),
        "uid": wx.getStorageSync("uid"),
        "class_id": that.data.class_id,
        "keyword": that.data.input_title
      }
      console.log(params)
      app.ljjw.jwTeacherMorningReadMore(params).then(d => {
        if (d.data.status == 1) {
          that.setData({
            morningRead: d.data.data
          })

          for (var i = 0; i < that.data.morningRead.length; i++) {
            var cs = 'morningRead[' + i + '].pics'
            that.setData({
              [cs]: that.data.morningRead[i].pics.split(",")
            })
          }

          that.setData({
            csmorningRead: that.data.morningRead
          })

          console.log(that.data.csmorningRead)

        }


      })
    } else if (that.data.type == 2 && that.data.input_title != '' && that.data.role == 4) {

      var params = {
        "token": wx.getStorageSync("token"),
        "uid": wx.getStorageSync("uid"),
        "keyword": that.data.input_title
      }
      console.log(params)
      app.ljjw.jwGetFilesByKeyword(params).then(d => {
        if (d.data.status == 1) {
          that.setData({
            mydata: d.data.data
          })
          console.log("资料接口获取成功")
        }else{
          that.setData({
            mydata: ""
          })
        }


      })

    }


  },

  open_file: function (e) {
    let that = this
    var file_xb = e.currentTarget.dataset.file_xb
    console.log(file_xb)
    console.log(that.data.mydata[file_xb].fileurl)
    wx.downloadFile({
      url: that.data.mydata[file_xb].fileurl, //仅为示例，并非真实的资源
      success(res) {
        // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容


        var filePath = res.tempFilePath
        console.log(filePath)
        wx.showLoading({
          title: '资料打开中...',
        })

        wx.openDocument({

          filePath: filePath,

          success: function (res) {

            console.log('打开文档成功')
            wx.hideLoading()

          }

        })
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

  }
})