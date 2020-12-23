// pages/stu-info/stu-info.js
const app = getApp()
Page({

  submiting: false,

  /**
   * 页面的初始数据
   */
  data: {
    sex: ['请选择', '男', '女'],
    stu_class:[],
    stu_class_index:-1,
    sex_index :0 ,
    graduation_time: '请选择',

    // 是否展示选择图片类型弹框
    showPictureTypeSelect: false,

    // 导航栏标题
    naviTitle: '完善基础信息',

    // 被驳回原因 type为3时获取
    rejectReason: '',
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

    var params = {
      "token": wx.getStorageSync("token"),
    }
    console.log(params)
    app.ljjw.jwGetAllClass(params).then(d => {
      if (d.data.status == 1) {
        console.log(d.data.data)
        that.setData({
          stu_class: d.data.data
        })
        console.log(that.data.stu_class)
        console.log("所有班级获取成功")
      } 


    })

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
        this.getBaseInfo()
        break
      }
      case 3: {
        // 重新提交基础信息
        this.setData({
          naviTitle: '重新提交基础信息'
        })
        this.getRejectRenson()
        this.getBaseInfo()
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
    console.log('picker发送选择改变，携带值为', e.detail.value)
    that.setData({
      stu_class_index: e.detail.value
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
        "class_id": that.data.stu_class[that.data.stu_class_index].id,
        "sex": that.data.sex_index,
        type: this.data.type == 3 ? '2' : '1',
      }
      // console.log(params)
      // console.log(that.data.input_school + "that.data.input_school")
      app.ljjw.jwSaveStudentBaseInfo(params).then(d => {
        that.submiting = false
        // console.log(d)
        if (d.data.status == 1) {
          wx.navigateBack({
            delta: 1  // 返回上一级页面。
          })
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
    var issubmit = true
    if (!that.data.input_name || that.data.input_name == ''){
      issubmit = false
    }

    if (!that.data.sex_index || that.data.sex_index == '' || that.data.sex_index == 0) {
      issubmit = false
    }
    
    if (!that.data.input_school || that.data.input_school == '' || that.data.input_school == undefined) {
      issubmit = false
    }

    if (!that.data.graduation_time || that.data.graduation_time == '' || that.data.graduation_time == 0) {
      issubmit = false
    }

    if (!that.data.input_major || that.data.input_major == '') {
      issubmit = false
    }

    if (!that.data.input_email || that.data.input_email == '') {
      issubmit = false
    }

    if (!that.data.stu_class_index || that.data.stu_class_index == '' || that.data.stu_class_index == -1) {
      issubmit = false
    }

    that.setData({
      issubmit:issubmit
    })
    console.log(that.data.issubmit)
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
  getBaseInfo: function() {
    var params = {
      "token": wx.getStorageSync("token"),
      "uid": wx.getStorageSync("uid"),
    }
    let that = this
    app.ljjw.jwGetStudentMainPage(params).then(d => {
      if (d.data.status == 1) {
        if (that.data.type == 2) {
          for(var i=0;i<that.data.stu_class.length;i++){
            if (d.data.data.classes[0].class_id == that.data.stu_class[i].id){
              that.setData({
                stu_class_index: i
              })
            }
          }
        }
        
        that.setData({
          madata: d.data.data,
          avatar: d.data.data.avatar,
          input_name: d.data.data.realname,
          // input_phone: d.data.data.phone,
          sex_index: d.data.data.sex,
          input_school: d.data.data.graduate_school,
          input_major: d.data.data.subject,
          input_email: d.data.data.email,
          graduation_time: that.timestampToTime(d.data.data.graduate_time)
        })

        that.chargeCanSubmit()
        console.log("我的主页接口获取成功")
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
  }
})