const app = getApp()
Component({
  data: {
    color: "#7A7E83",
    selectedColor: "#3cc51f",
    list: [{
        pagePath: "/pages/index/index",
        iconPath: "/images/unselectCourse.png",
        selectedIconPath: "/images/selectCourse.png",
        text: "课表"
    }, {
        pagePath: "/pages/record/record",
        iconPath: "/images/unselectRecord.png",
        selectedIconPath: "/images/selectRecord.png",
        text: "成绩"
    },{
        pagePath: "/pages/task/task",
        iconPath: "/images/unselectTask.png",
        selectedIconPath: "/images/selectTask.png",
        text: "任务"
    }, {
        pagePath: "/pages/my/my",
        iconPath: "/images/unselectMy.png",
        selectedIconPath: "/images/selectMy.png",
        text: "我的"
    }]
  },
  attached() {
  },
  methods: {
    switchTab(e) {
      let that = this
      const data = e.currentTarget.dataset
      const url = data.path
      console.log(url)
      wx.switchTab({ url })
      that.setData({
        selected: data.index
      })
    }
  }
})