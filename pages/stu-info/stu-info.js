// pages/stu-info/stu-info.js
const app = getApp()
Page({

  // 是否正在提交中
  submiting: false,

  // 自定义区域选择器 是否正在滚动
  zonePickerScrolling: false,
  // 临时自定义区域选择器 选中索引
  tempZonePickerValue: null,
  // 是否拒绝授权定位
  rejectLocationAuth: false,

  /**
   * 页面的初始数据
   */
  data: {
    sex: ['请选择', '男', '女'],

    // 班级列表
    stu_class:[],
    // 选择的班级
    stu_class_Selected:null,

    sex_index :0 ,
    graduation_time: '请选择',

    // 是否展示选择图片类型弹框
    showPictureTypeSelect: false,

    // 导航栏标题
    naviTitle: '完善基础信息',

    // 被驳回原因 type为3时获取
    rejectReason: '',

    // 区域列表
    zoneList: [],
    // 选择的区域对象
    zone_selected: null,
    // 是否展示区域选择器
    showZonePicker: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getPageSize()

    let that = this
    var type = options.type
    that.setData({
      type:type
    })
    var userInfo = wx.getStorageSync("userInfo")
    that.setData({
      phone: userInfo.phone
    })
    var date = new Date()
    var cur_year = date.getFullYear()
    // console.log(cur_year)
    var cur_month = date.getMonth() + 1
    // console.log(cur_month)
    var cur_day = date.getDate()
    // console.log(cur_day)
    var cur_date = cur_year + '/' + (cur_month < 10 ? '0' + (cur_month) : cur_month) + '/' + (cur_day < 10 ? '0' + (cur_day) : cur_day)
    console.log(cur_date)
    that.setData({
      cur_date : cur_date
    })

    // 获取区域列表
    this.getZoneList()
    
    switch(that.data.type*1) {
      case 0:
      case 1: {
        // 完善基础信息
        this.setData({
          naviTitle: '完善基础信息'
        })
        break
      }
      case 2: {
        // 修改基础信息
        this.setData({
          naviTitle: '修改基础信息'
        })
        this.getBaseInfo(function(success){
          if (success) {
            that.getClassList()
          }
        })
        break
      }
      case 3: {
        // 重新提交基础信息
        this.setData({
          naviTitle: '重新提交基础信息'
        })
        if(options.checked == 2) {
          this.getRejectRenson()
        }
        
        this.getBaseInfo(function(success){
          if (success) {
            that.getClassList()
          }
        })
        break
      }
    }
  },


  back: function () {
    wx.navigateBack({
      delta: 1  // 返回上一级页面。
    })
  },

  timestampToTime: function (timestamp) {
    var date = new Date(timestamp * 1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
    var Y = date.getFullYear() + '-';
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
    var D = date.getDate() + ' ';
    var h = (date.getHours() < 10 ? '0' + (date.getHours()) : date.getHours()) + ':';
    var m = (date.getMinutes() < 10 ? '0' + (date.getMinutes()) : date.getMinutes());
    var s = date.getSeconds();
    return Y + M;
  },

  

  sex_picker: function (e) {
    let that = this
    console.log('picker发送选择改变，携带值为', e.detail.value)
    that.setData({
      sex_index: e.detail.value
    })
    that.chargeCanSubmit()
  },
  stu_class_picker: function (e) {
    let that = this
    let index = e.detail.value
    let classItem = this.data.stu_class[index]
    that.setData({
      stu_class_Selected: classItem
    })
    // console.log(that.data.input_name, that.data.input_phone, that.data.avatar, that.data.input_school.indexOf("请选择"), that.data.graduation_time, that.data.input_major, that.data.input_email, that.data.sex_index)
    that.chargeCanSubmit()
  },
  graduation_time: function (e) {
    let that = this
    console.log('picker发送选择改变，携带值为', e.detail.value)
    that.setData({
      graduation_time: e.detail.value
    })
    that.chargeCanSubmit()
  },

  input_name:function(e){
    let that = this
    console.log(e.detail.value)
    that.setData({
      input_name: e.detail.value
    })
    if (that.data.input_name == '') {
      that.setData({
        input_name: undefined
      })
    }
    that.chargeCanSubmit()
  },
  input_phone: function (e) {
    let that = this
    console.log(e.detail.value)
    that.setData({
      input_phone: e.detail.value
    })
    if (that.data.input_phone == '') {
      that.setData({
        input_phone: undefined
      })
    }
    that.chargeCanSubmit()
  },
  // input_school: function (e) {
  //   let that = this
  //   console.log(e.detail.value)
  //   that.setData({
  //     input_school: e.detail.value
  //   })
  // },
  to_graduation_school:function(){
    wx.navigateTo({
      url: '../../pages/graduation_school/graduation_school',
    })
  },

  input_major: function (e) {
    let that = this
    console.log(e.detail.value)
    that.setData({
      input_major: e.detail.value
    })
    if (that.data.input_major == ''){
      that.setData({
        input_major: undefined
      })
    }
    that.chargeCanSubmit()
  },
  input_email: function (e) {
    let that = this
    console.log(e.detail.value)
    that.setData({
      input_email: e.detail.value
    })
    if (that.data.input_email == '') {
      that.setData({
        input_email: undefined
      })
    }
    that.chargeCanSubmit()
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
    let that = this
    // if(that.data.type == 0){
      if(this.data.type != 3) {
        var input_school = wx.getStorageSync("input_school")
        if (input_school) {
          input_school = input_school.split(' ').join('')
          that.setData({
            input_school: input_school
          })
          that.chargeCanSubmit()
        }
        else {
          that.setData({
            input_school: input_school
          })
        }
      }
      
    // }
    
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

//----------------------------------------------私有方法--------------------------------------------
  /**
   * 判断是否可以提交
  */
  chargeCanSubmit: function(){
    let that = this
    let issubmit = true
    let reason = ''
    if (!that.data.input_name || that.data.input_name == ''){
      reason = '姓名'
      issubmit = false
    }

    if (!that.data.sex_index || that.data.sex_index == '' || that.data.sex_index == 0) {
      reason = '性别'
      issubmit = false
    }
    
    if (!that.data.input_school || that.data.input_school == '' || that.data.input_school == undefined) {
      reason = '毕业院校'
      issubmit = false
    }

    if (!that.data.graduation_time || that.data.graduation_time == '' || that.data.graduation_time == 0) {
      reason = '毕业时间'
      issubmit = false
    }

    if (!that.data.input_major || that.data.input_major == '') {
      reason = '专业'
      issubmit = false
    }

    if (!that.data.input_email || that.data.input_email == '') {
      reason = '邮箱'
      issubmit = false
    }

    if (that.data.stu_class_Selected == null) {
      reason = '班级'
      issubmit = false
    }

    if (that.data.zone_selected == null) {
      reason = '所属区域'
      issubmit = false
    }

    that.setData({
      issubmit:issubmit
    })
    console.log(that.data.issubmit, reason)
  },

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

  /**
   * 获取当前所在区域
  */
  getCurrentArea: function() {
    let that = this
    wx.getLocation({
      type: 'wgs84',
      success(res) {
        let latitude = res.latitude
        let longitude = res.longitude
        that.getLocalAddress(latitude, longitude, function(success){
          if (!success) {
            that.setData({
              showZonePicker: true
            })
            wx.showToast({
              title: '请选择您所在的区域',
              icon: 'none'
            })
          } else {
            that.getClassList()
          }
        })
      },
      fail(res) {
        that.rejectLocationAuth = true
        that.setData({
          showZonePicker: true
        })
        wx.showToast({
          title: '请选择您所在的区域',
          icon: 'none'
        })
      }
    })
  },

  // --------------------------------------------------接口----------------------------------------
  /**
   * 上传图片
  */
  uploadAvatar: function(path) {
    let that = this
    var token = wx.getStorageSync('token');
    wx.showLoading({
      title: '上传中',
    })
    wx.uploadFile({
      url: app.ljjw.getUploadFileURI(),
      filePath: path,
      name: 'file',
      
      formData: {
        'file': path,
        "token": token,
        "action": "jwUploadAvatar", //action=uploads&authhash=445454554
      },
      header: {
        'content-type': 'multipart/form-data'
      },
      success(r) {
        console.log(r)
        let d = JSON.parse(r.data);
        if(d.status == 1){
          that.setData({
            avatar : d.data
          })
          // console.log(that.data.input_name + "=======that.data.input_name")
          //提交判断
          that.chargeCanSubmit()
          //提交判断结束
        }
        wx.hideLoading({
          success: (res) => {},
        })
      },
      fail (res) {
        console.log('上传失败')
        console.log(res)
        wx.hideLoading({
          success: (res) => {},
        })
      }
    })
  },

  /**
   * 获取基础信息
  */
  getBaseInfo: function(callback) {
    var params = {
      "token": wx.getStorageSync("token"),
      "uid": wx.getStorageSync("uid"),
    }
    let that = this
    app.ljjw.jwGetStudentMainPage(params).then(d => {
      if (d.data.status == 1) {
        let info = d.data.data
        let classItem = info.classes[0]
        classItem.name = classItem.classname
        classItem.id = classItem.class_id

        // 判断选择的区域是哪个
        let zone_selected = null
        for (let i = 0; i < that.data.zoneList.length; i++) {
          let zone = that.data.zoneList[i]
          if(zone.id == info.jw_zoneID) {
            zone_selected = zone
            break
          }
        }
        
        that.setData({
          madata: info,
          avatar: info.avatar,
          input_name: info.realname,
          // input_phone: info.phone,
          sex_index: info.sex,
          input_school: info.graduate_school,
          input_major: info.subject,
          input_email: info.email,
          graduation_time: that.timestampToTime(info.graduate_time),
          zone_selected: zone_selected,
          stu_class_Selected: classItem
        })

        that.chargeCanSubmit()
        
        typeof callback == 'function' && callback(true)
      } else {
        typeof callback == 'function' && callback(false)
      }
    })
  },

  /**
   * 获取驳回原因
  */
  getRejectRenson: function() {
    let userinfo = wx.getStorageSync('userInfo')
    let params = {
      token: wx.getStorageSync('token'),
      uid: userinfo.uid
    }
    let that = this
    app.ljjw.jwGetRejection(params).then(d=>{
      if (d.data.status == 1) {
        let reason = d.data.data.rejection
        that.setData({
          rejectReason: reason
        })
      }
    })
  },

  /**
   * 获取区域列表
  */
  getZoneList: function() {
    let params = {
      token: wx.getStorageSync('token')
    }
    let that = this
    app.ljjw.jwZoneList(params).then(d=>{
      if (d.data.status == 1) {
        let zoneList = d.data.data
        that.setData({
          zoneList: zoneList
        })
      }
    })
  },

  /**
   * 基础信息提交
  */
  submit:function(){
    if (this.submiting) {
      return
    }
    this.submiting = true
    let that = this
    if(that.data.issubmit){
      var params = {
        "token": wx.getStorageSync("token"),
        "uid": wx.getStorageSync("uid"),
        "avatar": that.data.avatar,
        "realname": that.data.input_name,
        "phone": that.data.phone,
        "school": that.data.input_school,
        "graduate_time": that.data.graduation_time,
        "subject": that.data.input_major,
        "email": that.data.input_email,
        "class_id": that.data.stu_class_Selected.id,
        "sex": that.data.sex_index,
        type: this.data.type == 3 ? '2' : '1',
        jw_zoneID: this.data.zone_selected.id,
      }
      app.ljjw.jwSaveStudentBaseInfo(params).then(d => {
        that.submiting = false
        if (d.data.status == 1) {
          wx.navigateBack({
            delta: 1  // 返回上一级页面。
          })
        }
      })
    }
  },

  /**
   * 获取班级列表
  */
  getClassList: function() {
    if (!this.data.zone_selected) {
      return
    }
    var params = {
      "token": wx.getStorageSync("token"),
      jw_zoneID: this.data.zone_selected.id
    }
    let that = this
    app.ljjw.jwGetAllClass(params).then(d => {
      if (d.data.status == 1) {
        that.setData({
          stu_class: d.data.data
        })
      } 
    })
  },

  /**
   * 获取当前地址
  */
  getLocalAddress: function(latitude, longitude, callback) {
    let that = this
    app.ljjw.getLoacationAddress(latitude, longitude).then(d=>{
      if(d.data.status == 0) {
        let province = d.data.result.addressComponent.province
        for (let i = 0; i < that.data.zoneList.length; i++) {
          let zone = that.data.zoneList[i]
          if (zone.province == province || province.indexOf(zone.province)) {
            that.setData({
              zone_selected: zone
            })
            break
          }
        }
        if (!that.data.zone_selected) {
          typeof callback == 'function' && callback(false)
        } else {
          typeof callback == 'function' && callback(true)
        }
      } else {
        typeof callback == 'function' && callback(false)
      }
    }).catch(error=>{
      typeof callback == 'function' && callback(false)
    })
  },

  //-------------------------------------------------点击事件---------------------------------------
  /**
   * 导航栏 返回按钮 点击事件
  */
  naviBackClicked : function() {
    wx.navigateBack({
      complete: (res) => {},
    })
  },
  /**
   * 选择头像 点击事件
  */
  chooseImg() {
    this.setData({
      showPictureTypeSelect: true,
    })
    // let that = this;
    // wx.chooseImage({
    //   sourceType: ['album', 'camera'],
    //   success: (res) => {
    //     let tempFilePaths = res.tempFilePaths;
    //     console.log(tempFilePaths)

    //     var token = wx.getStorageSync('token');
    //     wx.uploadFile({
    //       url: app.ljjw.getUploadFileURI(),
    //       filePath: tempFilePaths[0],
    //       name: 'file',
          
    //       formData: {
    //         'file': tempFilePaths[0],
    //         "token": token,
    //         "action": "jwUploadAvatar", //action=uploads&authhash=445454554
    //       },
    //       header: {
    //         'content-type': 'multipart/form-data'
    //       },
    //       success(r) {
    //         console.log(r)
    //         let d = JSON.parse(r.data);
    //         console.log(d.data)
    //         if(d.status == 1){
    //           that.setData({
    //             avatar : d.data
    //           })
    //           // console.log(that.data.input_name + "=======that.data.input_name")
    //           //提交判断
    //           that.chargeCanSubmit()
    //           //提交判断结束
    //         }
    //       }
    //     })
          


        

          
       
    //     }

      
    // })
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
  },

  /**
   * 区域选择器 选择
  */
  zone_picker: function(e) {
    let index = e.detail.value
    let zone = this.data.zoneList[index]
    if(zone.id == this.data.zone_selected.id) {
      return
    }
    this.setData({
      zone_selected: zone,
      stu_class_Selected: null
    })
    this.getClassList()
  },

  /**
   * 区域 点击事件
  */
  areaClicked: function() {
    if(this.data.zone_selected || this.rejectLocationAuth) {
      // 已选择过区域
      if (this.data.type != 3) {
        // 重新提交基础信息时不能修改区域
        this.setData({
          showZonePicker: true
        })
      }
    } else {
      // 未选择过区域
      this.getCurrentArea()
    }
  },

  /**
   * 自定义区域选择器 选中
  */
  customZonePickerChange: function(e) {
    // console.log(e)
    let index = e.detail.value[0]
    this.tempZonePickerValue = index
  },

  /**
   * 自定义区域选择器 开始滚动
  */
  customZonePickerStart: function() {
    this.zonePickerScrolling = true
  },

  /**
   * 自定义区域选择器 结束滚动
  */
  customZonePickerEnd: function() {
    this.zonePickerScrolling = false
  },

  /**
   * 自定义区域选择器 取消按钮 点击事件
  */
  cutomZonePickerCancelButtonClciked: function() {
    this.setData({
      showZonePicker: false
    })
    this.zonePickerScrolling = false
    this.tempZonePickerValue = null
  },

  /**
   * 自定义区域选择器 确定按钮 点击事件
  */
  customZonePickerSureButtonClciked: function() {
    if (this.zonePickerScrolling) {
      return
    }
    let index = this.tempZonePickerValue ? this.tempZonePickerValue : 0
    let zone = this.data.zoneList[index]

    if (!this.data.zone_selected || zone.id != this.data.zone_selected.id) {
      this.setData({
        zone_selected: zone,
        stu_class_Selected: null
      })
      this.getClassList()
      this.chargeCanSubmit()
    }
    this.cutomZonePickerCancelButtonClciked()
  },

  /**
   * 班级 点击事件
  */
  classViewClicked: function() {
    if(this.data.zone_selected) {
      return
    }
    wx.showToast({
      title: '请先选择区域',
      icon: 'none'
    })
  }
})