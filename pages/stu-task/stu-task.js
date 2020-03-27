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
    type2_ans:[],
    work_reject : false
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    that.un_task()
  },

  back: function () {
    wx.navigateBack({
      delta: 1  // 返回上一级页面。
    })
  },

  type4_reject:function(e){
    let that = this
    var task_index = e.currentTarget.dataset.task_index
    console.log(task_index)
    // var query = wx.createSelectorQuery();
    // query.select('.type4_reject').boundingClientRect()
    // query.exec((res) => {
    //   var listHeight = res[0].top; // 获取list高度
    //   console.log(listHeight + "listHeight")
      
    // })
    
    that.setData({
      task_index: task_index,
    })
    that.setData({
      work_reject : true
    })
    
    
  },
  work_reject_del:function(){
    let that = this
    that.setData({
      work_reject: false
    })
  },

  un_task:function(){
    let that = this
    var params = {
      "token": wx.getStorageSync("token"),
      "uid": wx.getStorageSync("uid"),
    }
    console.log(params)
    app.ljjw.jwStudentTaskNotFinished(params).then(d => {
      
      if (d.data.status == 1) {
        console.log(d.data.data)
        that.setData({
          task: d.data.data,
          task1: d.data.data
        })

        for (var i = 0; i < that.data.task.length; i++) {
          console.log(i)
          var cs = "task[" + i + "].submit"
          that.setData({
            [cs]: false
          })

        }

        for (var i = 0; i < that.data.task.length; i++) {
          if (that.data.task[i].title) {
            var title = "task[" + i + "].title"
            console.log(i + "i")
            that.setData({
              [title]: that.data.task[i].title.split(",")
            })

          }
          if (that.data.task[i].type == 2) {
            for (var n = 0; n < that.data.task[i].title.length; n++) {
              var title = "task[" + i + "].task_detail[" + n + "].title"
              that.setData({
                [title]: that.data.task[i].title[n],
              })
            }

            for (var j = 0; j < that.data.task[i].task_detail.length; j++) {
             
              if (that.data.task[i].task_detail[j].child_title != null) {
                var title1 = "task[" + i + "].task_detail[" + j + "].child_title"
                console.log(j + "j")
                that.setData({
                  [title1]: that.data.task[i].task_detail[j].child_title.split(",")
                })

                for (var n = 0; n < that.data.task[i].task_detail[j].child_title.length; n++) {
                  var title = "task[" + i + "].task_detail[" + j + "].options[" + n + "].title"
                  that.setData({
                    [title]: that.data.task[i].task_detail[j].child_title[n],
                  })
                }

              }
              for(var k=0;k<that.data.task[i].task_detail[j].options.length;k++){
                var arr = []

                for (let n in that.data.task[i].task_detail[j].options[k].lists) {

                  arr.push(that.data.task[i].task_detail[j].options[k].lists[n]);
                  console.log(arr)
                  var imgs = []
                  var css = "task[" + i + "].task_detail[" + j + "].options["+ k +"].imgs"
                  var cs = "task[" + i + "].task_detail[" + j + "].options[" + k +"].list"
                  
                  that.setData({
                    [cs]: arr,
                    [css]: imgs,
                    
                  })
                }

                for (var n = 0; n < that.data.task[i].task_detail[j].options[k].list.length; n++) {
                  
                  var css = "task[" + i + "].task_detail[" + j + "].options[" + k + "].list[" + n + "].item"
                  var csss = "task[" + i + "].task_detail[" + j + "].options[" + k + "].list[" + n + "].option"
                  var cssss = "task[" + i + "].task_detail[" + j + "].options[" + k + "].list[" + n + "].select"
                  console.log(that.data)
                  that.setData({
                    
                    [css]: that.data.task[i].task_detail[j].options[k].list[n],
                    [csss]: String.fromCharCode(65 + n),
                    [cssss]: false
                  })

                }

              }

            }
          } else if (that.data.task[i].type == 3) {
            for (var n = 0; n < that.data.task[i].title.length; n++) {
              var title = "task[" + i + "].task_detail[" + n + "].title"
              that.setData({
                [title]: that.data.task[i].title[n],
              })
            }
            for (var j = 0; j < that.data.task[i].task_detail.length; j++) {
              for (var k = 0; k < that.data.task[i].task_detail[j].fieldlist.length;k++){
                var imgs = []
                var css = "task[" + i + "].task_detail[" + j + "].fieldlist[" + k + "].imgs"
                

                that.setData({
                  
                  [css]: imgs
                })

                for (var n = 0; n < that.data.task[i].task_detail[j].fieldlist[k].lists.length; n++) {
                  var css = "task[" + i + "].task_detail[" + j + "].fieldlist[" + k + "].lists[" + n + "].item"
                  var csss = "task[" + i + "].task_detail[" + j + "].fieldlist[" + k + "].lists[" + n + "].content"

                
                  that.setData({
                    [css]: that.data.task[i].task_detail[j].fieldlist[k].lists[n],
                    [csss]: '',

                  })

                }

              }

            }

          }
          else if (that.data.task[i].type == 1) {
           
            var imgs = []
            var css = "task[" + i + "].task_detail.imgs"
            that.setData({
              [css]: imgs
            })
            console.log("==========================================imgs")
            
          }
          else if (that.data.task[i].type == 4){
            for (var j = 0; j < that.data.task[i].task_detail.length; j++) {
              // var cs = "leave[" + i + "].ask_info[" + j + "].pin"
              var _cs = "task[" + i + "].task_detail[" + j + "].cs"
              // var hh = that.data.leave[i].ask_info[j].classtime + " " + that.data.leave[i].ask_info[j].title
              that.setData({
                // [cs]: hh,
                [_cs]: []
              })
              var date = that.data.task[i].task_detail[j].classdate

              for (var k = 0; k < that.data.task1[i].task_detail.length; k++) {
                // if (that.data.leave[i].add_arr[k].date == '')

                if (date == that.data.task1[i].task_detail[k].classdate) {
                  that.data.task[i].task_detail[j].cs.push([that.data.task1[i].task_detail[k].classtime, that.data.task1[i].task_detail[k].check_status])
                }
                else {


                }
              }
            }

            
                for (var j = 0; j < that.data.task[i].task_detail.length; j++) {
                  // for (var k = 0; k < that.data.task[i].task_detail[j].cs.length; k++) {
                  var cs = j+1
                  if (cs < that.data.task[i].task_detail.length){
                    if (that.data.task[i].task_detail[j].classdate == that.data.task[i].task_detail[cs].classdate) {
                      that.data.task[i].task_detail.splice(cs, 1)
                      j = j-1
                    }
                  }
                  
                  // }
               
              
            }

            
          }

          that.setData({
            task : that.data.task
          })


        }
        
        console.log("学生任务列表获取成功")
      }
      else{
        that.setData({
          task: ''
        })
      }


    })
  },

  type3_content:function(e){
    let that = this;
    var task_index = e.currentTarget.dataset.task_index
    console.log(task_index + "task_index")
    var task_detail_index = e.currentTarget.dataset.task_detail_index
    console.log(task_detail_index + "task_detail_index")
    var fieldlist_index = e.currentTarget.dataset.fieldlist_index
    console.log(fieldlist_index + "fieldlist_index")
    var list_index = e.currentTarget.dataset.list_index
    console.log(list_index + "list_index")


    var type3_content = e.detail.value
    console.log(type3_content)
    if (type3_content != ''){
      that.setData({
        type3_content: type3_content
      })
    }else{
      that.setData({
        type3_content: '请填写'
      })
    }
    


    for(var i=0;i<that.data.task.length;i++){
      if (i == task_index){
        for (var j = 0; j < that.data.task[i].task_detail.length;j++){
          if (j == task_detail_index){
            for (var k = 0; k < that.data.task[i].task_detail[j].fieldlist.length;k++){
              if (k == fieldlist_index){
                for (var n = 0; n < that.data.task[i].task_detail[j].fieldlist[k].lists.length;n++){
                  if (n == list_index){
                    var cs = "task[" + i + "].task_detail[" + j + "].fieldlist[" + k + "].lists[" + n + "].content"
                    that.setData({
                      [cs]: that.data.type3_content
                    })
                  }
                  
                }
              
              }
            }
          }
        }
      }
    }

    for (var i = 0; i < that.data.task.length; i++) {
      if (i == task_index) {
        for (var j = 0; j < that.data.task[i].task_detail.length; j++) {
          var cs = "task[" + i + "].task_detail[" + j + "].ans"
          var css = "task[" + i + "].task_detail[" + j + "].memo"
          var csss = "task[" + i + "].task_detail[" + j + "].pics"
          that.setData({
            [cs]: [],
            [css]: [],
            [csss]: []
          })
          for (var k = 0; k < that.data.task[i].task_detail[j].fieldlist.length; k++) {

            for (var n = 0; n < that.data.task[i].task_detail[j].fieldlist[k].lists.length; n++) {
              if (that.data.task[i].task_detail[j].fieldlist[k].lists[n].content != '') {

                that.data.task[i].task_detail[j].ans.push(that.data.task[i].task_detail[j].fieldlist[k].lists[n].content)

              }
              if (that.data.task[i].task_detail[j].fieldlist[k].lists[n].content.indexOf("请填写") >= 0 || that.data.task[i].task_detail[j].fieldlist[k].lists[n].content == ''){
                var css = "task[" + task_index + "].submit"
                that.setData({
                  [css]: false
                })
                console.log("cs1")
              }
              else{
                var css = "task[" + task_index + "].submit"
                that.setData({
                  [css]: true
                })
                // console.log(that.data.task[i].task_detail[j].fieldlist[k].lists[n].content.indexOf("请填写"))
                console.log("cs2")
              }

            }
          }

        }
      }
    }
  },

  select: function (e) {
    let that = this;
    var task_index = e.currentTarget.dataset.task_index
    console.log(task_index + "task_index")
    var task_detail_index = e.currentTarget.dataset.task_detail_index
    console.log(task_detail_index + "task_detail_index")
    var options_index = e.currentTarget.dataset.options_index
    console.log(options_index + "options_index")
    var list_index = e.currentTarget.dataset.list_index
    console.log(list_index + "list_index")
    for (var i = 0; i < that.data.task.length; i++) {
      if (i == task_index) {
        for (var j = 0; j < that.data.task[i].task_detail.length; j++) {
          if (j == task_detail_index) {
            for (var k = 0; k < that.data.task[i].task_detail[j].options.length; k++) {
              if (k == options_index) {
                for (var n = 0; n < that.data.task[i].task_detail[j].options[k].list.length; n++) {
                  if (n == list_index) {
                    var cs = "task[" + i + "].task_detail[" + j + "].options[" + k + "].list[" + n + "].select"
                    that.setData({
                      [cs]: true
                    })
                  } else {
                    var cs = "task[" + i + "].task_detail[" + j + "].options[" + k + "].list[" + n + "].select"
                    that.setData({
                      [cs]: false
                    })
                  }

                }

              }
            }
          }
        }
      }
    }

    for (var i = 0; i < that.data.task.length; i++) {
      if (i == task_index) {
        for (var j = 0; j < that.data.task[i].task_detail.length; j++) {
          var cs = "task[" + i + "].task_detail[" + j + "].ans"
          var css = "task[" + i + "].task_detail[" + j + "].memo"
          var csss = "task[" + i + "].task_detail[" + j + "].pics"
          that.setData({
            [cs]: [],
            [css]: [],
            [csss]: []
          })
          for (var k = 0; k < that.data.task[i].task_detail[j].options.length; k++) {

            for (var n = 0; n < that.data.task[i].task_detail[j].options[k].list.length; n++) {
              if (that.data.task[i].task_detail[j].options[k].list[n].select == true) {

                that.data.task[i].task_detail[j].ans.push(that.data.task[i].task_detail[j].options[k].list[n].option)

              }

            }
          }


          if (that.data.task[i].task_detail[j].ans.length == that.data.task[i].task_detail[j].options.length) {
            var css = "task[" + task_index + "].submit"
            that.setData({
              [css]: true
            })
          }
          else {
            var css = "task[" + task_index + "].submit"
            that.setData({
              [css]: false
            })
          }

        }
      }
    }
  },

  type1_content:function(e){
    let that = this
    var task_type = e.currentTarget.dataset.task_type
    console.log(task_type +"task_type")
    var task_index = e.currentTarget.dataset.task_index
    console.log(task_index + "task_index")
    var task_detail_index = e.currentTarget.dataset.task_detail_index
    console.log(task_detail_index + "task_detail_index")
    var options_index = e.currentTarget.dataset.options_index
    console.log(options_index + "options_index")
    var fieldlist_index = e.currentTarget.dataset.fieldlist_index
    console.log(fieldlist_index + "fieldlist_index")
    

    var type1_content = e.detail.value
    console.log(type1_content)
    that.setData({
      type1_content: type1_content
    })
    if (task_type == 1){
      var cs = "task[" + task_index + "].submit_content"
      that.setData({
        [cs]: that.data.type1_content
      })
      if (that.data.task[task_index].submit_content != ''){
        var css = "task[" + task_index + "].submit"
        that.setData({
          [css]:true
        })
      }
    } else if (task_type == 2){
      var cs = "task[" + task_index + "].task_detail[" + task_detail_index + "].options[" + options_index + "].submit_content"
      that.setData({
        [cs]: that.data.type1_content
      })
    } else if (task_type == 3){
      var cs = "task[" + task_index + "].task_detail[" + task_detail_index + "].fieldlist[" + fieldlist_index + "].submit_content"
      that.setData({
        [cs]: that.data.type1_content
      })
    }
    
  },


  submit:function(e){
    let that = this
    var task_index = e.currentTarget.dataset.task_index
    console.log(task_index + "task_index")
    if (that.data.task[task_index].type == 1){
      var newarray = [{
        memo: that.data.task[task_index].submit_content,
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
          wx.showToast({
            title: '提交成功',
            duration:1500
          })
          that.un_task()  //刷新任务待完成列表
          console.log("任务提交成功")
        }


      })
    }
    else if(that.data.task[task_index].type == 2){
      console.log("选项式提交")
      for(var i=0;i<that.data.task.length;i++){
        if(i == task_index){
          for(var j=0;j<that.data.task[i].task_detail.length;j++){
            var cs = "task[" + i + "].task_detail[" + j + "].ans"
            var css = "task[" + i + "].task_detail[" + j + "].memo"
            var csss = "task[" + i + "].task_detail[" + j + "].pics"
            that.setData({
              [cs]: [],
              [css]:[],
              [csss]:[]
            })
            for(var k=0;k<that.data.task[i].task_detail[j].options.length;k++){
              
              for (var n = 0; n < that.data.task[i].task_detail[j].options[k].list.length;n++){
                if (that.data.task[i].task_detail[j].options[k].list[n].select == true) {
                  
                  that.data.task[i].task_detail[j].ans.push(that.data.task[i].task_detail[j].options[k].list[n].option)

                }
                
              }
              var hh = "task[" + i + "].task_detail[" + j + "].options[" + k + "].pics"
              that.setData({
                [hh]: that.data.task[i].task_detail[j].options[k].imgs.join(",")
              })
              
              that.data.task[i].task_detail[j].memo.push(that.data.task[i].task_detail[j].options[k].submit_content)
              that.data.task[i].task_detail[j].pics.push(that.data.task[i].task_detail[j].options[k].pics)
              
            }
            var memo, pics, attach
            
            if (that.data.task[i].task_detail[j].memo.join("|") == "|"){
              memo = ""
            }
            else{
              memo = that.data.task[i].task_detail[j].memo.join("|")
            }

            if (that.data.task[i].task_detail[j].pics.join("|") == "|") {
              pics = ""
            }
            else {
              pics = that.data.task[i].task_detail[j].pics.join("|")
            }

            
            var newarray = [{
              info_id: that.data.task[i].task_detail[j].id,
              answers: that.data.task[i].task_detail[j].ans.join(","),
              memo: memo,
              pics: pics,
              attach: '',
            }];
            that.setData({
              'type2_ans': that.data.type2_ans.concat(newarray)
            });
            
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
          wx.showToast({
            title: '提交成功',
            duration: 1500
          })
          that.un_task()  //刷新任务待完成列表
          console.log("任务提交成功")
        }


      })
      
     
    }
    else if (that.data.task[task_index].type == 3) {
      console.log("字段式提交")
      for (var i = 0; i < that.data.task.length; i++) {
        if (i == task_index) {
          for (var j = 0; j < that.data.task[i].task_detail.length; j++) {
            
            for (var k = 0; k < that.data.task[i].task_detail[j].fieldlist.length; k++) {

              
              var hh = "task[" + i + "].task_detail[" + j + "].fieldlist[" + k + "].pics"
              that.setData({
                [hh]: that.data.task[i].task_detail[j].fieldlist[k].imgs.join(",")
              })

              that.data.task[i].task_detail[j].memo.push(that.data.task[i].task_detail[j].fieldlist[k].submit_content)
              that.data.task[i].task_detail[j].pics.push(that.data.task[i].task_detail[j].fieldlist[k].pics)

            }
            var memo, pics, attach

            if (that.data.task[i].task_detail[j].memo.join("|") == "|") {
              memo = ""
            }
            else {
              memo = that.data.task[i].task_detail[j].memo.join("|")
            }

            if (that.data.task[i].task_detail[j].pics.join("|") == "|") {
              pics = ""
            }
            else {
              pics = that.data.task[i].task_detail[j].pics.join("|")
            }


            var newarray = [{
              info_id: that.data.task[i].task_detail[j].id,
              answers: that.data.task[i].task_detail[j].ans.join(","),
              memo: memo,
              pics: pics,
              attach: '',
            }];
            that.setData({
              'type2_ans': that.data.type2_ans.concat(newarray)
            });

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
          wx.showToast({
            title: '提交成功',
            duration: 1500
          })
          that.un_task()  //刷新任务待完成列表
          console.log("任务提交成功")
        }


      })
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
      "tid": that.data.task[that.data.task_index].id,
      "type": 2,
      "reason": that.data.reject_reason
    }
    console.log(params)
    app.ljjw.jwStudentCheckonVerify(params).then(d => {
      console.log(d)
      if (d.data.status == 1) {
        that.setData({
          work_reject: false
        })
        wx.showToast({
          title: '驳回成功',
          duration:2000
        })
        that.un_task()
        console.log("驳回成功")
      }


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
          console.log(d.data.data + "d.data.data")
          that.setData({
            task: d.data.data,
            task1: d.data.data
          })

          for (var i = 0; i < that.data.task.length; i++) {
            if (that.data.task[i].title) {
              var title = "task[" + i + "].title"
              console.log(i + "i")
              that.setData({
                [title]: that.data.task[i].title.split(",")
              })
            }
          
            if (that.data.task[i].type == 2) {
              for (var n = 0; n < that.data.task[i].title.length; n++) {
                var title = "task[" + i + "].task_detail[" + n + "].title"
                that.setData({
                  [title]: that.data.task[i].title[n],
                })
              }

              for (var j = 0; j < that.data.task[i].task_detail.length; j++) {

                if (that.data.task[i].task_detail[j].child_title != null) {
                  var title1 = "task[" + i + "].task_detail[" + j + "].child_title"
                  console.log(j + "j")
                  that.setData({
                    [title1]: that.data.task[i].task_detail[j].child_title.split(",")
                  })

                  for (var n = 0; n < that.data.task[i].task_detail[j].child_title.length; n++) {
                    var title = "task[" + i + "].task_detail[" + j + "].options[" + n + "].title"
                    that.setData({
                      [title]: that.data.task[i].task_detail[j].child_title[n],
                    })
                  }

                }

                var answers = "task[" + i + "].task_detail[" + j + "].finished_info.answers"
                var memo = "task[" + i + "].task_detail[" + j + "].finished_info.memo"
                var attach = "task[" + i + "].task_detail[" + j + "].finished_info.attach"
                // var attach = "task[" + i + "].task_detail[" + j + "].finished_info.attach"
                // console.log(j + "j")
                that.setData({
                  [answers]: that.data.task[i].task_detail[j].finished_info.answers.split(","),
                  [memo]: that.data.task[i].task_detail[j].finished_info.memo.split("|"),
                  [attach]: that.data.task[i].task_detail[j].finished_info.attach.split("|"),
                  // [attach]: that.data.task[i].task_detail[j].finished_info.attach.split(",")
                })

                for (var k = 0; k < that.data.task[i].task_detail[j].options.length; k++) {
                  var arr = []

                  for (let n in that.data.task[i].task_detail[j].options[k].lists) {

                    arr.push(that.data.task[i].task_detail[j].options[k].lists[n]);
                    console.log(arr)
                    var imgs = []
                    var css = "task[" + i + "].task_detail[" + j + "].options[" + k + "].imgs"
                    var cs = "task[" + i + "].task_detail[" + j + "].options[" + k + "].list"

                    that.setData({
                      [cs]: arr,
                      [css]: imgs,

                    })
                  }

                  for (var n = 0; n < that.data.task[i].task_detail[j].options[k].list.length; n++) {

                    var css = "task[" + i + "].task_detail[" + j + "].options[" + k + "].list[" + n + "].item"
                    var csss = "task[" + i + "].task_detail[" + j + "].options[" + k + "].list[" + n + "].option"
                    var cssss = "task[" + i + "].task_detail[" + j + "].options[" + k + "].list[" + n + "].select"
                    console.log(that.data)
                    that.setData({

                      [css]: that.data.task[i].task_detail[j].options[k].list[n],
                      [csss]: String.fromCharCode(65 + n),
                      [cssss]: false
                    })

                    for (var m = 0; m < that.data.task[i].task_detail[j].finished_info.answers.length;m++){
                      if (that.data.task[i].task_detail[j].options[k].list[n].option == that.data.task[i].task_detail[j].finished_info.answers[m]){
                        var select = "task[" + i + "].task_detail[" + j + "].options[" + k + "].list[" + n + "].select"
                        that.setData({
                          [select]: true
                        })
                      }
                    }

                    for (var m = 0; m < that.data.task[i].task_detail[j].finished_info.memo.length; m++) {
                      if(k == m){
                        var select = "task[" + i + "].task_detail[" + j + "].options[" + k + "].memo"
                        that.setData({
                          [select]: that.data.task[i].task_detail[j].finished_info.memo[m]
                        })
                      }
                    }


                  }


                }

              }
            } else if (that.data.task[i].type == 3) {
              for (var n = 0; n < that.data.task[i].title.length; n++) {
                var title = "task[" + i + "].task_detail[" + n + "].title"
                that.setData({
                  [title]: that.data.task[i].title[n],
                })
              }

              for (var j = 0; j < that.data.task[i].task_detail.length; j++) {

                if (that.data.task[i].task_detail[j].child_title != null) {
                  var title1 = "task[" + i + "].task_detail[" + j + "].child_title"
                  console.log(j + "j")
                  that.setData({
                    [title1]: that.data.task[i].task_detail[j].child_title.split(",")
                  })

                  for (var n = 0; n < that.data.task[i].task_detail[j].child_title.length; n++) {
                    var title = "task[" + i + "].task_detail[" + j + "].fieldlist[" + n + "].title"
                    that.setData({
                      [title]: that.data.task[i].task_detail[j].child_title[n],
                    })
                  }

                }

                var answers = "task[" + i + "].task_detail[" + j + "].finished_info.answers"
                var memo = "task[" + i + "].task_detail[" + j + "].finished_info.memo"
                var attach = "task[" + i + "].task_detail[" + j + "].finished_info.attach"
                // var attach = "task[" + i + "].task_detail[" + j + "].finished_info.attach"
                // console.log(j + "j")
                that.setData({
                  [answers]: that.data.task[i].task_detail[j].finished_info.answers.split(","),
                  [memo]: that.data.task[i].task_detail[j].finished_info.memo.split("|"),
                  [attach]: that.data.task[i].task_detail[j].finished_info.attach.split("|"),
                  // [attach]: that.data.task[i].task_detail[j].finished_info.attach.split(",")
                })

                for (var k = 0; k < that.data.task[i].task_detail[j].fieldlist.length; k++) {
                  var arr = []

                  // for (let n in that.data.task[i].task_detail[j].fieldlist[k].lists) {

                  //   arr.push(that.data.task[i].task_detail[j].fieldlist[k].lists[n]);
                  //   console.log(arr)
                  //   var imgs = []
                  //   var css = "task[" + i + "].task_detail[" + j + "].fieldlist[" + k + "].imgs"
                  //   var cs = "task[" + i + "].task_detail[" + j + "].fieldlist[" + k + "].list"

                  //   that.setData({
                  //     [cs]: arr,
                  //     [css]: imgs,

                  //   })
                  // }
                    var css = "task[" + i + "].task_detail[" + j + "].fieldlist[" + k + "].imgs"
                    

                    that.setData({
                  
                      [css]: imgs,

                    })
                  for (var n = 0; n < that.data.task[i].task_detail[j].fieldlist[k].lists.length; n++) {

                    var css = "task[" + i + "].task_detail[" + j + "].fieldlist[" + k + "].lists[" + n + "].item"
                    var csss = "task[" + i + "].task_detail[" + j + "].fieldlist[" + k + "].lists[" + n + "].content"
                    
                    console.log(that.data)
                    that.setData({

                      [css]: that.data.task[i].task_detail[j].fieldlist[k].lists[n],
                      [csss]: ''
                      
                    })

                    for (var m = 0; m < that.data.task[i].task_detail[j].finished_info.answers.length; m++) {
                      if (n == m) {
                        var select = "task[" + i + "].task_detail[" + j + "].fieldlist[" + k + "].lists[" + n + "].content"
                        that.setData({
                          [select]: that.data.task[i].task_detail[j].finished_info.answers[m]
                        })
                      }
                    }

                    for (var m = 0; m < that.data.task[i].task_detail[j].finished_info.memo.length; m++) {
                      if (k == m) {
                        var select = "task[" + i + "].task_detail[" + j + "].fieldlist[" + k + "].memo"
                        that.setData({
                          [select]: that.data.task[i].task_detail[j].finished_info.memo[m]
                        })
                      }
                    }


                  }


                }

              }

            }
            else if (that.data.task[i].type == 1) {

              var imgs = []
              var css = "task[" + i + "].task_detail.imgs"
              that.setData({
                [css]: imgs
              })
              console.log("==========================================imgs")

            }
            else if (that.data.task[i].type == 4) {
              for (var j = 0; j < that.data.task[i].task_detail.length; j++) {
                // var cs = "leave[" + i + "].ask_info[" + j + "].pin"
                var _cs = "task[" + i + "].task_detail[" + j + "].cs"
                // var hh = that.data.leave[i].ask_info[j].classtime + " " + that.data.leave[i].ask_info[j].title
                that.setData({
                  // [cs]: hh,
                  [_cs]: []
                })
                var date = that.data.task[i].task_detail[j].classdate

                for (var k = 0; k < that.data.task1[i].task_detail.length; k++) {
                  // if (that.data.leave[i].add_arr[k].date == '')

                  if (date == that.data.task1[i].task_detail[k].classdate) {
                    that.data.task[i].task_detail[j].cs.push([that.data.task1[i].task_detail[k].classtime, that.data.task1[i].task_detail[k].check_status])
                  }
                  else {


                  }
                }
              }

              that.setData({
                task:that.data.task
              })
              console.log(that.data.task)
              console.log("cs")


              


            }
            

          }

          for(var q=0;q<that.data.task.length;q++){
            if (that.data.task[q].type == 4){
              for (var n = 0; n < that.data.task[q].task_detail.length; n++) {
                // for (var k = 0; k < that.data.task[i].task_detail[n].cs.length; k++) {
                var cs = n + 1
                if (cs < that.data.task[q].task_detail.length) {
                  console.log(n, cs + "1")
                  if (that.data.task[q].task_detail[n].classdate.indexOf(that.data.task[q].task_detail[cs].classdate) != -1) {
                    console.log(n, cs + "2")
                    that.data.task[q].task_detail.splice(cs, 1)
                    n = n - 1
                  }
                }

                // }


              }
            }
            
          }
          
          
          that.setData({
            task: that.data.task
          })
          console.log(that.data.task)
          console.log("学生任务已完成获取成功")
        }else{
          that.setData({
            task : ''
          })
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