//index.js
//获取应用实例
const app = getApp()

Page({

  // 分页数据
  pageData: {
    page: 1,
    perpage: 10,
    canLoadNextPage: true,
  },

  // 是否正在提交数据
  dataSubmiting: false,

  data: {
    type: 2,  //type 1-请假，2-课表，3-考勤
    aud: 0, // 0-未审核 1-已审核

    // 打点数据
    dots: [],

    // 考勤日历背景色数据
    calendarColors: [],

    // 选中的日期 0000-00-00
    clickDate: null,

    // 当前日期 0000-00-00
    nowDate: null,

    // role: 3,    //role：4 -学生；1 -老师；2 -教务；3 -管理员
    // audoc:true,
    dot_riqi:[],
    dot_work: [],
    lea_date_arr:[],

    // 是否无权限
    noPower: false
  },
  //事件处理函数
  
  onLoad: function () {

    // 设置导航栏尺寸
    this.setUpNaviSize()
    
    
  },


  /**
   * 刷新数据
   * riqi: 请求日期 0000-00-00
  */
  loadData: function(riqi){
    let that = this
    let role = that.data.role*1
    
    switch (that.data.type*1) {
      case 1: {
        // 请假
        that.pageData.page = 1
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
            // that.admin_askfor()
            that.adminGetLeaveList()
            break
          }
          case 4: {
            // 学生
            that.studentGetLeaveList()
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
        break
      }
        
      case 3: {
        // 考勤
        wx.showTabBar({
          animation: false,
        })
        break
      }
    }

    // 小红点数量
    if (role == 2) {
      that.AskforleaveCount(1)
    } else if(role == 3) {
      that.adminGetUnreadLeaveNoti()
    }
  },

  onTabItemTap(item) {
    app.setTaskItemDot()
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
    if (this.dataSubmiting) {
      return
    }
    this.dataSubmiting = true
    let that = this
    that.setData({
      type : 1
    })
    var lea_role = e.currentTarget.dataset.role
    var ask_xb = e.currentTarget.dataset.ask_xb
    console.log(lea_role, ask_xb)
    /*
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
      // console.log(params)
      
      app.ljjw.jwAdminAskforleaveVerify(params).then(d => {
        // console.log(d)
        if (d.data.status == 1) {
          
          wx.showToast({
            title: '操作成功',
            duration: 2000
          })

          that.AskforleaveCount(2)

          
        }else{
          var cscs = "admin_unaud_leave[" + ask_xb + "].submit"
          that.setData({
            [cscs]: false
          })
        }
        that.admin_askfor()
        that.dataSubmiting = false
        // console.log("我是管理员请假通过")
      })
    } else */if (lea_role == 2){
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
      // console.log(params)
      app.ljjw.jwJiaowuAskforleaveVerify(params).then(d => {
        // console.log(d)
        if (d.data.status == 1) {
          
          wx.showToast({
            title: '操作成功',
            duration: 2000
          })

          that.AskforleaveCount(1)
          
          
          

        }else{
          var cscs = "hm_unaud_leave[" + ask_xb + "].submit"
          that.setData({
            [cscs]: false
          })
        }
        that.pageData.page = 1
        that.jw_askfor()
        that.dataSubmiting = false
        // console.log("我是教务请假通过")
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
    // console.log(e.detail.value)
    let value = e.detail.value
    if (value == ' ') {
      value = ''
    }
    that.setData({
      input_reason: value
    })
  },

  /**
   * 教务/管理员-驳回请假申请
  */
  reject_pass:function(){
    if (this.dataSubmiting) {
      return
    }
    this.dataSubmiting = true
    let that = this
    that.setData({
      type : 1
    })
    /*
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

          that.AskforleaveCount(2)

          that.admin_askfor()
          console.log("我是管理员请假驳回成功")
        }
        that.dataSubmiting = false
      })
    } else */if(that.data.lea_role == 2){
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
          that.AskforleaveCount(1)
          that.pageData.page = 1
          that.jw_askfor()
          console.log("我是教务请假驳回成功")
        }
        that.dataSubmiting = false
      })
    }
  },

  close:function(){
    let that = this
    that.setData({
      hm_rejest: false
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

  

  /**
   * 管理员获取请假列表
  */
  /*
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

  },*/


  onShow() {
    let that = this

    // 初始化data数据
    this.initUserInfoData()

    // 加载数据
    if (!this.data.noPower) {
      that.loadData(that.data.nowDate)
    }

  },

  onReachBottom() {
    
    if (this.data.type != 1 || !this.pageData.canLoadNextPage || this.data.role == 1) {
      // 只有 学生/教务/管理员 且 请假 且 可以加载下一页 才能继续执行
      return
    }
    let oldPage = this.pageData.page
    this.pageData.page = oldPage + 1
    let that = this
    switch(that.data.role*1) {
      case 1: {
        // 老师
        break
      }
      case 2: {
        // 教务
        this.jw_askfor(function (success, msg){
          if (!success) {
            that.pageData.page = oldPage
          }
        })
        break
      }
      case 3: {
        // 管理员
        this.adminGetLeaveList(function (success, msg){
          if (!success) {
            that.pageData.page = oldPage
          }
        })
        break
      }
      case 4: {
        // 学生
        this.studentGetLeaveList(function (success, msg) {
          if (!success) {
            that.pageData.page = oldPage
          }
        })
        break
      }
    }
  },

  onPullDownRefresh: function () {
    
    if(this.data.type != 1 || this.data.role == 1) {
      // 只有 学生/教务/管理员 且 请假 才能继续执行
      wx.stopPullDownRefresh({
        complete: (res) => {},
      })
      return
    } 
    let oldPage = this.pageData.page
    this.pageData.page = 1
    let that = this
    switch(that.data.role*1){
      case 1: {
        // 老师
        break
      }
      case 2: {
        // 教务
        that.jw_askfor(function (success, msg){
          wx.stopPullDownRefresh({
            complete: (res) => {},
          })
          if (!success) {
            that.pageData.page = oldPage
          }
        })
        break
      }
      case 3: {
        // 管理员
        this.adminGetLeaveList(function (success, msg) {
          wx.stopPullDownRefresh({
            complete: (res) => {},
          })
          if (!success) {
            that.pageData.page = oldPage
          }
        })
        break
      }
      case 4: {
        // 学生
        this.studentGetLeaveList(function (success, msg) {
          wx.stopPullDownRefresh({
            complete: (res) => {},
          })
          if (!success) {
            that.pageData.page = oldPage
          }
        })
        break
      }
    }
  },

  //---------------------------------------------------私有方法--------------------------------------------------
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
    let nowDateStr = app.util.formatDate(new Date())
    if (!role) {
      that.setData({
        role: -1,
        login: false,
        uid: wx.getStorageSync("uid"),
        userInfo : wx.getStorageSync("userInfo"),
        class_ids: wx.getStorageSync("class_ids"),
        // stu_sta: wx.getStorageSync("stu_sta")

        nowDate: nowDateStr
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
        class_ids: wx.getStorageSync("class_ids"),
        
        nowDate: nowDateStr
      })
      
      if(that.data.role == 4){
        let noPower = false
        let stuinfo = wx.getStorageSync('stuinfo')
        if (stuinfo && stuinfo.ifused && stuinfo.ifused == 0) {
          noPower = true
        }
        that.setData({
          noPower: noPower,
          stu_sta: wx.getStorageSync("stu_sta")
        })
      }
    }
    console.log(that.data.stu_sta + "that.data.stu_sta")
    console.log("onload")
    
  },

  /**
   * 打点数据处理
   * dataArray: 接口返回的打点数据
   * 
   * dot.type 1-打绿点  2-打红点
  */
  dotsDataDeal: function (dataArray) {
    if (!dataArray || dataArray == '') {
      return
    }
    switch (this.data.type * 1) {
      case 2: {
        // 课表
        switch (this.data.role * 1) {
          case 1:
            // 老师
          case 2: 
            // 教务
          case 3: 
            // 管理员
          case 4: {
            // 学生
            for (var i = 0; i < dataArray.length; i++) {
              var dot = dataArray[i]
              dot.type = 1
            }
            break
          }
        }
        break
      }
      case 3: {
        // 考勤
        switch (this.data.role * 1) {
          case 1:
            // 老师
          case 2: 
            // 教务
          case 3: {
            // 管理员
            for (var i = 0; i < dataArray.length; i++) {
              var dot = dataArray[i]
              dot.type = 1
            }
            break
          }
          case 4: {
            // 学生
            for (var i = 0; i < dataArray.length; i++) {
              var dot = dataArray[i]
              if (dot.ischeckon == 0) {
                // 未点名
                dot.type = 2
              } else {
                // 已点名
                if (dot.status == '未全勤') {
                  // 未全勤
                  dot.type = 2
                } else {
                  // 全勤
                  dot.type = 1
                }
                
              }
            }
            break
          }
        }
        break
      }
    }

    this.setData({
      dots: dataArray
    })
  },

    
  //-----------------------------------------------接口调用---------------------------------------------------
  /**
   * 学生获取请假列表
   * type: 0-待审核、1-已审核
  */
  studentGetLeaveList: function (cb) {
    let that = this
    var params = {
      "token": wx.getStorageSync("token"),
      "uid": wx.getStorageSync("uid"),
      "type": that.data.aud,
      page: that.pageData.page,
      limit: that.pageData.perpage
    }
    // console.log(params)
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

          // 判断假条状态
          switch(item.status*1) {
            case 0: {
              // 未审核
              item.statusTitle = "待审核"
              item.statusColor = "#fbb95e"
              break
            }
            case 1: {
              // 教务审核通过
              item.statusTitle = "审核通过"
              item.statusColor = "rgba(70,191,106,1)"
              break
            }
            case 2: {
              // 教务审核驳回
              item.statusTitle = "审核驳回"
              item.statusColor = "rgba(241,68,68,1)"
              break
            }
            case 3: {
              // 管理员审核通过
              item.statusTitle = "审核通过"
              item.statusColor = "rgba(70,191,106,1)"
              break
            }
            case 4: {
              // 管理员审核驳回
              item.statusTitle = "审核驳回"
              item.statusColor = "rgba(241,68,68,1)"
              break
            }
            case 5: {
              // 假条已作废
              item.statusTitle = "假条已作废"
              item.statusColor = "#fbb95e"
              break
            }
            default: {
              item.statusTitle = "未知状态"
              item.statusColor = "#fbb95e"
              break
            }
          }

          // 流程处理
          for (var j = 0; j < item.verify_list.length; j++) {
            let verify = item.verify_list[j]
            if (j==0) {
              verify.title = "教务审核通过"
              verify.type = 1
            } else if (j == 1) {
              if (verify.verify_status == 1) {
                verify.title = "管理员审核通过"
                verify.type = 3
              } else {
                verify.title = "管理员审核驳回"
                verify.type = 4
              }
            }
          }
          item.verify_list.unshift({
            type: 0,
            title: "发起",
            verify_time: item.createtime
          })
        }
        // 分页数据处理
        var newLeaveArray = []
        var newLeaveArray1 = []
        if (that.pageData.page > 1) {
          newLeaveArray = that.data.leave.concat(newData)
          newLeaveArray1 = that.data.wscs.concat(newData1)
        } else {
          newLeaveArray = newData
          newLeaveArray1 = newData1
        }
        that.setData({
          leave: newLeaveArray,
          wscs: newLeaveArray1
        })
        
        // 判断是否可加载下一页
        if (newData1.length < that.pageData.perpage) {
          that.pageData.canLoadNextPage = false
        } else {
          that.pageData.canLoadNextPage = true
        }

        typeof cb == "function" && cb(true, "加载成功")
      } else {
        // console.log(d.data.msg)
        typeof cb == "function" && cb(false, "加载失败")
      }
    })
  },

  /**
   * 学生获取日考勤列表
   * 返回值：
   * ischeckon： 0-未点名 1-已点名
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
        let data = d.data.data

        // 判断是否有数据
        if (!data || data == '') {
          that.setData({
            dayCheckon: null
          })
          wx.showToast({
            title: '暂无考勤内容',
            icon: 'none'
          })
          return
        }

        // 按课程开始时间排序
        data.sort(function(a,b){
            let astarttime = a.starttime
            let bstarttime = b.starttime
            return (astarttime - bstarttime)
        })
        
        that.setData({
          dayCheckon: data
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
        if (!dayCourse || dayCourse == '') {
          that.setData({
            dayCourse: null
          })
          wx.showToast({
            title: '暂无课程安排',
            icon: 'none'
          })
          return
        }
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
      } else {
        console.log(d.data.msg ? d.data.msg : "请求失败")
      }
    })
  },
  
  /**
   * 老师/教务/管理员 获取某一天考勤
   * 参数：
   * riqi：0000-00-00
   * type：1-课表   2-考勤
   * 返回值：
   * ischeckon：是否已点名
   * cancheckon: 是否可以点名
  */
  teacherGetCheckOnList: function(riqi) {
    let that = this
    var params = {
      "token": wx.getStorageSync("token"),
      "uid": wx.getStorageSync("uid"),
      "riqi": riqi,
      "type": that.data.type == 2 ? "1" : "2"
    }
    console.log(params)
    that.setData({
      class_ids: wx.getStorageSync("class_ids"),
    })
    console.log(that.data.class_ids)
    console.log("that.data.class_ids")
    app.ljjw.jwGetCheckOnList(params).then(d => {
      if (d.data.status == 1) {

        var tea_dayCourse = d.data.data.course_list
        // var tea_courselist = d.data.data.day_list

        if (!tea_dayCourse || tea_dayCourse == '' || tea_dayCourse.length == 0) {
          that.setData({
            tea_dayCourse: [],
          })
          if (that.data.type == 3) {
            wx.showToast({
              title: '暂无考勤内容',
              icon: 'none'
            })
          }
          return
        }

        
        var timestamp = (new Date()).getTime();

        var newCourseArray = []
        for (var i = 0; i < tea_dayCourse.length; i++) {
          var course = tea_dayCourse[i]
          
          // 判断是否是关联课程
          switch(that.data.role) {
            case 1: {
              // 老师
              switch(that.data.type) {
                case 2: {
                  // 课表
                  if (course.teacher_id == that.data.uid) {
                    newCourseArray.push(course)
                  }
                  break
                }
                case 3: {
                  // 考勤
                  if (that.data.class_ids.indexOf(course.class_id) != -1) {
                    newCourseArray.push(course)
                  }
                  break
                }
              }
              break
            }
            case 2: {
              // 教务
              if (that.data.class_ids.indexOf(course.class_id) != -1) {
                course.rc = true
                newCourseArray.push(course)
              }
              break
            }
            case 3: {
              // 管理员
              if (that.data.class_ids.indexOf(course.class_id) != -1) {
                newCourseArray.push(course)
              }
              break
            }
          }

          // 判断课程是否结束
          if (course.endtime*1000 < timestamp) {
            course.comp = false
          } else {
            course.comp = true
          }
          // //关联班级 是否可以点名
          // for(var rc=0;rc<that.data.class_ids.length;rc++){
          //   if (course.class_id == that.data.class_ids[rc]){
          //     course.rc = true
          //   }
          // }

          let avatar = course.avatar
          if (!avatar || avatar.indexOf('http') == -1) {
            course.avatar = '../../images/avatar_null.png'
          }

        }

        that.setData({
          tea_dayCourse: newCourseArray,
        })
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
      if (d.data.status == 1) {
        let count = d.data.data
        if (count != '') {
          that.setData({
            red_num: count
          })
        } else {
          that.setData({
            red_num: 0
          })
        }
      } else {
        that.setData({
          red_num: 0
        })
      }
    })
  },

  /**
   * 学生按日期段 获取课程信息
   * startDate: 查询开始日期 0000-00-00
   * endDate：查询结束日期 0000-00-00
  */
  studentGetPeriodCourse: function (startDate, endDate) {
    let that = this
    var params = {
      "token": wx.getStorageSync("token"),
      "uid": wx.getStorageSync("uid"),
      "startdate" : startDate,
      "enddate" : endDate,
    }
    app.ljjw.jwGePeriodCourse(params).then(d => {
      if (d.data.status == 1) {
        let data = d.data.data
        let dots = data.info
        that.dotsDataDeal(dots)
      }
    })
  },

  /**
   * 学生 按日期段 获取考勤信息
   * startDate: 查询开始日期 0000-00-00
   * endDate：查询结束日期 0000-00-00
  */
  studentGetPeriodCheckon: function (startDate, endDate) {
    let that = this
    var params = {
      "token": wx.getStorageSync("token"),
      "uid": wx.getStorageSync("uid"),
      "startdate" : startDate,
      "enddate" : endDate,
    }
    app.ljjw.jwGetPeriodsCheckon(params).then(d => {

      if (d.data.status == 1) {
        let data = d.data.data

        var dots = data.info
        that.dotsDataDeal(dots)

        var colors = data.period_info
        that.setData({
          calendarColors: colors
        })
      }
    })
  },

  /**
   * 老师/教务/管理员 按日期段 获取考勤信息
  */
  teacherGetPeriodCheckon: function (startDate, endDate) {
    let that = this
    var params = {
      "token": wx.getStorageSync("token"),
      "uid": wx.getStorageSync("uid"),
      "startdate" : startDate,
      "enddate" : endDate,
      "type" : that.data.type == 2 ? '1' : '2'
    }
    app.ljjw.jwGetDayList(params).then(d => {
      if (d.data.status == 1) {
        let data = d.data.data
        if (data && data != '') {
          this.dotsDataDeal(data)
        }
      }
    })
  },

  /**
   * 管理员 获取 请假消息 数量
  */
  adminGetUnreadLeaveNoti: function () {
    let that = this
    let params = {
      "token": wx.getStorageSync("token"),
      "uid": wx.getStorageSync("uid"),
    }
    app.ljjw.jwAdminGetUnreadAskforleave(params).then(d=>{
      let status = d.data.status
      if (status == 1) {
        let redCount = d.data.data
        if (redCount != '') {
          that.setData({
            red_num: redCount
          })
        } else {
          that.setData({
            red_num: 0
          })
        }
      } else {
        that.setData({
          red_num: 0
        })
      }
    })
  },

  /**
   * 管理员 - 获取请假列表
  */
  adminGetLeaveList: function (cb) {
    let that = this
    let params = {
      "token": wx.getStorageSync("token"),
      "uid": wx.getStorageSync("uid"),
      "page": that.pageData.page,
      "limit": that.pageData.perpage,
    }
    app.ljjw.jwAdminViewAskforleaveList(params).then(d=>{
      let status = d.data.status
      if (status == 1) {
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
              // status_text = "待管理员审核"
              // status_color = "#b4b4b4"
              status_text = "审核通过"
              status_color = "#46bf6a"
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

          for (var j = 0; j < leave.verify_list.length; j++) {
            let verify = leave.verify_list[j]
            if (j==0) {
              verify.title = "教务审核通过"
              verify.type = 1
            } else if (j == 1) {
              if (verify.verify_status == 1) {
                verify.title = "管理员审核通过"
                verify.type = 3
              } else {
                verify.title = "管理员审核驳回"
                verify.type = 4
              }
            }
          }
          leave.verify_list.unshift({
            type: 0,
            title: "发起",
            verify_time: leave.createtime
          })

          // 老师头像处理
          if (leave.course && leave.course != '') {
            for (var j = 0; j < leave.course.length; j++) {
              let course = leave.course[j]
              if (!course.avatar || course.avatar.indexOf('http') == -1) {
                course.avatar = '../../images/avatar_null.png'
              } 
            }
          }
        }
        // 分页数据处理
        var newLeaveArray = []
        if (that.pageData.page != 1) {
          newLeaveArray = that.data.admin_aud_leave.concat(admin_aud_leave)
        } else {
          newLeaveArray = admin_aud_leave
        }
        // 是否可以加载下一页
        if (admin_aud_leave.length < that.pageData.perpage) {
          that.pageData.canLoadNextPage = false
        } else {
          that.pageData.canLoadNextPage = true
        }
        that.setData({
          admin_aud_leave: newLeaveArray
        })
        typeof cb == "function" && cb(true, "加载成功")
      } else {
        that.setData({
          admin_aud_leave: ''
        })
        typeof cb == "function" && cb(false, "加载失败")
      }
    })
  },

  /**
   * 管理员 将请假消息变为已读
  */
  adminReadLeave: function(ask_id, cb) {
    let that = this
    let params = {
      "token": wx.getStorageSync("token"),
      "uid": wx.getStorageSync("uid"),
      ask_id: ask_id,
    }
    app.ljjw.jwUpdateAdminsaw(params).then(d=>{
      let status = d.data.status
      if(status == 1) {
        typeof cb == "function" && cb(true, "加载成功")
      } else {
        typeof cb == "function" && cb(false, "加载失败")
      }
    })
  },

  /**
   * 教务获取请假列表
  */
  jw_askfor:function(cb){
    let that = this
    if(that.data.aud == 0){
      var params = {
        "token": wx.getStorageSync("token"),
        "uid": wx.getStorageSync("uid"),
        "type": 1,
        page: that.pageData.page,
        limit: that.pageData.perpage
      }
      // console.log(params)
      app.ljjw.jwJiaowuGetAskforleaveList(params).then(d => {
        
        if (d.data.status == 1) {
          // console.log(d)
          var hm_unaud_leave = d.data.data
          
          for(var i=0;i<hm_unaud_leave.length;i++){
            // 默认收起
            hm_unaud_leave[i].submit = false
            // 老师头像处理
            let leave = hm_unaud_leave[i]
            if (leave.course && leave.course != '') {
              for (var j = 0; j < leave.course.length; j++) {
                let course = leave.course[j]
                if (!course.avatar || course.avatar.indexOf('http') == -1) {
                  course.avatar = '../../images/avatar_null.png'
                }
              }
            }
          }
          // 处理分页数据
          var newLeaveArray = []
          if (that.pageData.page > 1) {
            newLeaveArray = that.data.hm_unaud_leave.concat(hm_unaud_leave)
          } else {
            newLeaveArray = hm_unaud_leave
          }
          that.setData({
            hm_unaud_leave: newLeaveArray
          })

          // 判断是否可以加载下一页
          if (hm_unaud_leave.length < that.pageData.perpage) {
            that.pageData.canLoadNextPage = false
          } else {
            that.pageData.canLoadNextPage = true
          }
          typeof cb == "function" && cb(true, "加载成功")
          // console.log(that.data.hm_unaud_leave)
        } else {
          that.setData({
            hm_unaud_leave: ''
          })
          typeof cb == "function" && cb(false, "加载失败")
        }
        console.log("我是教务请假待审核")
      })
    } else if (that.data.aud == 1){
      var params = {
        "token": wx.getStorageSync("token"),
        "uid": wx.getStorageSync("uid"),
        "type": 2,
        page: that.pageData.page,
        limit: that.pageData.perpage,
      }
      // console.log(params)
      app.ljjw.jwJiaowuGetAskforleaveList(params).then(d => {
        // console.log(d)
        if (d.data.status == 1) {
          var hm_aud_leave = d.data.data
          
          for (var i = 0; i < hm_aud_leave.length;i++){

            // 默认收起
            var leave = hm_aud_leave[i]
            leave.fold = false

            // 假条状态
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
                status_text = "审核通过"
                status_color = "#46bf6a"
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

            // 审核流程
            for (var j = 0; j < leave.verify_list.length; j++) {
              let verify = leave.verify_list[j]
              if (j==0) {
                verify.title = "教务审核通过"
                verify.type = 1
              } else if (j == 1) {
                if (verify.verify_status == 1) {
                  verify.title = "管理员审核通过"
                  verify.type = 3
                } else {
                  verify.title = "管理员审核驳回"
                  verify.type = 4
                }
              }
            }
            leave.verify_list.unshift({
              type: 0,
              title: "发起",
              verify_time: leave.createtime
            })

            // 老师头像处理
            if (leave.course && leave.course != '') {
              for (var j = 0; j < leave.course.length; j++) {
                let course = leave.course[j]
                if (!course.avatar || course.avatar.indexOf('http') == -1) {
                  course.avatar = '../../images/avatar_null.png'
                }
              }
            }
          }
          // 分页数据处理
          var newLeaveArray = []
          if (that.pageData.page > 1) {
            newLeaveArray = that.data.hm_aud_leave.concat(hm_aud_leave)
          } else {
            newLeaveArray = hm_aud_leave
          }

          // 判断是否可以加载下一页
          if (hm_aud_leave.length < that.pageData.perpage) {
            that.pageData.canLoadNextPage = false
          } else {
            that.pageData.canLoadNextPage = true
          }
          that.setData({
            hm_aud_leave: newLeaveArray
          })
          typeof cb == "function" && cb(true, "加载成功")
          // console.log(that.data.hm_aud_leave)
        } else {
          that.setData({
            hm_aud_leave: ''
          })
          typeof cb == "function" && cb(false, "加载失败")
        }
        console.log("教务请假已审核")
      })
    }
    
  },

  /*--------------------------------------------触发事件-------------------------------------------------*/
  /**
   * 顶部菜单栏 点击事件
   */ 
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

    if (that.data.noPower) {
      return
    }
    var riqi = ""
    if (that.data.clickDate) {
      riqi = that.data.clickDate
    } else {
      riqi = that.data.nowDate
    }

    that.loadData(riqi)
  },

  /**
   * 请假 待审核/已审核 点击事件
  */
  aud_select : function(e){
    let that = this
    var aud = e.currentTarget.dataset.aud
    if (aud == that.data.aud) {
      return
    }
    that.pageData.page= 1
    that.setData({
      aud:aud
    })
    if (that.data.noPower) {
      return
    }
    if (that.data.role == 4){
      //学生
      that.studentGetLeaveList()
    }
    /*
    else if (that.data.role == 3){
      // 管理员
      that.admin_askfor()
      that.AskforleaveCount(2)
    }
    */
    else if (that.data.role == 2) {
      // 教务
      that.jw_askfor()
      that.AskforleaveCount(1)
    }

  },

  /**
   * 天 点击事件
  */
  dayClicked: function (e) {
    let that = this
    console.log(e)
    let dateStr = e.detail.dateStr
    that.setData({
      clickDate: dateStr
    })
    switch (that.data.type*1) {
      case 2: {
        // 课表
        switch (that.data.role*1) {
          case 1: {
            // 老师
            that.teacherGetCheckOnList(dateStr)
            break
          }
          case 2: {
            // 教务
            that.teacherGetCheckOnList(dateStr)
            break
          }
          case 3: {
            // 管理员
            that.teacherGetCheckOnList(dateStr)
            break
          }
          case 4: {
            // 学生
            that.StudentGetDayCourse(dateStr)
            break
          }
        }
        break
      }
      case 3: {
        // 考勤
        switch (that.data.role*1) {
          case 1: {
            // 老师
            that.teacherGetCheckOnList(dateStr)
            break
          }
          case 2: {
            // 教务
            that.teacherGetCheckOnList(dateStr)
            break
          }
          case 3: {
            // 管理员
            that.teacherGetCheckOnList(dateStr)
            break
          }
          case 4: {
            // 学生
            that.StudentGetDayCheckon(dateStr)
            break
          }
        }
        break
      }
    }
  },

  /**
   * 日历时间段改变回调
  */
  datePeriodChange: function (e) {
    console.log(e)
    let startDate = e.detail.startDate.dateStr
    let endDate = e.detail.endDate.dateStr
    switch (this.data.type * 1) {
      case 2: {
        // 课表
        switch(this.data.role *1) {
          case 1: {
            // 老师
            this.teacherGetPeriodCheckon(startDate, endDate)
            break
          }
          case 2: {
            // 教务
            this.teacherGetPeriodCheckon(startDate, endDate)
            break
          }
          case 3: {
            // 管理员
            break
          }
          case 4: {
            // 学生
            this.studentGetPeriodCourse(startDate, endDate)
            break
          }
        }
        break
      }
      case 3: {
        // 考勤
        switch(this.data.role *1) {
          case 1: {
            // 老师
            this.teacherGetPeriodCheckon(startDate, endDate)
            break
          }
          case 2: {
            // 教务
            this.teacherGetPeriodCheckon(startDate, endDate)
            break
          }
          case 3: {
            // 管理员
            this.teacherGetPeriodCheckon(startDate, endDate)
            break
          }
          case 4: {
            // 学生
            this.studentGetPeriodCheckon(startDate, endDate)
            break
          }
        }
        break
      }
    }
  },

  /**
   * 管理员 假条 点击展开/关闭
  */
  admin_aud_fold: function (e) {
    let that = this
    var aud_xb = e.currentTarget.dataset.aud_xb
    console.log(aud_xb)
    var cs = "admin_aud_leave[" + aud_xb + "].fold"
    let leave = that.data.admin_aud_leave[aud_xb]
    if (leave.fold) {
      // 关闭
      that.setData({
        [cs]: false
      })
    } else {
      // 展开
      if(leave.adminsaw == 1) {
        that.setData({
          [cs]: true
        })
      } else {
        that.adminReadLeave(leave.id, function(success, msg){
          if (success) {
            let adminsawStr = "admin_aud_leave[" + aud_xb + "].adminsaw"
            that.setData({
              [cs]: true,
              [adminsawStr]: 1
            })
          } else {
            that.setData({
              [cs]: true
            })
          }
          that.adminGetUnreadLeaveNoti()
        })
      }
    }

  },
})
