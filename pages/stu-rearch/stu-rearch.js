// pages/stu-rearch/stu-rearch.js
const app = getApp()
Page({

  // 打开的文件路径 在onShow中删除文件
  openFilePath: '',
  // 是否正在加载
  loading: false,
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

  // previewImg: function (e) {
  //   let that = this
  //   var xb = e.currentTarget.dataset.xb
  //   // var dxb = e.currentTarget.dataset.dxb
  //   // console.log(dxb)
  //   var imgs = that.data.csmorningRead[0].pics
  //   wx.previewImage({
  //     current: that.data.csmorningRead[0].pics[xb],
  //     urls: imgs
  //   })

  // },

  previewImg: function (e) {
    let that = this
    var xb = e.currentTarget.dataset.xb
    var dxb = e.currentTarget.dataset.dxb
    console.log(dxb)
    var imgs = that.data.csmorningRead[dxb].pics
    wx.previewImage({
      current: that.data.csmorningRead[dxb].pics[xb],
      urls: imgs
    })

  },

  search_button:function(e){
    let that = this
    if (that.data.input_title == ''){
      wx.showToast({
        title: '请输入搜索内容',
        icon:"none",
        duration:2000
      })
    }else{
      that.search_fun()
    }
    
  },

  search_fun:function(){
    let that = this
    if (that.data.input_title == '') {
      that.setData({
        csmorningRead: ''
      })
    }

    if (that.data.type == 1 && that.data.input_title != '' && that.data.role == 4) {
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
        "keyword": that.data.input_title,
        "class_id": that.data.class_id,
      }
      console.log(params)
      app.ljjw.jwGetFilesByKeyword(params).then(d => {
        if (d.data.status == 1) {
          that.setData({
            mydata: d.data.data
          })
          console.log("资料接口获取成功")
        } else {
          that.setData({
            mydata: ""
          })
        }


      })

    }
  },

  search: function (e) {
    let that = this
    console.log(e.detail.value)
    that.setData({
      input_title: e.detail.value
    })
    that.search_fun()


  },

  rea_del:function(){
    let that = this
    that.setData({
      input_title:'',

    })
  },

  open_file: function (e) {
    if (this.loading) {
      return
    }
    let that = this
    var file_xb = e.currentTarget.dataset.file_xb
    console.log(file_xb)
    console.log(that.data.mydata[file_xb].fileurl)
    if (that.data.mydata[file_xb].fileurl.indexOf("png") != -1 || that.data.mydata[file_xb].fileurl.indexOf("jpg") != -1) {
      var image = []

      image.push(that.data.mydata[file_xb].fileurl)

      // var imgs = that.data.mydata.files[file_xb].fileurl
      wx.previewImage({
        current: image[0],
        urls: image
      })
      console.log("图")
    } else {
      this.loading = true
      let timestamp = Date.parse(new Date()); 
      let fileTypeArray = that.data.mydata[file_xb].fileurl.split(".")
      let fileType = fileTypeArray[fileTypeArray.length-1]
      let customFilePath = wx.env.USER_DATA_PATH+"/"+timestamp+"."+fileType
      console.log('得到自定义路径：')
      console.log(customFilePath)
      wx.showLoading({
        title: '资料打开中...',
      })
      wx.downloadFile({
        url: that.data.mydata[file_xb].fileurl, //仅为示例，并非真实的资源
        filePath: customFilePath,
        success(res) {
          // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容


          var filePath = res.filePath
          console.log(filePath)
          that.openFilePath = filePath
          wx.openDocument({
            showMenu: true,
            filePath: filePath,

            success: function (res) {
              console.log('打开文档成功')
              wx.hideLoading()
              that.loading = false
            },
            fail: function(res) {
              console.log('文件打开失败')
              console.log(res)
              wx.hideLoading({
                complete: (res) => {
                  wx.showToast({
                    title: '文件打开失败',
                    icon: 'none'
                  })
                },
              })
              that.loading = false
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
          that.loading = false
        }
      })
    }
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
    this.clearLocalFile()
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
   * 清除本地保存的文件
  */
  clearLocalFile: function() {
    let that = this

    if (this.openFilePath == '') {
      return
    }

    let fs = wx.getFileSystemManager()
    let filePath = this.openFilePath
    fs.unlink({
      filePath: filePath,
      success (res) {
        console.log("文件删除成功" + filePath)
        that.openFilePath = ''
      },
      fail (res) {
        console.log("文件删除失败"+filePath)
        console.log(res)
      }
    })
  }
})