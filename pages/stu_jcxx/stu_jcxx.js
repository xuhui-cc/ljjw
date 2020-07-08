// pages/stu_jcxx/stu_jcxx.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 是否打开图片选择方式页面
    showPictureTypeSelect: false,
  },

  timestampToTime: function (timestamp) {
    var date = new Date(timestamp*1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
    var Y = date.getFullYear() + '-';
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
    var D = date.getDate() + ' ';
    var h = (date.getHours() < 10 ? '0' + (date.getHours()) : date.getHours()) + ':';
    var m = (date.getMinutes() < 10 ? '0' + (date.getMinutes()) : date.getMinutes());
    var s = date.getSeconds();
    return Y + M;
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getPageSize()
    this.getStudentBaseInfo()
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

  // --------------------------------------------------私有方法----------------------------------------------
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
        screenWidth: systemInfo.screenWidth
      }
    })
  },

  /**
   * 跳转至图片编辑页
  */
  gotoPictureEditPage: function (path) {
    wx.navigateTo({
      url: "../../pages/avatar_edit/avatar_edit?path="+path
    })
  },

  // --------------------------------------------------------------接口-------------------------------------------------
  /**
   * 获取学生基本信息
   * 参数：token、uid
  */
  getStudentBaseInfo: function () {
    let that = this
    // 获取用户信息
    var params = {
      "token": wx.getStorageSync("token"),
      "uid": wx.getStorageSync("uid"),
    }
    // console.log(params)
    app.ljjw.jwGetStudentMainPage(params).then(d => {
      if (d.data.status == 1) {
        var infoData = d.data.data
        let graduate_time = that.timestampToTime(infoData.graduate_time)
        infoData.graduate_time = graduate_time
        let eduList = [
          {
            "item": "邮箱",
            "iconPath": "../../images/email.png",
            "value": infoData.email,
            "identifier": "email"
          },
          {
            "item": "毕业院校",
            "iconPath": "../../images/byyx.png",
            "value": infoData.graduate_school,
            "identifier": "school"
          },
          {
            "item": "毕业时间",
            "iconPath": "../../images/bysj.png",
            "value": infoData.graduate_time,
            "identifier": "end_time"
          },
          {
            "item": "专业",
            "iconPath": "../../images/zhuanye.png",
            "value": infoData.subject,
            "identifier": "subject"
          },
          {
            "item": "班级",
            "iconPath": "../../images/banji.png",
            "value": infoData.classes[0].classname,
            "identifier": "class"
          },
          {
            "item": "在校时间",
            "iconPath": "../../images/zxsj.png",
            "value": infoData.study_time,
            "identifier": "class"
          },
          {
            "item": "市场老师",
            "iconPath": "../../images/scls.png",
            "value": infoData.market_teacher,
            "identifier": "teacher"
          }]
        infoData.eduList = eduList

        let avatar = infoData.avatar
        if (!avatar || avatar.indexOf('http') == -1) {
          infoData.avatar = '../../images/avatar_null.png'
        }

        that.setData({
          mydata: infoData,
        })
      }
    })
  },

  /**
   * 上传图片
   * 参数：
   * path：图片路径
  */
  uploadAvatar: function(path) {
    let that = this
    wx.showLoading({
      title: '上传中'
    })
    wx.uploadFile({
      url: app.ljjw.getUploadFileURI(),
      filePath: path,
      name: 'file',
      formData: {
        'file': path,
        "token": wx.getStorageSync('token'),
        "action": "jwUploadAvatar", //action=uploads&authhash=445454554
      },
      success(r) {
        wx.hideLoading()
        let result = JSON.parse(r.data);
        if (result.status == 1) {
          let url = result.data
          that.updateUserAvatar(url)
        } else {
          wx.showToast({
            title: result.msg ? result.msg : '上传失败'
          })
          console.log('失败')
          console.log(result.status)
        }
      },
      fail (res) {
        wx.hideLoading()
        wx.showToast({
          title: '上传失败',
          icon: 'none'
        })
      }
    })
  },

  /**
   * 更新头像
  */
  updateUserAvatar: function(url) {
    let that = this
    let params = {
      avatar: url,
      "token": wx.getStorageSync("token"),
      "uid": wx.getStorageSync("uid"),
    }
    wx.showLoading({
      title: '更新中'
    })
    app.ljjw.jwUpdateStudentBaseInfo(params).then(d => {
      wx.hideLoading()
      if (d.data.status == 1) {
        let avatarChangeStr = 'mydata.avatar'
        let userInfo = wx.getStorageSync('userInfo')
        userInfo.avatar = url
        wx.setStorageSync('userInfo', userInfo)
        that.setData({
          [avatarChangeStr]: url
        })
        wx.showToast({
          title: "更新成功",
          icon: 'none'
        })
      }
    })
  },

  // -------------------------------------------------------action-----------------------------------------
  /**
   * 头像点击事件
  */
  avatarTap: function(e) {
    this.setData({
      showPictureTypeSelect: true
    })
  },

  /**
   * 导航栏 返回按钮 点击事件
  */
  naviBackClicked : function() {
    wx.navigateBack({
      complete: (res) => {},
    })
  },

  /**
   * 选择图片类型弹框 相机/相册/取消按钮 点击事件
  */
  pictureTypeButtonClicked: function(e) {
    // console.log(e)
    let that = this
    let type = (e.currentTarget.dataset.type)*1
    switch(type) {
      case 1: {
        //相机
        wx.chooseImage({
          count: 1,
          sourceType: ['camera'],
          success (res) {
            if (res.tempFilePaths && res.tempFilePaths.length >= 1) {
              let path = res.tempFilePaths[0]
              that.gotoPictureEditPage(path)
            }
          },
          fail (res) {
            console.log('打开相机失败')
            console.log(res)
          }
        })
        this.setData({
          showPictureTypeSelect: false
        })
        break
      }
      case 2: {
        // 相册
        this.setData({
          showPictureTypeSelect: false
        })
        wx.chooseImage({
          count: 1,
          sourceType: ['album'],
          success (res) {
            // console.log(res)
            if (res.tempFilePaths && res.tempFilePaths.length >= 1) {
              let path = res.tempFilePaths[0]
              that.gotoPictureEditPage(path)
            }
          },
          fail (res) {
            console.log('打开相册失败')
            console.log(res)
          }
        })
        
        break
      }
      case 3: {
        //取消
        this.setData({
          showPictureTypeSelect: false
        })
        break
      }
    }
  }
})