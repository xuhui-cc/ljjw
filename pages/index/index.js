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

    // 设置导航栏尺寸
    this.setUpNaviSize()
    
    
  },

  cs:function(){
    let that = this
    // console.log(that.data.stu_classlist)
    if (that.data.stu_classlist){
      var class_cs = []
      for (var i = 0; i < that.data.stu_classlist.length; i++) {
        var stu_class = that.data.stu_classlist[i]

        var start = Number(stu_class.startriqi.substr(8, 2))
        var end = that.data.stu_classlist[i].endriqi.substr(8, 2)
        var class_num = end - start + 1

        stu_class.class_num = class_num
        stu_class.start = start

        for (var j = stu_class.start; j < (stu_class.class_num + stu_class.start);j++){
          class_cs.push([j,i+1])
        }
      }

      that.setData({
        stu_classlist: that.data.stu_classlist,
        class_cs: class_cs
      })
      
      that.class_color()
    }
  },

  dot: function () {
    let that = this
    console.log("------------红点日期-------------")
    console.log(that.data.dot_riqi)
    console.log("-----------nowWeekData----------")
    console.log(that.data.nowWeekData)
    console.log("-------------that.data.showym---------")
    console.log(that.data.showym)
    for (var q = 0; q < that.data.dot_riqi.length; q++) {
      // console.log(that.data.dot_riqi[q])
      var dot_riqi_item = that.data.dot_riqi[q]
      if (dot_riqi_item.ym == that.data.showym) {

        // 本周
        var nowWeekData = that.data.nowWeekData
        for (var w = 0; w < nowWeekData.length; w++) {
          var nowWeekDataItem = nowWeekData[w]
          if (dot_riqi_item.d == nowWeekDataItem[0]) {
            // console.log(that.data.nowWeekData[w][0])
            nowWeekDataItem[2] = true 
          } else {
            // console.log("本周无课")
          }
        }

        // 本月
        for (var w = 0; w < that.data.weekData.length; w++) {
          var weekDataItem = that.data.weekData[w]
          for (var e = 0; e < weekDataItem.length; e++) {
            var weekDataItem_item = weekDataItem[e]
            if (weekDataItem_item[1] == "true"){
              if (dot_riqi_item.d == weekDataItem_item[0]) {
                // console.log(that.data.weekData[w][e][0])
                weekDataItem_item[2] = true

              } else {
                // console.log(weekDataItem_item[0] + "无课")
              }
            }
          }
        }
      }
    }

    console.log("----------------------------------------------------------------------------------------------")
    console.log(nowWeekData)
    that.setData({
      nowWeekData: that.data.nowWeekData,
      weekData: that.data.weekData
    })
  },

  dot_work: function () {
    let that = this
    
    for (var q = 0; q < that.data.dot_work.length; q++) {
      
      // console.log(that.data.dot_work[q])
      var work = that.data.dot_work[q]
      if (work.ym == that.data.showym) {
        // 本周
        var nowWeekData = that.data.nowWeekData
        for (var w = 0; w < nowWeekData.length; w++) {
          var nowWeekDataItem = that.data.nowWeekData[w]
          if (work.d == nowWeekDataItem[0]) {
            // console.log(that.data.dot_work[q].d, that.data.nowWeekData[w][0])
            if (work.work != 0 ){
              nowWeekDataItem[2] = 2
            }else{
              nowWeekDataItem[2] = 1
            }
          } 
          else if (nowWeekDataItem[2]  <1) {
            // console.log(that.data.dot_work[q].d, that.data.nowWeekData[w][0])
            nowWeekDataItem[2] = 0
          }
        }

        // 本月
        for (var w = 0; w < that.data.weekData.length; w++) {
          var weekDataItem = that.data.weekData[w]
          var nowWeekDataItem = that.data.nowWeekData[w]
          for (var e = 0; e < weekDataItem.length; e++) {
            var weekDataItem_item = weekDataItem[e]
            if (weekDataItem[1] == "true") {
              if (work.d == weekDataItem_item[0]) {
                // console.log(that.data.weekData[w][e][0])
                if (work.work == 0){
                  weekDataItem_item[2] = 1
                }else{
                  weekDataItem_item[2] = 2
                }
              } else if (nowWeekDataItem[2] < 1) {
                // console.log(that.data.dot_work[q].d, that.data.nowWeekData[w][0])
                nowWeekDataItem[2] = 0
              }
            }
          }
        }
      }
    }

    that.setData({
      nowWeekData: nowWeekData,
      weekData: that.data.weekData,
    })
  },

  class_color: function () {
    let that = this
    
    for (var q = 0; q < that.data.class_cs.length; q++) {
      // console.log(that.data.class_cs[q])
      var class_cs_item = that.data.class_cs[q]

      // 本周
      for (var w = 0; w < that.data.nowWeekData.length; w++) {
        var nowWeekDataItem = that.data.nowWeekData[w]
        if (class_cs_item[0] == nowWeekDataItem[0]) {
          nowWeekDataItem[3] = class_cs_item[1]

        } else if (!nowWeekDataItem[3]) {
          nowWeekDataItem[3] = -1
        }
      }

      // 本月
      for (var w = 0; w < that.data.weekData.length; w++) {
        var weekDataItem = that.data.weekData[w]
        for (var e = 0; e < weekDataItem.length; e++) {
          var weekDataItem_item = weekDataItem[e]
          if (weekDataItem_item[1] == "true") {
            if (class_cs_item[0] == weekDataItem_item[0]) {
              // console.log(that.data.weekData[w][e][0]  + "===================cs")
              weekDataItem_item[3] = class_cs_item[1]

            } else if (!weekDataItem_item[3]){
              weekDataItem_item[3] = -1
            }
          }
        }
      }
    }
    that.setData({
      nowWeekData: that.data.nowWeekData,
      weekData: that.data.weekData
    })
  },

  

  menu_select:function(e){
    let that = this
    var type = e.currentTarget.dataset.type
    console.log(type)

    if (type == that.data.type) {
      return
    }

    that.setData({
      type : type
    })
    var riqi = ""
    if (that.data.clickDate) {
      riqi = that.data.clickDate
    } else {
      riqi = that.data.nowDate
    }

    that.loadData(type, riqi)
    
  },

  loadData: function(type, riqi){
    let that = this
    let role = that.data.role*1
    console.log("-------------type:"+type+"------------riqi:"+riqi+"---------role:"+role+"-----")

    switch (type*1) {
      case 1: {
        // 请假
        wx.hideTabBar({
          animation: true,
        })

        switch (role) {
          case 1: {
            // 老师
            break
          }
          case 2: {
            // 教务
            that.jw_askfor()
            break
          }
          case 3: {
            // 管理员
            that.admin_askfor()
            break
          }
          case 4: {
            // 学生
            that.studentGetLeaveList(0)
            break
          }
        }
        break
      }
      case 2: {
        // 课表
        wx.showTabBar({
          animation: false,
        })

        switch (role) {
          case 1: {
            // 老师
            that.teacherGetCheckOnList(riqi)
            break
          }
          case 2: {
            // 教务
            that.teacherGetCheckOnList(riqi)
            break
          }
          case 3: {
            // 管理员
            
            // console.log("-------------管理员加载数据---------------")
            break
          }
          case 4: {
            // 学生

            // 获取日课程列表
            that.StudentGetDayCourse(riqi)

            // 学生获取月课程信息
            that.studentGetMonthCourse(that.data.nowmonth)
            
            break
          }
        }
        break
      }
        
      case 3: {
        // 考勤
        wx.showTabBar({
          animation: false,
        })

        switch (role) {
          case 1:
            // 老师
          case 2: 
            // 教务
          case 3: {
            // 管理员
            that.teacherGetCheckOnList(riqi)
            break
          }
          case 4: {
            // 学生

            var nowWeekData = that.data.nowWeekData
            for (var i = 0; i < nowWeekData.length; i++) {
              var week = nowWeekData[i]
              week[2] = false
              week[3] = 0
            }

            var weekData = that.data.weekData
            for (var i = 0; i < weekData.length; i++) {
              var week = weekData[i]
              for (var j = 0; j < week.length; j++) {
                week[j][2] = false
                week[j][3] = 0
              }
            }

            that.setData({
              nowWeekData: nowWeekData,
              weekData: weekData
            })
            //学生某月考勤
            that.studentGetMonthCheckon(that.data.nowMonth)
      
            //学生当日考勤
            that.StudentGetDayCheckon(riqi)
            break
          }
        }
        break
      }
    }

    // 小红点数量
    if (role == 2 || role == 3) {
      var type = 1
      if (role == 3) {
        type = 2
      }
      that.AskforleaveCount(type)
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
      that.studentGetLeaveList(0)
    }
    else if (aud == 1 && that.data.role == 4){
      //学生请假已审核
      that.studentGetLeaveList(1)
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

  /**
   * 教务/管理员 请假申请 审核通过
  */
  hm_pass:function(e){
    let that = this
    that.setData({
      type : 1
    })
    var lea_role = e.currentTarget.dataset.role
    var ask_xb = e.currentTarget.dataset.ask_xb
    console.log(lea_role, ask_xb)
    if (lea_role == 3){

      var cscs = "admin_unaud_leave[" + ask_xb + "].submit"
      that.setData({
        [cscs]: true
      })
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

          var params = {
            "token": wx.getStorageSync("token"),
            "uid": wx.getStorageSync("uid"),
            "type": 2
          }
          console.log(params)
          app.ljjw.jwGetAskforleaveCount(params).then(d => {
            // console.log(d.data.status)
            if (d.data.status == 1) {
              console.log("管理员红点")
              console.log(d.data.data)
              that.setData({
                red_num: d.data.data
              })
              console.log(that.data.red_num + "red_num")



            }
          })

          that.admin_askfor()
        }else{
          var cscs = "admin_unaud_leave[" + ask_xb + "].submit"
          that.setData({
            [cscs]: false
          })
        }
        console.log("我是管理员请假通过")
      })
    } else if (lea_role == 2){
      var cscs = "hm_unaud_leave[" + ask_xb + "].submit"
      that.setData({
        [cscs]: true
      })
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

          var params = {
            "token": wx.getStorageSync("token"),
            "uid": wx.getStorageSync("uid"),
            "type": 1
          }
          console.log(params)
          app.ljjw.jwGetAskforleaveCount(params).then(d => {
            // console.log(d.data.status)
            if (d.data.status == 1) {
              console.log("教务红点")
              console.log(d.data.data)
              that.setData({
                red_num: d.data.data
              })
              console.log(that.data.red_num + "red_num")



            }
          })
          
          that.jw_askfor()
          

        }else{
          var cscs = "hm_unaud_leave[" + ask_xb + "].submit"
          that.setData({
            [cscs]: false
          })
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

          var params = {
            "token": wx.getStorageSync("token"),
            "uid": wx.getStorageSync("uid"),
            "type": 2
          }
          console.log(params)
          app.ljjw.jwGetAskforleaveCount(params).then(d => {
            // console.log(d.data.status)
            if (d.data.status == 1) {
              console.log("教务红点")
              console.log(d.data.data)
              that.setData({
                red_num: d.data.data
              })
              console.log(that.data.red_num + "red_num")



            }
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
          var params = {
            "token": wx.getStorageSync("token"),
            "uid": wx.getStorageSync("uid"),
            "type": 1
          }
          console.log(params)
          app.ljjw.jwGetAskforleaveCount(params).then(d => {
            // console.log(d.data.status)
            if (d.data.status == 1) {
              console.log("教务红点")
              console.log(d.data.data)
              that.setData({
                red_num: d.data.data
              })
              console.log(that.data.red_num + "red_num")



            }
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
      
    }else{
      
      showYear = that.data.showYear
      console.log(showYear)
      showMonth = that.data.showMonth - 1
    }

      showym = showYear + "-" + (showMonth < 10 ? '0' + (showMonth) : showMonth)

      showlast = showYear + "-" + (showMonth < 10 ? '0' + (showMonth) : showMonth) + '-' + (that.data.nowDay < 10 ? '0' + (that.data.nowDay) : that.data.nowDay)
    
    if(that.data.role <= 3){
      
      var params = {
        "token": wx.getStorageSync("token"),
        "uid": wx.getStorageSync("uid"),
        "riqi": showlast
      }
      console.log(params)
      that.setData({
        class_ids: wx.getStorageSync("class_ids"),
      })
      console.log(that.data.class_ids)
      console.log("that.data.class_ids")
      app.ljjw.jwGetCheckOnList(params).then(d => {
        // console.log(d.data.status)
        if (d.data.status == 1) {
          console.log("或教务")
          console.log(d.data.data)
         
          if(d.data.data.day_list == ''){
            wx.showToast({
              title: '上个月还没有安排哦~',
              icon: "none",
              duration: 1200
            })
            // var params = {
            //   "token": wx.getStorageSync("token"),
            //   "uid": wx.getStorageSync("uid"),
            //   "riqi": that.data.nowDate
            // }
            // console.log(params)
            // that.setData({
            //   class_ids: wx.getStorageSync("class_ids"),
            // })
            // console.log(that.data.class_ids)
            // console.log("that.data.class_ids")
            // app.ljjw.jwGetCheckOnList(params).then(d => {
            //   // console.log(d.data.status)
            //   if (d.data.status == 1) {
            //     console.log("或教务")
            //     console.log(d.data.data)
            //     that.setData({
            //       tea_dayCourse: d.data.data.course_list,
            //       tea_courselist: d.data.data.day_list
            //     })
                
            //     for (var i = 0; i < that.data.tea_dayCourse.length; i++) {
            //       //关联班级点名判断
            //       for (var rc = 0; rc < that.data.class_ids.length; rc++) {
            //         if (that.data.tea_dayCourse[i].class_id == that.data.class_ids[rc]) {
            //           var csrc = "tea_dayCourse[" + i + "].rc"
            //           that.setData({
            //             [csrc]: true
            //           })
            //         }
            //       }
            //       console.log(that.data.tea_dayCourse)
            //       console.log("that.data.tea_dayCourse.rc")

            //       var end1 = that.data.tea_dayCourse[i].classtime.substr(8, 5)
            //       var end = that.data.tea_dayCourse[i].riqi + " " + end1
            //       console.log(end + "=============end")
            //       var iphone1 = end.substr(0, 4)
            //       var iphone2 = end.substr(5, 2)
            //       var iphone3 = end.substr(8, 2)
            //       var iphone4 = end.substr(11, 5)
            //       console.log(iphone1 + "=============iphone1")
            //       console.log(iphone2 + "=============iphone2")
            //       console.log(iphone3 + "=============iphone3")
            //       console.log(iphone4 + "=============iphone4")
            //       var iphone_cs = iphone1 + "/" + iphone2 + "/" + iphone3 + " " + iphone4
            //       var aa = Date.parse(end)
            //       var bb = Date.parse(iphone_cs)
            //       console.log(bb + "++++++==========bb")

            //       var timestamp = Date.parse(new Date());
            //       console.log(aa + "=================aa")
            //       console.log(timestamp + "=======================now")
            //       if (bb < timestamp) {
            //         var comp = "tea_dayCourse[" + i + "].comp"
            //         that.setData({
            //           [comp]: false
            //         })
            //       }
            //       else {
            //         var comp = "tea_dayCourse[" + i + "].comp"
            //         that.setData({
            //           [comp]: true
            //         })
            //       }

            //     }

            //     console.log(that.data.tea_dayCourse)

            //     for (var i = 0; i < that.data.tea_courselist.length; i++) {
            //       var newarray = [{
            //         ym: that.data.tea_courselist[i].riqi.substr(0, 7),
            //         d: that.data.tea_courselist[i].riqi.substr(8, 2)
            //       }];
            //       that.setData({
            //         'dot_riqi': that.data.dot_riqi.concat(newarray)
            //       });

            //     }
            //     console.log(that.data.dot_riqi)

            //     // 日历点点
            //     that.dot()





            //     // console.log(that.data.tea_dayCourse)
            //   }
            // })

          }else{

            that.setData({
              tea_dayCourse: d.data.data.course_list,
              tea_courselist: d.data.data.day_list
            })
         
            that.setData({
              showYear: showYear,
              showMonth: showMonth,
              showlast: showlast,
              showym: showym
            })
            that.getMonthData(that.data.showYear, that.data.showMonth);
          for (var i = 0; i < that.data.tea_dayCourse.length; i++) {
            var end1 = that.data.tea_dayCourse[i].classtime.substr(8, 5)
            var end = that.data.tea_dayCourse[i].riqi + " " + end1
            console.log(end + "=============end")
            var iphone1 = end.substr(0, 4)
            var iphone2 = end.substr(5, 2)
            var iphone3 = end.substr(8, 2)
            var iphone4 = end.substr(11, 5)
            console.log(iphone1 + "=============iphone1")
            console.log(iphone2 + "=============iphone2")
            console.log(iphone3 + "=============iphone3")
            console.log(iphone4 + "=============iphone4")
            var iphone_cs = iphone1 + "/" + iphone2 + "/" + iphone3 + " " + iphone4
            var aa = Date.parse(end)
            var bb = Date.parse(iphone_cs)
            console.log(bb + "++++++==========bb")

            var timestamp = Date.parse(new Date());
            console.log(aa + "=================aa")
            console.log(timestamp + "=======================now")
            if (bb < timestamp) {
              var comp = "tea_dayCourse[" + i + "].comp"
              that.setData({
                [comp]: false
              })
            }
            else {
              var comp = "tea_dayCourse[" + i + "].comp"
              that.setData({
                [comp]: true
              })
            }

          }

          console.log(that.data.tea_dayCourse)

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
                console.log(that.data.dayCourse)
                for (var i = 0; i < that.data.dayCourse.length; i++) {
                  var end1 = that.data.dayCourse[i].classtime.substr(8, 5)
                  var end = that.data.dayCourse[i].riqi + " " + end1
                  console.log(end + "=============end")
                  var iphone1 = end.substr(0, 4)
                  var iphone2 = end.substr(5, 2)
                  var iphone3 = end.substr(8, 2)
                  var iphone4 = end.substr(11, 5)
                  console.log(iphone1 + "=============iphone1")
                  console.log(iphone2 + "=============iphone2")
                  console.log(iphone3 + "=============iphone3")
                  console.log(iphone4 + "=============iphone4")
                  var iphone_cs = iphone1 + "/" + iphone2 + "/" + iphone3 + " " + iphone4
                  var aa = Date.parse(end)
                  var bb = Date.parse(iphone_cs)
                  console.log(bb + "++++++==========bb")

                  var timestamp = Date.parse(new Date());
                  console.log(aa + "=================aa")
                  console.log(timestamp + "=======================now")
                  if (bb < timestamp) {
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
                console.log("that.data.dayCourse ")
              }
            })
            that.setData({
              calendarfold: false
            })
          }
          else {
            console.log("222")
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
      
    } else {
      showYear = that.data.showYear
      showMonth = that.data.showMonth + 1
     
      showym = showYear + "-" + (showMonth < 10 ? '0' + (showMonth) : showMonth)
      
      showlast = showYear + "-" + (showMonth < 10 ? '0' + (showMonth) : showMonth) + '-' + (that.data.nowDay < 10 ? '0' + (that.data.nowDay) : that.data.nowDay)
    }
    if (that.data.role <= 3) {
      
      var params = {
        "token": wx.getStorageSync("token"),
        "uid": wx.getStorageSync("uid"),
        "riqi": showlast
      }
      console.log(params)
      that.setData({
        class_ids: wx.getStorageSync("class_ids"),
      })
      console.log(that.data.class_ids)
      console.log("that.data.class_ids")
      app.ljjw.jwGetCheckOnList(params).then(d => {
        console.log(d.data)
        if (d.data.status == 1) {
          console.log("或教务")
          console.log(d.data.data)
          
          if (d.data.data.day_list != ''){
            that.setData({
              tea_dayCourse: d.data.data.course_list,
              tea_courselist: d.data.data.day_list
            })
            that.setData({
              showYear: showYear,
              showMonth: showMonth,
              showlast: showlast,
              showym: showym,
              clickDay: that.data.nowDay
            })
            that.getMonthData(that.data.showYear, that.data.showMonth);
            that.setData({
              calendarfold: false
            })
            // that.getMonthData(showYear, showMonth);
            for (var i = 0; i < that.data.tea_dayCourse.length; i++) {
              //关联班级点名判断
              for (var rc = 0; rc < that.data.class_ids.length; rc++) {
                if (that.data.tea_dayCourse[i].class_id == that.data.class_ids[rc]) {
                  var csrc = "tea_dayCourse[" + i + "].rc"
                  that.setData({
                    [csrc]: true
                  })
                }
              }
              console.log(that.data.tea_dayCourse)
              console.log("that.data.tea_dayCourse.rc")

              var end1 = that.data.tea_dayCourse[i].classtime.substr(8, 5)
              var end = that.data.tea_dayCourse[i].riqi + " " + end1
              console.log(end + "=============end")
              var iphone1 = end.substr(0, 4)
              var iphone2 = end.substr(5, 2)
              var iphone3 = end.substr(8, 2)
              var iphone4 = end.substr(11, 5)
              console.log(iphone1 + "=============iphone1")
              console.log(iphone2 + "=============iphone2")
              console.log(iphone3 + "=============iphone3")
              console.log(iphone4 + "=============iphone4")
              var iphone_cs = iphone1 + "/" + iphone2 + "/" + iphone3 + " " + iphone4
              var aa = Date.parse(end)
              var bb = Date.parse(iphone_cs)
              console.log(bb + "++++++==========bb")

              var timestamp = Date.parse(new Date());
              console.log(aa + "=================aa")
              console.log(timestamp + "=======================now")
              if (bb < timestamp) {
                var comp = "tea_dayCourse[" + i + "].comp"
                that.setData({
                  [comp]: false
                })
              }
              else {
                var comp = "tea_dayCourse[" + i + "].comp"
                that.setData({
                  [comp]: true
                })
              }

            }

            console.log(that.data.tea_dayCourse)

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
          }else{
            wx.showToast({
              title: '下个月还没有安排哦~',
              icon:"none",
              duration:2000
            })
          }
          
          
        }
      })
      

    }
    else if (that.data.role == 4 && that.data.type == 2) {
      console.log(showym, that.data.nowmonth,"hhhhh")
      if (showym.indexOf(that.data.nowmonth) != -1){
        var params = {
          "token": wx.getStorageSync("token"),
          "uid": wx.getStorageSync("uid"),
          "month": showym
        }
        console.log(params)
        app.ljjw.jwGetMonthCourse(params).then(d => {
          if (d.data.status == 1) {
            console.log(d)
            
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
              console.log(that.data.stu_classlist + "[1]")
              that.cs()
              console.log("[cs,2]")
              for (var i = 0; i < that.data.stu_courselist.length; i++) {
                var newarray = [{
                  ym: that.data.stu_courselist[i].riqi.substr(0, 7),
                  d: that.data.stu_courselist[i].riqi.substr(8, 2)
                }];
                that.setData({
                  'dot_riqi': that.data.dot_riqi.concat(newarray)
                });

              }
              console.log("[3]")
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
                  console.log(that.data.dayCourse)
                  for (var i = 0; i < that.data.dayCourse.length; i++) {
                    var end1 = that.data.dayCourse[i].classtime.substr(8, 5)
                    var end = that.data.dayCourse[i].riqi + " " + end1
                    console.log(end + "=============end")
                    var iphone1 = end.substr(0, 4)
                    var iphone2 = end.substr(5, 2)
                    var iphone3 = end.substr(8, 2)
                    var iphone4 = end.substr(11, 5)
                    console.log(iphone1 + "=============iphone1")
                    console.log(iphone2 + "=============iphone2")
                    console.log(iphone3 + "=============iphone3")
                    console.log(iphone4 + "=============iphone4")
                    var iphone_cs = iphone1 + "/" + iphone2 + "/" + iphone3 + " " + iphone4
                    var aa = Date.parse(end)
                    var bb = Date.parse(iphone_cs)
                    console.log(bb + "++++++==========bb")

                    var timestamp = Date.parse(new Date());
                    console.log(aa + "=================aa")
                    console.log(timestamp + "=======================now")
                    if (bb < timestamp) {
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
                  console.log("that.data.dayCourse ")
                }
              })
              that.setData({
                calendarfold: false
              })

          }
        })
      }else{
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
                  console.log(that.data.dayCourse)
                  for (var i = 0; i < that.data.dayCourse.length; i++) {
                    var end1 = that.data.dayCourse[i].classtime.substr(8, 5)
                    var end = that.data.dayCourse[i].riqi + " " + end1
                    console.log(end + "=============end")
                    var iphone1 = end.substr(0, 4)
                    var iphone2 = end.substr(5, 2)
                    var iphone3 = end.substr(8, 2)
                    var iphone4 = end.substr(11, 5)
                    console.log(iphone1 + "=============iphone1")
                    console.log(iphone2 + "=============iphone2")
                    console.log(iphone3 + "=============iphone3")
                    console.log(iphone4 + "=============iphone4")
                    var iphone_cs = iphone1 + "/" + iphone2 + "/" + iphone3 + " " + iphone4
                    var aa = Date.parse(end)
                    var bb = Date.parse(iphone_cs)
                    console.log(bb + "++++++==========bb")

                    var timestamp = Date.parse(new Date());
                    console.log(aa + "=================aa")
                    console.log(timestamp + "=======================now")
                    if (bb < timestamp) {
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
                  console.log("that.data.dayCourse ")
                }
              })
              that.setData({
                calendarfold: false
              })
            }
            else {
              console.log("下月2")
              wx.showToast({
                
                title: '下个月还没有安排哦~',
                icon: "none",
                duration: 1500
              })
            }



          }
        })
      }
      
      
      
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
            console.log("学生考勤下个月为空")
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
    // var dxb = e.currentTarget.dataset.weekIndex
    // console.log(dxb,"dxb")
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
          // console.log(that.data.dayCourse)
          for (var i = 0; i < that.data.dayCourse.length; i++) {
            var end1 = that.data.dayCourse[i].classtime.substr(8, 5)
            var end = that.data.dayCourse[i].riqi + " " + end1
            console.log(end + "=============end")
            var iphone1 = end.substr(0, 4)
            var iphone2 = end.substr(5, 2)
            var iphone3 = end.substr(8, 2)
            var iphone4 = end.substr(11, 5)
            console.log(iphone1 + "=============iphone1")
            console.log(iphone2 + "=============iphone2")
            console.log(iphone3 + "=============iphone3")
            console.log(iphone4 + "=============iphone4")
            var iphone_cs = iphone1 + "/" + iphone2 + "/" + iphone3 + " " + iphone4
            var aa = Date.parse(end)
            var bb = Date.parse(iphone_cs)
            console.log(bb + "++++++==========bb")

            var timestamp = Date.parse(new Date());
            console.log(aa + "=================aa")
            console.log(timestamp + "=======================now")
            if (bb < timestamp) {
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
          console.log("that.data.dayCourse ")
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
      that.setData({
        class_ids: wx.getStorageSync("class_ids"),
      })
      console.log(that.data.class_ids)
      console.log("that.data.class_ids")
      app.ljjw.jwGetCheckOnList(params).then(d => {
        console.log(d)
        if (d.data.status == 1) {
          that.setData({
            tea_dayCourse: d.data.data.course_list
          })
          for (var i = 0; i < that.data.tea_dayCourse.length; i++) {
            //关联班级点名判断
            for (var rc = 0; rc < that.data.class_ids.length; rc++) {
              if (that.data.tea_dayCourse[i].class_id == that.data.class_ids[rc]) {
                var csrc = "tea_dayCourse[" + i + "].rc"
                that.setData({
                  [csrc]: true
                })
              }
            }
            console.log(that.data.tea_dayCourse)
            console.log("that.data.tea_dayCourse.rc")
            var end1 = that.data.tea_dayCourse[i].classtime.substr(8, 5)
            var end = that.data.tea_dayCourse[i].riqi + " " + end1
            console.log(end + "=============end")
            var iphone1 = end.substr(0, 4)
            var iphone2 = end.substr(5, 2)
            var iphone3 = end.substr(8, 2)
            var iphone4 = end.substr(11, 5)
            console.log(iphone1 + "=============iphone1")
            console.log(iphone2 + "=============iphone2")
            console.log(iphone3 + "=============iphone3")
            console.log(iphone4 + "=============iphone4")
            var iphone_cs = iphone1 + "/" + iphone2 + "/" + iphone3 + " " + iphone4
            var aa = Date.parse(end)
            var bb = Date.parse(iphone_cs)
            console.log(bb + "++++++==========bb")

            var timestamp = Date.parse(new Date());
            console.log(aa + "=================aa")
            console.log(timestamp + "=======================now")
            if (bb < timestamp) {
              var comp = "tea_dayCourse[" + i + "].comp"
              that.setData({
                [comp]: false
              })
            }
            else {
              var comp = "tea_dayCourse[" + i + "].comp"
              that.setData({
                [comp]: true
              })
            }

          }

          console.log(that.data.tea_dayCourse)
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
      that.setData({
        class_ids: wx.getStorageSync("class_ids"),
      })
      console.log(that.data.class_ids)
      console.log("that.data.class_ids")
      app.ljjw.jwGetCheckOnList(params).then(d => {
        console.log(d)
        if (d.data.status == 1) {
          that.setData({
            tea_dayCourse: d.data.data.course_list
          })
          for (var i = 0; i < that.data.tea_dayCourse.length; i++) {
            var end1 = that.data.tea_dayCourse[i].classtime.substr(8, 5)
            var end = that.data.tea_dayCourse[i].riqi + " " + end1
            console.log(end + "=============end")
            var iphone1 = end.substr(0, 4)
            var iphone2 = end.substr(5, 2)
            var iphone3 = end.substr(8, 2)
            var iphone4 = end.substr(11, 5)
            console.log(iphone1 + "=============iphone1")
            console.log(iphone2 + "=============iphone2")
            console.log(iphone3 + "=============iphone3")
            console.log(iphone4 + "=============iphone4")
            var iphone_cs = iphone1 + "/" + iphone2 + "/" + iphone3 + " " + iphone4
            var aa = Date.parse(end)
            var bb = Date.parse(iphone_cs)
            console.log(bb + "++++++==========bb")

            var timestamp = Date.parse(new Date());
            console.log(aa + "=================aa")
            console.log(timestamp + "=======================now")
            if (bb < timestamp) {
              var comp = "tea_dayCourse[" + i + "].comp"
              that.setData({
                [comp]: false
              })
            }
            else {
              var comp = "tea_dayCourse[" + i + "].comp"
              that.setData({
                [comp]: true
              })
            }

          }

          console.log(that.data.tea_dayCourse)
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

  /**
   * 教务获取请假列表
  */
  jw_askfor:function(){
    let that = this
    if(that.data.aud == 0){
      var params = {
        "token": wx.getStorageSync("token"),
        "uid": wx.getStorageSync("uid"),
        "type": 1
      }
      // console.log(params)
      app.ljjw.jwJiaowuGetAskforleaveList(params).then(d => {
        
        if (d.data.status == 1) {
          // console.log(d)
          var hm_unaud_leave = d.data.data
          
          for(var i=0;i<hm_unaud_leave.length;i++){
            hm_unaud_leave[i].submit = false
          }
          that.setData({
            hm_unaud_leave: hm_unaud_leave
          })
          // console.log(that.data.hm_unaud_leave)
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
      // console.log(params)
      app.ljjw.jwJiaowuGetAskforleaveList(params).then(d => {
        // console.log(d)
        if (d.data.status == 1) {
          var hm_aud_leave = d.data.data
          
          for (var i = 0; i < hm_aud_leave.length;i++){
            var leave = hm_aud_leave[i]
            leave.fold = false
            var status_text = ''
            var status_color = ""
            switch (leave.status*1) {
              case 0: {
                // 未审核
                status_text = "未审核"
                status_color = "#b4b4b4"
                break
              }
              case 1: {
                // 教务通过
                status_text = "待管理员审核"
                status_color = "#b4b4b4"
                break
              }
              case 2: {
                // 教务驳回
                status_text = "审核驳回"
                status_color = "#f14444"
                break
              }
              case 3: {
                // 管理员审核通过
                status_text = "审核通过"
                status_color = "#46bf6a"
                break
              }
              case 4: {
                // 管理员驳回
                status_text = "审核驳回"
                status_color = "#f14444"
                break
              }
              case 5: {
                // 假条作废（到期未审核）
                status_text = "假条已作废"
                status_color = "#fb895e"
                break
              }
              default: {
                status_text= "未知状态"
                status_color = "#b4b4b4"
              }
            }
            leave.status_text = status_text
            leave.status_color = status_color
          }
          that.setData({
            hm_aud_leave: hm_aud_leave
          })
          // console.log(that.data.hm_aud_leave)
        } else {
          that.setData({
            hm_aud_leave: ''
          })
        }
        console.log("教务请假已审核")
      })
    }
    
  },

  /**
   * 管理员获取请假列表
  */
  admin_askfor: function () {
    let that = this
    if (that.data.aud == 0) {
      var params = {
        "token": wx.getStorageSync("token"),
        "uid": wx.getStorageSync("uid"),
        "type": 1
      }
      // console.log(params)
      app.ljjw.jwAdminGetAskforleaveList(params).then(d => {
        // console.log(d)
        if (d.data.status == 1) {
          var admin_unaud_leave = d.data.data
          
          for (var i = 0; i < admin_unaud_leave.length; i++) {
            admin_unaud_leave[i].submit = false
          }
          that.setData({
            admin_unaud_leave: admin_unaud_leave
          })
          // console.log(that.data.admin_unaud_leave)
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
      // console.log(params)
      app.ljjw.jwAdminGetAskforleaveList(params).then(d => {
        // console.log(d)
        if (d.data.status == 1) {
          var admin_aud_leave = d.data.data
          
          for (var i = 0; i < admin_aud_leave.length; i++) {
            var leave = admin_aud_leave[i]
            leave.fold = false
            var status_text = ''
            var status_color = ""
            switch (leave.status*1) {
              case 0: {
                // 未审核
                status_text = "未审核"
                status_color = "#b4b4b4"
                break
              }
              case 1: {
                // 教务通过
                status_text = "待管理员审核"
                status_color = "#b4b4b4"
                break
              }
              case 2: {
                // 教务驳回
                status_text = "审核驳回"
                status_color = "#f14444"
                break
              }
              case 3: {
                // 管理员审核通过
                status_text = "审核通过"
                status_color = "#46bf6a"
                break
              }
              case 4: {
                // 管理员驳回
                status_text = "审核驳回"
                status_color = "#f14444"
                break
              }
              case 5: {
                // 假条作废（到期未审核）
                status_text = "假条已作废"
                status_color = "#fb895e"
                break
              }
              default: {
                status_text= "未知状态"
                status_color = "#b4b4b4"
              }
            }
            leave.status_text = status_text
            leave.status_color = status_color
          }
          that.setData({
            admin_aud_leave: admin_aud_leave
          })
          // console.log(that.data.admin_aud_leave)
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
    let that = this
    // if (typeof this.getTabBar === 'function' &&
    //   this.getTabBar()) {
    //   console.log('index_onshow')
    //   this.getTabBar().setData({
    //     selected: 0
    //   })
    // }
    // else{
    //   console.log('未执行')
    // }

    // 初始化data数据
    this.initUserInfoData()

    // 加载数据
    // var riqi = ""
    // if (that.data.clickDate) {
    //   riqi = that.data.clickDate
    // } else {
    //   riqi = that.data.nowDate
    // }
    that.loadData(that.data.type, that.data.nowDate)
  },

  /**
   * 设置自定义导航栏尺寸
  */
  setUpNaviSize: function () {
    var menuButtonRect = wx.getMenuButtonBoundingClientRect()
    var systemInfo = wx.getSystemInfoSync()
    let naviBarHeight = menuButtonRect.bottom+10
    let naviBarWidth = systemInfo.screenWidth
    let saveBottom = systemInfo.screenHeight-systemInfo.safeArea.bottom
    console.log(systemInfo)
    this.setData ({
      naviBarHeight: naviBarHeight,
      naviBarWidth: naviBarWidth,
      naviBarSelectSub_Height: menuButtonRect.height,
      naviBarSelectSub_Top: menuButtonRect.top,
      saveBottom: saveBottom
    })
  },

  /**
   * 初始化用户信息数据
  */
  initUserInfoData: function() {
    let that = this;
    // console.log(-1%2 , "取余")
    var role = wx.getStorageSync("role")
    
    if (!role) {
      that.setData({
        role: -1,
        login: false,
        uid: wx.getStorageSync("uid"),
        userInfo : wx.getStorageSync("userInfo"),
        class_ids: wx.getStorageSync("class_ids")
        // stu_sta: wx.getStorageSync("stu_sta")
      }),
      wx.switchTab({
        url: '/pages/my/my',
      })
      // that.getTabBar().setData({
      //   selected: 3
      // })
      
    } else {
      that.setData({
        role: role*1,
        login: true,
        uid: wx.getStorageSync("uid"),
        userInfo: wx.getStorageSync("userInfo"),
        class_ids: wx.getStorageSync("class_ids")
        
        
      })
      if(that.data.role == 4){
        that.setData({
          stu_sta: wx.getStorageSync("stu_sta")
        })
      }
    }
    console.log(that.data.stu_sta + "that.data.stu_sta")
    console.log("onload")
    
    // if (!that.data.showYear) {
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
        var nowWeekDataItem = that.data.nowWeekData[i]
        nowWeekDataItem[2] = false
        nowWeekDataItem[3] = 0
      }
      for (var i = 0; i < that.data.weekData.length; i++) {
        var weekDataItem = that.data.weekData[i]
        for (var j = 0; j < weekDataItem.length;j++){
          var weekDataItem_item = weekDataItem[j]
          weekDataItem_item[2] = false
          weekDataItem_item[3] = 0
        }
      }
      that.setData({
        weekData: that.data.weekData,
        nowWeekData: that.data.nowWeekData
      })
    // }
    
  },
    
  /**
   * 学生获取请假列表
   * type: 0-待审核、1-已审核
  */
  studentGetLeaveList: function (type) {
    let that = this
    var params = {
      "token": wx.getStorageSync("token"),
      "uid": wx.getStorageSync("uid"),
      "type": type
    }
    console.log(params)
    app.ljjw.jwGetStudentAskforleave(params).then(d => {

      if (d.data.status == 1) {
        var newData = d.data.data
        var newData1 = d.data.data
        for (var i = 0; i < newData.length; i++) {
          var item = newData[i]
          item.fold = true

          for (var j = 0; j < item.ask_info.length; j++) {
            var askInfo = item.ask_info[j]
            var hh = askInfo.classtime + " " + askInfo.title
            askInfo.pin = hh
            askInfo.cs = []
            var date = askInfo.date

            for (var k = 0; k < newData1[i].ask_info.length; k++) {
              // if (that.data.leave[i].add_arr[k].date == '')

              if (date == newData1[i].ask_info[k].date) {
                askInfo.cs.push(newData1[i].ask_info[k].pin)
              }
              else {


              }
            }
          }
        }

        for (var i = 0; i < newData.length; i++) {
          var item = newData[i]
          for (var j = 0; j < item.ask_info.length; j++) {
            var askInfo = item.ask_info[j]
            for (var k = 0; k < askInfo.cs.length; k++) {
              if (askInfo.cs[k] == null) {
                item.ask_info.splice(j, 1)
              }
            }
          }
        }
        that.setData({
          leave: newData,
          wscs: newData1
        })
        


      } else if (d.data.status == -1) {
        console.log(d.data.msg)
      }
    })
  },

  /**
   * 学生获取月考勤数据
  */
  studentGetMonthCheckon: function(nowMonth) {
    let that = this
    var params = {
      "token": wx.getStorageSync("token"),
      "uid": wx.getStorageSync("uid"),
      "month": nowMonth
    }
    app.ljjw.jwGetMonthCheckon(params).then(d => {
      let status = d.data.status
      if (status == 1) {
        var data = d.data.data
        
        var stu_courselist = ''
        var stu_classlist = data.period_info
        if (data.info){
          stu_courselist = data.info
        }else{
          stu_courselist = ''
        }
        that.setData({
          'stu_classlist' : stu_classlist,
          'stu_courselist': stu_courselist,
        })
        that.cs()
        if (stu_courselist != ''){
          for (var i = 0; i < stu_courselist.length; i++) {
            var newarray = [{
              ym: stu_courselist[i].riqi.substr(0, 7),
              d: Number(stu_courselist[i].riqi.substr(8, 2)),
              work: Number(stu_courselist[i].check_status)
            }];
            that.setData({
              'dot_work': that.data.dot_work.concat(newarray)
            });

          }
          // console.log(that.data.dot_work)

          // 考勤点点
          that.dot_work()
        }
        
      } else if (status == -1){
        console.log(d.data.msg)
      }
    })
  },

  /**
   * 学生获取日考勤列表
  */
  StudentGetDayCheckon: function(riqi) {
    let that = this
    var params = {
      "token": wx.getStorageSync("token"),
      "uid": wx.getStorageSync("uid"),
      "riqi": riqi
    }
    // console.log(params)
    app.ljjw.jwGetDayCheckon(params).then(d => {
      if (d.data.status == 1) {
        that.setData({
          dayCheckon: d.data.data
        })
        // console.log(that.data.dayCheckon)
      }
      else if (d.data.status == -1) {
        that.setData({
          dayCheckon: ''
        })
        // console.log(that.data.dayCheckon)
      }

    })
  },

  /**
   * 学生获取日课表
  */
  StudentGetDayCourse: function(riqi) {
    let that = this
    var params = {
      "token": wx.getStorageSync("token"),
      "uid": wx.getStorageSync("uid"),
      "riqi": riqi
    }
    // console.log(params)
    app.ljjw.jwGetDayCourse(params).then(d => {
      if (d.data.status == 1) {

        var dayCourse = d.data.data
        
        // console.log(that.data.dayCourse)
        for (var i = 0; i < dayCourse.length; i++) {
          var course = dayCourse[i]
          var end1 = course.classtime.substr(8, 5)
          var end = course.riqi + " " + end1
          console.log(end + "=============end")
          var iphone1 = end.substr(0, 4)
          var iphone2 = end.substr(5, 2)
          var iphone3 = end.substr(8, 2)
          var iphone4 = end.substr(11, 5)
          console.log(iphone1 + "=============iphone1")
          console.log(iphone2 + "=============iphone2")
          console.log(iphone3 + "=============iphone3")
          console.log(iphone4 + "=============iphone4")
          var iphone_cs = iphone1 + "/" + iphone2 + "/" + iphone3 + " " + iphone4
          var aa = Date.parse(end)
          var bb = Date.parse(iphone_cs)
          console.log(bb + "++++++==========bb")

          var timestamp = Date.parse(new Date());
          console.log(aa + "=================aa")
          console.log(timestamp + "=======================now")
          if (bb < timestamp) {
            course.comp = false
          }
          else {
            course.comp = true
          }

        }
        that.setData({
          dayCourse: dayCourse
        })
        // console.log(that.data.dayCourse)
        // console.log("that.data.dayCourse ")
      }
    })
  },

  /**
   * 学生获取月课程列表
  */
  studentGetMonthCourse: function(month) {
    let that = this
    var params = {
      "token": wx.getStorageSync("token"),
      "uid": wx.getStorageSync("uid"),
      "month": month
    }
    // console.log(params)
    app.ljjw.jwGetMonthCourse(params).then(d => {
      if (d.data.status == 1) {
        // console.log(d)
        var data = d.data.data
        that.data.stu_courselist = data.info
        that.data.stu_classlist = data.period_info
        that.cs()

        var dot_riqi = that.data.dot_riqi
        for (var i = 0; i < that.data.stu_courselist.length; i++) {
          var stu_course = that.data.stu_courselist[i]
          var newarray = [{
            ym: stu_course.riqi.substr(0, 7),
            d: stu_course.riqi.substr(8, 2)
          }];
          dot_riqi = dot_riqi.concat(newarray)
        }
        that.setData({
          stu_courselist: that.data.stu_courselist,
          stu_classlist: that.data.stu_classlist,
          'dot_riqi': dot_riqi
        });
        console.log(that.data.dot_riqi)

        // 日历点点
        that.dot()
      }
    })
  },
  
  /**
   * 老师/教务/管理员 获取某一天考勤
  */
  teacherGetCheckOnList: function(riqi) {
    let that = this
    var params = {
      "token": wx.getStorageSync("token"),
      "uid": wx.getStorageSync("uid"),
      "riqi": riqi
    }
    console.log(params)
    that.setData({
      class_ids: wx.getStorageSync("class_ids"),
    })
    console.log(that.data.class_ids)
    console.log("that.data.class_ids")
    app.ljjw.jwGetCheckOnList(params).then(d => {
      // console.log(d.data.status)
      if (d.data.status == 1) {
        console.log("或教务")
        console.log(d.data.data)

        var tea_dayCourse = d.data.data.course_list
        var tea_courselist = d.data.data.day_list

        for (var i = 0; i < tea_dayCourse.length; i++) {
          //关联班级点名判断
          for(var rc=0;rc<that.data.class_ids.length;rc++){
            if (tea_dayCourse[i].class_id == that.data.class_ids[rc]){
              tea_dayCourse[i].rc = true
            }
          }
          // console.log(that.data.tea_dayCourse)
          // console.log("that.data.tea_dayCourse.rc")
          var end1 = tea_dayCourse[i].classtime.substr(8, 5)
          var end = tea_dayCourse[i].riqi + " " + end1
          // console.log(end1 + "=======================end1")
          // console.log(end + "=============end")
          var iphone1 = end.substr(0, 4)
          var iphone2 = end.substr(5, 2)
          var iphone3 = end.substr(8, 2)
          var iphone4 = end.substr(11, 5)
          // console.log(iphone1 + "=============iphone1")
          // console.log(iphone2 + "=============iphone2")
          // console.log(iphone3 + "=============iphone3")
          // console.log(iphone4 + "=============iphone4")
          var iphone_cs = iphone1 + "/" + iphone2 + "/" + iphone3 + " " + iphone4
          var aa = Date.parse(end)
          var bb = Date.parse(iphone_cs)
          // console.log(bb + "++++++==========bb")

          var timestamp = Date.parse(new Date());
          // console.log(aa + "=================aa")
          // console.log(timestamp + "=======================now")
          if (bb < timestamp) {
            tea_dayCourse[i].comp = false
          }
          else {
            tea_dayCourse[i].comp = true
          }

        }

        
        console.log(that.data.tea_dayCourse)
        var newDotRiqi = []
        for(var i=0;i<tea_courselist.length;i++){
          var newarray = {
            ym: tea_courselist[i].riqi.substr(0, 7),
            d: tea_courselist[i].riqi.substr(8, 2)
          };
          newDotRiqi.push(newarray)
        }
        console.log(newDotRiqi)
        that.setData({
          tea_dayCourse: tea_dayCourse,
          tea_courselist: tea_courselist,
          'dot_riqi': that.data.dot_riqi.concat(newDotRiqi)
        })

        // 日历点点
        that.dot()
      }
    })
  },


  /**
   * 教务/管理员 获取待审批请假数量（小红点）
   * type 1-教务， 2-管理员
  */
  AskforleaveCount: function(type) {
    let that = this
    var params = {
      "token": wx.getStorageSync("token"),
      "uid": wx.getStorageSync("uid"),
      "type": type
    }
    console.log(params)
    app.ljjw.jwGetAskforleaveCount(params).then(d => {
      // console.log(d.data.status)
      if (d.data.status == 1) {
        console.log("教务红点")
        console.log(d.data.data)
        that.setData({
          red_num: d.data.data
        })
        console.log(that.data.red_num +"red_num")
      }
    })
  }
})
