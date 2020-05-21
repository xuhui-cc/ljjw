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

    this.setUpNaviSize()

    let that = this
    var subject = wx.getStorageSync("subject")
    that.setData({
      subject: subject
    })
    
    console.log(that.data.subject)
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
          for (var i = 0; i < that.data.student_score.length;i++){
            console.log("家插入")
            var cs = "student_score[" + i + "].isfold"
            that.setData({
              [cs] : false
            })
          }
          

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
          
          for(var i=0;i<that.data.cates.length;i++){
            var cs = "cates[" + i + "].com"
            that.setData({
              [cs]:false
            })
          }
          for(var n=0;n<that.data.subject.length;n++){
            if(that.data.cates[that.data.cates_index].id == that.data.subject[n].id){
              var cscs = "cates[" + that.data.cates_index + "].com"
              that.setData({
                [cscs]:true
              })
            }
          }
          that.setData({
            cscs: that.data.cates
          })
          console.log(that.data.cates_index + "that.data.cates_index")
          console.log(that.data.cates)
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

  score_fold:function(e){
    let that = this
    var xb = e.currentTarget.dataset.xb
    console.log(xb)
    var cs = "student_score[" + xb + "].isfold"
    that.setData({
      [cs]: !that.data.student_score[xb].isfold
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
          for (var i = 0; i < that.data.cates.length; i++) {
            var cs = "cates[" + i + "].com"
            that.setData({
              [cs]: false
            })
          }
          for (var n = 0; n < that.data.subject.length; n++) {
            if (that.data.cates[that.data.cates_index].id == that.data.subject[n].id) {
              var cscs = "cates[" + that.data.cates_index + "].com"
              that.setData({
                [cscs]: true
              })
            }
          }
          that.setData({
            cscs: that.data.cates
          })
          console.log(that.data.cates_index + "that.data.cates_index")
          console.log(that.data.cates)
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
          for (var i = 0; i < that.data.student_score.length; i++) {
            console.log("家插入")
            var cs = "student_score[" + i + "].isfold"
            that.setData({
              [cs]: false
            })
          }

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
          // that.setData({
          //   input_condition:''
          // })
        }
        that.setData({
          add_mask: false,
          input_condition: ''
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
            for (var i = 0; i < that.data.cates.length; i++) {
              var cs = "cates[" + i + "].com"
              that.setData({
                [cs]: false
              })
            }
            for (var n = 0; n < that.data.subject.length; n++) {
              if (that.data.cates[that.data.cates_index].id == that.data.subject[n].id) {
                var cscs = "cates[" + that.data.cates_index + "].com"
                that.setData({
                  [cscs]: true
                })
              }
            }
            that.setData({
              cscs:that.data.cates
            })
            console.log(that.data.cates_index + "that.data.cates_index")
            console.log(that.data.cates)
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
          add_mask: false,
          input_condition: ''
        })
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
        for (var i = 0; i < that.data.cates.length; i++) {
          var cs = "cates[" + i + "].com"
          that.setData({
            [cs]: false
          })
        }
        for (var n = 0; n < that.data.subject.length; n++) {
          if (that.data.cates[that.data.cates_index].id == that.data.subject[n].id) {
            var cscs = "cates[" + that.data.cates_index + "].com"
            that.setData({
              [cscs]: true
            })
          }
        }
        that.setData({
          cscs: that.data.cates
        })
        console.log(that.data.cates_index + "that.data.cates_index")
        console.log(that.data.cates)
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
    let that = this
    var subject = wx.getStorageSync("subject")
    that.setData({
      subject: subject
    })
    // var stu_id = options.stu_id
    // console.log(stu_id + "stu_id")
    // that.setData({
    //   stu_id: stu_id
    // })
    if (that.data.aud == 2) {
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


          console.log("学生档案——成绩获取成功")
        }

      })
    } else if (that.data.aud == 1) {
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
          for (var i = 0; i < that.data.cates.length; i++) {
            var cs = "cates[" + i + "].com"
            that.setData({
              [cs]: false
            })
          }
          for (var n = 0; n < that.data.subject.length; n++) {
            if (that.data.cates[that.data.cates_index].id == that.data.subject[n].id) {
              var cscs = "cates[" + that.data.cates_index + "].com"
              that.setData({
                [cscs]: true
              })
            }
          }
          that.setData({
            cscs: that.data.cates
          })
          console.log(that.data.cates_index + "that.data.cates_index")
          console.log(that.data.cates)
          console.log("学生档案——学情获取成功")
        }

      })
      console.log("我是学生档案学情")
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

  /**
   * 设置自定义导航栏尺寸
   */
  setUpNaviSize: function () {
    var menuButtonRect = wx.getMenuButtonBoundingClientRect()
    let systemInfo = wx.getSystemInfoSync()
    let naviBarHeight = menuButtonRect.bottom+10
    let naviBarWidth = systemInfo.screenWidth
    
    this.setData ({
      naviBarHeight: naviBarHeight,
      naviBarWidth: naviBarWidth,
      naviBarSelectSub_Height: menuButtonRect.height,
      naviBarSelectSub_Top: menuButtonRect.top,
      stateBarHeight: systemInfo.statusBarHeight
    })
  },
})