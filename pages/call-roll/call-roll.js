// pages/call-roll/call-roll.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    stu_situ: ['到课', '迟到', '旷课',  '请假', '离校'],
    stu_situ_index:0,
    submit:[],
    // unsigned:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    var i = 0
    var sid = options.sid
    that.setData({
      sid:sid
    })
    var params = {
      "token": wx.getStorageSync("token"),
      "uid": wx.getStorageSync("uid"),
      "sid": sid
    }
    console.log(params)
    app.ljjw.jwTeacherClassSignIn(params).then(d => {
      console.log(d)
      if (d.data.status == 1) {
        that.setData({
          tea_info: d.data.data.info,
          students_signed: d.data.data.students_signed,
          students_unsigned: d.data.data.students_unsigned
        })

        
        for (i; i < d.data.data.students_unsigned.length;i++){
          var cs = "students_unsigned[" + i + "].status"
          
          that.setData({
            [cs] : 0
          })
        }
        // that.setData({
        //   students_unsigned : that.data.unsigned
        // })
      }
    })
  },

  stu_situ_picker:function(e){
    let that = this
    var xb = e.currentTarget.dataset.xb
    console.log(xb)
    console.log('picker发送选择改变，携带值为', e.detail.value)
    for(var i = 0; i <= that.data.students_signed.length ;i++){
      if(i == xb){
        var change = "students_signed[" + xb + "].check_status"
        that.setData({
          [change]: e.detail.value
        })
      }
    }
    var newarray = [{
      stu_id: that.data.students_signed[xb].stu_id,
      status: e.detail.value
    }];
    this.setData({
      'submit': this.data.submit.concat(newarray)
    });
    
  },

  stu_unsitu_picker: function (e) {
    let that = this
    var unxb = e.currentTarget.dataset.unxb
    console.log(unxb)
    console.log('unpicker发送选择改变，携带值为', e.detail.value)
    for (var i = 0; i < that.data.students_unsigned.length; i++) {
      if (i == unxb) {
        var change = "students_unsigned[" + unxb + "].status"
        that.setData({
          [change]: e.detail.value
        })
      }
    }

    for (var i = 0; i < that.data.students_unsigned.length;i++){
      var newarray = [{
        stu_id: that.data.students_unsigned[i].stu_id,
        status: that.data.students_unsigned[i].status
      }];
      this.setData({
        'submit': this.data.submit.concat(newarray)
      });
    }
    
  },
  submit:function(){
    let that = this
    var params = {
      "token": wx.getStorageSync("token"),
      "sid": that.data.sid,
      "data": that.data.submit
    }
    console.log(params)
    app.ljjw.jwSaveStudentSignIn(params).then(d => {
      console.log(d)
      if (d.data.status == 1) {
        that.onShow()
        wx.showToast({
          title: '提交成功',
          duration:1500
        })
        
      }
      else {
        wx.showToast({
          title: '提交失败',
          icon:"none",
          duration: 1500
        })
      }
    })
  },

  // change_condition:function(e){
  //   let that = this
  //   var xb = e.currentTarget.dataset.xb
  //   console.log(xb)
  // },

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
    console.log(params)
    app.ljjw.jwTeacherClassSignIn(params).then(d => {
      console.log(d)
      if (d.data.status == 1) {
        that.setData({
          tea_info: d.data.data.info,
          students_signed: d.data.data.students_signed,
          students_unsigned: d.data.data.students_unsigned
        })


        for (i; i < d.data.data.students_unsigned.length; i++) {
          var cs = "students_unsigned[" + i + "].status"

          that.setData({
            [cs]: 0
          })
        }

        console.log("onshow")
        
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
    console.log("hh")
    

    for (var i = 0; i < that.data.students_unsigned.length; i++) {
      var newarray = [{
        stu_id: that.data.students_unsigned[i].stu_id,
        status: that.data.students_unsigned[i].status
      }];
      this.setData({
        'submit': this.data.submit.concat(newarray)
      });
    }
    var params = {
      "token": wx.getStorageSync("token"),
      "sid": that.data.sid,
      "data": that.data.submit
    }
    console.log(params)
    app.ljjw.jwSaveStudentSignIn(params).then(d => {
      console.log(d)
      if (d.data.status == 1) {
        console.log("点名返回键保存成功")

      }
    })
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

  }
})