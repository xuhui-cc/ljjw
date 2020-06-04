// pages/tea_data/tea_data.js
const app = getApp()
Page({

  // 打开的文件路径 在onShow中删除文件
  openFilePath: '',
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
    this.getFileList()
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

  /**
   * 打开文件 点击事件
  */
  open_file:function(e){
    let that = this
    var file_xb = e.currentTarget.dataset.file_xb
    console.log(file_xb)

    let file = that.data.files[file_xb]

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
              },

              fail: function (res) {
                console.log("fail");
                console.log(res)
                wx.hideLoading({
                  complete: (res) => {
                    wx.showToast({
                      title: '文件打开失败',
                      icon: 'none'
                    })
                  },
                })
              },
              complete: function (res) {
                console.log("complete");
                console.log(res)
              }


            })
          },
          fail: function(res) {
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
        break
      }
    }
  },

  tea_class_picker: function (e) {
    let that = this
    console.log('picker发送选择改变，携带值为', e.detail.value)
    that.setData({
      tea_class_index: e.detail.value
    })
    this.getFileList(that.data.tea_class[that.data.tea_class_index].id)
  },

  search_tea_data:function(e){
    let that = this 
    console.log(e.detail.value)
    that.setData({
      input_tltle: e.detail.value
    })
    
    this.getFileList(that.data.tea_class[that.data.tea_class_index].id)
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

  // -------------------------------------------------接口----------------------------------------------
  /**
   * 获取附件列表
  */
  getFileList: function(class_id) {
    let that = this
    var params = {
      "token": wx.getStorageSync("token"),
      "uid": wx.getStorageSync("uid"),
    }
    if (class_id && class_id != '') {
      params.class_id = class_id
    }
    
    app.ljjw.jwTeacherClassFiles(params).then(d => {
      
      if (d.data.status == 1) {

        let data = d.data.data

        if (data.files && data.files != '') {
          for (var i = 0; i < data.files.length; i++) {
            var file = data.files[i]

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
            var time = file.createtime.substr(10, 15)
            if (file.createtime.indexOf(that.data.today) != -1) {
              var createtime = "今天" + time
              file.createtime = createtime
            }

            if (file.createtime.indexOf(that.data.yestday) != -1) {
              var createtime = "昨天" + time
              file.createtime = createtime
            }
          }
        }
        that.setData({
          tea_class: data.classes,
          files: data.files
        })
      }
    })
  }
})