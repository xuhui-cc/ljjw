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

  /**
   * 待完成任务列表
   * 返回值：
   * type：任务类型  1-普通任务  2-选项任务  3-字段任务  4-考勤任务
   * createuid：发布人uid
   * createdate：发布时间（10位时间戳）
   * subject：任务标题
   * title：标题（多个任务逗号隔开）
   * has_child_title：选项类任务是否有子标题  0-无   1-有
   * has_remark：普通任务是否显示学生备注  1-显示
   * has_pics：普通任务是否显示学生图片上传   1-显示
   * attach：普通任务附件列表，其他类任务为空
   * notallow_class：
   * createtime：创建时间
   * datetime：搜索日期
   * pubname：发布人名字
   * pubtime：发布时间 （0000-00-00 00:00）
   * task_detail：type为2/3 时返回，子字段如下：
   *      type=3
   *           id: 字段id
   *           tid：任务id
   *           field_type：1-纯字段  2-字段+备注   3-字段+图片     4-字段+备注+图片
   *           fieldlist：字段列表，如下
   *                    count：字段数量
   *                    lists：字段数组
   *       type=2
   *           id: 字段id
   *           tid：任务id
   *           child_title：任务子标题（多个子标题逗号隔开）
   *           options：徐昂想列表，如下
   *                     cout：选项数量
   *                     lists：选项
   *                            a：
   *                            b：
   *                            ...
   *           option_type：选项任务类型：  1-纯选项   2-选项+备注    3-选项+图片    4-选项+备注+图片
   *           muti_title_id：多个标题对应位置序号（但个标题为空）
   * 
  */
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

          switch (item.type*1) {
            case 1: {
              // 普通任务
              var imgs = []
              item.task_detail = {}
              item.task_detail.imgs = imgs
              if (item.attach != '') {
                item.attach = item.attach.split(',')
                // if (item.attach.length > 3) {
                //   item.attach.splice(3, item.attach.length-3)
                // }
              }
              
              break
            }
            case 2: {
              // 选项任务
              for (var n = 0; n < item.title.length; n++) {
                var taskDetail = item.task_detail[n]
                taskDetail.title = item.title[n]
                if (item.title.length > 1) {
                  taskDetail.title = (n+1)+". "+taskDetail.title
                }
              }
  
              for (var j = 0; j < item.task_detail.length; j++) {
                var taskDetail = item.task_detail[j]
                if (taskDetail.child_title != null) {
                  taskDetail.child_title = taskDetail.child_title.split(",")
  
                  for (var n = 0; n < taskDetail.child_title.length; n++) {
                    var subtitle = taskDetail.child_title[n]
                    if (taskDetail.child_title.length > 1) {
                      subtitle = "("+(n+1)+") "+subtitle
                    }
                    taskDetail.options[n].title = subtitle
                  }
  
                }
                for(var k=0;k<taskDetail.options.length;k++){
                  var option = taskDetail.options[k]
                  var arr = []
  
                  for (let n in option.lists) {
  
                    arr.push(option.lists[n]);
                    // console.log(arr)
                    option.list = arr
                  }
                  option.imgs = []

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
              break
            }
            case 3: {
              // 字段任务
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
              break
            }
            case 4: {
              // 考勤任务
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
              }
              break
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
    // console.log(params)
    app.ljjw.jwStudentTaskFinished(params).then(d => {
      // console.log(d)
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
        
          switch (item.type*1) {
            case 1: {
              // 普通任务
              var imgs = []
            
              if (item.task_detail != ''){
                item.task_detail.imgs = item.task_detail.finished_info.pics.split(",")
              }else{
                item.task_detail = {}
                item.task_detail.imgs = imgs
              }

              if (item.attach != '') {
                item.attach = item.attach.split(',')
                if (item.attach.length > 3) {
                  item.attach.splice(3, item.attach.length-3)
                }
              }

              break;
            }
            case 2: {
              // 选项任务
               // 标题拆分
              for (var n = 0; n < item.title.length; n++) {
                item.task_detail[n].title = item.title[n]
              }
                  
              for (var j = 0; j < item.task_detail.length; j++) {
                var taskDetail = item.task_detail[j]
                // 子标题拆分
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
                  
                  var option = taskDetail.options[k]

                  if (taskDetail.finished_info.answers.length > k) {
                    let answer = taskDetail.finished_info.answers[k]
                    option.answer = answer
                  }
                  
                  option.imgs = []
                  option.list = Object.values(option.lists)

                  if (taskDetail.finished_info.attach && taskDetail.finished_info.attach != '' && taskDetail.finished_info.attach.length > k && taskDetail.finished_info.attach[k] != ""){

                    option.imgs = taskDetail.finished_info.attach[k].split(",")
                    // console.log(option.imgs)
                  }
                  
                  for (var n = 0; n < option.list.length; n++) {
                    var optionListItem = option.list[n]
                    var newOptionListItem = {}
                    newOptionListItem.item = optionListItem
                    newOptionListItem.option = String.fromCharCode(65 + n)
                    newOptionListItem.select = false
                    option.list[n] = newOptionListItem
  
                    // for (var m = 0; m < taskDetail.finished_info.answers.length;m++){
                    //   let answer = taskDetail.finished_info.answers[m]
                      if (newOptionListItem.option == option.answer){
                        newOptionListItem.select = true
                      }
                    // }
  
                    for (var m = 0; m < taskDetail.finished_info.memo.length; m++) {
                      if(k == m){
                        option.memo = taskDetail.finished_info.memo[m]
                      }
                    }
                  }
                }
              }
              break
            }
            case 3: {
              // 字段任务
              for (var n = 0; n < item.title.length; n++) {
                item.task_detail[n].title = item.title[n]
              }
  
              for (var j = 0; j < item.task_detail.length; j++) {
                var taskDetail = item.task_detail[j]
  
                let answers = taskDetail.finished_info.answers.split(",")
                let imgsList = taskDetail.finished_info.attach.split(",")
  
                for (var k = 0; k < taskDetail.fieldlist.length; k++) {
  
                  var arr = []
                  var fileListItem = taskDetail.fieldlist[k]

                  fileListItem.imgs = imgsList
                  fileListItem.memo = taskDetail.finished_info.memo

                  for (var n = 0; n < fileListItem.lists.length; n++) {
                    var fileListItemListItem = fileListItem.lists[n]
                    var newListItem = {}
                    newListItem.item = fileListItemListItem
                    newListItem.content = answers[n]
                    fileListItem.lists[n] = newListItem
                  }
                }
              }
              break
            }
            case 4: {
              // 考勤任务
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
              break
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


    var content = e.detail.value
    console.log(content)

    var cs = "task[" + task_index + "].task_detail[" + task_detail_index + "].fieldlist[" + fieldlist_index + "].lists[" + list_index + "].content"
    that.setData({
      [cs]: content
    })
    that.taskCanSubmit(task_index)

  },

  /**
   * 选项任务 点击选项
  */
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

    var task = that.data.task[task_index]
    var taskDetail = task.task_detail[task_detail_index]
    var option = taskDetail.options[options_index]

    option.selected = true
    
    for (var i = 0; i < option.list.length; i++) {
      var list = option.list[i]
      var selected = false
      if (i == list_index) {
        selected = true
      }
      list.select = selected
    }

    var cs = "task[" + task_index + "].task_detail[" + task_detail_index + "].options[" + options_index + "]"
    that.setData({
      [cs]: option
    })

    // 判断是否可以提交
    that.taskCanSubmit(task_index)
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
    

    var content = e.detail.value
    console.log(content)
    var task = that.data.task[task_index]
    if (task_type == 1){
      var cs = "task[" + task_index + "].submit_content"

      that.setData({
        [cs]: content,
      })
      
    } else if (task_type == 2){
      var cs = "task[" + task_index + "].task_detail[" + task_detail_index + "].options[" + options_index + "].submit_content"
      that.setData({
        [cs]: content
      })
      
    } else if (task_type == 3){
      var cs = "task[" + task_index + "].task_detail[" + task_detail_index + "].fieldlist[" + fieldlist_index + "].submit_content"
      that.setData({
        [cs]: content
      })
    }
    that.taskCanSubmit(task_index)
  },


  submit:function(e){
    let that = this
    var task_index = e.currentTarget.dataset.task_index
    console.log(task_index + "task_index")

    let task = that.data.task[task_index]
    switch (task.type * 1) {
      case 1: {
        // 普通任务
        var submit_arr = [{
          memo: task.submit_content,
          pics: task.task_detail.imgs.join(","),
          attach: ''
        }];
  
        var params = {
          "token": wx.getStorageSync("token"),
          "uid": wx.getStorageSync("uid"),
          "tid": task.id,
          "data": submit_arr
        }
        // console.log(params)
        app.ljjw.jwStudentSaveTask(params).then(d => {
          // console.log(d)
          if (d.data.status == 1) {
            wx.showToast({
              title: '提交成功',
              duration:1500
            })
            that.pageData.page = 1
            that.un_task()  //刷新任务待完成列表
            console.log("任务提交成功")
          }
        })
        break
      }
      case 2: {
        // 选项任务
        console.log("选项式提交")
        var submit_arr = []
        for(var j=0; j<task.task_detail.length; j++){
          let taskDetail = task.task_detail[j]

          var taskDetail_answers = []
          var taskDetail_memoContent = []
          var taskDetail_pics = []

          for(var k=0; k<taskDetail.options.length; k++){
            let option = taskDetail.options[k]

            for (var n = 0; n < option.list.length;n++){
              let list = option.list[n]

              if (list.select == true) {
                taskDetail_answers.push(list.option)
              }
            }
            
            taskDetail_memoContent.push(option.submit_content)
            let optionImage = option.imgs.join(",")
            taskDetail_pics.push(optionImage)
            
          }
          var memo = taskDetail_memoContent.join("|")
          var pics = taskDetail_pics.join("|")
          
          if (memo == "|"){
            memo = ""
          }

          if (pics == "|") {
            pics = ""
          }

          var newdata = {
            info_id: taskDetail.id,
            answers: taskDetail_answers.join(","),
            memo: memo,
            // pics: pics,
            attach: pics,
          }
          submit_arr.push(newdata)
        }
        
        var params = {
          "token": wx.getStorageSync("token"),
          "uid": wx.getStorageSync("uid"),
          "tid": task.id,
          "data": submit_arr
        }
        // console.log(params)
        app.ljjw.jwStudentSaveTask(params).then(d => {
          // console.log(d)
          if (d.data.status == 1) {
            wx.showToast({
              title: '提交成功',
              duration: 1500
            })
            that.pageData.page = 1
            that.un_task()  //刷新任务待完成列表
            console.log("任务提交成功")
          }
        })
        break
      }
      case 3: {
        // 字段任务
        console.log("字段式提交")
        var submit_arr = []
        for (var j = 0; j < task.task_detail.length; j++) {
          let taskDetail = task.task_detail[j]

          var taskDetail_memoContent = []
          var taskDetail_pics = []
          var answerArray = []

          for (var k = 0; k < taskDetail.fieldlist.length; k++) {
            let field = taskDetail.fieldlist[k]
            taskDetail_memoContent.push(field.submit_content)
            taskDetail_pics.push(field.imgs.join(","))

            for (var i = 0; i < field.lists.length; i++) {
              let list = field.lists[i]
              var content = list.content
              var contentArray = content.split(",")
              var newContent = contentArray.join(" ")
              answerArray.push(newContent)
            }
          }
          var memo = taskDetail_memoContent.join("|")
          var pics = taskDetail_pics.join("|")

          if (memo == "|") {
            memo = ""
          }

          if (pics == "|") {
            pics = ""
          }

          var newData = {
            info_id: taskDetail.id,
            answers: answerArray.join(","),
            memo: memo,
            // pics: pics,
            attach: pics,
          };
          submit_arr.push(newData)
        }

        var params = {
          "token": wx.getStorageSync("token"),
          "uid": wx.getStorageSync("uid"),
          "tid": task.id,
          "data": submit_arr
        }
        // console.log(params)
        app.ljjw.jwStudentSaveTask(params).then(d => {
          // console.log(d)
          if (d.data.status == 1) {
            wx.showToast({
              title: '提交成功',
              duration: 1500
            })
            that.pageData.page = 1
            that.un_task()  //刷新任务待完成列表
            console.log("任务提交成功")
          }
        })
        break
      }
      case 4: {
        // 考勤任务
        break
      }
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
    
    let count_img = 6

    var len = 0;

    let task = that.data.task[task_index]
    switch (task.type * 1) {
      case 1: {
        // 普通任务
        len = task.task_detail.imgs.length
        break
      }
      case 2: {
        // 选项任务
        let taskDetail = task.task_detail[task_detail_index]
        let option = taskDetail.options[options_index]
        len = option.imgs.length
        break
      }
      case 3: {
        // 字段任务
        let taskDetail = task.task_detail[task_detail_index]
        let field = taskDetail.fieldlist[options_index]
        len = field.imgs.length
        break
      }
    }
    
    if (len < 6) {
      count_img = 6 - len
      console.log(count_img +"count_img")
      wx.chooseImage({
        count: count_img*1,
        success: (res) => {
          let tempFilePaths = res.tempFilePaths;
          console.log(tempFilePaths)

          // 开始上传
          that.pictureCycleUpload(tempFilePaths, 0, task_index, task_detail_index, options_index)

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
    
    let task = that.data.task[task_index]
    let taskDetail = task.task_detail[task_detail_index]

    switch (task.type * 1) {
      case 2: {
        // 选项任务
        var option = taskDetail.options[options_index]
        option.imgs.splice(xb, 1);
        var css = "task[" + task_index + "].task_detail[" + task_detail_index + "].options[" + options_index + "].imgs"
        that.setData({
          [css]: option.imgs
        })
        break
      }
      case 3: {
        // 字段任务
        var field = taskDetail.fieldlist[options_index]
        field.imgs.splice(xb, 1);
        var css = "task[" + task_index + "].task_detail[" + task_detail_index + "].fieldlist[" + options_index + "].imgs"
        that.setData({
          [css]: field.imgs
        })
        break
      }
    }
    that.taskCanSubmit(task_index)
  },

  del_img1: function (e) {   //普通删除图片
    let that = this
    var xb = e.currentTarget.dataset.xb
    console.log(xb + "xb")
    var task_index = e.currentTarget.dataset.task_index
    console.log(task_index + "task_index")
    
    var task = that.data.task[task_index]
    task.task_detail.imgs.splice(xb, 1);
    
    var css = "task[" + task_index + "].task_detail.imgs"
    that.setData({
      [css]: task.task_detail.imgs
    })

    that.taskCanSubmit(task_index)
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

  },


  /**
   * 查看任务附件大图
  */
  previewAttachImage: function(e) {
    let that = this
    console.log(e)
    let taskIndex = e.currentTarget.dataset.taskindex
    let type = e.currentTarget.dataset.type

    let task = that.data.task[taskIndex]

    var urls = []
    var current = ''
    switch(type*1) {
      case 1: {
        // 普通任务 附件 attach
        let attachIndex = e.currentTarget.dataset.attachindex
        let attachArray = task.attach
        urls = attachArray
        current = attachArray[attachIndex]
        break
      }
      case 2: {
        // 普通任务 学生上传图片 task_detail.finished_info.pics
        let imgIndex = e.currentTarget.dataset.imageindex
        let imgArray = task.task_detail.imgs
        urls = imgArray
        current = imgArray[imgIndex]
        break
      }
      case 3: {
        // 选项任务 学生上传图片 task_detail[i].finished_info.attach
        let imgIndex = e.currentTarget.dataset.imageindex
        let taskDetailIndex = e.currentTarget.dataset.taskdetailindex
        let optinIndex = e.currentTarget.dataset.optionindex
        let option = task.task_detail[taskDetailIndex].options[optinIndex]
        urls = option.imgs
        current = urls[imgIndex]
        break
      }
      case 4: {
        // 字段任务 学生上传图片 task_detail[i].finished_info.attach
        let imgIndex = e.currentTarget.dataset.imageindex
        let taskDetailIndex = e.currentTarget.dataset.taskdetailindex
        let fieldlistIndex = e.currentTarget.dataset.fieldlistindex
        let field = task.task_detail[taskDetailIndex].fieldlist[fieldlistIndex]
        urls = field.imgs
        current = urls[imgIndex]
        break
      }
    }
    console.log(urls)
    console.log(current)
    wx.previewImage({
      urls: urls,
      current: current
    })
  },

  /**
   * 判断是否可以提交
  */
  taskCanSubmit: function(taskIndex) {
    let that = this
    let task = that.data.task[taskIndex]
    var cansubmit = false
    switch (task.type * 1) {
      case 1: {
        // 普通任务
        if ((task.submit_content && task.submit_content != '') && (task.task_detail.imgs.length != 0 || task.has_pics != 1)) {
          cansubmit = true
        }
        break
      }
      case 2: {
        // 选项任务
        cansubmit = true
        for (var i = 0; i < task.task_detail.length; i++) {
          let taskDetail = task.task_detail[i]
          // 是否继续执行循环
          var next = true
          for (var j= 0; j < taskDetail.options.length; j++) {
            let option = taskDetail.options[j]
            // 判断备注内容是否填写
            if ((taskDetail.option_type == 2 || taskDetail.option_type == 4) && (!option.submit_content || option.submit_content == '')) {
              cansubmit = false
              next = false
              break
            }
            // 判断图片是否选择
            if ((taskDetail.option_type == 3 || taskDetail.option_type == 4) && option.imgs.length == 0) {
              cansubmit = false
              next = false
              break
            }
            // 判断是否选择
            if (!option.selected) {
              cansubmit = false
              next = false
            }
          }
          if (!next) {
            break
          }
        }
        break
      }
      case 3: {
        // 字段任务
        cansubmit = true
        for (var i = 0; i < task.task_detail.length; i++) {
          let taskDetail = task.task_detail[i]
          var taskDetailNext = true
          for (var j = 0; j < taskDetail.fieldlist.length; j++) {
            let field = taskDetail.fieldlist[j]
            // 判断备注内容是否填写
            if ((taskDetail.field_type == 2 || taskDetail.field_type == 4) && (!field.submit_content || field.submit_content == '')) {
              cansubmit = false
              taskDetailNext = false
              break
            }
            // 判断图片是否选择
            if ((taskDetail.field_type == 3 || taskDetail.field_type == 4) && field.imgs.length == 0) {
              cansubmit = false
              taskDetailNext = false
              break
            }
            // 判断字段是否填写
            var fieldNext = true
            for (var k= 0; k < field.lists.length; k++) {
              let list = field.lists[k]
              if (!list.content || field.content == '') {
                cansubmit = false
                taskDetailNext = false
                fieldNext = false
                break
              }
            }

            if (!fieldNext) {
              break
            }
          }
          if (!taskDetailNext) {
            break
          }
        }
        break
      }
    }

    if (task.submit == cansubmit) {
      return
    }
    var cs = "task[" + taskIndex + "].submit"
    that.setData({
      [cs]: cansubmit
    })
  },

  /**
   * 多张图片上传
  */
  pictureCycleUpload: function(filePathList, uploadIndex, taskIndex, taskDetailIndex, optionsIndex) {
    let that = this
    if (filePathList.length <= uploadIndex) {
      return
    }

    let filePath = filePathList[uploadIndex]
    this.uploadImage(filePath, function(success, imageData, errorMsg) {
      if(success) {
        var task = that.data.task[taskIndex]
        switch(task.type*1) {
          case 1: {
            // 普通任务
            task.task_detail.imgs.push(imageData)
                        
            var css = "task[" + taskIndex + "].task_detail.imgs"
            that.setData({
              [css]: task.task_detail.imgs
            })
            break
          }
          case 2: {
            // 选项任务
            var taskDetail = task.task_detail[taskDetailIndex]
            var option = taskDetail.options[optionsIndex]
            option.imgs.push(imageData)
            var css = "task[" + taskIndex + "].task_detail[" + taskDetailIndex + "].options[" + optionsIndex + "].imgs"
            that.setData({
              [css]: option.imgs
            })
            break
          }
          case 3: {
            // 字段任务
            var taskDetail = task.task_detail[taskDetailIndex]
            var field = taskDetail.fieldlist[optionsIndex]
            field.imgs.push(imageData)
            var css = "task[" + taskIndex + "].task_detail[" + taskDetailIndex + "].fieldlist[" + optionsIndex + "].imgs"
            that.setData({
              [css]: field.imgs
            })
            break
          }
        }

        if (uploadIndex < filePathList.length-1) {
          that.pictureCycleUpload(filePathList, uploadIndex+1, taskIndex, taskDetailIndex, optionsIndex)
        }

        that.taskCanSubmit(taskIndex)
      }
    })
  },

  /**
   * 上传图片
  */
  uploadImage: function(filePath, cb) {
    let that = this
    var token = wx.getStorageSync('token');
    wx.showLoading({
      title: '上传中',
    })
    wx.uploadFile({
      url: app.ljjw.getUploadFileURI(),
      filePath: filePath,
      name: 'file',
      formData: {
        'file': filePath,
        "token": token,
        "action": "jwUploadAvatar", //action=uploads&authhash=445454554
      },
      success(r) {
        wx.hideLoading({
          complete: (res) => {
            let hhh = JSON.parse(r.data);
            console.log(hhh)
            if (hhh.status == 1) {
              typeof cb == "function" && cb(true, hhh.data, "加载成功")
            } else {
              let errorMsg = hhh.msg ? hhh.msg : '上传失败'
              wx.showToast({
                title: errorMsg,
                icon: 'none'
              })
              typeof cb == "function" && cb(false, null, errorMsg)
            }
          },
        })
      },
      fail(error) {
        wx.hideLoading({
          complete: (res) => {
            wx.showToast({
              title: '上传失败',
              icon: 'none'
            })
            typeof cb == "function" && cb(false, null, "上传失败")
          },
        })
      }
    })
  },
})