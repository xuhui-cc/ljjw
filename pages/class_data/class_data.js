// pages/class_data/class_data.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    let nowTime = new Date();

    var today = new Date(nowTime.getFullYear(), nowTime.getMonth(), nowTime.getDate()).getTime(); //今天凌晨

    var yestday = new Date(today - 24 * 3600 * 1000).getTime();
    that.setData({
      today: that.timestampToTime(today),
      yestday: that.timestampToTime(yestday)
    })

    var params = {
      "token": wx.getStorageSync("token"),
      "uid": wx.getStorageSync("uid"),
      
    }
    console.log(params)
    app.ljjw.jwGetMyCollection(params).then(d => {
      if (d.data.status == 1) {
        that.setData({
          mydata: d.data.data
        })
        for (var i = 0; i < that.data.mydata.length; i++) {
          if (that.data.mydata[i].fileurl.indexOf(".doc") != -1) {
            var form = "mydata[" + i + "].form"
            that.setData({
              [form]: "doc"
            })
          } else if (that.data.mydata[i].fileurl.indexOf(".pdf") != -1) {
            var form = "mydata[" + i + "].form"
            that.setData({
              [form]: "pdf"
            })
          } else if (that.data.mydata[i].fileurl.indexOf(".ppt") != -1) {
            var form = "mydata[" + i + "].form"
            that.setData({
              [form]: "ppt"
            })
          } else if (that.data.mydata[i].fileurl.indexOf(".jpg") != -1) {
            var form = "mydata[" + i + "].form"
            that.setData({
              [form]: "jpg"
            })
          } else if (that.data.mydata[i].fileurl.indexOf(".png") != -1) {
            var form = "mydata[" + i + "].form"
            that.setData({
              [form]: "png"
            })
          }else{
            var form = "mydata[" + i + "].form"
            that.setData({
              [form]: null
            })
          }

          var d = that.data.mydata[i].col_time.substr(10, 15)

          if (that.data.mydata[i].col_time.indexOf(that.data.today) != -1) {
            var col_time = "今天" + d
            console.log(col_time)
            var cs = "mydata[" + i + "].col_time"
            that.setData({
              [cs]: col_time
            })
          }
          if (that.data.mydata[i].col_time.indexOf(that.data.yestday) != -1) {
            var col_time = "昨天" + d
            console.log(col_time)
            var cs = "mydata[" + i + "].col_time"
            that.setData({
              [cs]: col_time
            })
          }

        }

        console.log("我的收藏搜索接口获取成功")
      } else {
        that.setData({
          mydata: ''
        })
      }


    })
  },

  timestampToTime: function (timestamp) {
    var date = new Date(timestamp);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
    var Y = date.getFullYear() + '-';
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    var D = date.getDate() + ' ';
    var h = (date.getHours() < 10 ? '0' + (date.getHours()) : date.getHours()) + ':';
    var m = (date.getMinutes() < 10 ? '0' + (date.getMinutes()) : date.getMinutes());
    var s = date.getSeconds();
    return Y + M + D;
  },

  back: function () {
    wx.navigateBack({
      delta: 1  // 返回上一级页面。
    })
  },

  previewImage: function () {
    let that = this
    // var file_xb = e.currentTarget.dataset.file_xb
    console.log("cs")
    var image = []

    image.push(that.data.mydata[that.data.file_xb].fileurl)
    // var imgs = that.data.mydata.files[file_xb].fileurl
    wx.previewImage({
      current: image[0],
      urls: image
    })

  },


  open_file:function(e){
    let that = this
    var file_xb = e.currentTarget.dataset.file_xb
    console.log(file_xb)
    console.log(that.data.mydata[file_xb].fileurl)
    that.setData({
      file_xb: file_xb
    })
    console.log(file_xb)
    // console.log(that.data.mydata.files[file_xb].fileurl)
    if (that.data.mydata[file_xb].form.indexOf("png") != -1 || that.data.mydata[file_xb].form.indexOf("jpg") != -1) {
      that.previewImage()
      console.log("图")
    } else {
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
    }
  },

  search_collect:function(e){
    let that = this
    console.log(e.detail.value)
    that.setData({
      input_title: e.detail.value
    })

    var params = {
      "token": wx.getStorageSync("token"),
      "uid": wx.getStorageSync("uid"),
      "keyword": that.data.input_title
    }
    console.log(params)
    app.ljjw.jwGetMyCollection(params).then(d => {
      if (d.data.status == 1) {
        that.setData({
          mydata: d.data.data
        })
        console.log("我的收藏搜索接口获取成功")
      } else {
        wx.showToast({
          title: d.data.msg,
          icon: "none",
          duration: 2000
        })
      }


    })
  

  },

  cancel_collect:function(e){
    let that = this
    var file_xb = e.currentTarget.dataset.file_xb
    console.log(file_xb)
    var params = {
      "token": wx.getStorageSync("token"),
      "uid": wx.getStorageSync("uid"),
      "type": 2,  //1-添加，2-取消
      "fileid": that.data.mydata[file_xb].fileid
    }
    console.log(params)
    app.ljjw.jwStudentAddCollection(params).then(d => {
      if (d.data.status == 1) {
        console.log(d.data.msg)
        that.onLoad();
        console.log("收藏与取消收藏接口获取成功")
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