//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    type: 2,  //type 1-请假，2-课表，3-考勤
    aud: 0,
    // role: 3,    //role：4 -学生；1 -老师；2 -教务；3 -管理员
    // audoc:true,
    week: ["周日", '周一', '周二', '周三', '周四', '周五', '周六'],
    //当前显示的年
    showYear: null,
    showMonth: null,
    showDay: null,
    nowYear: null,
    nowMonth: null,
    nowDay: null,
    //选中的日
    clickDay: null,
    //当前周数据
    nowWeekData: null,
    //日历是否折叠
    calendarfold: true,
    dot_riqi:[],
    dot_work: [],
    lea_date_arr:[]
  },
  //事件处理函数
  
  onLoad: function () {
    let that = this;
    var role = wx.getStorageSync("role")
    
    if (!role) {
      that.setData({
        role: -1,
        login: flase,
        uid: wx.getStorageSync("uid"),
        userInfo : wx.getStorageSync("userInfo")
      })
    } else {
      that.setData({
        role: role,
        login: true,
        uid: wx.getStorageSync("uid"),
        userInfo: wx.getStorageSync("userInfo")
      })
    }
    console.log("onload")
    //获取当前年份和月份
    let nowTime = new Date();
    let nowYear = nowTime.getFullYear();
    let nowMonth = nowTime.getMonth();
    let nowDay = nowTime.getDate();
    that.getMonthData(nowYear, nowMonth + 1);
    that.setData({
      showYear: nowYear,
      showMonth: nowMonth + 1,
      showDay: nowDay,
      nowYear,
      nowMonth: nowMonth + 1,
      nowDay,
      clickYear: nowYear,
      clickMonth: nowMonth + 1,
      clickDay: nowDay,
      // show_month: nowMonth + 1
    })
    var showym = that.data.showYear + "-" + (that.data.showMonth < 10 ? '0' + (that.data.showMonth) : that.data.showMonth) 
    var nowDate = that.data.nowYear + "-" + (that.data.nowMonth < 10 ? '0' + (that.data.nowMonth) : that.data.nowMonth) + '-' + (that.data.nowDay < 10 ? '0' + (that.data.nowDay) : that.data.nowDay)
    var nowmonth = that.data.nowYear + "-" + (that.data.nowMonth < 10 ? '0' + (that.data.nowMonth) : that.data.nowMonth)
    that.setData({
      nowDate: nowDate,
      nowmonth: nowmonth,
      showym: showym
    })

    for (var i = 0; i < that.data.nowWeekData.length;i++){
      var cs = "nowWeekData[" + i + "][2]"
      var css = "nowWeekData[" + i + "][3]"
      that.setData({
        [cs]:false,
        [css]: 0
      })
    }
    for (var i = 0; i < that.data.weekData.length; i++) {
      for (var j = 0; j < that.data.weekData[i].length;j++){
        var cs = "weekData[" + i + "][" + j + "][2]"
        var css = "weekData[" + i + "][" + j + "][3]"
        that.setData({
          [cs]: false,
          [css]: 0
        })
      }
    }

    if(that.data.role == 4){
      var params = {
        "token": wx.getStorageSync("token"),
        "uid": wx.getStorageSync("uid"),
        "riqi": nowDate
      }
      console.log(params)
      app.ljjw.jwGetDayCourse(params).then(d => {
        if (d.data.status == 1) {
          that.setData({
            dayCourse: d.data.data
          })
          for(var i=0;i<that.data.dayCourse.length;i++){
            var end1 = that.data.dayCourse[i].classtime.substr(8, 5)
            var end = that.data.dayCourse[i].riqi + " " + end1
            // console.log(end + "=============end")
            var aa = Date.parse(end)
            // console.log(aa +"++++++==========aa")
            
            var timestamp = Date.parse(new Date());
            // console.log(timestamp + "now")
            if (aa < timestamp){
              var comp = "dayCourse[" + i + "].comp"
              that.setData({
                [comp]: false
              })
            }
            else{
              var comp = "dayCourse[" + i + "].comp"
              that.setData({
                [comp]: true
              })
            }
            
          }
          console.log(that.data.dayCourse)
        }
      })

      var params = {
        "token": wx.getStorageSync("token"),
        "uid": wx.getStorageSync("uid"),
        "month": nowmonth
      }
      console.log(params)
      app.ljjw.jwGetMonthCourse(params).then(d => {
        if (d.data.status == 1) {
          console.log(d)
          that.setData({
            stu_courselist: d.data.data.info,
            stu_classlist: d.data.data.period_info
          })
          that.cs()
          for (var i = 0; i < that.data.stu_courselist.length; i++) {
            var newarray = [{
              ym: that.data.stu_courselist[i].riqi.substr(0, 7),
              d: that.data.stu_courselist[i].riqi.substr(8, 2)
            }];
            that.setData({
              'dot_riqi': that.data.dot_riqi.concat(newarray)
            });

          }
          console.log(that.data.dot_riqi)

          // 日历点点
          that.dot()
        }
      })
    }
    else if(that.data.role <= 3){
      var params = {
        "token": wx.getStorageSync("token"),
        "uid": wx.getStorageSync("uid"),
        "riqi": nowDate
      }
      console.log(params)
      app.ljjw.jwGetCheckOnList(params).then(d => {
        // console.log(d.data.status)
        if (d.data.status == 1) {
          console.log("或教务")
          console.log(d.data.data)
          that.setData({
            tea_dayCourse: d.data.data.course_list,
            tea_courselist: d.data.data.day_list
          })
          console.log(that.data.tea_dayCourse)
          for(var i=0;i<that.data.tea_courselist.length;i++){
            var newarray = [{
              ym: that.data.tea_courselist[i].riqi.substr(0, 7),
              d: that.data.tea_courselist[i].riqi.substr(8, 2)
            }];
            that.setData({
              'dot_riqi': that.data.dot_riqi.concat(newarray)
            });
            
          }
          console.log(that.data.dot_riqi)

          // 日历点点
          that.dot()
          
          


           
          // console.log(that.data.tea_dayCourse)
        }
      })

      
    }else if(that.data.role == 3){
      if (that.data.type == 1){
        var params = {
          "token": wx.getStorageSync("token"),
          "uid": wx.getStorageSync("uid"),
          "type": 1
        }
        console.log(params)
        app.ljjw.jwAdminGetAskforleaveList(params).then(d => {
          console.log(d)
          if (d.data.status == 1) {
            // that.setData({
            //   dayCourse: d.data.data
            // })
            // console.log(that.data.dayCourse)
          } else {
            that.setData({
              admin_auding_lea: false
            })
          }
          console.log("我是管理员请假待审核")
        })
        
      } 
      
    }




  },

  cs:function(){
    let that = this
    if (that.data.stu_classlist){
    for (var i = 0; i < that.data.stu_classlist.length; i++) {
      var cs = "stu_classlist[" + i + "].class_num"
      var css = "stu_classlist[" + i + "].start"
      var start = Number(that.data.stu_classlist[i].startriqi.substr(8, 2))
      var end = that.data.stu_classlist[i].endriqi.substr(8, 2)
      var class_num = end - start + 1
      console.log(start, end, class_num)
      that.setData({
        [cs]: class_num,
        [css]: start
      })
    }
    var class_cs = []
    for (var i = 0; i < that.data.stu_classlist.length;i++){
      for (var j = that.data.stu_classlist[i].start; j < (that.data.stu_classlist[i].class_num + that.data.stu_classlist[i].start);j++){
        class_cs.push([j,i+1])
        that.setData({
          class_cs: class_cs
        })
      }
    }
    that.class_color()
    }
  },

  dot: function () {
    let that = this
    // 本周
    for (var q = 0; q < that.data.dot_riqi.length; q++) {
      // console.log(that.data.dot_riqi[q])
      if (that.data.dot_riqi[q].ym == that.data.showym) {
        for (var w = 0; w < that.data.nowWeekData.length; w++) {
          if (that.data.dot_riqi[q].d == that.data.nowWeekData[w][0]) {
      // //       console.log(that.data.nowWeekData[w][0])
            var cs = "nowWeekData[" + w + "][2]"

            that.setData({
              [cs]: true
            })

          } else {
            console.log("本周无课")
          }
        }
      }

    }

    // 本月
    for (var q = 0; q < that.data.dot_riqi.length; q++) {
      console.log(that.data.dot_riqi[q])
      if (that.data.dot_riqi[q].ym == that.data.showym) {
        for (var w = 0; w < that.data.weekData.length; w++) {
          for (var e = 0; e < that.data.weekData[w].length; e++) {
            if (that.data.weekData[w][e][1] == "true"){
              if (that.data.dot_riqi[q].d == that.data.weekData[w][e][0]) {
                console.log(that.data.weekData[w][e][0])
                var cs = "weekData[" + w + "][" + e + "][2]"

                that.setData({
                  [cs]: true
                })

              } else {
                console.log(that.data.weekData[w][e][0] + "无课")
              }
            }
            
          }
            
            
          

        }
      }

    }
  },

  dot_work: function () {
    let that = this
    // 本周
    for (var q = 0; q < that.data.dot_work.length; q++) {
      // console.log(that.data.dot_work[q])
      if (that.data.dot_work[q].ym == that.data.showym) {
        for (var w = 0; w < that.data.nowWeekData.length; w++) {
          if (that.data.dot_work[q].d == that.data.nowWeekData[w][0]) {
            console.log(that.data.dot_work[q].d, that.data.nowWeekData[w][0])
            if (that.data.dot_work[q].work != 0 ){
              var cs = "nowWeekData[" + w + "][2]"

              that.setData({
                [cs]: 2
              })
            }else{
              var cs = "nowWeekData[" + w + "][2]"

              that.setData({
                [cs]: 1
              })
            }
            
            

          } 
          else if (that.data.nowWeekData[w][2]  <1) {
            console.log(that.data.dot_work[q].d, that.data.nowWeekData[w][0])
            var cs = "nowWeekData[" + w + "][2]"

            that.setData({
              [cs]: 0
            })
          }
        }
      }

    }

    // 本月
    for (var q = 0; q < that.data.dot_work.length; q++) {
      console.log(that.data.dot_work[q])
      if (that.data.dot_work[q].ym == that.data.showym) {
        for (var w = 0; w < that.data.weekData.length; w++) {
          for (var e = 0; e < that.data.weekData[w].length; e++) {
            if (that.data.weekData[w][e][1] == "true") {
              if (that.data.dot_work[q].d == that.data.weekData[w][e][0]) {
                console.log(that.data.weekData[w][e][0])
                if (that.data.dot_work[q].work == 0){
                  var cs = "weekData[" + w + "][" + e + "][2]"

                  that.setData({
                    [cs]: 1
                  })
                }else{
                  var cs = "weekData[" + w + "][" + e + "][2]"

                  that.setData({
                    [cs]: 2
                  })
                }
                

              } else if (that.data.nowWeekData[w][2] < 1) {
                console.log(that.data.dot_work[q].d, that.data.nowWeekData[w][0])
                var cs = "nowWeekData[" + w + "][2]"

                that.setData({
                  [cs]: 0
                })
              }
            }

          }




        }
      }

    }
  },

  class_color: function () {
    let that = this
    // 本周
    for (var q = 0; q < that.data.class_cs.length; q++) {
      // console.log(that.data.class_cs[q])
     
        for (var w = 0; w < that.data.nowWeekData.length; w++) {
          if (that.data.class_cs[q][0] == that.data.nowWeekData[w][0]) {
            // //       console.log(that.data.nowWeekData[w][0])
            var cs = "nowWeekData[" + w + "][3]"

            that.setData({
              [cs]: that.data.class_cs[q][1]
            })

          } else {
            // console.log("本周无课")
          }
        }
      

    }

    // 本月
    for (var q = 0; q < that.data.class_cs.length; q++) {
      
      
        for (var w = 0; w < that.data.weekData.length; w++) {
          for (var e = 0; e < that.data.weekData[w].length; e++) {
            if (that.data.weekData[w][e][1] == "true") {
              if (that.data.class_cs[q][0] == that.data.weekData[w][e][0]) {
                console.log(that.data.weekData[w][e][0])
                var cs = "weekData[" + w + "][" + e + "][3]"

                that.setData({
                  [cs]: that.data.class_cs[q][1]
                })

              } else {
                // console.log(that.data.weekData[w][e][0] + "无课")
              }
            }

          }




        }
      

    }
  },

  

  menu_select:function(e){
    let that = this
    var type = e.currentTarget.dataset.type
    console.log(type)
    that.setData({
      type : type
    })
    var riqi = ""
    if (that.data.clickDate) {
      riqi = that.data.clickDate
    } else {
      riqi = that.data.nowDate
    }
    if(that.data.role == 4 && type == 3){
      for (var i = 0; i < that.data.nowWeekData.length; i++) {
        var cs = "nowWeekData[" + i + "][2]"
        var css = "nowWeekData[" + i + "][3]"
        that.setData({
          [cs]: false,
          [css]: 0
        })
      }
      for (var i = 0; i < that.data.weekData.length; i++) {
        for (var j = 0; j < that.data.weekData[i].length; j++) {
          var cs = "weekData[" + i + "][" + j + "][2]"
          var css = "weekData[" + i + "][" + j + "][3]"
          that.setData({
            [cs]: false,
            [css]: 0
          })
        }
      }
      //学生某月考勤
      var params = {
        "token": wx.getStorageSync("token"),
        "uid": wx.getStorageSync("uid"),
        "month": that.data.nowmonth
      }
      console.log(params)
      app.ljjw.jwGetMonthCheckon(params).then(d => {
        if (d.data.status == 1) {
          console.log(d)
          if (d.data.data.info){
            that.setData({
              stu_courselist: d.data.data.info,
              stu_classlist: d.data.data.period_info
            })
          }else{
            that.setData({
              stu_courselist: '',
              stu_classlist: d.data.data.period_info
            })
          }
          
          that.cs()
          if (that.data.stu_courselist != ''){
            for (var i = 0; i < that.data.stu_courselist.length; i++) {
              var newarray = [{
                ym: that.data.stu_courselist[i].riqi.substr(0, 7),
                d: Number(that.data.stu_courselist[i].riqi.substr(8, 2)),
                work: Number(that.data.stu_courselist[i].check_status)
              }];
              that.setData({
                'dot_work': that.data.dot_work.concat(newarray)
              });

            }
            console.log(that.data.dot_work)

            // 考勤点点
            that.dot_work()
          }
          
        } else if (d.data.status == -1){
          console.log(d.data.msg)
        }
      })

      //学生当日考勤
      var params = {
        "token": wx.getStorageSync("token"),
        "uid": wx.getStorageSync("uid"),
        "riqi": riqi
      }
      console.log(params)
      app.ljjw.jwGetDayCheckon(params).then(d => {
        if (d.data.status == 1) {
          that.setData({
            dayCheckon: d.data.data
          })
          console.log(that.data.dayCheckon)
        }
        else if (d.data.status == -1) {
          that.setData({
            dayCheckon: ''
          })
          console.log(that.data.dayCheckon)
        }

      })

    }
    else if (that.data.role == 4 && type == 1){
      //学生请假
      var params = {
        "token": wx.getStorageSync("token"),
        "uid": wx.getStorageSync("uid"),
        "type": 0 
      }
      console.log(params)
      app.ljjw.jwGetStudentAskforleave(params).then(d => {
        if (d.data.status == 1) {
          that.setData({
            leave:d.data.data,
            wscs: d.data.data
          })
          for(var i=0;i<that.data.leave.length;i++){
            var fold = "leave[" + i + "].fold"
            that.setData({
              [fold]: true
            })
            for(var j=0;j<that.data.leave[i].ask_info.length;j++){
              var cs = "leave["+ i + "].ask_info[" + j + "].pin"
              var _cs = "leave[" + i + "].ask_info[" + j + "].cs"
              var hh = that.data.leave[i].ask_info[j].classtime + " " + that.data.leave[i].ask_info[j].title
              that.setData({
                [cs]:hh,
                [_cs]:[]
              })
              var date = that.data.leave[i].ask_info[j].date
              
              for (var k = 0; k < that.data.wscs[i].ask_info.length;k++){
                // if (that.data.leave[i].add_arr[k].date == '')
                
                if (date == that.data.wscs[i].ask_info[k].date){
                  that.data.leave[i].ask_info[j].cs.push(that.data.wscs[i].ask_info[k].pin)
                }
                else{
                  
                  
                }
              }
            }
          }

          for(var i=0;i<that.data.leave.length;i++){
            for(var j=0;j<that.data.leave[i].ask_info.length;j++){
              for (var k = 0; k < that.data.leave[i].ask_info[j].cs.length; k++) {
                if (that.data.leave[i].ask_info[j].cs[k] == null){
                  that.data.leave[i].ask_info.splice(j,1)
                }
              }
            }
          }

          that.setData({
            leave:that.data.leave
          })
          

        } else if (d.data.status == -1) {
          console.log(d.data.msg)
        }
      })
    } else if (that.data.role == 4 && type == 2){
      var params = {
        "token": wx.getStorageSync("token"),
        "uid": wx.getStorageSync("uid"),
        "riqi": riqi
      }
      console.log(params)
      app.ljjw.jwGetDayCourse(params).then(d => {
        if (d.data.status == 1) {
          that.setData({
            dayCourse: d.data.data
          })
          for (var i = 0; i < that.data.dayCourse.length; i++) {
            var end1 = that.data.dayCourse[i].classtime.substr(8, 5)
            var end = that.data.dayCourse[i].riqi + " " + end1
            // console.log(end + "=============end")
            var aa = Date.parse(end)
            // console.log(aa +"++++++==========aa")

            var timestamp = Date.parse(new Date());
            // console.log(timestamp + "now")
            if (aa < timestamp) {
              var comp = "dayCourse[" + i + "].comp"
              that.setData({
                [comp]: false
              })
            }
            else {
              var comp = "dayCourse[" + i + "].comp"
              that.setData({
                [comp]: true
              })
            }

          }
          console.log(that.data.dayCourse)
        }
      })
      var params = {
        "token": wx.getStorageSync("token"),
        "uid": wx.getStorageSync("uid"),
        "month": that.data.nowmonth
      }
      console.log(params)
      app.ljjw.jwGetMonthCourse(params).then(d => {
        if (d.data.status == 1) {
          console.log(d)
          that.setData({
            stu_courselist: d.data.data.info,
            stu_classlist: d.data.data.period_info
          })
          that.cs()
          for (var i = 0; i < that.data.stu_courselist.length; i++) {
            var newarray = [{
              ym: that.data.stu_courselist[i].riqi.substr(0, 7),
              d: that.data.stu_courselist[i].riqi.substr(8, 2)
            }];
            that.setData({
              'dot_riqi': that.data.dot_riqi.concat(newarray)
            });

          }
          console.log(that.data.dot_riqi)

          // 日历点点
          that.dot()
        }
      })
    }
    else if (that.data.role == 3 && type == 1) {
      that.admin_askfor()
      
    }
    else if (that.data.role == 2 && type == 1) {
      that.jw_askfor()

    } else if (that.data.role <= 3 && type == 3) {
      
      var params = {
        "token": wx.getStorageSync("token"),
        "uid": wx.getStorageSync("uid"),
        "riqi": riqi
      }
      console.log(params)
      app.ljjw.jwGetCheckOnList(params).then(d => {
        // console.log(d.data.status)
        if (d.data.status == 1) {
          console.log("我是老师或教务")
          console.log(d.data.data)
          that.setData({
            tea_dayCourse: d.data.data.course_list,
            tea_courselist: d.data.data.day_list
          })
          for (var i = 0; i < that.data.tea_courselist.length; i++) {
            var newarray = [{
              ym: that.data.tea_courselist[i].riqi.substr(0, 7),
              d: that.data.tea_courselist[i].riqi.substr(8, 2)
            }];
            that.setData({
              'dot_riqi': that.data.dot_riqi.concat(newarray)
            });
          }
          console.log(that.data.dot_riqi)
          console.log(that.data.tea_dayCourse)
          // 日历点点
          that.dot()
        }
      })

    }

  },

  

  aud_select : function(e){
    let that = this
    var aud = e.currentTarget.dataset.aud
    that.setData({
      aud:aud
    })
    if (aud == 0 && that.data.role == 4){
      //学生请假未审核
      var params = {
        "token": wx.getStorageSync("token"),
        "uid": wx.getStorageSync("uid"),
        "type": 0
      }
      console.log(params)
      app.ljjw.jwGetStudentAskforleave(params).then(d => {
        if (d.data.status == 1) {
          that.setData({
            leave: d.data.data,
            wscs: d.data.data
          })
          for (var i = 0; i < that.data.leave.length; i++) {
            var fold = "leave[" + i + "].fold"
            that.setData({
              [fold]: true
            })
            for (var j = 0; j < that.data.leave[i].ask_info.length; j++) {
              var cs = "leave[" + i + "].ask_info[" + j + "].pin"
              var _cs = "leave[" + i + "].ask_info[" + j + "].cs"
              var hh = that.data.leave[i].ask_info[j].classtime + " " + that.data.leave[i].ask_info[j].title
              that.setData({
                [cs]: hh,
                [_cs]: []
              })
              var date = that.data.leave[i].ask_info[j].date

              for (var k = 0; k < that.data.wscs[i].ask_info.length; k++) {
                // if (that.data.leave[i].add_arr[k].date == '')

                if (date == that.data.wscs[i].ask_info[k].date) {
                  that.data.leave[i].ask_info[j].cs.push(that.data.wscs[i].ask_info[k].pin)
                }
                else {


                }
              }
            }
          }

          for (var i = 0; i < that.data.leave.length; i++) {
            for (var j = 0; j < that.data.leave[i].ask_info.length; j++) {
              for (var k = 0; k < that.data.leave[i].ask_info[j].cs.length; k++) {
                if (that.data.leave[i].ask_info[j].cs[k] == null) {
                  that.data.leave[i].ask_info.splice(j, 1)
                }
              }
            }
          }

          that.setData({
            leave: that.data.leave
          })


        } else if (d.data.status == -1) {
          console.log(d.data.msg)
        }
      })
    }
    else if (aud == 1 && that.data.role == 4){
      //学生请假已审核
      var params = {
        "token": wx.getStorageSync("token"),
        "uid": wx.getStorageSync("uid"),
        "type": 1
      }
      console.log(params)
      app.ljjw.jwGetStudentAskforleave(params).then(d => {
        if (d.data.status == 1) {
          that.setData({
            leave: d.data.data,
            wscs: d.data.data
          })
          for (var i = 0; i < that.data.leave.length; i++) {
            var fold = "leave[" + i + "].fold"
            that.setData({
              [fold]:true
            })
            for (var j = 0; j < that.data.leave[i].ask_info.length; j++) {
              var cs = "leave[" + i + "].ask_info[" + j + "].pin"
              var _cs = "leave[" + i + "].ask_info[" + j + "].cs"
              var hh = that.data.leave[i].ask_info[j].classtime + " " + that.data.leave[i].ask_info[j].title
              that.setData({
                [cs]: hh,
                [_cs]: []
              })
              var date = that.data.leave[i].ask_info[j].date

              for (var k = 0; k < that.data.wscs[i].ask_info.length; k++) {
                // if (that.data.leave[i].add_arr[k].date == '')

                if (date == that.data.wscs[i].ask_info[k].date) {
                  that.data.leave[i].ask_info[j].cs.push(that.data.wscs[i].ask_info[k].pin)
                }
                else {


                }
              }
            }
          }

          for (var i = 0; i < that.data.leave.length; i++) {
            for (var j = 0; j < that.data.leave[i].ask_info.length; j++) {
              for (var k = 0; k < that.data.leave[i].ask_info[j].cs.length; k++) {
                if (that.data.leave[i].ask_info[j].cs[k] == null) {
                  that.data.leave[i].ask_info.splice(j, 1)
                }
              }
            }
          }

          that.setData({
            leave: that.data.leave
          })


        } else if (d.data.status == -1) {
          console.log(d.data.msg)
        }
      })
    } else if (aud == 0 && that.data.role == 3){
      that.admin_askfor()

      
    } else if (aud == 1 && that.data.role == 3){
      that.admin_askfor()

    } else if (aud == 0 && that.data.role == 2) {
      that.jw_askfor()

    } else if (aud == 1 && that.data.role == 2) {
      that.jw_askfor()

    }
  },

  stu_add_leave:function(){
    console.log('add_leave跳转')
    wx.navigateTo({
      url: "../../pages/add_leave/add_leave"
    })
  },

  stu_lea_open:function(e){

    let that = this
    var xb = e.currentTarget.dataset.xb
    console.log(xb)
    var cs = "leave[" + xb + "].fold"
    that.setData({
      [cs]: !that.data.leave[xb].fold
    })
    
  },

  to_call_roll:function(e){
    let that = this
    console.log(e.currentTarget.dataset.tea_index)
    var tea_index = e.currentTarget.dataset.tea_index
    console.log(that.data.tea_dayCourse[tea_index].id)
    wx.navigateTo({
      url: '../../pages/call-roll/call-roll?sid=' + that.data.tea_dayCourse[tea_index].id + '&classname=' + that.data.tea_dayCourse[tea_index].classname,
    })
  },

  to_t_stuwork:function(e){
    let that = this
    console.log(e.currentTarget.dataset.tea_index)
    var tea_index = e.currentTarget.dataset.tea_index
    console.log(that.data.tea_dayCourse[tea_index].id)
    wx.navigateTo({
      url: '../../pages/t_stuwork/t_stuwork?sid=' + that.data.tea_dayCourse[tea_index].id  + '&classname=' + that.data.tea_dayCourse[tea_index].classname,
    })
    
  },

  hm_pass:function(e){
    let that = this
    that.setData({
      type : 1
    })
    var lea_role = e.currentTarget.dataset.role
    var ask_xb = e.currentTarget.dataset.ask_xb
    console.log(lea_role, ask_xb)
    if (lea_role == 3){
      var params = {
        "token": wx.getStorageSync("token"),
        "uid": wx.getStorageSync("uid"),
        "type": 1,
        "ask_id":that.data.admin_unaud_leave[ask_xb].id
      }
      console.log(params)
      app.ljjw.jwAdminAskforleaveVerify(params).then(d => {
        console.log(d)
        if (d.data.status == 1) {
          wx.showToast({
            title: '操作成功',
            duration: 2000
          })

          that.admin_askfor()
        } 
        console.log("我是管理员请假通过")
      })
    } else if (lea_role == 2){
      var params = {
        "token": wx.getStorageSync("token"),
        "uid": wx.getStorageSync("uid"),
        "type": 1,
        "ask_id": that.data.hm_unaud_leave[ask_xb].id
      }
      console.log(params)
      app.ljjw.jwJiaowuAskforleaveVerify(params).then(d => {
        console.log(d)
        if (d.data.status == 1) {

          wx.showToast({
            title: '操作成功',
            duration: 2000
          })
          
          that.jw_askfor()
          

        }
        console.log("我是教务请假通过")
      })
    }
    

  },

  hm_rejest:function(e){
    let that = this

    that.setData({
      type: 1
    })
    var lea_role = e.currentTarget.dataset.role
    var ask_xb = e.currentTarget.dataset.ask_xb

    that.setData({
      hm_rejest : true,
      lea_role: lea_role,
      ask_xb: ask_xb
    })
    
  },

  leafor_reason:function(e){
    let that = this
    console.log(e.detail.value)
    that.setData({
      input_reason: e.detail.value
    })
  },

  reject_pass:function(){
    let that = this
    that.setData({
      type : 1
    })
    if(that.data.lea_role ==3){
      var params = {
        "token": wx.getStorageSync("token"),
        "uid": wx.getStorageSync("uid"),
        "type": 2,
        "ask_id": that.data.admin_unaud_leave[that.data.ask_xb].id,
        "reason" : that.data.input_reason
      }
      console.log(params)
      app.ljjw.jwAdminAskforleaveVerify(params).then(d => {
        console.log(d)
        if (d.data.status == 1) {
          that.setData({
            hm_rejest: false,
          })
          wx.showToast({
            title: '驳回成功',
            duration: 2000
          })

          that.admin_askfor()
          console.log("我是管理员请假驳回成功")
        }
        
      })
    } else if(that.data.lea_role == 2){
      var params = {
        "token": wx.getStorageSync("token"),
        "uid": wx.getStorageSync("uid"),
        "type": 2,
        "ask_id": that.data.hm_unaud_leave[that.data.ask_xb].id,
        "reason": that.data.input_reason
      }
      console.log(params)
      app.ljjw.jwJiaowuAskforleaveVerify(params).then(d => {
        console.log(d)
        if (d.data.status == 1) {
          that.setData({
            hm_rejest: false,
          })
         wx.showToast({
           title: '驳回成功',
           duration:1500
         })
         that.jw_askfor()
          console.log("我是教务请假驳回成功")
        }

      })
    }
  },

  close:function(){
    let that = this
    that.setData({
      hm_rejest: false
    })
  },

  last:function(){
    let that = this
    var showYear, showMonth, showym, showlast
    if (that.data.showMonth == 1){
      showYear = that.data.showYear - 1
      console.log(showYear)
      showMonth = 12
      // that.setData({
      //   showYear: that.data.showYear - 1,
      //   showMonth: 12
      // })
      // that.getMonthData(that.data.showYear, that.data.showMonth);
    }else{
      
      showYear = that.data.showYear
      console.log(showYear)
      showMonth = that.data.showMonth - 1
    }
      // that.setData({
      //   showYear: that.data.showYear ,
      //   showMonth: that.data.showMonth - 1
      // })
      // var showym = that.data.showYear + "-" + (that.data.showMonth < 10 ? '0' + (that.data.showMonth) : that.data.showMonth)
      // that.setData({
      //   show_month: showMonth
      // })
      
      showym = showYear + "-" + (showMonth < 10 ? '0' + (showMonth) : showMonth)
    //   that.setData({
    //     showym: showym
    //   })
    //   that.getMonthData(that.data.showYear, that.data.showMonth);
      showlast = showYear + "-" + (showMonth < 10 ? '0' + (showMonth) : showMonth) + '-' + (that.data.nowDay < 10 ? '0' + (that.data.nowDay) : that.data.nowDay)
    
    if(that.data.role <= 3){
      
      var params = {
        "token": wx.getStorageSync("token"),
        "uid": wx.getStorageSync("uid"),
        "riqi": showlast
      }
      console.log(params)
      app.ljjw.jwGetCheckOnList(params).then(d => {
        // console.log(d.data.status)
        if (d.data.status == 1) {
          console.log("或教务")
          console.log(d.data.data)
          that.setData({
            tea_dayCourse: d.data.data.course_list,
            tea_courselist: d.data.data.day_list
          })
          for (var i = 0; i < that.data.tea_courselist.length; i++) {
            var newarray = [{
              ym: that.data.tea_courselist[i].riqi.substr(0, 7),
              d: that.data.tea_courselist[i].riqi.substr(8, 2)
            }];
            that.setData({
              'dot_riqi': that.data.dot_riqi.concat(newarray)
            });

          }
          console.log(that.data.dot_riqi)

          // 日历点点
          that.dot()





          // console.log(that.data.tea_dayCourse)
        }
      })

    } 
    else if (that.data.role == 4 && that.data.type == 2) {
      var params = {
        "token": wx.getStorageSync("token"),
        "uid": wx.getStorageSync("uid"),
        "month": showym
      }
      console.log(params)
      app.ljjw.jwGetMonthCourse(params).then(d => {
        if (d.data.status == 1) {
          console.log(d)
          if (d.data.data.info != '') {
            that.setData({
              showYear: showYear,
              showMonth: showMonth,
              showlast: showlast,
              showym: showym
            })
            that.getMonthData(that.data.showYear, that.data.showMonth);
            that.setData({
              stu_courselist: d.data.data.info,
              stu_classlist: d.data.data.period_info
            })
            that.cs()
            for (var i = 0; i < that.data.stu_courselist.length; i++) {
              var newarray = [{
                ym: that.data.stu_courselist[i].riqi.substr(0, 7),
                d: that.data.stu_courselist[i].riqi.substr(8, 2)
              }];
              that.setData({
                'dot_riqi': that.data.dot_riqi.concat(newarray)
              });

            }
            console.log(that.data.dot_riqi)
            // 日历点点
            that.dot()
            var params = {
              "token": wx.getStorageSync("token"),
              "uid": wx.getStorageSync("uid"),
              "riqi": showlast
            }
            console.log(params)
            app.ljjw.jwGetDayCourse(params).then(d => {
              if (d.data.status == 1) {
                that.setData({
                  dayCourse: d.data.data
                })
                for (var i = 0; i < that.data.dayCourse.length; i++) {
                  var end1 = that.data.dayCourse[i].classtime.substr(8, 5)
                  var end = that.data.dayCourse[i].riqi + " " + end1
                  // console.log(end + "=============end")
                  var aa = Date.parse(end)
                  // console.log(aa +"++++++==========aa")

                  var timestamp = Date.parse(new Date());
                  // console.log(timestamp + "now")
                  if (aa < timestamp) {
                    var comp = "dayCourse[" + i + "].comp"
                    that.setData({
                      [comp]: false
                    })
                  }
                  else {
                    var comp = "dayCourse[" + i + "].comp"
                    that.setData({
                      [comp]: true
                    })
                  }

                }
                console.log(that.data.dayCourse)
              }
            })
            that.setData({
              calendarfold: false
            })
          }
          else {
            wx.showToast({
              title: '上个月还没有安排哦~',
              icon: "none",
              duration: 1500
            })
          }



        }
      })
    }
    else if (that.data.role == 4 && that.data.type == 3) {
      var params = {
        "token": wx.getStorageSync("token"),
        "uid": wx.getStorageSync("uid"),
        "month": showym
      }
      console.log(params)
      app.ljjw.jwGetMonthCheckon(params).then(d => {
        if (d.data.status == 1) {
          console.log(d)
          if(d.data.data != ''){
            if (d.data.data.info != '') {
              that.setData({
                showYear: showYear,
                showMonth: showMonth,
                showlast: showlast,
                showym: showym
              })
              that.getMonthData(that.data.showYear, that.data.showMonth);
              if (d.data.data.info) {
                that.setData({
                  stu_courselist: d.data.data.info,
                  stu_classlist: d.data.data.period_info
                })
              } else {
                that.setData({
                  stu_courselist: '',
                  stu_classlist: d.data.data.period_info
                })
              }
              that.cs()
              if (that.data.stu_courselist != '') {
                for (var i = 0; i < that.data.stu_courselist.length; i++) {
                  var newarray = [{
                    ym: that.data.stu_courselist[i].riqi.substr(0, 7),
                    d: Number(that.data.stu_courselist[i].riqi.substr(8, 2)),
                    work: Number(that.data.stu_courselist[i].check_status)
                  }];
                  that.setData({
                    'dot_work': that.data.dot_work.concat(newarray)
                  });

                }
                console.log(that.data.dot_work)

                // 考勤点点
                that.dot_work()
              }
              var params = {
                "token": wx.getStorageSync("token"),
                "uid": wx.getStorageSync("uid"),
                "riqi": showlast
              }
              console.log(params)
              app.ljjw.jwGetDayCheckon(params).then(d => {
                if (d.data.status == 1) {
                  that.setData({
                    dayCheckon: d.data.data
                  })
                  console.log(that.data.dayCheckon)
                }
                else if (d.data.status == -1) {
                  that.setData({
                    dayCheckon: ''
                  })
                  console.log(that.data.dayCheckon)
                }
              })
              that.setData({
                calendarfold: false
              })
            }
          }
          
          else {
            wx.showToast({
              title: '上个月还没有安排哦~',
              icon: "none",
              duration: 1500
            })
          }



        }
      })
    }

  },

  next: function () {
    let that = this
    var showYear, showMonth, showym, showlast
    if (that.data.showMonth == 12) {
      showYear = that.data.showYear + 1
      showMonth = 1
      // that.setData({
      //   showYear: that.data.showYear + 1,
      //   showMonth: 1
      // })
      // that.getMonthData(that.data.showYear, that.data.showMonth);
    } else {
      showYear = that.data.showYear
      showMonth = that.data.showMonth + 1
      // that.setData({
      //   showYear: that.data.showYear,
      //   showMonth: that.data.showMonth + 1
      // })
      // var showym = that.data.showYear + "-" + (that.data.showMonth < 10 ? '0' + (that.data.showMonth) : that.data.showMonth)
      // that.setData({
      //   show_month: showMonth
      // })
      showym = showYear + "-" + (showMonth < 10 ? '0' + (showMonth) : showMonth)
      // that.setData({
      //   showym: showym
      // })
      // that.getMonthData(that.data.showYear, that.data.showMonth);
      showlast = showYear + "-" + (showMonth < 10 ? '0' + (showMonth) : showMonth) + '-' + (that.data.nowDay < 10 ? '0' + (that.data.nowDay) : that.data.nowDay)
    }
    if (that.data.role <= 3) {
      
      var params = {
        "token": wx.getStorageSync("token"),
        "uid": wx.getStorageSync("uid"),
        "riqi": showlast
      }
      console.log(params)
      app.ljjw.jwGetCheckOnList(params).then(d => {
        // console.log(d.data.status)
        if (d.data.status == 1) {
          console.log("或教务")
          console.log(d.data.data)
          that.setData({
            tea_dayCourse: d.data.data.course_list,
            tea_courselist: d.data.data.day_list
          })
          for (var i = 0; i < that.data.tea_courselist.length; i++) {
            var newarray = [{
              ym: that.data.tea_courselist[i].riqi.substr(0, 7),
              d: that.data.tea_courselist[i].riqi.substr(8, 2)
            }];
            that.setData({
              'dot_riqi': that.data.dot_riqi.concat(newarray)
            });

          }
          console.log(that.data.dot_riqi)

          // 日历点点
          that.dot()





          // console.log(that.data.tea_dayCourse)
        }
      })

    }
    else if (that.data.role == 4 && that.data.type == 2) {
      var params = {
        "token": wx.getStorageSync("token"),
        "uid": wx.getStorageSync("uid"),
        "month": showym
      }
      console.log(params)
      app.ljjw.jwGetMonthCourse(params).then(d => {
        if (d.data.status == 1) {
          console.log(d)
          if (d.data.data.info != '') {
            that.setData({
              showYear: showYear,
              showMonth: showMonth,
              showlast: showlast,
              showym: showym
            })
            that.getMonthData(that.data.showYear, that.data.showMonth);
            that.setData({
              stu_courselist: d.data.data.info,
              stu_classlist: d.data.data.period_info
            })
            that.cs()
            for (var i = 0; i < that.data.stu_courselist.length; i++) {
              var newarray = [{
                ym: that.data.stu_courselist[i].riqi.substr(0, 7),
                d: that.data.stu_courselist[i].riqi.substr(8, 2)
              }];
              that.setData({
                'dot_riqi': that.data.dot_riqi.concat(newarray)
              });

            }
            console.log(that.data.dot_riqi)
            // 日历点点
            that.dot()
            var params = {
              "token": wx.getStorageSync("token"),
              "uid": wx.getStorageSync("uid"),
              "riqi": showlast
            }
            console.log(params)
            app.ljjw.jwGetDayCourse(params).then(d => {
              if (d.data.status == 1) {
                that.setData({
                  dayCourse: d.data.data
                })
                for (var i = 0; i < that.data.dayCourse.length; i++) {
                  var end1 = that.data.dayCourse[i].classtime.substr(8, 5)
                  var end = that.data.dayCourse[i].riqi + " " + end1
                  // console.log(end + "=============end")
                  var aa = Date.parse(end)
                  // console.log(aa +"++++++==========aa")

                  var timestamp = Date.parse(new Date());
                  // console.log(timestamp + "now")
                  if (aa < timestamp) {
                    var comp = "dayCourse[" + i + "].comp"
                    that.setData({
                      [comp]: false
                    })
                  }
                  else {
                    var comp = "dayCourse[" + i + "].comp"
                    that.setData({
                      [comp]: true
                    })
                  }

                }
                console.log(that.data.dayCourse)
              }
            })
            that.setData({
              calendarfold: false
            })
          }
          else {
            wx.showToast({
              title: '下个月还没有安排哦~',
              icon: "none",
              duration: 1500
            })
          }



        }
      })
    }
    else if (that.data.role == 4 && that.data.type == 3) {
      var params = {
        "token": wx.getStorageSync("token"),
        "uid": wx.getStorageSync("uid"),
        "month": showym
      }
      console.log(params)
      app.ljjw.jwGetMonthCheckon(params).then(d => {
        if (d.data.status == 1) {
          console.log(d)
          if (d.data.data != '') {
            if (d.data.data.info != '') {
              that.setData({
                showYear: showYear,
                showMonth: showMonth,
                showlast: showlast,
                showym: showym
              })
              that.getMonthData(that.data.showYear, that.data.showMonth);
              if (d.data.data.info) {
                that.setData({
                  stu_courselist: d.data.data.info,
                  stu_classlist: d.data.data.period_info
                })
              } else {
                that.setData({
                  stu_courselist: '',
                  stu_classlist: d.data.data.period_info
                })
              }
              that.cs()
              if (that.data.stu_courselist != '') {
                for (var i = 0; i < that.data.stu_courselist.length; i++) {
                  var newarray = [{
                    ym: that.data.stu_courselist[i].riqi.substr(0, 7),
                    d: Number(that.data.stu_courselist[i].riqi.substr(8, 2)),
                    work: Number(that.data.stu_courselist[i].check_status)
                  }];
                  that.setData({
                    'dot_work': that.data.dot_work.concat(newarray)
                  });

                }
                console.log(that.data.dot_work)

                // 考勤点点
                that.dot_work()
              }
              var params = {
                "token": wx.getStorageSync("token"),
                "uid": wx.getStorageSync("uid"),
                "riqi": showlast
              }
              console.log(params)
              app.ljjw.jwGetDayCheckon(params).then(d => {
                if (d.data.status == 1) {
                  that.setData({
                    dayCheckon: d.data.data
                  })
                  console.log(that.data.dayCheckon)
                }
                else if (d.data.status == -1) {
                  that.setData({
                    dayCheckon: ''
                  })
                  console.log(that.data.dayCheckon)
                }
              })
              that.setData({
                calendarfold: false
              })
            }
          }

          else {
            wx.showToast({
              title: '下个月还没有安排哦~',
              icon: "none",
              duration: 1500
            })
          }



        }
      })
    }

    
  },


  getMonthData(year, month) {
    let that = this;
    that.setData({
      showMonth: month,
      showYear: year
    })
    let nowgetdate = new Date();
    let dayData = [];
    let weekData = [];
    let sundayDays = [];
    let dateObj = null;
    //拿到当月有多少天
    let lastDay = new Date(year, month, 0).getDate();

    console.log(year + '年' + month + '月有' + lastDay + '天');
    //找到每个月的星期天,切割数组
    for (let i = 1; i <= lastDay; i++) {
      dayData.push(i);
      dateObj = new Date(`${year}/${month}/${i}`);
      if (dateObj.getDay() == 0) {
        sundayDays.unshift(i);
      }
    }
    // console.log(sundayDays)
    for (let i = 0; i < sundayDays.length; i++) {
      weekData.unshift(dayData.splice(sundayDays[i] - 1, 7))
    }
    
    // console.log(weekData)
    if (dayData.length !== 0) {
      weekData.unshift(dayData);
    }

    //检查首周是否有七天
    let llastDay = new Date(year, month - 1, 0).getDate();
    if (weekData[0].length < 7) {
      let i = 0;
      let firstWeek = weekData[0].reverse();
      
      let item = null;
      let newWeekData = [];
      for (i = 0; i < 7; i++) {
        item = firstWeek[i] || llastDay + firstWeek.length - i;
        if(item< 7){
          newWeekData.unshift([item, "true"])
        }else{
          newWeekData.unshift([item, "false"])
        }
      }
      weekData[0] = newWeekData;
      // console.log(weekData[0])
    }else{
      let newWeekData = [];
      for (let i = 0; i < 7; i++) {
        var item = weekData[0][i]
        newWeekData.push([item, "true"])
      }
      weekData[0] = newWeekData;
    }
    
    for (let cscs = 1; cscs < weekData.length - 1;cscs++){
      let item = null;
      let newWeekData = [];
      for(let hh=0;hh<7;hh++){
        item = weekData[cscs][hh];
        newWeekData.push([item, "true"])
      }
      weekData[cscs] = newWeekData;
    }

    //检查最后一周是否有七天
    if (weekData[weekData.length - 1].length < 7) {
      let i = 0;
      let lastWeek = weekData[weekData.length - 1]
      // console.log(lastWeek )
      let item = null;
      let newWeekData = [];
      for (i = 0; i < 7; i++) {
        item = lastWeek[i] || i - lastWeek.length + 1;
        if (item > 7) {
          newWeekData.push([item, "true"])
        } else {
          newWeekData.push([item, "false"])
        }
      }
      weekData[weekData.length - 1] = newWeekData;
    }else{
      let newWeekData = [];
      for ( let i = 0; i < 7; i++) {
        var item = weekData[weekData.length - 1][i]
      
       newWeekData.push([item, "true"])
      
     
      }
      weekData[weekData.length - 1] = newWeekData;
    }

    that.setData({
      weekData,
    })
    //拿到当前日期的本周数据
    for (let i = 0; i < weekData.length;i++){
      for (let j = 0; j < weekData[i].length; j++){
        // console.log(weekData[i][j][0]  + "============")
        // console.log(new Date().getDate() + "============")
        if (weekData[i][j][1] == "true"){
          if (weekData[i][j][0] == new Date().getDate()) {
            console.log(weekData[i])
            that.setData({
              nowWeekData: weekData[i]
            })
          }
        }
        
      }
     
    }
    if (that.data.nowMonth == that.data.showMonth){
      that.setData({
        showMonth: that.data.showMonth,
        showYear: that.data.showYear
        // show_month: that.data.showMonth
      })
    }
    

  },

  //点击某一天,课表
  clickDay(e) {
    let that = this
    
    if (e.currentTarget.dataset.day === -1) return;
    that.setData({
      showDay: e.currentTarget.dataset.day,
      clickDay: e.currentTarget.dataset.day,
      clickMonth: that.data.showMonth
    })
    // console.log(e.currentTarget.dataset.day1)
    // console.log(that.data.clickYear + "-" + that.data.clickMonth + "-" + that.data.clickDay + "==================clickDate")
    var clickDate = that.data.showYear + "-" + (that.data.showMonth < 10 ? '0' + (that.data.showMonth) : that.data.showMonth) + '-' + (that.data.clickDay < 10 ? '0' + (that.data.clickDay) : that.data.clickDay)
    that.setData({
      clickDate: clickDate
    })

    if(that.data.role == 4 && that.data.type == 2){
      var params = {
        "token": wx.getStorageSync("token"),
        "uid": wx.getStorageSync("uid"),
        "riqi": clickDate
      }
      console.log(params)
      app.ljjw.jwGetDayCourse(params).then(d => {
        if (d.data.status == 1) {
          that.setData({
            dayCourse: d.data.data
          })
          for (var i = 0; i < that.data.dayCourse.length; i++) {
            var end1 = that.data.dayCourse[i].classtime.substr(8, 5)
            var end = that.data.dayCourse[i].riqi + " " + end1
            // console.log(end + "=============end")
            var aa = Date.parse(end)
            // console.log(aa +"++++++==========aa")

            var timestamp = Date.parse(new Date());
            // console.log(timestamp + "now")
            if (aa < timestamp) {
              var comp = "dayCourse[" + i + "].comp"
              that.setData({
                [comp]: false
              })
            }
            else {
              var comp = "dayCourse[" + i + "].comp"
              that.setData({
                [comp]: true
              })
            }

          }
          console.log(that.data.dayCourse)
        }

      })
    }
    else if (that.data.role == 4 && that.data.type == 3){
      //学生当日考勤
      var params = {
        "token": wx.getStorageSync("token"),
        "uid": wx.getStorageSync("uid"),
        "riqi": clickDate
      }
      console.log(params)
      app.ljjw.jwGetDayCheckon(params).then(d => {
        if (d.data.status == 1) {
          that.setData({
            dayCheckon: d.data.data
          })
          console.log(that.data.dayCheckon)
        }
        else if (d.data.status == -1) {
          that.setData({
            dayCheckon: ''
          })
          console.log(that.data.dayCheckon)
        }

      })
    } else if(that.data.role <= 3){
      var params = {
        "token": wx.getStorageSync("token"),
        "uid": wx.getStorageSync("uid"),
        "riqi": clickDate
      }
      console.log(params)
      app.ljjw.jwGetCheckOnList(params).then(d => {
        console.log(d)
        if (d.data.status == 1) {
          that.setData({
            tea_dayCourse: d.data.data.course_list
          })
          console.log(that.data.tea_dayCourse)
        }
      })
      console.log("我是老师或教务某天课表")
    }
    


  },

  //点击某一天,考勤
  clickDay_work(e) {
    let that = this

    if (e.currentTarget.dataset.day === -1) return;
    that.setData({
      showDay: e.currentTarget.dataset.day,
      clickDay: e.currentTarget.dataset.day,
    })
    console.log(e.currentTarget.dataset.day1)
    // console.log(that.data.showYear + "-" + that.data.showMonth + "-" + that.data.clickDay + "==================clickDate")
    var clickDate = that.data.showYear + "-" + (that.data.showMonth < 10 ? '0' + (that.data.showMonth) : that.data.showMonth) + '-' + (that.data.clickDay < 10 ? '0' + (that.data.clickDay) : that.data.clickDay)
    that.setData({
      clickDate: clickDate
    })
    if (that.data.role == 4){
      var params = {
        "token": wx.getStorageSync("token"),
        "uid": wx.getStorageSync("uid"),
        "riqi": clickDate
      }
      console.log(params)
      app.ljjw.jwGetDayCheckon(params).then(d => {
        if (d.data.status == 1) {
          that.setData({
            dayCheckon: d.data.data
          })
          console.log(that.data.dayCheckon)
        }
        else if (d.data.status == -1) {
          that.setData({
            dayCheckon: ''
          })
          console.log(that.data.dayCheckon)
        }

      })
    } else if (that.data.role <= 3) {
      var params = {
        "token": wx.getStorageSync("token"),
        "uid": wx.getStorageSync("uid"),
        "riqi": clickDate
      }
      console.log(params)
      app.ljjw.jwGetCheckOnList(params).then(d => {
        console.log(d)
        if (d.data.status == 1) {
          that.setData({
            tea_dayCourse: d.data.data.course_list
          })
          console.log(that.data.tea_dayCourse)
        }
      })
      console.log("我是老师或教务某天考勤")
    }
    


  },
  
  //折叠日历
  foldAndUnfold() {
    let that = this;
    that.setData({
      calendarfold: !that.data.calendarfold
    })
    // 日历点点
    // that.dot()
  },

  // 已审核折叠
  aud_fold:function(e){
    let that = this
    var aud_xb = e.currentTarget.dataset.aud_xb
    console.log(aud_xb)
    var cs = "hm_aud_leave[" + aud_xb + "].fold"
    that.setData({
      [cs]: !that.data.hm_aud_leave[aud_xb].fold
    })

  },

  admin_aud_fold: function (e) {
    let that = this
    var aud_xb = e.currentTarget.dataset.aud_xb
    console.log(aud_xb)
    var cs = "admin_aud_leave[" + aud_xb + "].fold"
    that.setData({
      [cs]: !that.data.admin_aud_leave[aud_xb].fold
    })

  },

  jw_askfor:function(){
    let that = this
    if(that.data.aud == 0){
      var params = {
        "token": wx.getStorageSync("token"),
        "uid": wx.getStorageSync("uid"),
        "type": 1
      }
      console.log(params)
      app.ljjw.jwJiaowuGetAskforleaveList(params).then(d => {
        console.log(d)
        if (d.data.status == 1) {
          console.log(d)
          that.setData({
            hm_unaud_leave: d.data.data
          })
          console.log(that.data.hm_unaud_leave)
        } else {
          that.setData({
            hm_unaud_leave: ''
          })
        }
        console.log("我是教务请假待审核")
      })
    } else if (that.data.aud == 1){
      var params = {
        "token": wx.getStorageSync("token"),
        "uid": wx.getStorageSync("uid"),
        "type": 2
      }
      console.log(params)
      app.ljjw.jwJiaowuGetAskforleaveList(params).then(d => {
        console.log(d)
        if (d.data.status == 1) {
          that.setData({
            hm_aud_leave: d.data.data
          })
          for (var i = 0; i < that.data.hm_aud_leave.length;i++){
            var cs = "hm_aud_leave[" + i + "].fold"
            that.setData({
              [cs] :false
            })
          }
          console.log(that.data.hm_aud_leave)
        } else {
          that.setData({
            hm_aud_leave: ''
          })
        }
        console.log("教务请假已审核")
      })
    }
    
  },

  admin_askfor: function () {
    let that = this
    if (that.data.aud == 0) {
      var params = {
        "token": wx.getStorageSync("token"),
        "uid": wx.getStorageSync("uid"),
        "type": 1
      }
      console.log(params)
      app.ljjw.jwAdminGetAskforleaveList(params).then(d => {
        console.log(d)
        if (d.data.status == 1) {

          that.setData({
            admin_unaud_leave: d.data.data
          })
          console.log(that.data.admin_unaud_leave)
        } else {
          that.setData({
            admin_unaud_leave: ''
          })
        }
        console.log("我是管理员请假待审核")
      })
    } else if (that.data.aud == 1) {
      var params = {
        "token": wx.getStorageSync("token"),
        "uid": wx.getStorageSync("uid"),
        "type": 2
      }
      console.log(params)
      app.ljjw.jwAdminGetAskforleaveList(params).then(d => {
        console.log(d)
        if (d.data.status == 1) {
          that.setData({
            admin_aud_leave: d.data.data
          })
          for (var i = 0; i < that.data.admin_aud_leave.length; i++) {
            var cs = "admin_aud_leave[" + i + "].fold"
            that.setData({
              [cs]: false
            })
          }
          console.log(that.data.admin_aud_leave)
        } else {
          that.setData({
            admin_aud_leave: ''
          })
        }
        console.log("管理员请假已审核")
      })
    }

  },


  onShow() {
  
    if (typeof this.getTabBar === 'function' &&
      this.getTabBar()) {
      console.log('index_onshow')
      this.getTabBar().setData({
        selected: 0
      })
    }
    else{
      console.log('未执行')
    }

    let that = this
    if (that.data.type == 1){
      var params = {
        "token": wx.getStorageSync("token"),
        "uid": wx.getStorageSync("uid"),
        "type": 0
      }
      console.log(params)
      app.ljjw.jwGetStudentAskforleave(params).then(d => {
        if (d.data.status == 1) {
          that.setData({
            leave: d.data.data,
            wscs: d.data.data
          })
          for (var i = 0; i < that.data.leave.length; i++) {
            var fold = "leave[" + i + "].fold"
            that.setData({
              [fold]: true
            })
            for (var j = 0; j < that.data.leave[i].ask_info.length; j++) {
              var cs = "leave[" + i + "].ask_info[" + j + "].pin"
              var _cs = "leave[" + i + "].ask_info[" + j + "].cs"
              var hh = that.data.leave[i].ask_info[j].classtime + " " + that.data.leave[i].ask_info[j].title
              that.setData({
                [cs]: hh,
                [_cs]: []
              })
              var date = that.data.leave[i].ask_info[j].date

              for (var k = 0; k < that.data.wscs[i].ask_info.length; k++) {
                // if (that.data.leave[i].add_arr[k].date == '')

                if (date == that.data.wscs[i].ask_info[k].date) {
                  that.data.leave[i].ask_info[j].cs.push(that.data.wscs[i].ask_info[k].pin)
                }
                else {


                }
              }
            }
          }

          for (var i = 0; i < that.data.leave.length; i++) {
            for (var j = 0; j < that.data.leave[i].ask_info.length; j++) {
              for (var k = 0; k < that.data.leave[i].ask_info[j].cs.length; k++) {
                if (that.data.leave[i].ask_info[j].cs[k] == null) {
                  that.data.leave[i].ask_info.splice(j, 1)
                }
              }
            }
          }

          that.setData({
            leave: that.data.leave
          })


        } else if (d.data.status == -1) {
          console.log(d.data.msg)
        }
      })
    }
  }
  
})
