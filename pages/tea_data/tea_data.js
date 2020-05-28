// pages/tea_data/tea_data.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tea_class_index:0,
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

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getNaviSzie()
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
    // console.log(params)
    app.ljjw.jwTeacherClassFiles(params).then(d => {
      // console.log(d)
      if (d.data.status == 1) {
        that.setData({
          tea_class: d.data.data.classes,
          files: d.data.data.files
        })
        if (that.data.files) {
          for (var i = 0; i < that.data.files.length; i++) {
            if (that.data.files[i].fileurl.indexOf(".doc") != -1) {
              var form = "files[" + i + "].form"
              that.setData({
                [form]: "doc"
              })
            } else if (that.data.files[i].fileurl.indexOf(".pdf") != -1) {
              var form = "files[" + i + "].form"
              that.setData({
                [form]: "pdf"
              })
            } else if (that.data.files[i].fileurl.indexOf(".ppt") != -1) {
              var form = "files[" + i + "].form"
              that.setData({
                [form]: "ppt"
              })
            } else if (that.data.files[i].fileurl.indexOf(".jpg") != -1) {
              var form = "files[" + i + "].form"
              that.setData({
                [form]: "jpg"
              })
            } else if (that.data.files[i].fileurl.indexOf(".png") != -1) {
              var form = "files[" + i + "].form"
              that.setData({
                [form]: "png"
              })
            } else {
              var form = "files[" + i + "].form"
              that.setData({
                [form]: null
              })
            }

            var d = that.data.files[i].createtime.substr(10, 15)

            if (that.data.files[i].createtime.indexOf(that.data.today) != -1) {
              var createtime = "今天" + d
              console.log(createtime)
              var cs = "files[" + i + "].createtime"
              that.setData({
                [cs]: createtime
              })
            }
            if (that.data.files[i].createtime.indexOf(that.data.yestday) != -1) {
              var createtime = "昨天" + d
              console.log(createtime)
              var cs = "files[" + i + "].createtime"
              that.setData({
                [cs]: createtime
              })
            }

          }
        }
        console.log("老师的班级资料获取成功")
      }
      
    })
  },

  previewImage: function () {
    let that = this
    // var file_xb = e.currentTarget.dataset.file_xb
    console.log("cs")
    var image = []

    image.push(that.data.files[that.data.file_xb].fileurl)
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
    console.log(that.data.files[file_xb].fileurl)
    that.setData({
      file_xb: file_xb
    })
    console.log(file_xb)
    // console.log(that.data.mydata.files[file_xb].fileurl)
    if (that.data.files[file_xb].form.indexOf("png") != -1 || that.data.files[file_xb].form.indexOf("jpg") != -1) {
      that.previewImage()
      console.log("图")
    } else {
      let timestamp = Date.parse(new Date()); 
      let fileTypeArray = that.data.files[file_xb].fileurl.split(".")
      let fileType = fileTypeArray[fileTypeArray.length-1]
      let customFilePath = wx.env.USER_DATA_PATH+"/"+timestamp+"."+fileType
      console.log('得到自定义路径：')
      console.log(customFilePath)
      wx.showLoading({
        title: '资料打开中...',
      })
      wx.downloadFile({
        url: that.data.files[file_xb].fileurl, //仅为示例，并非真实的资源
        filePath: customFilePath,
        success(res) {
          // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容

          var filePath = res.filePath
          console.log(filePath)
          console.log(res)
          wx.openDocument({
            showMenu: true,
            filePath: filePath,

            success: function (res) {
              wx.hideLoading({
                complete: (res) => {},
              })
              console.log('打开文档成功')
            },
            fail: function(res) {
              console.log('打开文档失败')
              console.log(res)
              wx.hideLoading({
                complete: (res) => {
                  wx.showToast({
                    title: '文件打开失败',
                    icon: 'none'
                  })
                },
              })
            }
          })
        },
        fail: function(res) {
          console.log('文件下载失败')
          console.log(res)
          wx.hideLoading({
            complete: (res) => {
              wx.showToast({
                title: '文件下载失败',
                icon: 'none'
              })
            },
          })
        }
      })
    }
  },

  tea_class_picker: function (e) {
    let that = this
    console.log('picker发送选择改变，携带值为', e.detail.value)
    that.setData({
      tea_class_index: e.detail.value
    })
    var params = {
      "token": wx.getStorageSync("token"),
      "uid": wx.getStorageSync("uid"),
      "class_id": that.data.tea_class[that.data.tea_class_index].id,
    }
    // console.log(params)
    app.ljjw.jwTeacherClassFiles(params).then(d => {
      // console.log(d)
      if (d.data.status == 1) {
        that.setData({
          files: d.data.data.files
        })
        if (that.data.files) {
          for (var i = 0; i < that.data.files.length; i++) {
            if (that.data.files[i].fileurl.indexOf(".doc") != -1) {
              var form = "files[" + i + "].form"
              that.setData({
                [form]: "doc"
              })
            } else if (that.data.files[i].fileurl.indexOf(".pdf") != -1) {
              var form = "files[" + i + "].form"
              that.setData({
                [form]: "pdf"
              })
            } else if (that.data.files[i].fileurl.indexOf(".ppt") != -1) {
              var form = "files[" + i + "].form"
              that.setData({
                [form]: "ppt"
              })
            } else if (that.data.files[i].fileurl.indexOf(".jpg") != -1) {
              var form = "files[" + i + "].form"
              that.setData({
                [form]: "jpg"
              })
            } else if (that.data.files[i].fileurl.indexOf(".png") != -1) {
              var form = "files[" + i + "].form"
              that.setData({
                [form]: "png"
              })
            } else {
              var form = "files[" + i + "].form"
              that.setData({
                [form]: null
              })
            }

            var d = that.data.files[i].createtime.substr(10, 15)

            if (that.data.files[i].createtime.indexOf(that.data.today) != -1) {
              var createtime = "今天" + d
              console.log(createtime)
              var cs = "files[" + i + "].createtime"
              that.setData({
                [cs]: createtime
              })
            }
            if (that.data.files[i].createtime.indexOf(that.data.yestday) != -1) {
              var createtime = "昨天" + d
              console.log(createtime)
              var cs = "files[" + i + "].createtime"
              that.setData({
                [cs]: createtime
              })
            }

          }
        }
        console.log("老师更换班级资料获取成功")
      }
      // console.log("我是老师的班级资料")

    })
  },

  search_tea_data:function(e){
    let that = this 
    console.log(e.detail.value)
    that.setData({
      input_tltle: e.detail.value
    })
    
    var params = {
      "token": wx.getStorageSync("token"),
      "uid": wx.getStorageSync("uid"),
      "class_id": that.data.tea_class[that.data.tea_class_index].id,
    }
    if(that.data.input_tltle != '') {
      params.keyword = that.data.input_tltle
    }
    // console.log(params)
    app.ljjw.jwTeacherClassFiles(params).then(d => {
      // console.log(d)
      if (d.data.status == 1) {
        that.setData({
          files: d.data.data.files
        })
        if (that.data.files) {
          for (var i = 0; i < that.data.files.length; i++) {
            if (that.data.files[i].fileurl.indexOf(".doc") != -1) {
              var form = "files[" + i + "].form"
              that.setData({
                [form]: "doc"
              })
            } else if (that.data.files[i].fileurl.indexOf(".pdf") != -1) {
              var form = "files[" + i + "].form"
              that.setData({
                [form]: "pdf"
              })
            } else if (that.data.files[i].fileurl.indexOf(".ppt") != -1) {
              var form = "files[" + i + "].form"
              that.setData({
                [form]: "ppt"
              })
            } else if (that.data.files[i].fileurl.indexOf(".jpg") != -1) {
              var form = "files[" + i + "].form"
              that.setData({
                [form]: "jpg"
              })
            } else if (that.data.files[i].fileurl.indexOf(".png") != -1) {
              var form = "files[" + i + "].form"
              that.setData({
                [form]: "png"
              })
            } else {
              var form = "files[" + i + "].form"
              that.setData({
                [form]: null
              })
            }

            var d = that.data.files[i].createtime.substr(10, 15)

            if (that.data.files[i].createtime.indexOf(that.data.today) != -1) {
              var createtime = "今天" + d
              console.log(createtime)
              var cs = "files[" + i + "].createtime"
              that.setData({
                [cs]: createtime
              })
            }
            if (that.data.files[i].createtime.indexOf(that.data.yestday) != -1) {
              var createtime = "昨天" + d
              console.log(createtime)
              var cs = "files[" + i + "].createtime"
              that.setData({
                [cs]: createtime
              })
            }

          }
        }
        console.log("老师搜索班级资料获取成功")
      }
      // console.log("我是老师的班级资料")

    })
  },

  go_back:function(){
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

  /**
   * 获取页面辅助尺寸
  */
  getNaviSzie: function () {
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
})