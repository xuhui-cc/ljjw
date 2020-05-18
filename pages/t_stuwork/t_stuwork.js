// pages/t_stuwork/t_stuwork.js
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

    // 获取导航栏尺寸
    this.setUpNaviSize()

    // 获取 班级考勤数据
    this.initData(options)
  },

  look_stu_datail:function(e){
    let that = this
    var askfor_xb = e.currentTarget.dataset.askfor_xb
    console.log(askfor_xb)
    that.setData({
      askforleave_info: that.data.askforleave[askfor_xb].askforleave_info,
      askforleave_avatar: that.data.askforleave[askfor_xb].avatar,
      stu_detail: true
    })
  },

  clo_mask:function(){
    let that = this
    that.setData({
      stu_detail : false
    })
  },

  // 返回上一页
  go_back: function () {
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
   * 设置自定义导航栏尺寸
  */
  setUpNaviSize: function () {
    let menuButtonRect = wx.getMenuButtonBoundingClientRect()
    let systemInfo = wx.getSystemInfoSync()
    let naviBarHeight = menuButtonRect.bottom+10
    let naviBarWidth = systemInfo.screenWidth
    this.setData ({
      naviBarHeight: naviBarHeight,
      naviBarWidth: naviBarWidth,
      naviBarSelectSub_Height: menuButtonRect.height,
      naviBarSelectSub_Top: menuButtonRect.top,
      bottomButton_Height: systemInfo.screenHeight-systemInfo.safeArea.bottom+(80.0/750*naviBarWidth)
    })
  },

  /**
   * 加载数据 获取班级考勤信息
  */
  initData: function(options) {
    let that = this
    var sid = options.sid
    var classname = options.classname
    that.setData({
      sid: sid,
      classname:classname
    })
    var params = {
      "token": wx.getStorageSync("token"),
      "uid": wx.getStorageSync("uid"),
      "sid": sid
    }
    // console.log(params)
    app.ljjw.jwViewScheduleCheckOn(params).then(d => {
      // console.log(d)
      if (d.data.status == 1) {
        let checkData = d.data.data
        // 正常到课数量
        let normal_num = checkData.normal ? checkData.normal.length : 0
        // 旷课数量
        let cutschool_num = checkData.cutschool ? checkData.cutschool.length : 0
        // 迟到数量
        let later_num = checkData.later ? checkData.later.length : 0
        // 离校数量
        let leaveschool_num = checkData.leaveschool ? checkData.leaveschool.length : 0
        // 请假数量
        let askforleave_num = checkData.askforleave ? checkData.askforleave.length : 0

        that.setData({
          stu_totle: checkData.stucount,
          cutschool: checkData.cutschool,
          later: checkData.later,
          normal: checkData.normal,
          leaveschool: checkData.leaveschool,
          askforleave: checkData.askforleave,

          normal_num: normal_num,
          cutschool_num: cutschool_num,
          later_num: later_num,
          leaveschool_num: leaveschool_num,
          askforleave_num: askforleave_num,

          checkData:checkData
        })
        // console.log(that.data.normal.length)
        // if (that.data.normal){
        //   that.setData({
        //     normal_num: that.data.normal.length,
        //   })
        // }
        // if (that.data.cutschool) {
        //   that.setData({
        //     cutschool_num: that.data.cutschool.length,
        //   })
        // }
        // if (that.data.later) {
        //   that.setData({
        //     later_num: that.data.later.length,
        //   })
        // }
        // if (that.data.leaveschool) {
        //   that.setData({
        //     leaveschool_num: that.data.leaveschool.length,
        //   })
        // }
        // if (that.data.askforleave) {
        //   that.setData({
        //     askforleave_num: that.data.askforleave.length,
        //   })
        // }

      }
      
    })
  },

  /**
   * 复制信息按钮 点击事件
  */
  copyInfoButtonClcked: function(e) {
    let that = this

    // 处理时间戳
    let nowTime = new Date()
    let classDate = new Date(that.data.checkData.riqi*1000)
    let classYear = classDate.getFullYear()
    let classMonth = classDate.getMonth()+1
    let classDay = classDate.getDate()
    var dateStr = classMonth+"月"+classDay+"日"
    if (classYear != nowTime.getFullYear()) {
      dateStr = classYear+"年"+dateStr
    }

    // 拼接字符串
    var copyStr = that.data.classname+" ("+dateStr+that.data.checkData.classtime+")\n"+"班级共"+that.data.stu_totle+"人；\n"+"正常到课"+that.data.normal_num+"人；"
    // 拼接请假人数
    if (that.data.askforleave_num != 0) {
      var nameStr = ''
      for (var i = 0; i < that.data.askforleave.length; i++) {
        let student = that.data.askforleave[i]
        nameStr = nameStr + student.realname
      }
      copyStr = copyStr + "\n请假"+ that.data.askforleave_num + "人："+nameStr
    }
    // 拼接旷课人数
    if (that.data.cutschool_num != 0) {
      var nameStr = ''
      for (var i = 0; i < that.data.cutschool.length; i++) {
        let student = that.data.cutschool[i]
        nameStr = nameStr + student.realname
      }
      copyStr = copyStr + "\n旷课"+ that.data.cutschool_num + "人："+nameStr
    }
    // 拼接迟到人数
    if (that.data.later_num != 0) {
      var nameStr = ''
      for (var i = 0; i < that.data.later.length; i++) {
        let student = that.data.later[i]
        nameStr = nameStr + student.realname
      }
      copyStr = copyStr + "\n迟到"+ that.data.later_num + "人："+nameStr
    }
    // 拼接离校人数
    if (that.data.leaveschool_num != 0) {
      var nameStr = ''
      for (var i = 0; i < that.data.leaveschool.length; i++) {
        let student = that.data.leaveschool[i]
        nameStr = nameStr + student.realname
      }
      copyStr = copyStr + "\n离校"+ that.data.leaveschool_num + "人："+nameStr
    }
    wx.setClipboardData({
      data: copyStr,
    })
  }
})