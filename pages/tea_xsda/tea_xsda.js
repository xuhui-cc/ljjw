// pages/tea_xsda/tea_xsda.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    aud : 0,
    cates_index:0,
    add_mask:false,
    isfold:true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    var subject_id = wx.getStorageSync("subject_id")
    that.setData({
      subject_id: subject_id
    })
    var stu_id = options.stu_id
    console.log(stu_id +"stu_id")
    that.setData({
      stu_id: stu_id
    })
    if(that.data.aud ==2){
      var params = {
        "token": wx.getStorageSync("token"),
        "uid": wx.getStorageSync("uid"),    //老师uid
        "stu_id":that.data.stu_id
      }
      console.log(params)
      app.ljjw.jwViewStudentScores(params).then(d => {
        console.log(d)
        if (d.data.status == 1) {
          that.setData({
            student_score: d.data.data
          })
          // console.log(that.data.student_score[0].mock_date.substr(0, 19))
          // for (var i = 0; i < that.data.student_score.length;i++){
          //   for (var j = 0;j < that.data.student_score[i].xc_scoreinfo.length;j++){
          //     var ccs = "student_score[" + i + "].xc_scoreinfo[" + j + "].cateDate[2]"
          //     // console.log(that.data.student_score[i].xc_scoreinfo[j].cateDate[2].toFixed(1))
          //     that.setData({
          //       [ccs]: that.data.student_score[i].xc_scoreinfo[j].cateDate[2].toFixed(1)
          //     })

          //   }
          // }

          console.log("学生档案——成绩获取成功")
        }

      })
    }else if(that.data.aud == 1){
      var params = {
        "token": wx.getStorageSync("token"),
        "uid": wx.getStorageSync("uid"),    //老师uid
        "stu_id": that.data.stu_id
      }
      console.log(params)
      app.ljjw.jwViewStudentSumary(params).then(d => {
        console.log(d)
        if (d.data.status == 1) {
          that.setData({
            condition: d.data.data
          })
          console.log("学生档案——概况获取成功")
        }

      })
      
    } else if (that.data.aud == 0) {
      var params = {
        "token": wx.getStorageSync("token"),
        "uid": wx.getStorageSync("uid"),    //老师uid
        "stu_id": that.data.stu_id
      }
      console.log(params)
      app.ljjw.jwViewStudentStudyInfo(params).then(d => {
        console.log(d)
        if (d.data.status == 1) {
          that.setData({
            studyinfo: d.data.data.studyinfo,
            cates: d.data.data.cates,
          })
          console.log("学生档案——学情获取成功")
        }

      })
      console.log("我是学生档案学情")
    }
  },

  back: function () {
    wx.navigateBack({
      delta: 1  // 返回上一级页面。
    })
  },

  score_fold:function(){
    let that = this
    that.setData({
      isfold:!that.data.isfold
    })
  },


  aud_select: function (e) {
    let that = this
    var aud = e.currentTarget.dataset.aud
    that.setData({
      aud: aud
    })
    if(that.data.aud == 0){
      var params = {
        "token": wx.getStorageSync("token"),
        "uid": wx.getStorageSync("uid"),    //老师uid
        "stu_id": that.data.stu_id
      }
      console.log(params)
      app.ljjw.jwViewStudentStudyInfo(params).then(d => {
        console.log(d)
        if (d.data.status == 1) {
          that.setData({
            studyinfo: d.data.data.studyinfo,
            cates: d.data.data.cates,
          })
          console.log("学生档案——学情获取成功")
        }

      })
    } else if (that.data.aud == 1){
      var params = {
        "token": wx.getStorageSync("token"),
        "uid": wx.getStorageSync("uid"),    //老师uid
        "stu_id": that.data.stu_id
      }
      console.log(params)
      app.ljjw.jwViewStudentSumary(params).then(d => {
        console.log(d)
        if (d.data.status == 1) {
          that.setData({
            condition: d.data.data
          })
          console.log("学生档案——概况获取成功")
        }

      })
    } else if (that.data.aud == 2){
      var params = {
        "token": wx.getStorageSync("token"),
        "uid": wx.getStorageSync("uid"),    //老师uid
        "stu_id": that.data.stu_id
      }
      console.log(params)
      app.ljjw.jwViewStudentScores(params).then(d => {
        console.log(d)
        if (d.data.status == 1) {
          that.setData({
            student_score: d.data.data
          })
          // console.log(that.data.student_score[0].mock_date.substr(0, 19))
          // for (var i = 0; i < that.data.student_score.length; i++) {
          //   for (var j = 0; j < that.data.student_score[i].xc_scoreinfo.length; j++) {
          //     var ccs = "student_score[" + i + "].xc_scoreinfo[" + j + "].cateDate[2]"
          //     // console.log(that.data.student_score[i].xc_scoreinfo[j].cateDate[2].toFixed(1))
          //     that.setData({
          //       [ccs]: that.data.student_score[i].xc_scoreinfo[j].cateDate[2].toFixed(1)
          //     })

          //   }
          // }

          console.log("学生档案——成绩获取成功")
        }

      })
    }
  },

  add:function(){
    let that = this
    that.setData({
      add_mask:true
    })
  },

  close:function(){
    let that = this
    that.setData({
      add_mask: false
    })
  },

  input_condition:function(e){
    let that = this
    console.log(e.detail.value)
    that.setData({
      input_condition: e.detail.value

    })
  },

  add_submit:function(){
    let that = this
    if (that.data.aud == 0){
      var params = {
        "token": wx.getStorageSync("token"),
        "uid": wx.getStorageSync("uid"),    //老师uid
        "stu_id": that.data.stu_id,
        "type": 1,
        "cate_id": that.data.cates[that.data.cates_index].id,
        "memo": that.data.input_condition
      }
      console.log(params)
      app.ljjw.jwAddStudyInfo(params).then(d => {
        console.log(d)
        if (d.data.status == 1) {
          wx.showToast({
            title: '新建成功',
            duration:1500
          })
        }
        that.setData({
          add_mask: false
        })
        var params = {
          "token": wx.getStorageSync("token"),
          "uid": wx.getStorageSync("uid"),    //老师uid
          "stu_id": that.data.stu_id,
          "cateid": that.data.cates[that.data.cates_index].id
        }
        console.log(params)
        app.ljjw.jwViewStudentStudyInfo(params).then(d => {
          console.log(d)
          if (d.data.status == 1) {
            that.setData({
              studyinfo: d.data.data.studyinfo,
              cates: d.data.data.cates,
            })
            console.log("学生档案——学情获取成功")
          }

        })
      })
    }else if(that.data.aud == 1){
      var params = {
        "token": wx.getStorageSync("token"),
        "uid": wx.getStorageSync("uid"),    //老师uid
        "stu_id": that.data.stu_id,
        "type": 2,
        "memo": that.data.input_condition
      }
      console.log(params)
      app.ljjw.jwAddStudyInfo(params).then(d => {
        console.log(d)
        if (d.data.status == 1) {
          wx.showToast({
            title: '新建成功',
            duration:1500
          })
        }
        that.setData({
          add_mask:false
        })
        that.onLoad()

      })
    }
    
  },


  cates_picker: function (e) {
    let that = this
    console.log('picker发送选择改变，携带值为', e.detail.value)
    that.setData({
      cates_index: e.detail.value
    })
    var params = {
      "token": wx.getStorageSync("token"),
      "uid": wx.getStorageSync("uid"),    //老师uid
      "stu_id": that.data.stu_id,
      "cateid": that.data.cates[that.data.cates_index].id
    }
    console.log(params)
    app.ljjw.jwViewStudentStudyInfo(params).then(d => {
      console.log(d)
      if (d.data.status == 1) {
        that.setData({
          studyinfo: d.data.data.studyinfo,
          cates: d.data.data.cates,
        })
        console.log("学生档案——学情获取成功")
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