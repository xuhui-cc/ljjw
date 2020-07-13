// pages/class_data/class_data.js
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

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getPageSize()
    let that = this
    let nowTime = new Date();

    var today = new Date(nowTime.getFullYear(), nowTime.getMonth(), nowTime.getDate()).getTime(); //今天凌晨

    var yestday = new Date(today - 24 * 3600 * 1000).getTime();
    that.setData({
      today: that.timestampToTime(today),
      yestday: that.timestampToTime(yestday)
    })

    this.getFileList()
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
   * 图片显示大图
  */
  previewImage: function (pics) {
    wx.previewImage({
      current: pics[0],
      urls: pics
    })
  },


  open_file:function(e){
    if (this.loading) {
      return
    }
    
    let that = this
    var file_xb = e.currentTarget.dataset.file_xb
    
    console.log(file_xb)

    let file = that.data.mydata[file_xb]

    switch (file.formType) {
      case 0:{
        // 不支持格式
        wx.showToast({
          title: (file.fileurl && file.fileurl != '') ? '不支持该文件格式' : '文件不存在',
          icon: 'none'
        })
        break
      }
      case 1:{
        // 图片
        let pics = file.fileurl
        that.previewImage(pics)
        break
      }
      default:{
        this.loading = true
        // 其他支持的文件格式
        let timestamp = Date.parse(new Date()); 
        // let fileTypeArray = that.data.mydata.files[file_xb].fileurl.split(".")
        let fileType = file.form
        let customFilePath = wx.env.USER_DATA_PATH+"/"+timestamp+"."+fileType
        console.log('得到自定义路径：')
        console.log(customFilePath)
        wx.showLoading({
          title: '资料打开中...',
        })
        wx.downloadFile({
          url: file.fileurl, //仅为示例，并非真实的资源
          filePath: customFilePath,
          success(res) {
            // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容

            console.log(res)
            var filePath = res.filePath
            console.log('返回自定义路径：')
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

              fail: function (res) {
                console.log("打开文档失败");
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
              },
              complete: function (res) {
                console.log("complete");
                console.log(res)
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
        break
      }
    }
  },

  search_collect:function(e){
    let that = this
    console.log(e.detail.value)
    that.setData({
      input_title: e.detail.value
    })

    this.getFileList(that.data.input_title)
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

  // ----------------------------------------------------私有方法---------------------------------------------
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
  },

  /**
   * 获取页面辅助尺寸
  */
  getPageSize: function() {
    let systemInfo = wx.getSystemInfoSync()
    let menuBounding = wx.getMenuButtonBoundingClientRect()
    let naviHeight = menuBounding.bottom + 10
    let statusBarHeight = systemInfo.statusBarHeight
    let safeareaBottom = systemInfo.screenHeight - systemInfo.safeArea.bottom
    console.log("屏幕高度:"+systemInfo.screenHeight+"  safearea底部:"+systemInfo.safeArea.bottom)
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

  // --------------------------------------------接口----------------------------------------------------
  /**
   * 获取我的收藏列表
  */
  getFileList: function(keyword) {
    let that = this
    var params = {
      "token": wx.getStorageSync("token"),
      "uid": wx.getStorageSync("uid"),
    }

    if (keyword && keyword != '') {
      params.keyword = keyword
    }
    app.ljjw.jwGetMyCollection(params).then(d => {
      if (d.data.status == 1) {

        let data = d.data.data

        if (!data || data == '') {
          that.setData({
            mydata: ''
          })
          return
        }
        for (var i = 0; i < data.length; i++) {

          let file = data[i]

          // 截取后缀 获取格式
          let form = null
          if (file.fileurl && file.fileurl != '') {
            let subFileUrlArray = file.fileurl.split(".")
            if (subFileUrlArray && subFileUrlArray.length >= 2) {
              form = subFileUrlArray[subFileUrlArray.length - 1]
            }
          }
          file.form = form

          let formType = 0 // 0-不支持格式 1-图片 2-word 3-pdf 4-ppt 5-jpg
          switch(form) {
            case "png":
            case "jpg":
            case "jpeg": {
              // 图片
              file.fileurl = file.fileurl.split(",")
              formType = 1
              break;
            }
            case "doc":
            case "docx": {
              // word
              formType = 2
              break
            }
            case "pdf": {
              // pdf
              formType = 3
              break
            }
            case "ppt":
            case "pptx": {
              formType = 4
              break
            }
          }
          file.formType = formType

          // 处理日期
          var time = file.col_time.substr(10, 15)
          if (file.col_time.indexOf(that.data.today) != -1) {
            var col_time = "今天" + time
            file.col_time = col_time
          }

          if (file.col_time.indexOf(that.data.yestday) != -1) {
            var col_time = "昨天" + time
            file.col_time = col_time
          }
        }

        that.setData({
          mydata: data
        })

      } else {
        that.setData({
          mydata: ''
        })
      }
    })
  },

  // --------------------------------------------交互事件-----------------------------------
  /**
   * 导航栏 返回按钮 点击事件
  */
  back: function () {
    wx.navigateBack({
      delta: 1  // 返回上一级页面。
    })
  },
})