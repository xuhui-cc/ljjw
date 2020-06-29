// pages/call-roll/call-roll.js
const app = getApp()
Page({

  // 是否正在提交数据
  dataSubmiting: false,
  // 准备提交的数据
  sumitDataDic: {},
  /**
   * 页面的初始数据
   */
  data: {
    stu_situ: ['到课', '迟到', '旷课',  '请假', '离校'],
    stu_situ_index:0,
    submit:[],
    // unsigned:[]
  },

  back: function () {
    let that = this
    that.submitData(2, function(success, msg){
      if (success) {
        wx.showToast({
          title: '提交成功',
          duration:1500
        })
        
        console.log("点名返回键,保存成功")
      }
    })
    wx.navigateBack({
      delta: 1  // 返回上一级页面。
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this

    that.setUpNaviSize()

    var sid = options.sid
    that.setData({
      sid:sid
    })
  },


  // 已标注学生状态更改
  stu_situ_picker:function(e){
    let that = this
    var xb = e.currentTarget.dataset.xb
    console.log(xb)
    console.log('picker发送选择改变，携带值为', e.detail.value)

    var change = "students_signed[" + xb + "].check_status"
    that.setData({
      [change]: e.detail.value
    })

    let student = that.data.students_signed[xb]
    that.sumitDataDic[student.stu_id] = student

    // var newarray = [{
    //   stu_id: that.data.students_signed[xb].stu_id,
    //   status: e.detail.value
    // }];
    // this.setData({
    //   'submit': this.data.submit.concat(newarray)
    // });
    
  },


  // 未标注学生状态更改
  stu_unsitu_picker: function (e) {
    let that = this
    var unxb = e.currentTarget.dataset.unxb
    console.log(unxb)
    console.log('unpicker发送选择改变，携带值为', e.detail.value)

    var change = "students_unsigned[" + unxb + "].check_status"
    that.setData({
      [change]: e.detail.value
    })

    let student = that.data.students_unsigned[unxb]
    that.sumitDataDic[student.stu_id] = student

    // for (var i = 0; i < that.data.students_unsigned.length;i++){
    //   var newarray = [{
    //     stu_id: that.data.students_unsigned[i].stu_id,
    //     status: that.data.students_unsigned[i].status
    //   }];
    //   this.setData({
    //     'submit': this.data.submit.concat(newarray)
    //   });
    // }
    
  },
  submit:function(){
    let that = this

    that.submitData(1, function(success, msg){
      if (success) {
        wx.showToast({
          title: '提交成功',
          duration:1500 
        })
        wx.navigateBack({
          delta: 1  // 返回上一级页面。
        })
      }
    })

    // var submit = JSON.stringify(that.data.submit)
    // var params = {
    //   "token": wx.getStorageSync("token"),
    //   "sid": that.data.sid,
    //   "data": submit
    // }
    // console.log(params)
    // app.ljjw.jwSaveStudentSignIn(params).then(d => {
    //   console.log(d)
    //   if (d.data.status == 1) {
    //     // that.onShow()
    //     wx.showToast({
    //       title: '提交成功',
    //       duration:1500
    //     })
    //     wx.navigateBack({
    //       delta: 1  // 返回上一级页面。
    //     })
        
    //   }
    //   else {
    //     console.log(d.data.msg)
    //     wx.showToast({
    //       title: '提交失败',
    //       icon:"none",
    //       duration: 1500
    //     })
    //   }
    // })
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
    var i = 0
    var params = {
      "token": wx.getStorageSync("token"),
      "uid": wx.getStorageSync("uid"),
      "sid": that.data.sid
    }
    // console.log(params)
    app.ljjw.jwTeacherClassSignIn(params).then(d => {
      // console.log(d)
      if (d.data.status == 1) {

        let data = d.data.data

        // 处理老师头像
        let classInfo = data.info
        if (!classInfo.avatar || classInfo.avatar.indexOf("http") == -1) {
          classInfo.avatar = '../../images/avatar_null.png'
        }

        for (var i=0; i < data.students_unsigned.length;i++){
          let student = data.students_unsigned[i]
          student.check_status = 0
          that.sumitDataDic[student.stu_id] = student
          // 处理未标注学生头像
          if (!student.avatar || student.avatar.indexOf('http') == -1) {
            student.avatar = '../../images/avatar_null.png'
          }
        }
        for (var i = 0; i < data.students_signed.length; i++) {
          let student = data.students_signed[i]
          // 处理已标注学生头像
          if (!student.avatar || student.avatar.indexOf('http') == -1) {
            student.avatar = '../../images/avatar_null.png'
          }
        }

        that.setData({
          tea_info: classInfo,
          students_signed: data.students_signed,
          students_unsigned: data.students_unsigned
        })
      }
    })
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
    let that = this

    
    // console.log("hh")
    

    // for (var i = 0; i < that.data.students_unsigned.length; i++) {
    //   var newarray = [{
    //     stu_id: that.data.students_unsigned[i].stu_id,
    //     status: that.data.students_unsigned[i].status
    //   }];
    //   this.setData({
    //     'submit': this.data.submit.concat(newarray)
    //   });
    // }
    // var submit = JSON.stringify(that.data.submit)
    // var params = {
    //   "token": wx.getStorageSync("token"),
    //   "sid": that.data.sid,
    //   "data": submit
    // }
    
    // console.log(params)
    // app.ljjw.jwSaveStudentSignIn(params).then(d => {
    //   console.log(d)
    //   console.log("请求执行")
    //   if (d.data.status == 1) {
    //     wx.showToast({
    //       title: '提交成功',
    //       duration:1500
    //     })
        
    //     console.log("点名返回键,保存成功")

    //   }
    //   else{
    //     wx.showToast({
    //       title: d.data.msg,
    //       icon:"none",
    //       duration:2000
    //     })
    //   }
    // })
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
   * 设置自定义导航栏尺寸
  */
  setUpNaviSize: function () {
    var menuButtonRect = wx.getMenuButtonBoundingClientRect()
    let naviBarHeight = menuButtonRect.bottom+10
    let naviBarWidth = wx.getSystemInfoSync().screenWidth
    this.setData ({
      naviBarHeight: naviBarHeight,
      naviBarWidth: naviBarWidth,
      naviBarSelectSub_Height: menuButtonRect.height,
      naviBarSelectSub_Top: menuButtonRect.top
    })
  },

  /**
   * 提交数据
   * type 1-提交按钮 2-返回
  */
  submitData: function(type, cb) {
    let that = this
    // console.log("hh")
    if (this.dataSubmiting) {
      return
    }
    this.dataSubmiting = true

    // for (var i = 0; i < that.data.students_unsigned.length; i++) {
    //   var newarray = [{
    //     stu_id: that.data.students_unsigned[i].stu_id,
    //     status: that.data.students_unsigned[i].status
    //   }];
    //   this.setData({
    //     'submit': this.data.submit.concat(newarray)
    //   });
    // }

    let submitStudentArray = Object.values(that.sumitDataDic)
    if (submitStudentArray.length == 0) {
      if (type == 1) {
        wx.showToast({
          title: '暂未更改标注',
          icon: 'none'
        })
      }
      return
    }

    var submitArray = []
    for (var i = 0; i < submitStudentArray.length; i++) {
      let student = submitStudentArray[i]
      let submitData = {
        stu_id: student.stu_id,
        status: student.check_status
      }
      submitArray.push(submitData)
    }

    var submit = JSON.stringify(submitArray)
    var params = {
      "token": wx.getStorageSync("token"),
      "sid": that.data.sid,
      "data": submit
    }

    // console.log(params)
    app.ljjw.jwSaveStudentSignIn(params).then(d => {
      // console.log(d)
      // console.log("请求执行")
      if (d.data.status == 1) {
        typeof cb == "function" && cb(true, "提交成功")
      }
      else{
        typeof cb == "function" && cb(false, d.data.msg)
      }
      that.dataSubmiting = false
    })
  }
})