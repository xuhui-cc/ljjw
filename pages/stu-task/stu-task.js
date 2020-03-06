// pages/stu-task/stu-task.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    finish:0,
    img: [],
    imgs: [],
    submit_arr:[],
    type2_ans:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    that.un_task()
  },

  un_task:function(){
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

        for (var i = 0; i < that.data.task.length; i++) {
          var cs = "task[" + i + "].submit"
          that.setData({
            [cs]: false
          })

        }

        for (var i = 0; i < that.data.task.length; i++) {
          if (that.data.task[i].type == 2) {
            for (var j = 0; j < that.data.task[i].task_detail.length; j++) {
              // console.log(j)
              console.log(that.data.task[i].task_detail[j].options.lists)
              var arr = []
              for (let k in that.data.task[i].task_detail[j].options.lists) {
                arr.push(that.data.task[i].task_detail[j].options.lists[k]); //属性
                console.log(arr)
                var imgs = []
                var css = "task[" + i + "].task_detail[" + j + "].options.imgs"
                var cs = "task[" + i + "].task_detail[" + j + "].options.list"
                that.setData({
                  [cs]: arr,
                  [css]: imgs
                })
              }
              for (var k = 0; k < that.data.task[i].task_detail[j].options.list.length; k++) {
                var css = "task[" + i + "].task_detail[" + j + "].options.list[" + k + "].item"
                var csss = "task[" + i + "].task_detail[" + j + "].options.list[" + k + "].option"
                var cssss = "task[" + i + "].task_detail[" + j + "].options.list[" + k + "].select"
                console.log(that.data)
                that.setData({
                  [css]: that.data.task[i].task_detail[j].options.list[k],
                  [csss]: String.fromCharCode(65 + k),
                  [cssss]: false
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
                var imgs = []
                var css = "task[" + i + "].task_detail[" + j + "].fieldlist.imgs"
                // that.data.task[i].task_detail[j].fieldlist.list.push(arr)
                var cs = "task[" + i + "].task_detail[" + j + "].fieldlist.list"

                that.setData({
                  [cs]: arr,
                  [css]: imgs
                })
              }
              for (var k = 0; k < that.data.task[i].task_detail[j].fieldlist.list.length; k++) {
                var css = "task[" + i + "].task_detail[" + j + "].fieldlist.list[" + k + "].item"
                var csss = "task[" + i + "].task_detail[" + j + "].fieldlist.list[" + k + "].content"
                
                // console.log(that.data)
                that.setData({
                  [css]: that.data.task[i].task_detail[j].fieldlist.list[k],
                  [csss]: '',
                  
                })

              }

            }

          }
          else if (that.data.task[i].type == 1) {
            // for (var j = 0; j < that.data.task[i].task_detail.length; j++) {
            var imgs = []
            var css = "task[" + i + "].task_detail.imgs"
            that.setData({
              [css]: imgs
            })
            console.log("==========================================imgs")
            // }
          }


        }
        // console.log(that.data.task[1])
        console.log("学生任务列表获取成功")
      }


    })
  },

  select:function(e){
    let that = this;
    var task_index = e.currentTarget.dataset.task_index
    console.log(task_index + "task_index")
    var task_detail_index = e.currentTarget.dataset.task_detail_index
    console.log(task_detail_index + "task_detail_index")
    var list_index = e.currentTarget.dataset.list_index
    console.log(list_index + "list_index")
    for(var i=0;i<that.data.task.length;i++){
      if (i == task_index){
        for (var j = 0; j < that.data.task[i].task_detail.length;j++){
          if (j == task_detail_index){
            for (var k = 0; k < that.data.task[i].task_detail[j].options.list.length;k++){
              if (k == list_index){
                var cs = "task[" + i + "].task_detail[" + j + "].options.list[" + k + "].select"
                that.setData({
                  [cs]: true
                })
              }else{
                var cs = "task[" + i + "].task_detail[" + j + "].options.list[" + k + "].select"
                that.setData({
                  [cs]: false
                })
              }
            }
          }
        }
      }
    }
  },

  type1_content:function(e){
    let that = this
    var type1_content = e.detail.value
    console.log(type1_content)
    that.setData({
      type1_content: type1_content
    })
  },

  memo: function (e) {
    let that = this
    var memo = e.detail.value
    console.log(memo)
    that.setData({
      memo: memo
    })
  },

  submit:function(e){
    let that = this
    var task_index = e.currentTarget.dataset.task_index
    console.log(task_index + "task_index")
    if (that.data.task[task_index].type == 1){
      var newarray = [{
        memo: that.data.type1_content,
        pics: '',
        attach: ''
      }];

      that.setData({
        'submit_arr': that.data.submit_arr.concat(newarray)
      });
      console.log(that.data.submit_arr)

      var params = {
        "token": wx.getStorageSync("token"),
        "uid": wx.getStorageSync("uid"),
        "tid": that.data.task[task_index].id,
        "data": that.data.submit_arr
      }
      console.log(params)
      app.ljjw.jwStudentSaveTask(params).then(d => {
        console.log(d)
        if (d.data.status == 1) {

          console.log("任务提交成功")
        }


      })
    }
    else if(that.data.task[task_index].type == 2){
      for(var i=0;i<that.data.task.length;i++){
        if(i == task_index){
          for(var j=0;j<that.data.task[i].task_detail.length;j++){
            for(var k=0;k<that.data.task[i].task_detail[j].options.list.length;k++){
              if (that.data.task[i].task_detail[j].options.list[k].select == true){
                var newarray = [{
                  info_id: that.data.task[i].task_detail[j].id,
                  answers: that.data.task[i].task_detail[j].options.list[k].item,
                  memo: '',
                  pics: '',
                  attach: '',
                }];
                that.setData({
                  'type2_ans': that.data.type2_ans.concat(newarray)
                });
              }
              
            }
          }
        }
      }

      var params = {
        "token": wx.getStorageSync("token"),
        "uid": wx.getStorageSync("uid"),
        "tid": that.data.task[task_index].id,
        "data": that.data.type2_ans
      }
      console.log(params)
      app.ljjw.jwStudentSaveTask(params).then(d => {
        console.log(d)
        if (d.data.status == 1) {

          console.log("任务提交成功")
        }


      })

      // console.log(that.data.type2_ans)
     
    }
    else if (that.data.task[task_index].type == 3) {

    }
    

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

  type4_submit:function(e){
    let that = this
    var task_index = e.currentTarget.dataset.task_index
    console.log(task_index + "task_index")
    var params = {
      "token": wx.getStorageSync("token"),
      "uid": wx.getStorageSync("uid"),
      "tid": that.data.task[task_index].id,
      "type": 1,
      
    }
    console.log(params)
    app.ljjw.jwStudentCheckonVerify(params).then(d => {
      console.log(d)
      if (d.data.status == 1) {
        wx.showToast({
          title: '确认成功',
          duration:1500
        })
        console.log("考勤确认成功")
      }


    })
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
      that.un_task()
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

  chooseImg(e) {
    let that = this;
    var task_index = e.currentTarget.dataset.task_index
    console.log(task_index + "task_index")
    var task_detail_index = e.currentTarget.dataset.task_detail_index
    console.log(task_detail_index + "task_detail_index")
    let count_img = 3

    let len = that.data.imgs.length;
    if (len < 3) {
      count_img = 3 - len
      console.log(count_img +"count_img")
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
                  for(var q=0;q<that.data.task.length;q++){
                    if(q == task_index){
                      for (var w = 0; w < that.data.task[q].task_detail.length;w++){
                        if(w == task_detail_index){
                          var css = "task[" + q + "].task_detail[" + w + "].fieldlist.imgs"
                          that.setData({
                            [css]: that.data.imgs
                          })
                        }
                      }
                    }
                  }

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
    console.log(xb  +"xb")
    var task_index = e.currentTarget.dataset.task_index
    console.log(task_index + "task_index")
    var task_detail_index = e.currentTarget.dataset.task_detail_index
    console.log(task_detail_index + "task_detail_index")
    that.data.imgs.splice(xb, 1);
    that.setData({
      imgs: that.data.imgs
    })
    for (var q = 0; q < that.data.task.length; q++) {
      if (q == task_index) {
        for (var w = 0; w < that.data.task[q].task_detail.length; w++) {
          if (w == task_detail_index) {
            var css = "task[" + q + "].task_detail[" + w + "].fieldlist.imgs"
            that.setData({
              [css]: that.data.imgs
            })
          }
        }
      }
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