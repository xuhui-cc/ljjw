// pages/add_leave/add_leave.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    course: [
        {
          id:5,
          time: '14:00-15:00',
          name: '逻辑推理第1节',
        },
        {
          id: 6,
          time: '15:00-16:00',
          name: '逻辑推理第2节',
        },
      {
        id: 7,
        time: '16:00-17:00',
        name: '逻辑推理第3节',
      },
      {
        id: 8,
        time: '17:00-18:00',
        name: '逻辑推理第4节',
        sel: false
      },
      ],
    lea_date_arr:[],
    list:[],
    cs:[],
    sel_id : []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    var date = new Date()
    var cur_year = date.getFullYear()
    var cur_month = date.getMonth() + 1
    var cur_day = date.getDate()
    var cur_date = cur_year + '-' + (cur_month < 10 ? '0' + (cur_month) : cur_month) + '-' + (cur_day < 10 ? '0' + (cur_day) : cur_day)
    console.log(cur_date)
    that.setData({
      cur_date: cur_date
    })
  },

  leave_stu_time: function (e) {
    let that = this

    console.log('picker发送选择改变，携带值为', e.detail.value)
    var newarray = [{
      date: e.detail.value,
      id: []
    }];


    this.setData({
      'lea_date_arr': this.data.lea_date_arr.concat(newarray)
    });
    that.setData({
      leave_stu_time: e.detail.value
    })
    var params = {
      "token": wx.getStorageSync("token"),
      "uid": wx.getStorageSync("uid"),
      "riqi": that.data.leave_stu_time
    }
    console.log(params)
    app.ljjw.jwGetDayCourse(params).then(d => {
      if (d.data.status == 1) {
        that.setData({
          dayCourse: d.data.data
        })
        console.log(that.data.dayCourse)
      }
    })
    that.setData({
      sel_id:[]
    })
    
    
  //   // console.log(lea_date_arr)
  },

  lea_sel:function(e){
    let that = this
    
    var index = e.currentTarget.dataset.index;
    // var hh = "course[" + index + "].xb"
    // for (var i = 0; i < that.data.course.length; i++) {
    //   that.setData({
    //     [hh]: false
    //   })
    // }
    for (var j = 0; j < that.data.dayCourse.length; j++){
      if(index == j){
        var hhh = "dayCourse[" + j + "].xb"
        that.setData({
          [hhh] : true
        })
      }
    }
    console.log(index)
    that.data.cs.push([that.data.dayCourse[index].classtime])
    console.log(that.data.cs)
    that.data.sel_id.push([that.data.dayCourse[index].id])
    var zh = that.data.sel_id.toString()
    console.log(zh)


    var cccs = that.data.lea_date_arr.length - 1

    var jj = "lea_date_arr[" + cccs + "].id"
    that.setData({
      [jj] : zh
    })
    
  },

  lea_for:function(e){
    let that = this
    console.log(e.detail.value)
    that.setData({
      lea_for: e.detail.value
    })

  },

  lea_submit:function(){
    let that = this
    var obj = []
    for (var i = 0; i < that.data.lea_date_arr.length; i++) {
      var qq = "ojb[" + i + "]." + that.data.lea_date_arr[i].date
      that.setData({
        [qq]: that.data.lea_date_arr[i].id
      })
    }
    // console.log(JSON.stringify(that.data.obj))
    var date_ids = JSON.stringify(that.data.ojb)
    console.log(date_ids)
    
    var params = {
      "token": wx.getStorageSync("token"),
      "uid": wx.getStorageSync("uid"),
      "date_ids": date_ids,
      "reason": that.data.lea_for
    }
    console.log(params)
    app.ljjw.jwSaveAskforleave(params).then(d => {
      // if (d.data.status == 1) {
      //   that.setData({
      //     dayCourse: d.data.data
      //   })
      //   console.log(that.data.dayCourse)
      // }
      wx.showToast({
        title: '提交成功',
        duration: 2000
      })
    })
    
    // wx.navigateBack({
    //   url: "../../pages/index/index"
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

  }
})