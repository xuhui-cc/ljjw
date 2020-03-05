// pages/stu-task/stu-task.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    finish:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    var params = {
      "token": wx.getStorageSync("token"),
      "uid": wx.getStorageSync("uid"),
    }
    console.log(params)
    app.ljjw.jwStudentTaskNotFinished(params).then(d => {
      // console.log(d)
      if (d.data.status == 1) {
        console.log(d.data.data)
        that.setData({
          task: d.data.data
        })
        for (var i = 0; i < that.data.task.length;i++){
          if(that.data.task[i].type == 2){
            for (var j = 0; j < that.data.task[i].task_detail.length;j++){
              // console.log(j)
              console.log(that.data.task[i].task_detail[j].options.lists)
              var arr = []
              for (let k in that.data.task[i].task_detail[j].options.lists) {
                arr.push(that.data.task[i].task_detail[j].options.lists[k]); //属性
                console.log(arr)
                // that.data.task[i].task_detail[j].options.list.push(arr)
                var cs = "task["+ i +"].task_detail[" + j + "].options.list"
                that.setData({
                  [cs]: arr
                })
              }
              // console.log(that.data.task[i].task_detail[j].options.lists);
              // console.log(that.data.task[i].task_detail[j].options.lists.length)
              for (var k = 0; k < that.data.task[i].task_detail[j].options.list.length;k++){
                 var css = "task[" + i + "].task_detail[" + j + "].options.list"
                var newarray = [{
                  item: String.fromCharCode(65 + k),
                  id: that.data.task[i].task_detail[j].options.list[k]
                }];


                that.setData({
                  [css]:that.data.task[i].task_detail[j].options.list.concat(newarray)
                });
                
                // var css = "task[" + i + "].task_detail[" + j + "].options.list[" + k + "]"
                // that.setData({
                //   [css]: String.fromCharCode(65 + k)
                // })
              }
              
            }
          }
        }
        // console.log(that.data.task[1])
        console.log("学生任务列表获取成功")
      }


    })
  },

  reject_for:function(e){
    let that = this
    console.log(e.detail.value)
    that.setData({
      reject_reason: e.detail.value
    })
    if (e.detail.value != ''){
      that.setData({
        isreject: true
      })
    }else{
      that.setData({
        isreject: false
      })
    }
  },

  reject:function(){
    let that = this
    var params = {
      "token": wx.getStorageSync("token"),
      "uid": wx.getStorageSync("uid"),
      "tid":1,
      "type": 2,
      "reason": that.data.reject_reason
    }
    console.log(params)
    app.ljjw.jwStudentCheckonVerify(params).then(d => {
      console.log(d)
      // if (d.data.status == 1) {
      //   console.log(d.data.data)
      //   that.setData({
      //     stu_class: d.data.data
      //   })
      //   console.log("所有班级获取成功")
      // }


    })
  },

  finish_select: function (e) {
    let that = this
    var finish = e.currentTarget.dataset.finish
    that.setData({
      finish: finish
    })
    if(finish == 0){
      var params = {
        "token": wx.getStorageSync("token"),
        "uid": wx.getStorageSync("uid"),
      }
      console.log(params)
      app.ljjw.jwStudentTaskNotFinished(params).then(d => {
        console.log(d)
        if (d.data.status == 1) {
          console.log(d.data.data)
          that.setData({
            task: d.data.data
          })
          console.log("学生任务待完成获取成功")
        }


      })
    }else{
      var params = {
        "token": wx.getStorageSync("token"),
        "uid": wx.getStorageSync("uid"),
      }
      console.log(params)
      app.ljjw.jwStudentTaskFinished(params).then(d => {
        console.log(d)
        if (d.data.status == 1) {
          console.log(d.data.data)
          that.setData({
            task: d.data.data
          })
          console.log("学生任务已完成获取成功")
        }else{
          // that.setData({
          //   finish_task : ''
          // })
        }


      })
    }
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