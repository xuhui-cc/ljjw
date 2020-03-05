// pages/stu-task/stu-task.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    finish:0,
    img: [],
    imgs: []
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
              for (var k = 0; k < that.data.task[i].task_detail[j].options.list.length;k++){
                var css = "task[" + i + "].task_detail[" + j + "].options.list[" + k + "].item"
                var csss = "task[" + i + "].task_detail[" + j + "].options.list[" + k + "].option"
                console.log(that.data)
                that.setData({
                  [css]: that.data.task[i].task_detail[j].options.list[k],
                  [csss]: String.fromCharCode(65 + k)
                })
               
              }
              
            }
          } else if (that.data.task[i].type == 3) {
            for (var j = 0; j < that.data.task[i].task_detail.length; j++) {
              // console.log(j)
              console.log(that.data.task[i].task_detail[j].fieldlist.lists)
              var arr = []
              for (let k in that.data.task[i].task_detail[j].fieldlist.lists) {
                arr.push(that.data.task[i].task_detail[j].fieldlist.lists[k]); //属性
                console.log(arr)
                // that.data.task[i].task_detail[j].fieldlist.list.push(arr)
                var cs = "task[" + i + "].task_detail[" + j + "].fieldlist.list"
                that.setData({
                  [cs]: arr
                })
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

  chooseImg() {
    let that = this;
    let count_img = 3

    let len = that.data.imgs.length;
    if (len < 3) {
      count_img = 3 - len
      console.log(count_img)
      wx.chooseImage({
        count: count_img,
        success: (res) => {
          let tempFilePaths = res.tempFilePaths;
          console.log(tempFilePaths)
          let imgs = [];

          for (let i = 0; i < tempFilePaths.length; i++) {

            var token = wx.getStorageSync('token');

            wx.uploadFile({
              url: 'http://cs.szgk.cn/api.php?',
              filePath: tempFilePaths[i],
              name: 'file',
              formData: {
                'file': tempFilePaths[i],
                "token": token,
                "action": "jwUploadAvatar", //action=uploads&authhash=445454554
              },
              success(r) {
                let hhh = JSON.parse(r.data);
                console.log(hhh)
                if (hhh.status == 1) {
                  that.data.img.unshift(hhh.data)

                  that.setData({
                    imgs: that.data.img
                  })

                  console.log(that.data.img)

                  // console.log(imgs)

                } else {
                  // that.setData({
                  //   img : imgs
                  // })
                  console.log('失败')
                  console.log(hhh.status)
                }




              }
            })

          }

        }
      })
    }

  },

  del_img: function (e) {
    let that = this
    var xb = e.currentTarget.dataset.xb
    console.log(xb)
    that.data.imgs.splice(xb, 1);
    that.setData({
      imgs: that.data.imgs
    })
    if (that.data.title != '' && that.data.imgs != '') {
      that.setData({
        submit: true
      })
    } else {
      that.setData({
        submit: false
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