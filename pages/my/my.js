// pages/my/my.js

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
    // role:0,
    
    stu_class_index: 0,

    // 问题反馈消息数量
    feedBackNotiCount: 0,

    // 老师未处理问题反馈数量
    teacherNotDealCount: 0,

    // 是否无权限
    noPower: false
  },

  /**
   * 生命周期函数--监听页面加载
   */

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

  onLoad: function (options) {

    let that = this
    // 获取导航尺寸
    this.setUpNaviSize()

    this.setUpDateInfo()
    
    this.setUpUserInfo()

    if(that.data.role == 4){
      if(that.data.stu_class && that.data.stu_class != '' && that.data.stu_class.length > that.data.stu_class_index) {
        let class_id = that.data.stu_class[that.data.stu_class_index].class_id
        that.studentGetPageInfo(class_id)
      } else {
        that.setData({
          stu_class_index: 0
        })
        that.studentGetPageInfo()
      }
    } 
    else if (that.data.role == 1){
      var params = {
        "token": wx.getStorageSync("token"),
        "uid": wx.getStorageSync("uid"),
      }
      console.log(params)
      app.ljjw.jwTeacherMyPage(params).then(d => {
        console.log(d)
        


      })
      console.log("老师——我的主页")
    }
    else if (that.data.role == 2) {
      console.log("教务——我的主页")
    }
    else if (that.data.role == 3) {
      console.log("管理员——我的主页")
    }
    
  },

  onTabItemTap(item) {
    app.setTaskItemDot()
  },

  //学生班级选择器
  stu_class_picker: function (e) {
    let that = this
    console.log('picker发送选择改变，携带值为', e.detail.value)
    let index = e.detail.value
    that.setData({
      stu_class_index: index
    })
    
    that.studentGetPageInfo(that.data.stu_class[index].class_id)
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

  // 打开文件
  open_file: function (e) {
    if (this.loading) {
      return
    }
    let that = this
    var file_xb = e.currentTarget.dataset.file_xb
    // that.setData({
    //   file_xb:file_xb
    // })
    console.log(file_xb)
    let file = that.data.mydata.files[file_xb]

    // console.log(that.data.mydata.files[file_xb].fileurl)
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
            wx.setStorageSync('openFilePath', filePath)
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

  // 学生查看基本信息
  to_stu_info:function(e){
    let that = this
    var type = e.currentTarget.dataset.type
    console.log(type + "to_stu_info")
    wx.navigateTo({
      url: '../../pages/stu-info/stu-info?type=' + type,
    })

  },

  // 老师基础信息跳转
  to_stu_jcxx: function () {
    let that = this
    wx.navigateTo({
      url: '../../pages/stu_jcxx/stu_jcxx?' ,
    })

  },

  
  /**
   * 搜索按钮 点击事件
  */
  to_stu_rea: function() {
    if (!this.data.stu_class || this.data.stu_class == '' || this.data.stu_class.length <= this.data.stu_class_index) {
      return
    }
    let classs = this.data.stu_class[this.data.stu_class_index]
    
    wx.navigateTo({
      url: '../../pages/stu-rearch/stu-rearch?type=' + 2 + '&class_id=' + classs.class_id,
    })
  },

  

  to_tea_sinfo: function () {
    wx.navigateTo({
      url: '../../pages/tea_sinfo/tea_sinfo',
    })
  },

  // 收藏
  iscollect:function(e){
    let that = this
    var type
    var file_xb = e.currentTarget.dataset.file_xb
    console.log(file_xb)
    console.log(that.data.mydata.files[file_xb].id)
    console.log(that.data.mydata.files[file_xb].colid   +"是否收藏id")
    if (that.data.mydata.files[file_xb].colid == null){
      type = 1
    }
    else{
      type = 2
    }
    console.log(type)
    
    var params = {
      "token": wx.getStorageSync("token"),
      "uid": wx.getStorageSync("uid"),
      "type":type,  //1-添加，2-取消
      "fileid":that.data.mydata.files[file_xb].id
    }
    // console.log(params)
    app.ljjw.jwStudentAddCollection(params).then(d => {
      // console.log(d.data.status +"d.data.status")
      if (d.data.status == 1) {
        // console.log(d.data.msg)
        that.studentGetPageInfo(that.data.stu_class[that.data.stu_class_index].class_id)
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
    this.onLoad()

    wx.login({
      complete: (res) => {
        app.updateWxLoginCode(res.code)
      },
    })

    // 清除文档缓存
    this.clearLocalFile()
    
    // 获取问题反馈消息数
    if(this.data.role == 4) {
      this.studentGetFeedBackNotiCount()
    } else {
      this.teacherGetFeedBackNotiCount()
    }
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

  //获取微信绑定手机号登录
  getPhoneNumber: function (e) {
    var that = this

    if (e.detail.errMsg == "getPhoneNumber:ok") {

      let iv = encodeURIComponent(e.detail.iv);
      let encryptedData = encodeURIComponent(e.detail.encryptedData);
      let code = app.getWxLoginCode()
      var params = {
        "code": code,
        "iv": iv,
        "encryptedData": encryptedData
      }
      
      app.ljjw.xcxjwlogin(params).then(d => {
        console.log(d)
        if (d.data.status == 0) {
          var role = d.data.role.split(",")
          if(role)
            if (d.data.class_ids != null){
              var class_ids = d.data.class_ids.split(",")
              wx.setStorageSync('class_ids', class_ids);
            }
          
          if(role.length == 2){
            role[0] = role[1]
          }
          console.log("登录成功")

          wx.setStorageSync('token', d.data.token);
          wx.setStorageSync('uid', d.data.uid);

          let userinfo = d.data.userInfo
          if (!userinfo.avatar || userinfo.avatar.indexOf('http') == -1) {
            userinfo.avatar = '../../images/avatar_null.png'
          }
          wx.setStorageSync('userInfo', userinfo)
          wx.setStorageSync('role', role[0])
          
          if(role[0] != 4){
            wx.setStorageSync('subject', d.data.cate_info)
            // wx.setStorageSync('subject_name', d.data.cate_info.name)
            console.log(d.data.cate_info)
          } else {
            let stuinfo = d.data.stuinfo
            wx.setStorageSync('stuinfo', stuinfo)
          }
          
          
          app.setTaskItemDot()
          that.onShow()


        } else {
          wx.showToast({
            title: "登录失败",
            icon: 'none',
            duration: 1000
          })
          
          console.log(d.data.msg)
        }
      })
    }
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
        wx.removeStorageSync('openFilePath')
      },
      fail (res) {
        console.log("文件删除失败"+filePath)
        console.log(res)
      }
    })
  },

  /**
   * 设置自定义导航栏尺寸
  */
  setUpNaviSize: function () {
    var menuButtonRect = wx.getMenuButtonBoundingClientRect()
    let naviBarHeight = menuButtonRect.bottom+10
    this.setData ({
      naviBarHeight: naviBarHeight,
      naviBarSelectSub_Height: menuButtonRect.height,
      naviBarSelectSub_Top: menuButtonRect.top
    })
  },

  /**
   * 获取 今天/昨天 date数据
  */
  setUpDateInfo: function () {
    let that = this

    let nowTime = new Date();
    
    var today = new Date(nowTime.getFullYear(), nowTime.getMonth(), nowTime.getDate()).getTime(); //今天凌晨

    var yestday = new Date(today - 24 * 3600 * 1000).getTime();
    that.setData({
      today: that.timestampToTime(today),
      yestday: that.timestampToTime(yestday)
    })
  },

  /**
   * 获取用户信息
  */
  setUpUserInfo: function() {
    let that = this
    var role = wx.getStorageSync("role")
    var userInfo = wx.getStorageSync("userInfo")
    if(!role){
      that.setData({
        role: -1
      })
    }else{
      var noPower = false
      if (role == 4) {
        let stuinfo = wx.getStorageSync('stuinfo')
        if (stuinfo && stuinfo.ifused && stuinfo.ifused == 0) {
          noPower = true
        }
      }
      that.setData({
        role: role,
        noPower: noPower
      })
    }
    that.setData({
      userInfo: userInfo
      // name: userInfo.name,
    })
  },

  // ------------------------------------------------------接口-----------------------------------------
  /**
   * 学生获取页面数据
  */
  studentGetPageInfo: function (class_id) {
    let that = this
    var params = {
      "token": wx.getStorageSync("token"),
      "uid": wx.getStorageSync("uid"),
    }
    if (class_id && class_id != '') {
      params.class_id = class_id
    }
    // console.log(params)
    app.ljjw.jwGetStudentMainPage(params).then(d => {
      
      if(d.data.status == 1){

        var data = d.data.data

        if (data.status_text.indexOf("请完成您的基础信息") != -1){
          wx.setStorageSync("stu_sta", false)
        }else{
          wx.setStorageSync("stu_sta", true)
        }

        if (!data.avatar || data.avatar.indexOf('http') == -1) {
          data.avatar = '../../images/avatar_null.png'
        }
        that.setData({
          mydata: data,
          stu_class: data.classes
          
        })
      }
    })
  },

  /**
   * 学生获取未读反馈消息数量
  */
  studentGetFeedBackNotiCount: function () {
    let that = this
    let prarms = {
      "token": wx.getStorageSync("token"),
      "uid": wx.getStorageSync("uid"),
    }
    app.ljjw.getUnreadCount(prarms).then(d=>{
      let status = d.data.status
      if (status == 1) {
        let data = d.data.data
        let count = data.allcount
        if (count && count != '') {
          that.setData({
            feedBackNotiCount: count
          })
        } else {
          that.setData({
            feedBackNotiCount: 0
          })
        }
      } else {
        that.setData({
          feedBackNotiCount: 0
        })
      }
    })
  },

  /**
   * 获取老师待处理反馈数量
  */
 teacherGetFeedBackNotiCount: function () {
  let that = this
  let prarms = {
    "token": wx.getStorageSync("token"),
    "uid": wx.getStorageSync("uid"),
  }
  app.ljjw.getTeacherUnreadCount(prarms).then(d=>{
    let status = d.data.status
    if (status == 1) {
      let data = d.data.data

      that.setData({
        teacherNotDealCount: data
      })
    } else {
      that.setData({
        teacherNotDealCount: 0
      })
    }
  })
},

  // ------------------------------------------事件-------------------------------------
  /**
   * 学生端 问题反馈 点击事件
  */
  to_feedBack: function(e) {
    // console.log(e)
    let stuinfo = wx.getStorageSync('stuinfo')
    if (!stuinfo || !stuinfo.checked || stuinfo.checked == 0 || !stuinfo.ifused || stuinfo.ifused == 0) {
      wx.showToast({
        title: '暂无权限',
        icon: 'none'
      })
      return
    }
    wx.navigateTo({
      url: '../../pages/feedBack_list/feedBack_list?menu=' + (this.data.feedBackNotiCount == 0 ? 0 : 1),
    })
  },

  /**
   * 反馈处理按钮 点击事件
  */
  to_tea_feedBack: function(e) {
    wx.navigateTo({
      url: '../../pages/tea_feedBack_list/tea_feedBack_list',
    })
  },


  /**
   * 学生端 班级资料 点击事件
  */
  to_student_data: function () {
    let stuinfo = wx.getStorageSync('stuinfo')
    if (!stuinfo || !stuinfo.checked || stuinfo.checked == 0 || !stuinfo.ifused || stuinfo.ifused == 0) {
      wx.showToast({
        title: '暂无权限',
        icon: 'none'
      })
      return
    }
    wx.navigateTo({
      url: '../../pages/tea_data/tea_data?type=1',
    })
  },

  /**
   * 老师端 班级资料 点击事件
  */
  to_tea_data:function(){
    wx.navigateTo({
      url: '../../pages/tea_data/tea_data?type=2',
    })
  },

  /**
   * 学生端 我的收藏 点击事件
  */
  to_class_data: function () {
    let stuinfo = wx.getStorageSync('stuinfo')
    if (!stuinfo || !stuinfo.checked || stuinfo.checked == 0 || !stuinfo.ifused || stuinfo.ifused == 0) {
      wx.showToast({
        title: '暂无权限',
        icon: 'none'
      })
      return
    }
    wx.navigateTo({
      url: '../../pages/class_data/class_data',
    })

  },

  /**
   * 进入公考广播
  */
  to_radio: function() {
    if (this.data.role == 4) {
      let stuinfo = wx.getStorageSync('stuinfo')
      if (!stuinfo || !stuinfo.checked || stuinfo.checked == 0 || !stuinfo.ifused || stuinfo.ifused == 0) {
        wx.showToast({
          title: '暂无权限',
          icon: 'none'
        })
        return
      }
    }
    
    wx.navigateTo({
      url: '../../pages/radioList/radioList',
    })
  },
  
})