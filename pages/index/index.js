//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    type: 2,  //type 1-请假，2-课表，3-考勤
    aud: 0,
    // role: 3,    //role：4 -学生；1 -老师；2 -教务；3 -管理员
    audoc:true,
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
    dot_riqi:[]
  },
  //事件处理函数
  
  onLoad: function () {
    let that = this;
    var role = wx.getStorageSync("role")
    if (!role) {
      that.setData({
        role: -1
      })
    } else {
      that.setData({
        role: role
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
      that.setData({
        [cs]:false
      })
    }
    for (var i = 0; i < that.data.weekData.length; i++) {
      for (var j = 0; j < that.data.weekData[i].length;j++){
        var cs = "weekData[" + i + "][" + j + "][2]"
        that.setData({
          [cs]: false
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
            dayCourse: d.data.data
          })
          console.log(that.data.dayCourse)
        }
      })
    }
    else if(that.data.role <= 2){
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
        
      } else if (that.data.type == 2){
        console.log("我是管理员课表")
      } else if (that.data.type == 3){
        console.log("我是管理员考勤")
      }
      
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
            console.log(that.data.nowWeekData[w][0])
            var cs = "weekData[" + w + "][2]"

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
      // console.log(that.data.dot_riqi[q])
      if (that.data.dot_riqi[q].ym == that.data.showym) {
        for (var w = 0; w < that.data.weekData.length; w++) {
          for (var e = 0; e < that.data.weekData[w].length; e++) {
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
          console.log(d)
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
          // that.setData({
          //   dayCourse: d.data.data
          // })
          // console.log(that.data.dayCourse)
        }
      })
    }
    else if (that.data.role == 3 && type == 1) {
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
    else if (that.data.role == 2 && type == 1) {
      var params = {
        "token": wx.getStorageSync("token"),
        "uid": wx.getStorageSync("uid"),
        "type": 1
      }
      console.log(params)
      app.ljjw.jwJiaowuGetAskforleaveList(params).then(d => {
        console.log(d)
        if (d.data.status == 1) {
          // that.setData({
          //   dayCourse: d.data.data
          // })
          // console.log(that.data.dayCourse)
        } else {
          that.setData({
            jw_auding_lea: false
          })
        }
        console.log("我是教务请假待审核")
      })

    } else if (that.data.role <= 2 && type == 3) {
      
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
        console.log(d)
        } else if (d.data.status == -1) {
          console.log(d.data.msg)
        }
      })
    }
    else if (aud == 1 && that.data.role == 4){
      //学生请假未审核
      var params = {
        "token": wx.getStorageSync("token"),
        "uid": wx.getStorageSync("uid"),
        "type": 1
      }
      console.log(params)
      app.ljjw.jwGetStudentAskforleave(params).then(d => {
        if (d.data.status == 1) {
        console.log(d)
        } else if (d.data.status == -1) {
          console.log(d.data.msg)
        }
      })
    } else if (aud == 0 && that.data.role == 3){
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
      
    } else if (aud == 1 && that.data.role == 3){
      var params = {
        "token": wx.getStorageSync("token"),
        "uid": wx.getStorageSync("uid"),
        "type": 2
      }
      console.log(params)
      app.ljjw.jwAdminGetAskforleaveList(params).then(d => {
        console.log(d)
        if (d.data.status == 1) {
          // that.setData({
          //   dayCourse: d.data.data
          // })
          // console.log(that.data.dayCourse)
        }else{
          that.setData({
            admin_auding_lea :false
          })
        }
        console.log("我是管理员请假已审核")
      })
      
    } else if (aud == 0 && that.data.role == 2) {
      var params = {
        "token": wx.getStorageSync("token"),
        "uid": wx.getStorageSync("uid"),
        "type": 1
      }
      console.log(params)
      app.ljjw.jwJiaowuGetAskforleaveList(params).then(d => {
        console.log(d)
        if (d.data.status == 1) {
          // that.setData({
          //   dayCourse: d.data.data
          // })
          // console.log(that.data.dayCourse)
        } else {
          that.setData({
            jw_auding_lea: false
          })
        }
        console.log("教务请假待审核")
      })

    } else if (aud == 1 && that.data.role == 2) {
      var params = {
        "token": wx.getStorageSync("token"),
        "uid": wx.getStorageSync("uid"),
        "type": 2
      }
      console.log(params)
      app.ljjw.jwJiaowuGetAskforleaveList(params).then(d => {
        console.log(d)
        if (d.data.status == 1) {
          // that.setData({
          //   dayCourse: d.data.data
          // })
          // console.log(that.data.dayCourse)
        } else {
          that.setData({
            jw_auded_lea: false
          })
        }
        console.log("教务请假已审核")
      })

    }
  },

  stu_add_leave:function(){
    console.log('add_leave跳转')
    wx.navigateTo({
      url: "../../pages/add_leave/add_leave"
    })
  },

  stu_lea_open:function(){
    let that = this
    
      that.setData({
        audoc: !that.data.audoc
      })
    
  },

  to_call_roll:function(e){
    let that = this
    console.log(e.currentTarget.dataset.tea_index)
    var tea_index = e.currentTarget.dataset.tea_index
    console.log(that.data.tea_dayCourse[tea_index].id)
    wx.navigateTo({
      url: '../../pages/call-roll/call-roll?sid=' + that.data.tea_dayCourse[tea_index].id,
    })
  },

  to_t_stuwork:function(e){
    let that = this
    console.log(e.currentTarget.dataset.tea_index)
    var tea_index = e.currentTarget.dataset.tea_index
    console.log(that.data.tea_dayCourse[tea_index].id)
    wx.navigateTo({
      url: '../../pages/t_stuwork/t_stuwork?sid=' + that.data.tea_dayCourse[tea_index].id,
    })
    
  },

  hm_pass:function(e){
    let that = this
    that.setData({
      type : 1
    })
    var lea_role = e.currentTarget.dataset.role
    console.log(lea_role)
    if (lea_role == 3){
      var params = {
        "token": wx.getStorageSync("token"),
        "uid": wx.getStorageSync("uid"),
        "type": 1,
        "ask_id":1
      }
      console.log(params)
      app.ljjw.jwAdminAskforleaveVerify(params).then(d => {
        console.log(d)
        if (d.data.status == 1) {
         that.onLoad()
        } 
        // console.log("我是管理员请假通过")
      })
    } else if (lea_role == 2){
      var params = {
        "token": wx.getStorageSync("token"),
        "uid": wx.getStorageSync("uid"),
        "type": 1,
        "ask_id": 1
      }
      console.log(params)
      app.ljjw.jwJiaowuAskforleaveVerify(params).then(d => {
        console.log(d)
        if (d.data.status == 1) {
          that.onLoad()
        }
        console.log("我是教务请假通过")
      })
    }
    

  },

  hm_rejest:function(e){
    let that = this
    var lea_role = e.currentTarget.dataset.role
    console.log(lea_role)

    that.setData({
      hm_rejest : true,
      lea_role: lea_role
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
    if(that.data.lea_role ==3){
      var params = {
        "token": wx.getStorageSync("token"),
        "uid": wx.getStorageSync("uid"),
        "type": 2,
        "ask_id": 1,
        "reason" : that.data.input_reason
      }
      console.log(params)
      app.ljjw.jwAdminAskforleaveVerify(params).then(d => {
        console.log(d)
        if (d.data.status == 1) {
          that.setData({
            hm_rejest: false,
          })
          that.onLoad()
          console.log("我是管理员请假驳回成功")
        }
        
      })
    } else if(that.data.lea_role == 2){
      var params = {
        "token": wx.getStorageSync("token"),
        "uid": wx.getStorageSync("uid"),
        "type": 2,
        "ask_id": 1,
        "reason": that.data.input_reason
      }
      console.log(params)
      app.ljjw.jwJiaowuAskforleaveVerify(params).then(d => {
        console.log(d)
        if (d.data.status == 1) {
          that.setData({
            hm_rejest: false,
          })
          that.onLoad()
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
    if (that.data.showMonth == 1){
      that.setData({
        showYear: that.data.showYear - 1,
        showMonth: 12
      })
      that.getMonthData(that.data.showYear, that.data.showMonth);
    }else{
      that.setData({
        showYear: that.data.showYear ,
        showMonth: that.data.showMonth - 1
      })
      that.getMonthData(that.data.showYear, that.data.showMonth);
    }
    
    that.setData({
      calendarfold: false
    })
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
        if (weekData[i][j][0] == new Date().getDate()) {
          console.log(weekData[i])
          that.setData({
            nowWeekData: weekData[i]
          })
        }
      }
     
    }

  },

  //点击某一天,课表
  clickDay(e) {
    let that = this
    
    if (e.currentTarget.dataset.day === -1) return;
    that.setData({
      showDay: e.currentTarget.dataset.day,
      clickDay: e.currentTarget.dataset.day,
    })
    // console.log(e.currentTarget.dataset.day1)
    console.log(that.data.clickYear + "-" + that.data.clickMonth + "-" + that.data.clickDay + "==================clickDate")
    var clickDate = that.data.clickYear + "-" + (that.data.clickMonth < 10 ? '0' + (that.data.clickMonth) : that.data.clickMonth) + '-' + (that.data.clickDay < 10 ? '0' + (that.data.clickDay) : that.data.clickDay)
    that.setData({
      clickDate: clickDate
    })

    if(that.data.role == 4){
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
          console.log(that.data.dayCourse)
        }

      })
    }else if(that.data.role <= 2){
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
    console.log(that.data.clickYear + "-" + that.data.clickMonth + "-" + that.data.clickDay + "==================clickDate")
    var clickDate = that.data.clickYear + "-" + (that.data.clickMonth < 10 ? '0' + (that.data.clickMonth) : that.data.clickMonth) + '-' + (that.data.clickDay < 10 ? '0' + (that.data.clickDay) : that.data.clickDay)
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
    } else if (that.data.role <= 2) {
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
    that.dot()
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
  }
})
