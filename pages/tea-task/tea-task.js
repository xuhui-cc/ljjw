// pages/tea-task/tea-task.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  back: function () {
    wx.navigateBack({
      delta: 1  // 返回上一级页面。
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    that.setData({
      class_id:options.class_id
    })
    var params = {
      "token": wx.getStorageSync("token"),
      "uid": wx.getStorageSync("uid"),
      "class_id":that.data.class_id
    }
    // console.log(params)
    app.ljjw.jwTeacherTasks(params).then(d => {
      // console.log(d)
      if (d.data.status == 1) {
        // console.log(d.data.data)

        var data = d.data.data

        for(var i=0;i<data.length;i++){
          var task = data[i]

          task.finished_students = task.finished_students.join("、")
          task.notfinished_students = task.notfinished_students.join("、")
          task.fold = false

          if (task.type == 1){
            // 普通任务
            if (task.attach != '') {
              task.attach = task.attach.split(",")
            } else {
              task.attach = []
            }
            
          } else if (task.type == 2) {
            // 选项任务

            var titles = []
            if (task.title && task.title != '') {
              titles = task.title.split(",")
            }

            for (var j= 0; j < task.task_detail.length; j++) {
              var taskDetail = task.task_detail[j]
              
              // 标题
              if (titles.length > j) {
                var title = titles[j]
                if (titles.length > 1) {
                  title = (j+1)+". "+title
                }
                taskDetail.title = title
              }

              var childTitles = []
              if (taskDetail.child_title && taskDetail.child_title != '') {
                childTitles = taskDetail.child_title.split(",")
              }
              
              for (var k = 0; k < taskDetail.options.length; k++) {
                var option = taskDetail.options[k]

                // 子标题
                if (childTitles.length > k) {
                  var subtitle = childTitles[k]
                  if (childTitles.length > 1) {
                    subtitle = "("+(k+1)+") "+subtitle
                  }
                  option.title = subtitle
                }
                
                // 选项
                var values = Object.values(option.lists)
                var list = []
                for (var w=0; w < values.length; w++) {
                  var value = {
                    index: String.fromCharCode(65 + w),
                    value: values[w]
                  }
                  list.push(value)
                }
                option.list = list
              }
            }
          }
          
        }

        that.setData({
          task: data
        })
        console.log("老师任务获取成功")
      }


    })
  },

  previewImg: function (e) {
    let that = this
    var xb = e.currentTarget.dataset.xb
    var dxb = e.currentTarget.dataset.dxb
    console.log(dxb)
    console.log(xb)
    var imgs = that.data.task[dxb].attach
    wx.previewImage({
      current: that.data.task[dxb].attach[xb],
      urls: imgs
    })

  },

  fold:function(e){
    let that = this
    var xb = e.currentTarget.dataset.xb
    var task = that.data.task[xb]
    var cs = "task[" + xb + "].fold"
    that.setData({
      [cs]:!task.fold
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