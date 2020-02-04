//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    type: 2,
    aud: 0,
    role: 0,    //role：0 -学生；1 -老师；2 -教务；3 -管理员
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
    calendarfold: true
  },
  //事件处理函数
  
  onLoad: function () {
    let that = this;
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
  },

  menu_select:function(e){
    let that = this
    var type = e.currentTarget.dataset.type
    console.log(type)
    that.setData({
      type : type
    })

  },

  aud_select : function(e){
    let that = this
    var aud = e.currentTarget.dataset.aud
    that.setData({
      aud:aud
    })
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

    // for (let qq = 0; qq < weekData.length; qq++){
    //   // console.log(weekData[qq][0])
    //   for (let ww = 0; ww < weekData[qq].length; ww++){
    //     // console.log(weekData[qq][ww])
    //     if (weekData[qq][ww] == nowgetdate.getDate() ){
    //       // console.log(weekData[qq][ww])
    //       weekData[qq][ww] = "今"
    //     }
    //   }
    // }

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
    // let nowWeekData = weekData.filter((weekItem) => {
    //   if (weekItem.indexOf(new Date().getDate()) !== -1) {
    //     return weekItem
    //   }
    //   //  console.log(nowWeekData)
    // })
    // console.log(nowWeekData[0])
    
    
     


    // for(let qq = 0; qq < that.data.nowWeekData.length ; qq ++){
    //   // console.log(that.data.nowDay)
    //   var cs = "nowWeekData[" + qq + "]"//添加键值对
    //   if (that.data.nowWeekData[qq] == nowgetdate.getDate()){
    //     console.log("今")
    //     that.setData({
    //       [cs] : "今"
    //     })
    //   }
    // }
  },

  //点击某一天
  clickDay(e) {
    if (e.currentTarget.dataset.day === -1) return;
    this.setData({
      showDay: e.currentTarget.dataset.day,
      clickDay: e.currentTarget.dataset.day,
    })
  },
  // //更改显示的日期
  // bindDateChange(e) {
  //   let date = e.detail.value.split('-');
  //   console.log(date)
  //   this.setData({
  //     showYear: date[0],
  //     showMonth: date[1],
  //     showDay: date[2],
  //     clickYear: date[0],
  //     clickMonth: date[1],
  //     clickDay: date[2],
  //     calendarfold: false,
  //   })
  //   this.getMonthData(date[0], date[1])
  // },
  //折叠日历
  foldAndUnfold() {
    let that = this;
    that.setData({
      calendarfold: !that.data.calendarfold
    })
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
