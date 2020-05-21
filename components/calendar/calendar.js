// component/calendar/calendar.js

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    dots: {
      type: Array,
      value: [],
    },
    colors: {
      type: Array,
      value: []
    },
    top: {
      type: String,
      value: '0rpx',
    }
  },

  observers: {
    'dots': function(dots) {
      console.log('监听到dots改变')
      console.log(dots)
      this.setDots(dots)
    },
    'colors': function (colors) {
      console.log('监听到colors改变')
      console.log(colors)
      this.setColors(colors)
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    // 日历展示类型 1，按周显示 2，按月显示
    dateShowType: 1,
    // 显示的年
    showYear: null,
    // 显示的月
    showMonth: null,
    // 天对象数组
    calenderDataArray: [],
    // 日历高度
    calenderHeight: 0,

    // 选中的天对象
    selectedDay: null,

    // 当天 Date对象
    nowDate: null,

    calenderData: {
      dayItemArray: [],
      lastDayItemArray: [],
      nextDayItemArray: [],
      currentCalenderIndex: 0,
    },
  },

  pageLifetimes: {
    show: function () {
      console.log("calender组件所在页面出现")
      this.reloadCalendarData()
    }
  },

  lifetimes: {
    attached: function () {
      console.log("calender组件进入页面节点树")
      this.reloadCalendarData()
    },
    detached: function () {
      console.log("calender组件实例被从页面节点树移除")
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /*--------------------------------------日历数据处理--------------------------------------*/
    /**
     * 初始化/刷新日历数据
    */
    reloadCalendarData: function () {
      
      this.data.nowDate = new Date()
      if (!this.data.selectedDay) {
        var today_item = this.createDayItem(this.data.nowDate, true)
        today_item.selected = true
        this.data.selectedDay = today_item
      }

      this.getDayArray(this.data.selectedDay)
      this.triggerEvent('dayClicked', this.data.selectedDay)
    },


    /**
     * 获取日历(天)数据
    */
    getDayArray: function (dayItem) {
      if (this.data.dateShowType == 1) {
        // 按周显示
        this.getWeekDayArray(dayItem)
      } else {
        // 按月显示
        this.getMonthDayArray(dayItem, 0)
      }
      this.sortCalenderDayArray()

      let startDay_item = this.data.calenderData.dayItemArray[0]
      let endDay_item = this.data.calenderData.dayItemArray[this.data.calenderData.dayItemArray.length - 1]
      this.triggerEvent("datePeriodChange", {"startDate":startDay_item, "endDate":endDay_item})
    },


    /**
     * 按周获取（天）数据
    */
    getWeekDayArray: function (dayItem) {
      let weekDay = dayItem.date.getDay()
      let date = dayItem.date
      var dayArray = []
      var nextDayArray = []
      var lastDayArray = []

      // 向前补足
      for (var i = 0; i < weekDay; i++) {
        let minusDayCount = weekDay-i
        let preDate = new Date(date.getTime() - 24*60*60*1000*minusDayCount)
        var preDay_item = this.createDayItem(preDate, true)
        dayArray.push(preDay_item)
      }
      
      // 添加自己
      dayArray.push(dayItem)

      // 向后补足
      for (var i = weekDay+1; i < 7; i++) {
        let addDatCount = i-weekDay
        let nextDate = new Date(date.getTime()+ 24*60*60*1000*addDatCount)
        var nextDay_item = this.createDayItem(nextDate, true)
        dayArray.push(nextDay_item)
      }

      // 下一页数据
      let lastDay_item = dayArray[dayArray.length-1]
      for(var i=0; i < 7; i++) {
        let addDayCount = i+1
        let nextDate = new Date(lastDay_item.date.getTime()+ 24*60*60*1000*addDayCount)
        var nextDay_item = this.createDayItem(nextDate, true)
        nextDayArray.push(nextDay_item)
      }

      // 上一页数据
      let firstDay_item = dayArray[0]
      for (var i = 0; i < 7; i++) {
        let minusDayCount = 7-i
        let preDate = new Date(firstDay_item.date.getTime() - 24*60*60*1000*minusDayCount)
        var preDay_item = this.createDayItem(preDate, true)
        lastDayArray.push(preDay_item)
      }

      this.data.calenderData.dayItemArray = dayArray
      this.data.calenderData.nextDayItemArray = nextDayArray
      this.data.calenderData.lastDayItemArray = lastDayArray
      this.setData({
        calenderHeight: 93+55+82,
      })

      this.setShowYearMonth()
      
    },

    /**
     * 按月获取（天）数据
     * dayItem: 显示的其中一天 天对象
     * type: 0-获取当前月数据  1-获取上一月数据  2-获取下一月数据
    */
    getMonthDayArray: function (dayItem, type) {
      let month = dayItem.month
      let year = dayItem.year
      let monthDayCount = (new Date(year, month, 0)).getDate()
      var dayItemArray = []
      
      for (var i = 0; i < monthDayCount; i++) {
        let date = new Date(year, month-1, i+1)
        let day_item = this.createDayItem(date, true)
        dayItemArray.push(day_item)
      }
      
      let firstDay_item = dayItemArray[0]
      let firstDay_weekDay = firstDay_item.date.getDay()

      let lastDay_item = dayItemArray[dayItemArray.length-1]
      let lastDay_weekDay = lastDay_item.date.getDay()

      // 向前补足
      for (var i=firstDay_weekDay-1; i >=0; i--) {
        let minusDayCount = firstDay_weekDay-i
        let preDate = new Date(firstDay_item.date.getTime() - 24*60*60*1000*minusDayCount)
        var preDay_item = this.createDayItem(preDate, false)
        dayItemArray.unshift(preDay_item)
      }
      
      // 向后补足
      for (var i = lastDay_weekDay+1; i < 7; i++) {
        let addDatCount = i-lastDay_weekDay
        let nextDate = new Date(lastDay_item.date.getTime()+ 24*60*60*1000*addDatCount)
        var nextDay_item = this.createDayItem(nextDate, false)
        dayItemArray.push(nextDay_item)
      }

      switch(type) {
        case 0: {
          // 获取当前月数据
          this.data.calenderData.dayItemArray = dayItemArray

          this.setData({
            calenderHeight: (dayItemArray.length/7) * 93 + 55 + 82
          })
      
          this.setShowYearMonth()

          let lastMonthDayDate = new Date(firstDay_item.date.getTime()-24*60*60*1000)
          let lastMonthDay_item = this.createDayItem(lastMonthDayDate, true)
          this.getMonthDayArray(lastMonthDay_item, 1)
          break
        }
        case 1: {
          // 获取上一月数据
          this.data.calenderData.lastDayItemArray = dayItemArray
          
          let nextMonthDayDate = new Date(this.data.calenderData.dayItemArray[this.data.calenderData.dayItemArray.length-1].date.getTime() + 24*60*60*1000)
          let nextMonthDay_item = this.createDayItem(nextMonthDayDate, true)
          this.getMonthDayArray(nextMonthDay_item, 2)
          break
        }
        case 2: {
          // 获取下一月数据
          this.data.calenderData.nextDayItemArray = dayItemArray
          break;
        }
      }
    },

    /**
     * 设置当前展示年/月
    */
    setShowYearMonth: function () {
      var showMonthYearItem = null
      for (var i = 0; i < this.data.calenderData.dayItemArray.length; i++) {
        let day_item = this.data.calenderData.dayItemArray[i]
        if (day_item.selected && day_item.canClicked) {
          showMonthYearItem = day_item
          break
        }
      }
      if (!showMonthYearItem) {
        showMonthYearItem = this.data.calenderData.dayItemArray[6]
      }
      this.setData({
        showYear: showMonthYearItem.year,
        showMonth: showMonthYearItem.month
      })
    },

    /**
     * 日历翻页根据索引值排序
    */
    sortCalenderDayArray: function () {
      var sortArray = []
      switch(this.data.calenderData.currentCalenderIndex*1) {
        case 0: {
          sortArray = [this.data.calenderData.dayItemArray, this.data.calenderData.nextDayItemArray, this.data.calenderData.lastDayItemArray]
          break
        }
        case 1: {
          sortArray = [this.data.calenderData.lastDayItemArray, this.data.calenderData.dayItemArray, this.data.calenderData.nextDayItemArray]
          break
        }
        case 2: {
          sortArray = [this.data.calenderData.nextDayItemArray, this.data.calenderData.lastDayItemArray, this.data.calenderData.dayItemArray]
          break
        }
      }
      this.setData({
        calenderDataArray: sortArray
      })
    },

    /**
     * 创建天对象
     * date: Date对象
     * canClicked: 是否有点击事件
    */
    createDayItem: function (date, canClicked) {
      let day = date.getDate()
      let month = date.getMonth()+1
      let year = date.getFullYear()

      var selected = false
      if (this.data.selectedDay) {
        let selectedDay = this.data.selectedDay.day
        let selectedMonth = this.data.selectedDay.month
        let selectedYear = this.data.selectedDay.year
        if (day == selectedDay && month == selectedMonth && year == selectedYear) {
          selected = true
        }
      }

      var isToday = false
      if (this.data.nowDate) {
        let nowDay = this.data.nowDate.getDate()
        let nowMonth = this.data.nowDate.getMonth()+1
        let nowYear = this.data.nowDate.getFullYear()
        if (day == nowDay && month == nowMonth && year == nowYear) {
          isToday = true
        }
      }

      return {
        date: date,
        day: day,
        month: month,
        year: year,
        dateStr: this.formatDate(date),
        // 是否被选择
        selected: selected,
        // 是否是今天
        isToday: isToday,
        // 是否有点击事件
        canClicked: canClicked,
        // 打点类型 0-不打点  1-打绿点  2-打红点
        dotType: 0,
        // 背景颜色类型 0-无颜色  1-蓝色   2-橙色
        bgColor: 0,
      }
    },

    /**
     * 设置打点数据
    */
    setDots: function (dots) {
      var setData = false
      for (var i = 0; i < this.data.calenderData.dayItemArray.length; i++) {
        let day_item = this.data.calenderData.dayItemArray[i]
        if (!day_item.canClicked) {
          continue
        }
        for (var j=0; j < dots.length; j++) {
          let dot = dots[j]
          if (dot.riqi == day_item.dateStr) {
            day_item.dotType = dot.type
            setData = true
          }
        }
      }
      
      this.sortCalenderDayArray()
    },

    /**
     * 设置颜色数据
    */
    setColors: function (colors) {
      for (var i = 0; i < colors.length; i++) {
        let colorPeriod = colors[i]

        if (!colorPeriod.startriqi || colorPeriod.startriqi == '' || !colorPeriod.endriqi || colorPeriod.endriqi == '') {
          continue
        }
        let startDate = new Date(colorPeriod.startriqi)
        // let startYear = startDate.getFullYear()
        // let startMonth = startDate.getMonth()+1
        // let startDay = startDate.getDate()
        let startDateStr = this.formatDate(startDate)

        let endDate = new Date(colorPeriod.endriqi)
        // let endYear = endDate.getFullYear()
        // let endMonth = endDate.getMonth()+1
        // let endDay = endDate.getDate()
        let endDateStr = this.formatDate(endDate)

        if (endDateStr < startDateStr) {
          continue
        }
        var start = false
        for (var j = 0; j < this.data.calenderData.dayItemArray.length; j++) {
          var day_item = this.data.calenderData.dayItemArray[j]
          if (start) {
            if (day_item.dateStr > endDateStr) {
              start = false
              break
            }
            day_item.bgColor = (i%2)+1
            if (day_item.dateStr == endDateStr) {
              start = false
              break
            }
          } else {
            if (day_item.dateStr == startDateStr) {
              day_item.bgColor = (i%2)+1
              start = true
            }
          }
        }
      }

      this.sortCalenderDayArray()
    },

    /*-----------------------------------------------工具------------------------------------------------*/
    /**
     * 格式化 日期
     * date：Date对象
    */
    formatDate: function(date) {
      let year = date.getFullYear()
      let month = date.getMonth()+1
      let day = date.getDate()
      
      var dateStr = year
      if (month < 10) {
        dateStr = dateStr + "-" + "0" + month
      } else {
        dateStr = dateStr + "-" + month
      }

      if (day < 10) {
        dateStr = dateStr + "-" + "0" + day
      } else {
        dateStr = dateStr + "-" + day
      }
      
      return dateStr
    },

    /*--------------------------------------------事件响应------------------------------------------------*/
    /**
     * 日历 周显示/月显示 切换按钮 点击事件
    */
    showClaenderButtonClicked: function (e) {
      if (this.data.dateShowType == 1) {
        // 按周显示 切换为 按月显示
        this.setData({
          dateShowType: 2
        })
        let date = new Date(this.data.showYear, this.data.showMonth-1, 1)
        let day_item = this.createDayItem(date, true)
        
        this.getDayArray(day_item)
      } else {
        // 按月显示 切换 按周显示
        this.setData({
          dateShowType: 1
        })
        var showDay_item = this.data.calenderData.dayItemArray[6]
        if(this.data.selectedDay.month == this.data.showMonth && this.data.selectedDay.year == this.data.showYear) {
          showDay_item = this.data.selectedDay
        }
        this.getDayArray(showDay_item)
      }
    },

    /**
     * 天 点击事件
    */
    dayItemClicked: function (e) {
      // console.log(e)
      let index = e.currentTarget.dataset.index
      var day_item = this.data.calenderData.dayItemArray[index]
      if (!day_item.canClicked) {
        return
      }
      if (day_item.selected) {
        return
      }
      day_item.selected = true
      for(var i=0; i < this.data.calenderData.dayItemArray.length; i++) {
        var item = this.data.calenderData.dayItemArray[i]
        if (item.dateStr == this.data.selectedDay.dateStr) {
          item.selected = false
          break
        }
      }
      this.data.selectedDay = day_item
      this.sortCalenderDayArray()
      this.setData({
        showMonth: day_item.month,
        showYear: day_item.year
      })
      
      this.triggerEvent('dayClicked', day_item)
    },

    /**
     * swiper索引值改变回调
    */
    calenderSwiperChange: function (e) {
      let index = e.detail.current*1
      this.data.calenderData.currentCalenderIndex = index
      let dayItemArray = this.data.calenderDataArray[index]
      this.getDayArray(dayItemArray[6])
    },

    /**
     * 上个月 按钮 点击事件
    */
    lastArrowClicked: function (e) {
      this.setData({
        dateShowType: 2,
      })
      let nowMonthDate = new Date(this.data.showYear, this.data.showMonth-1, 1)
      let lastMonthDate = new Date(nowMonthDate.getTime()-24*60*60*1000)
      let lastMonthDay_item = this.createDayItem(lastMonthDate, true)
      this.getDayArray(lastMonthDay_item)
    },

    /**
     * 下个月 按钮 点击事件
    */
    nextArrowClicked: function (e) {
      this.setData({
        dateShowType: 2,
      })
      let nowMonthDate = new Date(this.data.showYear, this.data.showMonth, 0)
      let lastMonthDate = new Date(nowMonthDate.getTime()+24*60*60*1000)
      let lastMonthDay_item = this.createDayItem(lastMonthDate, true)
      this.getDayArray(lastMonthDay_item)
    }
  }
})
