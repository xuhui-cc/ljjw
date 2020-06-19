// pages/feedBack_list/feedBack_list.js
const app = getApp()
Page({

  /**
   * 分页数据
  */
  pageData: {
    page: 1,
    perpage: 10,
    canLoadNextPage: false
  },

  /**
   * 页面的初始数据
   */
  data: {
    // 顶部菜单选中下标
    menuSelectedIndex: 0,

    // 页面红点
    redDotCount: {
      // 反馈处理 未读消息数量
      feedBackNotiCount: 0,
      // 待归还 未读消息数
      feedBackNotReturn: 0,
      // 已完成 未读消息数量
      feedBackFinished: 0,
    },
    
    /**
     * item列表
     * id: 类型id
     * title：类型标题
     * child：二级分类（字段 id， title）
    */
    itemArray: [],

    // 反馈类型 圆圈颜色
    typeColor: ['#6D9DEE', '#FB895E', '#74BB71', '#FC7878', '#E1CB3C'],

    /**
     * 反馈列表
     * sort_id: 二级分类ID
     * notes: 反馈内容
     * pics: 反馈图片，以','隔开
     * usetime: 申请试用自习室的时间段
     * marked: 学员评分
     * comment: 学员评价内容
     * comment_time: 学员评分时间
     * subtime: 学员提交反馈时间 10位时间戳
     * dispose_user: 关联处理人
     * operate_uid: 操作人
     * feed_state: 处理状态 1-未处理 2-处理中 3-已处理 4-已驳回
     * return_state: 申请归还状态 0-无归还状态 1-未归还 2-待确认 3-已归还 4-已驳回
     * saw: 反馈处理后学员是否已读 0-未读 10已读
     * parent: 一级分类名
     * soncount: 二级分类数量
     * process_list: 处理列表
     *     fid: 关联的反馈ID
     *     id: 流程id
     *     content：处理内容
     *     images：处理图片，用‘,’隔开
     *     createtime：创建时间 10位时间戳
     *     tid：处理反馈：0-无处理结果  1-有处理结果
     *     procstate：3-通过  4-驳回
     *     proctime： 处理时间 0000-00-00 00:00
     *     procuser： 处理人名字
     * apply_return： 归还流程列表
     *     id：流程ID
     *     fid：反馈ID
     *     deal_uid：处理人uid
     *     deal_time：处理时间 10位时间戳
     *     type：1-学生提交归还 2-老师审核
     *     content：处理内容
     *     images：处理图片，用','隔开
     *     status：0-老师驳回归还 1-老师确认归还
     * 
     * 自定义
     * time：创建时间 0000-00-00 00:00
     * dealList: 处理流程列表
     *     role: 1-我  2-老师
     *     name: 处理人名字
     *     pics: 处理图片
     *     content: 处理内容
     *     timestamp: 处理时间 10位时间戳
     *     time: 处理时间 0000-00-00 00:00
     *     type: 1-无处理结果 2-处理通过 3-处理驳回 4-学生提交归还 5-归还老师审核通过 6-归还老师审核驳回 7-评价
     * showReturnButton: 是否展示确认归还按钮
    */
    feedBackList:[],

    // 反馈处理 类型 1-未处理 2-待归还 3-已完结
    feedBackListType: 1,
    feedBackListMenu: [
      {
        title: "待处理",
        type: 1,
      }, 
      {
        title: "待归还",
        type: 2,
      }, 
      {
        title: "已完成",
        type: 3
      }
    ],

    // 选中要评价的反馈的索引
    evaluateIndex: null,
    // 评价内容
    evaluateContent: '',
    // 评分
    evaluateScore: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options)
    if (options.menu == 1) {
      this.setData({
        menuSelectedIndex: options.menu
      })
    }
    this.setUpNaviSize()
    if (this.data.menuSelectedIndex == 1) {
      this.studentGetFeedBackList()
    } else {
      this.getFeedBackTypeList()
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
    this.studentGetFeedBackNotiCount()
    // if (this.data.menuSelectedIndex == 1) {
    //   this.pageData.page = 1
    //   this.studentGetFeedBackList()
    // }
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

  },

  // ------------------------------------------------私有方法---------------------------------------------------
  /**
   * 设置自定义导航栏尺寸
  */
  setUpNaviSize: function () {
    var menuButtonRect = wx.getMenuButtonBoundingClientRect()
    var systemInfo = wx.getSystemInfoSync()
    let naviBarHeight = menuButtonRect.bottom+10
    let naviBarWidth = systemInfo.screenWidth
    let saveBottom = systemInfo.screenHeight-systemInfo.safeArea.bottom
    
    this.setData ({
      naviBarHeight: naviBarHeight,
      naviBarWidth: naviBarWidth,
      navibar_content_height: naviBarHeight - systemInfo.statusBarHeight,
      statusBar_height: systemInfo.statusBarHeight,
      saveBottom: saveBottom,
      screenWidth: systemInfo.screenWidth
    })
  },

  /**
   * 获取 已评价 流程对象
  */
  getDealObject: function (timestamp, content, type) {
    switch(type*1){
      case 4: {
        // 学生提交归还
        return {
          timestamp: timestamp,
          time: app.util.customFormatTimeByTimestamp(timestamp*1000, 'yyyy-MM-dd hh:mm'),
          role: 1,
          type: 4,
          timeColor: '#8D8D8D',
          statusColor: '#272727',
          contentColor: '#272727',
          status: "提交归还"
        }
        break
      }
      case 7: {
        // 评论
        return {
          content :content,
          timestamp: timestamp,
          time: app.util.customFormatTimeByTimestamp(timestamp*1000, 'yyyy-MM-dd hh:mm'),
          role: 1,
          type: 7,
          timeColor: '#8D8D8D',
          contentColor: '#272727'
        }
        break
      }
    }
  },

  // --------------------------------------------------接口-----------------------------------------------------
  /**
   * 获取反馈类型列表
  */
  getFeedBackTypeList: function() {
    let that = this
    let params = {
      "token": wx.getStorageSync("token")
    }
    app.ljjw.getFeedbackType(params).then(d=>{
      let status = d.data.status
      if (status == 1) {
        let data = d.data.data
        for (var i = 0; i < data.length; i++) {
          let type = data[i]
          type.open = false
        }
        that.setData({
          itemArray: data
        })
      }
    })
  },

  /**
   * 学生获取未读反馈消息数量
  */
  studentGetFeedBackNotiCount: function () {
    let that = this
    let prarms = {
      "token": wx.getStorageSync("token"),
      "uid": wx.getStorageSync("uid"),
    }
    app.ljjw.getUnreadCount(prarms).then(d=>{
      let status = d.data.status
      let redDotCount = {
        feedBackNotiCount: 0,
        feedBackNotReturn: 0,
        feedBackFinished: 0,
      }
      if (status == 1) {
        let data = d.data.data
        var allCount = data.allcount
        var notReturnCount = data.daiguihuan
        var finishedCount = data.yiwanjie
        if (allCount && allCount != '') {
          redDotCount.feedBackNotiCount = allCount
        }
        if (notReturnCount && notReturnCount != '') {
          redDotCount.feedBackNotReturn = notReturnCount
        }
        if (finishedCount && finishedCount != '') {
          redDotCount.feedBackFinished = finishedCount
        }
        this.setData({
          redDotCount: redDotCount
        })
      } else {
        that.setData({
          redDotCount: redDotCount
        })
      }
    })
  },

  /**
   * 学生获取反馈列表
   * params:
   * type=1 未处理  type=2 待归还 type=3 已完结
  */
  studentGetFeedBackList: function (type) {
    let that = this
    let params = {
      "token": wx.getStorageSync("token"),
      "uid": wx.getStorageSync("uid"),
      type: type ? type : this.data.feedBackListType,
      page: this.pageData.page,
      limit: this.pageData.perpage,
    }
    app.ljjw.getFeedBackList(params).then(d=>{
      let status = d.data.status
      if (status == 1) {
        let feedBackList = d.data.data
        
        for (var i = 0; i < feedBackList.length; i++) {
          let feedBack = feedBackList[i]
          // 默认收起
          feedBack.open = false
          // 创建时间
          feedBack.time = app.util.customFormatTimeByTimestamp(feedBack.subtime*1000, 'yyyy.MM.dd hh:mm')
          // 反馈图片处理
          feedBack.pics = (feedBack.pics && feedBack.pics != '') ? feedBack.pics.split(',') : []
          // 是否已评分
          feedBack.evaluated = (!feedBack.marked || feedBack.marked == '' || feedBack.marked == 0) ? false : true
          // 是否展示确认归还按钮
          if (type == 2) {
            var showReturnButton = true
            if (feedBack.apply_return && feedBack.apply_return != '' && feedBack.apply_return.length != 0) {
              let lastApply = feedBack.apply_return[feedBack.apply_return.length-1]
              if (lastApply.type == 1) {
                showReturnButton = false
              }
            }
            feedBack.showReturnButton = showReturnButton
          }
          // 流程列表 处理
          let dealList = []
          for(var j = 0; j < feedBack.process_list.length; j++) {
            let process = feedBack.process_list[j]
            let deal = {
              pics : (process.images && process.images != '') ? process.images.split(',') : [],
              content : process.content,
              name : process.procuser,
              role : 2,
              timestamp: process.createtime,
              time: process.proctime
            }
            if (process.tid == 1) {
              // 有处理结果
              if (process.procstate == 3) {
                // 已处理
                deal.type = 2
                deal.timeColor = '#8D8D8D'
                deal.statusColor = '#46A1FB'
                deal.contentColor = '#272727'
                deal.status = "已处理"
              } else {
                // 驳回
                deal.type = 3
                deal.timeColor = '#F14444'
                deal.statusColor = '#F14444'
                deal.contentColor = '#F14444'
                deal.status = "已驳回"
              }
            } else {
              // 无处理结果
              deal.type = 1
              deal.timeColor = '#8D8D8D'
              deal.contentColor = '#272727'
            }
            dealList.push(deal)
          }

          for (var j = 0; j < feedBack.apply_return.length; j++) {
            let apply = feedBack.apply_return[j]
            let deal = {}
            if (apply.type == 1) {
              // 学员提交归还
              deal = that.getDealObject(apply.deal_time, '', 4)
            } else {
              // 确认归还
              if(apply.status == 1) {
                // 老师确认归还
                deal = {
                  pics : (apply.images && apply.images != '') ? apply.images.split(',') : [],
                  content : apply.content,
                  name : apply.proc_user,
                  timestamp: apply.deal_time,
                  time: app.util.customFormatTimeByTimestamp(apply.deal_time*1000, 'yyyy.MM.dd hh:mm'),
                  role: 2,
                  type: 5,
                  timeColor: '#272727',
                  statusColor: '#272727',
                  contentColor: '#272727',
                  status: "确认归还"
                }
              } else {
                // 老师驳回归还
                deal = {
                  pics : (apply.images && apply.images != '') ? apply.images.split(',') : [],
                  content : apply.content,
                  name : apply.proc_user,
                  timestamp: apply.deal_time,
                  time: app.util.customFormatTimeByTimestamp(apply.deal_time*1000, 'yyyy.MM.dd hh:mm'),
                  role: 2,
                  type: 6,
                  timeColor: '#F14444',
                  statusColor: '#F14444',
                  contentColor: '#F14444',
                  status: "驳回归还"
                }
              }
            }
            dealList.push(deal)
          }
          if(feedBack.evaluated) {
            // 已评价 添加评价记录到流程列表
            let deal = that.getDealObject(feedBack.comment_time, feedBack.comment, 7)
            dealList.push(deal)
          }
          dealList.sort(function(a,b){
            let a_timestamp = a.timestamp
            let b_timestamp = b.timestamp
            return (a_timestamp - b_timestamp)
          })
          feedBack.dealList = dealList
        }
        that.setData({
          feedBackList: feedBackList,
          feedBackListType: params.type
        })
      }
    })
  },

  /**
   * 学生提交评分
  */
  studentEvaluateSubmit: function() {
    let feedBack = this.data.feedBackList[this.data.evaluateIndex]
    let that = this
    let params = {
      "token": wx.getStorageSync("token"),
      "uid": wx.getStorageSync("uid"),
      score: this.data.evaluateScore,
      fid: feedBack.id
    }
    if (this.data.evaluateContent && this.data.evaluateContent != '') {
      params.content = this.data.evaluateContent
    }
    app.ljjw.saveStudentScore(params).then(d=>{
      let status = d.data.status
      if (status==1) {
        wx.showToast({
          title: '提交成功',
          icon: 'none'
        })
        let current_timestamp = (Date.parse(new Date()))/1000
        feedBack.comment = params.content
        feedBack.marked = params.score
        feedBack.comment_time = current_timestamp
        feedBack.evaluated = true
        feedBack.dealList.push(that.getDealObject(current_timestamp, params.content, 7))
        let feedBackChange = "feedBackList["+this.data.evaluateIndex+"]"
        
        that.setData({
          [feedBackChange]: feedBack,
        })
        that.evaluateViewClose()
      }
    })
  },

  /**
   * 学生 提交归还
  */
  studentFeedBackSubmitReturn: function (index) {
    let feedBack = this.data.feedBackList[index]
    let that = this
    let params = {
      "token": wx.getStorageSync("token"),
      "uid": wx.getStorageSync("uid"),
      fid: feedBack.id
    }
    app.ljjw.submitReturn(params).then(d=>{
      let status = d.data.status
      if(status == 1) {
        wx.showToast({
          title: '提交成功',
          icon: 'none'
        })
        let current_timestamp = (Date.parse(new Date()))/1000
        feedBack.dealList.push(that.getDealObject(current_timestamp, '', 4))
        feedBack.showReturnButton = false
        let feedBackChange = "feedBackList["+index+"]"
        that.setData({
          [feedBackChange]: feedBack
        })
      }
    })
  },

  /**
   * 学生将反馈变为已读
  */
  studentFeedBackRead: function (index, cb) {
    let feedBack = this.data.feedBackList[index]
    let that = this
    let params = {
      "token": wx.getStorageSync("token"),
      "uid": wx.getStorageSync("uid"),
      fid: feedBack.id
    }
    app.ljjw.setFeedbackSaw(params).then(d=>{
      let status = d.data.status
      if (status == 1) {
        let feedBackSawChange = "feedBackList["+index+"].saw"
        that.setData({
          [feedBackSawChange]: 1
        })
        typeof cb == "function" && cb(true, "加载成功")
      } else {
        typeof cb == "function" && cb(false, "加载失败")
      }
    })
  },

  // ------------------------------------------------交互事件---------------------------------------------------
  /**
   * 顶部菜单 点击事件
  */
  menu_selected: function (e) {
    
    let index = e.currentTarget.dataset.index
    if (index == this.data.menuSelectedIndex) {
      return
    }
    this.setData({
      menuSelectedIndex: index
    })

    this.studentGetFeedBackNotiCount()
  },

  /**
   * 导航栏返回按钮
  */
  back: function() {
    wx.navigateBack({
      complete: (res) => {},
    })
  },

  /**
   * 一级反馈类型 单元格 点击事件
  */
  feedBackTypeClicked: function(e) {
    let index = e.currentTarget.dataset.index
    let item = this.data.itemArray[index]
    if (!item.child || !(item.child.constructor === Array) || item.child.length == 0) {
      wx.showToast({
        title: '没有二级分类',
        icon: 'none'
      })
      return
    }
    if (item.child.length == 1) {
      let childItem = item.child[0]
      wx.navigateTo({
        url: '../../pages/feedBack_submit/feedBack_submit?type=' + childItem.id + '&title=' + item.title,
      })
    } else {
      let itemOpenStr = "itemArray["+index+"].open"
      this.setData({
        [itemOpenStr]: !item.open
      })
    }
  },

  /**
   * 二级反馈类型 点击事件
  */
  feedBackSecondTypeClicked: function (e) {
    // console.log(e)
    let firstIndex = e.currentTarget.dataset.firstindex
    let secondIndex = e.currentTarget.dataset.secondindex

    let firstTypeItem = this.data.itemArray[firstIndex]
    let secondTypeItem = firstTypeItem.child[secondIndex]

    wx.navigateTo({
      url: '../../pages/feedBack_submit/feedBack_submit?type=' + secondTypeItem.id + '&title=' + firstTypeItem.title + '&subtitle=' + secondTypeItem.title,
    })
  },

  /**
   * 反馈处理 菜单 点击事件
  */
  feedBackListMenuClicked: function (e) {
    let type = e.currentTarget.dataset.type
    if (type == this.data.feedBackListType) {
      return
    }
    this.studentGetFeedBackList(type)
    this.studentGetFeedBackNotiCount()
  },

  /**
   * 反馈列表 单元格 展开/收起 点击事件
  */
  feedBackOpenButton: function(e) {
    // console.log(e)
    let that = this
    let index = e.currentTarget.dataset.index
    let feedBack = this.data.feedBackList[index]
    let setData = "feedBackList["+index+"].open"
    if (this.data.feedBackListType == 1) {
      this.setData({
        [setData]: !feedBack.open
      })
    } else {
      if (feedBack.saw == 0 && !feedBack.open) {
        // 未读 要展开
        this.studentFeedBackRead(index, function(success, msg) {
          if (success) {
            feedBack.open = true
            feedBack.saw = 1
            let feedBackCHange = "feedBackList["+index+"]"
            that.setData({
              [feedBackCHange]: feedBack
            })
            that.studentGetFeedBackNotiCount()
          } else {
            that.setData({
              [setData]: true
            })
          }
        })
      } else {
        that.setData({
          [setData]: !feedBack.open
        })
      }
    }
    
  },

  /**
   * 评分星星 点击事件
  */
  startClicked: function (e) {
    // console.log(e)
    let score = e.detail.score
    this.setData({
      evaluateScore: score
    })
  },

  /**
   * textarea文本输入
  */
  textareaInput: function(e) {
    // console.log(e)
    let newcontent = e.detail.value
    
    this.setData({
      evaluateContent: newcontent
    })

  },

  /**
   * 去评价 按钮 点击事件
  */
  evaluateButtonClciked: function (e) {
    let index = e.currentTarget.dataset.index
    this.setData({
      evaluateIndex: index
    })
  },

  /**
   * 评价 提价按钮 点击事件
  */
  evaluateSubmit: function(e) {
    this.studentEvaluateSubmit()
  },

  /**
   * 评价弹框 关闭按钮 点击事件
  */
  evaluateViewClose: function() {
    this.setData({
      evaluateIndex: null,
      evaluateContent: '',
      evaluateScore: 0,
    })
  },

  /**
   * 确认归还按钮 点击事件
  */
  feedBackReturnButtonClciked: function (e) {
    let index = e.currentTarget.dataset.index
    this.studentFeedBackSubmitReturn(index)
  },

  /**
   * 展示大图
  */
  showBigImage: function(e) {
    console.log(e)
    let type = e.currentTarget.dataset.type
    let feedBack_index = e.currentTarget.dataset.feedbackindex
    let image_index = e.currentTarget.dataset.imageindex

    let feedBack = this.data.feedBackList[feedBack_index]
    
    if (type == 1) {
      // 反馈图片
      let urls = feedBack.pics
      let current = urls[image_index]
      wx.previewImage({
        urls: urls,
        current: current
      })
    } else {
      // 流程处理图片
      let processIndex = e.currentTarget.dataset.dealindex
      let process = feedBack.dealList[processIndex]
      let urls = process.pics
      let current = urls[image_index]
      wx.previewImage({
        urls: urls,
        current: current
      })
    }
  }
})