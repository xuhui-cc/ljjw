// pages/stu-task/stu-task.js
const app = getApp()
Page({

  /**
   * 分页数据
  */
  pageData: {
    perpage: 5,
    page: 1,
    canLoadNextPage: true,
  },

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
    var class_id = options.class_id
    that.setData({
      class_id : class_id
    })
    this.pageData.page = 1
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

  un_task:function(cb){
    let that = this
    var params = {
      "token": wx.getStorageSync("token"),
      "uid": wx.getStorageSync("uid"),
      "class_id":that.data.class_id,
      "page": that.pageData.page,
      "limit": that.pageData.perpage,
    }
    console.log(params)
    app.ljjw.jwStudentTaskNotFinished(params).then(d => {
      let status = d.data.status

      if (status == 1) {
        let newData = d.data.data
        let newData1 = d.data.data
        for (var i = 0; i < newData.length; i++) {
          var item = newData[i]
          item.submit = false

          if (item.title) {
            item.title = item.title.split(",")
          }

          if (item.type == 2) {
            for (var n = 0; n < item.title.length; n++) {
              var taskDetail = item.task_detail[n]
              taskDetail.title = item.title[n]
            }

            for (var j = 0; j < item.task_detail.length; j++) {
              var taskDetail = item.task_detail[j]
              if (taskDetail.child_title != null) {
                taskDetail.child_title = taskDetail.child_title.split(",")

                for (var n = 0; n < taskDetail.child_title.length; n++) {
                  taskDetail.options[n].title = taskDetail.child_title[n]
                }

              }
              for(var k=0;k<taskDetail.options.length;k++){
                var option = taskDetail.options[k]
                var arr = []

                for (let n in option.lists) {

                  arr.push(option.lists[n]);
                  // console.log(arr)
                  var imgs = []
                  option.list = arr
                  option.imgs = imgs
                }

                for (var n = 0; n < option.list.length; n++) {
                  var list_item = option.list[n]
                  var new_list_item = {}
                  new_list_item.item = list_item
                  new_list_item.option = String.fromCharCode(65 + n)
                  new_list_item.select = false
                  option.list[n] = new_list_item
                }

              }

            }
          } else if (item.type == 3) {
            for (var n = 0; n < item.title.length; n++) {
              item.task_detail[n].title = item.title[n]
            }
            for (var j = 0; j < item.task_detail.length; j++) {
              var taskDetail = item.task_detail[j]
              for (var k = 0; k < taskDetail.fieldlist.length;k++){
                var fileListItem = taskDetail.fieldlist[k]
                var imgs = []
                fileListItem.imgs = imgs

                for (var n = 0; n < fileListItem.lists.length; n++) {
                  var fileListItem_listItem = fileListItem.lists[n]
                  var new_fileListItem_listItem = {}
                  new_fileListItem_listItem.item = fileListItem_listItem
                  new_fileListItem_listItem.content = ''
                  fileListItem.lists[n] = new_fileListItem_listItem
                }

              }

            }

          } else if (item.type == 1) {
           
            var imgs = []
            item.task_detail = {}
            item.task_detail.imgs = imgs
            // console.log("==========================================imgs")
          } else if (item.type == 4){
            for (var j = 0; j < item.task_detail.length; j++) {
              var taskDetail = item.task_detail[j]
              taskDetail.cs = []
              var classdate = taskDetail.classdate

              for (var k = 0; k < newData1[i].task_detail.length; k++) {
                // if (that.data.leave[i].add_arr[k].date == '')

                if (classdate == newData1[i].task_detail[k].classdate) {
                  taskDetail.cs.push([newData1[i].task_detail[k].classtime, newData1[i].task_detail[k].check_status])
                }
                else {


                }
              }
            }

            
                for (var j = 0; j < item.task_detail.length; j++) {
                  var taskDetail = item.task_detail[j]
                  // for (var k = 0; k < that.data.task[i].task_detail[j].cs.length; k++) {
                  var cs = j+1
                  if (cs < item.task_detail.length){
                    if (taskDetail.classdate == item.task_detail[cs].classdate) {
                      item.task_detail.splice(cs, 1)
                      j = j-1
                    }
                  }
                  
                  // }
               
              
            }

            
          }
        }
        var data = newData
        var data1 = newData1
        if (that.pageData.page != 1) {
          data = that.data.task.concat(newData)
          data1 = that.data.task1.concat(newData1)
        }
        if (newData.length < that.pageData.perpage) {
          that.pageData.canLoadNextPage = false
        } else {
          that.pageData.canLoadNextPage = true
        }
        // console.log(d.data.data)
        that.setData({
          task: data,
          task1: data1
        })
        typeof cb == "function" && cb(true, "加载成功")
        console.log("学生任务列表获取成功")
      }
      else{
        that.setData({
          task: ''
        })
        typeof cb == "function" && cb(false, d.msg ? d.msg: "加载失败")
        that.pageData.canLoadNextPage = false
      }
      wx.stopPullDownRefresh({
        complete: (res) => {},
      })
      
    })
  },

  /**
   *  已完成任务加载
  */
  finish_task: function(cb) {
    let that = this
    var params = {
      "token": wx.getStorageSync("token"),
      "uid": wx.getStorageSync("uid"),
      "class_id":that.data.class_id,
      "page": that.pageData.page,
      "limit": that.pageData.perpage,
    }
    console.log(params)
    app.ljjw.jwStudentTaskFinished(params).then(d => {
      console.log(d)
      let status = d.data.status

      if (status == 1) {
        var newData = d.data.data
        var newData1 = d.data.data

        // console.log(d.data.data + "d.data.data")
        for (var i = 0; i < newData.length; i++) {
          var item = newData[i]
          if (item.title) {
            item.title = item.title.split(",")
          }
        
          if (item.type == 2) {                      //选项式已完成
            for (var n = 0; n < item.title.length; n++) {
              item.task_detail[n].title = item.title[n]
            }

            for (var j = 0; j < item.task_detail.length; j++) {
              var taskDetail = item.task_detail[j]
              if (taskDetail.child_title != null) {
                taskDetail.child_title = taskDetail.child_title.split(",")

                for (var n = 0; n < taskDetail.child_title.length; n++) {
                  taskDetail.options[n].title = taskDetail.child_title[n]
                }
              }

              taskDetail.finished_info.answers = taskDetail.finished_info.answers.split(",")
              taskDetail.finished_info.memo = taskDetail.finished_info.memo.split("|")
              taskDetail.finished_info.attach = taskDetail.finished_info.attach.split("|")

              for (var k = 0; k < taskDetail.options.length; k++) {
                var arr = []
                var option = taskDetail.options[k]
                for (let n in option.lists) {

                  arr.push(option.lists[n]);
                  console.log(arr)
                  // var imgs = []
                  option.imgs = []
                  option.list = arr
                }
                if (taskDetail.finished_info.attach[k] != ""){
                  option.imgs = taskDetail.finished_info.attach[k].split(",")
                  console.log(option.imgs)
                }
                
                for (var n = 0; n < option.list.length; n++) {
                  var optionListItem = option.list[n]
                  var newOptionListItem = {}
                  newOptionListItem.item = optionListItem
                  newOptionListItem.option = String.fromCharCode(65 + n)
                  newOptionListItem.select = false
                  option.list[n] = newOptionListItem

                  for (var m = 0; m < taskDetail.finished_info.answers.length;m++){
                    let answer = taskDetail.finished_info.answers[m]
                    if (newOptionListItem.option == answer){
                      newOptionListItem.select = true
                    }
                  }

                  for (var m = 0; m < taskDetail.finished_info.memo.length; m++) {
                    if(k == m){
                      option.memo = taskDetail.finished_info.memo[m]
                    }
                  }
                }
              }
            }
          } else if (item.type == 3) {                                           //字段式已完成
            for (var n = 0; n < item.title.length; n++) {
              item.task_detail[n].title = item.title[n]
            }

            for (var j = 0; j < item.task_detail.length; j++) {
              var taskDetail = item.task_detail[j]
              if (taskDetail.child_title != null) {
                taskDetail.child_title = taskDetail.child_title.split(",")

                for (var n = 0; n < taskDetail.child_title.length; n++) {
                  taskDetail.fieldlist[n].title = taskDetail.child_title[n]
                }

              }

              taskDetail.finished_info.answers = taskDetail.finished_info.answers.split(",")
              taskDetail.finished_info.memo = taskDetail.finished_info.memo.split("|")
              taskDetail.finished_info.attach = taskDetail.finished_info.attach.split("|")

              for (var k = 0; k < taskDetail.fieldlist.length; k++) {

                var arr = []
                var fileListItem = taskDetail.fieldlist[k]
                for (let n in fileListItem.lists) {

                  arr.push(fileListItem.lists[n]);
                  // console.log(arr)
                  // var imgs = []
                  fileListItem.list = arr
                  fileListItem.imgs = []
                }
                if (taskDetail.finished_info.attach[k] != "") {
                  fileListItem.imgs = taskDetail.finished_info.attach[k].split(",")
                  console.log(fileListItem.imgs)
                }
                // var arr = []

               
                //   var css = "task[" + i + "].task_detail[" + j + "].fieldlist[" + k + "].imgs"
                  
                //   var imgs = []
                //   // that.setData({
                
                //   //   [css]: that.data.task[i].task_detail[j].finished_info.attach[k].split(","),

                //   // })

                // if (that.data.task[i].task_detail[j].finished_info.attach[k] != "") {
                //   that.data.task[i].task_detail[j].fieldlist[k].imgs.push(that.data.task[i].task_detail[j].finished_info.attach[k])
                //   console.log(that.data.task[i].task_detail[j].fieldlist[k].imgs)
                // }
                for (var n = 0; n < fileListItem.lists.length; n++) {
                  var fileListItemListItem = fileListItem.lists[n]
                  var newListItem = {}
                  newListItem.item = fileListItemListItem
                  newListItem.content = ''
                  fileListItem.lists[n] = newListItem

                  for (var m = 0; m < taskDetail.finished_info.answers.length; m++) {
                    if (n == m) {
                      newListItem.content = taskDetail.finished_info.answers[m]
                    }
                  }

                  for (var m = 0; m < taskDetail.finished_info.memo.length; m++) {
                    if (k == m) {
                      newListItem.memo = taskDetail.finished_info.memo[m]
                    }
                  }
                }
              }
            }
          } else if (item.type == 1) {   //普通式已完成处理

            var imgs = []
            item.task_detail = {}
            if (item.attach != ''){
              item.task_detail.imgs = item.task_detail.finished_info.pics.split(",")
              console.log("==========================================imgs")
            }else{
              item.task_detail.imgs = imgs
              console.log("==========================================imgs")
            }
          } else if (item.type == 4) {      //确认考勤已完成处理
            for (var j = 0; j < item.task_detail.length; j++) {
              var taskDetail = item.task_detail[j]
              taskDetail.cs = []
              var classdate = taskDetail.classdate

              for (var k = 0; k < newData1.task_detail.length; k++) {
                // if (that.data.leave[i].add_arr[k].date == '')

                if (classdate == newData1.task_detail[k].classdate) {
                  taskDetail.cs.push([newData1.task_detail[k].classtime, newData1.task_detail[k].check_status])
                }
                else {
                }
              }
            }
          }
        }

        for(var q=0;q<newData.length;q++){
          var item = newData[q]
          if (item.type == 4){
            for (var n = 0; n < item.task_detail.length; n++) {
              var taskDetail = item.task_detail[n]
              // for (var k = 0; k < that.data.task[i].task_detail[n].cs.length; k++) {
              var cs = n + 1
              if (cs < item.task_detail.length) {
                console.log(n, cs + "1")
                if (taskDetail.classdate.indexOf(item.task_detail[cs].classdate) != -1) {
                  console.log(n, cs + "2")
                  item.task_detail.splice(cs, 1)
                  n = n - 1
                }
              }
            }
          }
        }

        if (newData.length < that.pageData.perpage) {
          that.pageData.canLoadNextPage = false
        } else {
          that.pageData.canLoadNextPage = true
        }

        var data = []
        var data1 = []
        if (that.pageData.page == 1) {
          data = newData
          data1 = newData1
        } else {
          data = that.data.task.concat(newData)
          data1 = that.data.task1.concat(newData1)
        }
        that.setData({
          task: data,
          task1: data1
        })

        typeof cb == "function" && cb(true, "加载成功")
        console.log("学生任务已完成获取成功")
      }else{
        that.setData({
          task : ''
        })
        typeof cb == "function" && cb(false, d.msg ? d.msg : "加载失败")
      }

      wx.stopPullDownRefresh({
        complete: (res) => {},
      })
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
        type3_content: ''
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
      that.setData({
        submit_arr:[]
      })
      var newarray = [{
        memo: that.data.task[task_index].submit_content,
        pics: that.data.task[task_index].task_detail.imgs.join(",") ,
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
          that.setData({
            img:[],
            imgs:[],
            type1_content:'',
            type3_content: ''
          })
          that.pageData.page = 1
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
              // pics: pics,
              attach: pics,
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
          that.setData({
            img: [],
            imgs: [],
            type1_content: '',
            type3_content: ''
          })
          that.pageData.page = 1
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
              // pics: pics,
              attach: pics,
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
          that.setData({
            img: [],
            imgs: [],
            type1_content: '',
            type3_content: '',
            type2_ans:[]
          })
          that.pageData.page = 1
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
        that.pageData.page = 1
        that.un_task()
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
        that.pageData.page = 1
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
      // 待完成
      that.pageData.page = 1
      that.un_task()
    }else{
      // 已完成
      that.pageData.page = 1
      that.finish_task()
    }
  },

  chooseImg(e) {
    let that = this;
    var task_index = e.currentTarget.dataset.task_index
    console.log(task_index + "task_index")
    var task_detail_index = e.currentTarget.dataset.task_detail_index
    console.log(task_detail_index + "task_detail_index")
    var options_index = e.currentTarget.dataset.options_index
    console.log(options_index + "options_index")
    
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
              // url: 'https://szgk.cn/api.php?',
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
                      if (that.data.task[q].type == 1){
                        
                          that.data.task[q].task_detail.imgs.push(that.data.imgs)
                        
                          var css = "task[" + q + "].task_detail.imgs"
                          that.setData({
                            [css]: that.data.task[q].task_detail.imgs
                          })
                          that.setData({
                            imgs: [],

                          })
                        // }
                        
                      }else{
                        for (var w = 0; w < that.data.task[q].task_detail.length; w++) {
                          if (w == task_detail_index) {
                            if (that.data.task[q].type == 3) {
                              for (var n = 0; n < that.data.task[q].task_detail[w].fieldlist.length; n++) {
                                if (n == options_index) {
                                  that.data.task[q].task_detail[w].fieldlist[n].imgs.push(that.data.imgs)
                                  var css = "task[" + q + "].task_detail[" + w + "].fieldlist[" + n + "].imgs"
                                  that.setData({
                                    [css]: that.data.task[q].task_detail[w].fieldlist[n].imgs
                                  })
                                  that.setData({
                                    imgs:[],
                                    
                                  })
                                }
                              }
                            } else if (that.data.task[q].type == 2) {
                              for (var n = 0; n < that.data.task[q].task_detail[w].options.length; n++) {
                                if (n == options_index) {
                                  that.data.task[q].task_detail[w].options[n].imgs.push(that.data.imgs)
                                  var css = "task[" + q + "].task_detail[" + w + "].options[" + n + "].imgs"
                                  that.setData({
                                    [css]: that.data.task[q].task_detail[w].options[n].imgs
                                  })
                                  that.setData({
                                    imgs: [],
                                    
                                  })
                                }
                              }
                            }
                          }
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
            that.setData({
              img: []
            })
          }

        }
      })
    }

  },

  del_img: function (e) {   //选项字段删除图片
    let that = this
    var xb = e.currentTarget.dataset.xb
    console.log(xb  +"xb")
    var task_index = e.currentTarget.dataset.task_index
    console.log(task_index + "task_index")
    var task_detail_index = e.currentTarget.dataset.task_detail_index
    console.log(task_detail_index + "task_detail_index")
    var options_index = e.currentTarget.dataset.options_index
    console.log(options_index + "options_index")
    // that.data.imgs.splice(xb, 1);
    // that.setData({
    //   imgs: that.data.imgs
    // })
    

    for (var q = 0; q < that.data.task.length; q++) {
      if (q == task_index) {
        for (var w = 0; w < that.data.task[q].task_detail.length; w++) {
          if (w == task_detail_index) {
            if (that.data.task[q].type == 3) {
              for (var n = 0; n < that.data.task[q].task_detail[w].fieldlist.length; n++) {
                if (n == options_index) {
                  that.data.task[q].task_detail[w].fieldlist[n].imgs.splice(xb, 1);
                  console.log("我是测试")
                  var css = "task[" + q + "].task_detail[" + w + "].fieldlist[" + n + "].imgs"
                  that.setData({
                    [css]: that.data.task[q].task_detail[w].fieldlist[n].imgs
                  })
                }
              }
            } else if (that.data.task[q].type == 2) {
              for (var n = 0; n < that.data.task[q].task_detail[w].options.length; n++) {
                if (n == options_index) {
                  that.data.task[q].task_detail[w].options[n].imgs.splice(xb, 1);
                  var css = "task[" + q + "].task_detail[" + w + "].options[" + n + "].imgs"
                  that.setData({
                    [css]: that.data.task[q].task_detail[w].options[n].imgs
                  })
                }
              }
            }


          }
        }
      }
    }
    
  },
  del_img1: function (e) {   //普通删除图片
    let that = this
    var xb = e.currentTarget.dataset.xb
    console.log(xb + "xb")
    var task_index = e.currentTarget.dataset.task_index
    console.log(task_index + "task_index")
    
    that.data.imgs.splice(xb, 1);
    that.setData({
      imgs: that.data.imgs
    })
    


    for (var q = 0; q < that.data.task.length; q++) {
      if (q == task_index) {
                  var css = "task[" + q + "].task_detail.imgs"
                  that.setData({
                    [css]: that.data.imgs
                  })
                } 
      }
      that.setData({
        task:that.data.task
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
    this.pageData.page = 1
    if (this.data.finish == 0) {
      // 待完成
      this.un_task()
    } else {
      // 已完成
      this.finish_task()
    }
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this
    if (this.pageData.canLoadNextPage) {
      let oldPage = this.pageData.page
      this.pageData.page = oldPage + 1
      if (this.data.finish == 0) {
        // 待完成
        this.un_task(function (success, msg) {
          if (!success) {
            that.pageData.page = oldPage
            wx.showToast({
              title: msg,
              icon: 'none'
            })
          }
        })
      } else {
        // 已完成
        this.finish_task(function(success, msg) {
          if (!success) {
            that.pageData.page = oldPage
            wx.showToast({
              title: msg,
              icon: 'none'
            })
          }
        })
      }
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})