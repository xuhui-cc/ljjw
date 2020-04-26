// pages/add_leave/add_leave.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    lea_date_arr:[],
    lea_date_arr1: [],
    list:[],
    cs:[],
    cs1: [],
    sel_id : [],
    sel_id1: [],
    qwq:[],
    lea_for:'',
    submit_yes:false
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

  //请假时间选择器
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
      "riqi": that.data.leave_stu_time,
      "type":1
    }
    console.log(params)
    app.ljjw.jwGetDayCourse(params).then(d => {
      if (d.data.status == 1) {
        if (d.data.data != ''){
          that.setData({
            dayCourse: d.data.data
          })
          var newarray1 = [{
            date: e.detail.value,
            hh: []
          }];


          this.setData({
            'lea_date_arr1': this.data.lea_date_arr1.concat(newarray1)
          });
          for (var j = 0; j < that.data.dayCourse.length; j++) {
            var hhh = "dayCourse[" + j + "].xb"
            that.setData({
              [hhh]: false
            })
          }
          console.log("选择日期的课表接口获取成功")
        }
        else{
          wx.showToast({
            title: '选择日期没课哦',
            icon:"none",
            duration:2500
          })
        }
        
      }
    })
    that.setData({
      sel_id:[]
    })
    
    
  //   // console.log(lea_date_arr)
  },

  del_lea:function(e){
    let that = this
    var xb = e.currentTarget.dataset.xb
    var dxb = e.currentTarget.dataset.dxb
    console.log(dxb,xb)
    
    
    for(var i=0;i<that.data.dayCourse.length;i++){
      if (that.data.dayCourse[i].id == that.data.lea_date_arr1[dxb].hh[xb][2]){
        
        console.log(that.data.dayCourse[i].id + "that.data.dayCourse[i].id")
        var cs = "dayCourse[" + i + "].xb"
        that.setData({
          [cs] : false
        })
        
      }
    }
    that.data.lea_date_arr1[dxb].hh.splice(xb, 1)
    that.setData({
      lea_date_arr1: that.data.lea_date_arr1
    })
    for (var i = 0; i < that.data.lea_date_arr1.length; i++) {
      if (that.data.lea_date_arr1[i].hh == '') {
        that.data.lea_date_arr1.splice(i, 1)
      }
    }
    that.setData({
      lea_date_arr1: that.data.lea_date_arr1
    })

    if (that.data.lea_for != '' && that.data.lea_date_arr1 != '') {
      for (var i = 0; i < that.data.lea_date_arr1.length; i++) {
        if (that.data.lea_date_arr1[i].hh != '') {
          that.setData({
            submit_yes: true
          })
        } else {
          that.setData({
            submit_yes: false
          })
        }

      }
    } else {
      that.setData({
        submit_yes: false
      })
    }
          
  },

  //请假课程选择
  lea_sel:function(e){
    let that = this
    if(that.data.lea_date_arr1 == ''){
      var newarray1 = [{
        date: that.data.leave_stu_time,
        hh: []
      }];


      this.setData({
        'lea_date_arr1': this.data.lea_date_arr1.concat(newarray1)
      });
    }
    
    var index = e.currentTarget.dataset.index;
    for (var j = 0; j < that.data.dayCourse.length; j++){
      if(index == j){
        var hhh = "dayCourse[" + j + "].xb"
        that.setData({
          [hhh] : !that.data.dayCourse[index].xb
        })
        if (that.data.dayCourse[index].xb){
          for (var i = 0; i < that.data.lea_date_arr1.length; i++) {

            if (that.data.leave_stu_time == that.data.lea_date_arr1[i].date) {
              if (that.data.dayCourse[index].xb) {
                that.data.lea_date_arr1[i].hh.push([that.data.dayCourse[index].classtime, that.data.dayCourse[index].title, that.data.dayCourse[index].id])
              }
            }

          }
          
        }
        else {
          for (var i = 0; i < that.data.lea_date_arr1.length; i++) {

            if (that.data.leave_stu_time == that.data.lea_date_arr1[i].date) {
              for (var qq = 0; qq < that.data.lea_date_arr1[i].hh.length; qq++) {
                if (that.data.lea_date_arr1[i].hh[qq][2] == that.data.dayCourse[index].id) {
                  that.data.lea_date_arr1[i].hh.splice(qq, 1)
                }
              }



            }

          }
          for (var i = 0; i < that.data.lea_date_arr1.length; i++) {
            if (that.data.lea_date_arr1[i].hh == '') {
              that.data.lea_date_arr1.splice(i, 1)
            }
          }
        }
        
      }
      
    }
    that.setData({
      lea_date_arr1: that.data.lea_date_arr1
    })
    
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

    
    if (that.data.lea_for != '' && that.data.lea_date_arr1 != '') {
      for (var i = 0; i < that.data.lea_date_arr1.length; i++) {
        if (that.data.lea_date_arr1[i].hh != '') {
          that.setData({
            submit_yes: true
          })
        } else {
          that.setData({
            submit_yes: false
          })
        }

      }
    } else {
      that.setData({
        submit_yes: false
      })
    }
    
  },


  //请假原因填写
  lea_for:function(e){
    let that = this
    console.log(e.detail.value)
    that.setData({
      lea_for: e.detail.value
    })
    if (that.data.lea_for != '' && that.data.lea_date_arr1 != '') {
      for (var i = 0; i < that.data.lea_date_arr1.length; i++) {
        if (that.data.lea_date_arr1[i].hh != '') {
          that.setData({
            submit_yes: true
          })
        } else {
          that.setData({
            submit_yes: false
          })
        }

      }
    } else {
      that.setData({
        submit_yes: false
      })
    }
  },


  
  // 请假提交
  lea_submit:function(){
    let that = this
    for(var i=0;i<that.data.lea_date_arr1.length;i++){
      for(var j=0;j<that.data.lea_date_arr1[i].hh.length;j++){
        // var qwq = []
        that.data.qwq.push(that.data.lea_date_arr1[i].hh[j][2])
        var cs = "lea_date_arr1[" + i +"].id"
        that.setData({
          [cs] : that.data.qwq
        })
      }
      that.setData({
        qwq:[]
      })
      var zh = that.data.lea_date_arr1[i].id.join(",");
      // var id = "lea_date_arr1[" + i + "].cs"
      that.setData({
        [cs]: zh
      })
    }

    
    
    var obj = []
    for (var i = 0; i < that.data.lea_date_arr1.length; i++) {
      var qq = "ojb[" + i + "]." + that.data.lea_date_arr1[i].date
      that.setData({
        [qq]: that.data.lea_date_arr1[i].id
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
      if (d.data.status == 1) {
        that.setData({
          submit_yes: false
        })
        wx.showToast({
          title: '提交成功',
          duration: 2000
        })
        console.log("请假提交成功")
      }
      
    })
    
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

  }
})