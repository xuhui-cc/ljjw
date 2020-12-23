// pages/tea_xsda/tea_xsda.js
const app = getApp()
Page({

  // 数据是否正在提交
  dataSubmiting: false,

  /**
   * 页面的初始数据
   */
  data: {
    aud : 0,
    cates_index:0,
    add_mask:false,
    isfold:true,

    moreActionViewTop: null,
    showMoreActionIndex: null,
    showMoreActionView: false,
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

  onPageScroll: function() {
    if (this.data.showMoreActionIndex != null) {
      this.closeMoreActionView()
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

  

  input_condition:function(e){
    let that = this
    // console.log(e.detail.value)
    let value = e.detail.value
    if (value == ' ') {
      value = ''
    }
    that.setData({
      input_condition: value

    })
  },

  

  add_submit:function(){
    if (this.dataSubmiting) {
      return
    }
    this.dataSubmiting = true
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
        that.dataSubmiting = false
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
        that.dataSubmiting = false
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

  //-------------------------------------------私有方法---------------------------------------------------
  /**
   * 展示新增弹框
  */
  add:function(){
    let that = this
    that.setData({
      add_mask:true
    })
  },

  /**
   * 关闭新增视图
  */
  close:function(){
    let that = this
    that.setData({
      add_mask: false,
      input_condition: '',
      showMoreActionIndex: null,
    })
  },

  /**
   * 关闭更多功能按钮视图
  */
  closeMoreActionView: function() {
    this.setData({
      moreActionViewTop: null,
      showMoreActionView: false,
    })
  },
  //----------------------------------------------接口-------------------------------------------------------
  /**
   * 修改学情/概况
  */
  updateStudyInfo: function() {
    if (this.dataSubmiting) {
      return
    }
    this.dataSubmiting = true
    let userinfo = wx.getStorageSync('userInfo')
    let content = this.data.input_condition
    let params = {
      uid: userinfo.uid,
      token: wx.getStorageSync('token'),
      cate_id: this.data.cates[this.data.cates_index].id,
      studyId: this.data.aud == 0 ? this.data.studyinfo[this.data.showMoreActionIndex].id : this.data.condition[this.data.showMoreActionIndex].id,
      type: this.data.aud == 0 ? '1' : '2',
      memo: content
    }
    let that = this
    app.ljjw.jwUpdateStudyInfo(params).then(d=>{
      if (d.data.status == 1) {
        let memoStr = ''
        if (that.data.aud == 0) {
          // 学情
          memoStr = 'studyinfo[' + that.data.showMoreActionIndex + '].memo' 
        } else if(that.data.aud == 1) {
          // 概况
          memoStr = 'condition[' + that.data.showMoreActionIndex + '].memo'
        }
        that.setData({
          [memoStr]: content
        })
        that.close()
      }
      that.dataSubmiting = false
    })
  },

  /**
   * 删除 学情/概况 接口
  */
  deleteStudyInfo: function() {
    let userinfo = wx.getStorageSync('userInfo')
    let params = {
      studyId: this.data.aud == 0 ? this.data.studyinfo[this.data.showMoreActionIndex].id : this.data.condition[this.data.showMoreActionIndex].id,
      token: wx.getStorageSync('token'),
      uid: userinfo.uid
    }
    let that = this
    app.ljjw.jwDeleteStudy(params).then(d=>{
      if (d.data.status == 1) {
        if (that.data.aud == 0) {
          // 学情
          that.data.studyinfo.splice(that.data.showMoreActionIndex, 1)
          that.setData({
            studyinfo: that.data.studyinfo
          })
        } else if (that.data.aud == 1) {
          // 概况
          that.data.condition.splice(that.data.showMoreActionIndex, 1)
          that.setData({
            condition: that.data.condition
          })
        }
        wx.showToast({
          title: '删除成功',
          icon: 'none'
        })
      }
      that.setData({
        showMoreActionIndex: null,
      })
    })
  },

  //--------------------------------------------交互事件-------------------------------------------------------

  /**
   * 学情/概况单元格 展示更多功能按钮 点击事件
  */
  moreActionButtonClciked: function(e) {
    let index = e.currentTarget.dataset.index
    let id_Str = "#moreActionButton" + index
    var query = wx.createSelectorQuery();
    var that = this;
    query.select(id_Str).boundingClientRect(function (rect) {
      let top = rect.top
      console.log('top:', top)
      that.setData({
        moreActionViewTop: top,
        showMoreActionIndex: index,
        showMoreActionView: true
      })
    }).exec()
  },

  /**
   * 背景视图 点击事件
  */
  backgroundClicked: function() {
    if (this.data.showMoreActionIndex != null) {
      this.closeMoreActionView()
    }
  },

  /**
   * 编辑按钮 点击事件
  */
  editButtonClciked: function() {
    let index = this.data.showMoreActionIndex
    let userinfo = wx.getStorageSync('userInfo')
    if (this.data.aud == 0) {
      // 学情
      let study_item = this.data.studyinfo[index]
      if (study_item.createuid != userinfo.uid) {
        wx.showToast({
          title: '只能编辑自己发布的学情哦！',
          icon: 'none'
        })
        return
      }
      this.setData({
        input_condition: study_item.memo
      })
    } else if (this.data.aud == 1) {
      // 概况
      let easyInfoItem = this.data.condition[index]
      if (easyInfoItem.createuid != userinfo.uid) {
        wx.showToast({
          title: '只能编辑自己发布的概况哦！',
          icon: 'none'
        })
        return
      }
      this.setData({
        input_condition: easyInfoItem.memo
      })
    }

    this.add()
    this.closeMoreActionView()
  },

  /**
   * 删除按钮 点击事件 
  */
  deleteButtonClciked: function() {
    let index = this.data.showMoreActionIndex
    let title = ''
    let userinfo = wx.getStorageSync('userInfo')
    if (this.data.aud == 0) {
      // 学情
      let study_item = this.data.studyinfo[index]
      if (study_item.createuid != userinfo.uid) {
        wx.showToast({
          title: '只能删除自己发布的学情哦！',
          icon: 'none'
        })
        return
      }
      title = '学情'
    } else if (this.data.aud == 1) {
      // 概况
      let easyInfoItem = this.data.condition[index]
      if (easyInfoItem.createuid != userinfo.uid) {
        wx.showToast({
          title: '只能删除自己发布的概况哦！',
          icon: 'none'
        })
        return
      }
      title = '概况'
    }
    let that = this
    wx.showModal({
      content: '确定删除该条' + title + '吗？',
      success (res) {
        if (res.confirm) {
          // 确定
          that.deleteStudyInfo()
        } else {
          that.setData({
            showMoreActionIndex: null,
          })
        }
      },
      fail (res) {
        that.setData({
          showMoreActionIndex: null,
        })
      }
    })
    this.closeMoreActionView()
  },

  /**
   * 编辑弹框 确定按钮 点击事件
  */
  update_submit: function() {
    if (!this.data.input_condition || this.data.input_condition.length == 0) {
      return
    }
    this.updateStudyInfo()
  }
})