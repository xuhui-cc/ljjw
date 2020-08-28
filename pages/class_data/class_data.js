// pages/class_data/class_data.js
import {Timer} from '../../utils/timer.js'
const app = getApp()
Page({

  // 打开的文件路径 在onShow中删除文件
  openFilePath: '',
  // 是否正在加载
  loading: false,
  /**
   * 页面的初始数据
   */
  data: {
    // 选中的菜单索引
    selectedMenuIndex: 0,

    // 广播列表
    radioList:[],

    // 是否正在下拉刷新
    pullDownRefresh: false,

    // 广播详情弹框
    showAudioDetail: false,

    // 选择打开详情的广播
    openDetailRadio: null,

    // 输入的关键字
    keyword: '',
  },

  // // 分页数据
  // pageData:{
  //   page: 1,
  //   perpage: 10,
  //   canLoadNextPage: false
  // },

  // 选中的广播索引
  radioSelectedIndex: null,

  // 音频 播放控制对象
  innerAudioContext: null,

  // 跳转播放中
  seeking: false,

  // 最终搜索的关键字
  sureKeyWord: '',

  /**
   * 次数计时器
   * 创建时机：点击广播单元格 / 自然播放结束后播放下一个
   * 暂停时机：缓冲中 / 暂停中
   * 销毁时机：30秒触发回调 / 页面卸载 / 自然播放结束 / 非第一次点击广播单元格 / 音频onStop回调 / 切换顶部菜单栏 / 取消收藏的为正在播放的音频
   * 上传数据时机：30s触发回调
  */
  countTimer: null,

  /**
   * 时长计时器
   * 创建时机：onPlay回调
   * 暂停时机：缓冲中
   * 销毁时机：暂停 / 页面卸载 / 自然播放结束 / 非第一次点击广播单元格 / 音频onStop回调 / 切换顶部菜单栏 / 取消收藏的为正在播放的音频
   * 上传数据时机：同销毁时机
  */
  durationTimer: null,

  // 是否保持屏幕常亮
  keepScreenOn: false,

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getPageSize()
    let that = this
    let nowTime = new Date();

    var today = new Date(nowTime.getFullYear(), nowTime.getMonth(), nowTime.getDate()).getTime(); //今天凌晨

    var yestday = new Date(today - 24 * 3600 * 1000).getTime();
    that.setData({
      today: that.timestampToTime(today),
      yestday: that.timestampToTime(yestday),
      role: wx.getStorageSync('role')
    })

    this.getFileList()
  },

  timestampToTime: function (timestamp) {
    var date = new Date(timestamp);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
    var Y = date.getFullYear() + '-';
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    var D = date.getDate() + ' ';
    var h = (date.getHours() < 10 ? '0' + (date.getHours()) : date.getHours()) + ':';
    var m = (date.getMinutes() < 10 ? '0' + (date.getMinutes()) : date.getMinutes());
    var s = date.getSeconds();
    return Y + M + D;
  },

  

  /**
   * 图片显示大图
  */
  previewImage: function (pics) {
    wx.previewImage({
      current: pics[0],
      urls: pics
    })
  },

  search_collect:function(e){
    let that = this
    console.log(e.detail.value)
    that.setData({
      input_title: e.detail.value
    })

    this.getFileList(that.data.input_title)
  },

  cancel_collect:function(e){
    let that = this
    var file_xb = e.currentTarget.dataset.file_xb
    console.log(file_xb)
    var params = {
      "token": wx.getStorageSync("token"),
      "uid": wx.getStorageSync("uid"),
      "type": 2,  //1-添加，2-取消
      "fileid": that.data.mydata[file_xb].fileid
    }
    console.log(params)
    app.ljjw.jwStudentAddCollection(params).then(d => {
      if (d.data.status == 1) {
        console.log(d.data.msg)
        that.onLoad();
        console.log("收藏与取消收藏接口获取成功")
      }

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
    // 清除资料缓存
    this.clearLocalFile()

    // 解决从后台返回时 播放进度不回调问题
    if (this.radioSelectedIndex != null) {
      let selectedRadio = this.data.radioList[this.radioSelectedIndex]
      selectedRadio.readyPlay = false
      selectedRadio.playing = false
      let audioStr = 'radioList['+this.radioSelectedIndex+']'

      this.setData({
        [audioStr]: selectedRadio,
      })
      this.setInnerAudioControl(selectedRadio.audiourl)
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    if (this.innerAudioContext) {
      this.innerAudioContext.pause()
    }
    if (this.keepScreenOn) {
      let that = this
      wx.setKeepScreenOn({
        keepScreenOn: false,
        success (res) {
          console.log('关闭屏幕常亮成功')
          that.keepScreenOn = false
        },
        fail (res) {
          console.log('关闭屏幕敞亮失败：\n', res)
        }
      })
    }
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    // 销毁 音频播放管理对象
    this.clearAudioContent()
    // 销毁 音频收听次数 计时器
    this.clearCountTimer()

    // 销毁 收听时长计时器 并上传时长
    this.clearDurationTimer()
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

  // ----------------------------------------------------私有方法---------------------------------------------
  /**
   * 清除本地保存的文件
  */
  clearLocalFile: function() {
    let that = this

    if (this.openFilePath == '') {
      return
    }

    let fs = wx.getFileSystemManager()
    let filePath = this.openFilePath
    fs.unlink({
      filePath: filePath,
      success (res) {
        console.log("文件删除成功" + filePath)
        that.openFilePath = ''
        wx.removeStorageSync('openFilePath')
      },
      fail (res) {
        console.log("文件删除失败"+filePath)
        console.log(res)
      }
    })
  },

  /**
   * 获取页面辅助尺寸
  */
  getPageSize: function() {
    let systemInfo = wx.getSystemInfoSync()
    let menuBounding = wx.getMenuButtonBoundingClientRect()
    let naviHeight = menuBounding.bottom + 10
    let statusBarHeight = systemInfo.statusBarHeight
    let safeareaBottom = systemInfo.screenHeight - systemInfo.safeArea.bottom
    console.log("屏幕高度:"+systemInfo.screenHeight+"  safearea底部:"+systemInfo.safeArea.bottom)
    this.setData({
      pageSize: {
        naviHeight: naviHeight,
        statusBarHeight: statusBarHeight,
        naviContentHeight: naviHeight - statusBarHeight,
        safeareaBottom: safeareaBottom,
        screenWidth: systemInfo.screenWidth,
        screenHeight: systemInfo.screenHeight
      }
    })
  },

  /**
   * 创建播放管理对象
  */
  setInnerAudioControl: function(url) {
    this.clearAudioContent()

    let radio = this.data.radioList[this.radioSelectedIndex]
    this.innerAudioContext = wx.createInnerAudioContext()
    this.innerAudioContext.autoplay = true
    // this.innerAudioContext.loop = true
    this.innerAudioContext.src = url
    let that = this
    this.innerAudioContext.onTimeUpdate(function(e){
      // console.log('音频时长：', that.innerAudioContext.duration, that.innerAudioContext.currentTime)
      // console.log('播放进度:\n',e)
      let radio = that.data.radioList[that.radioSelectedIndex]
      let currentTime = Math.ceil(that.innerAudioContext.currentTime)
      let duration = Math.ceil(that.innerAudioContext.duration)
      let totalTime = app.util.formatTImeBySecond(duration, 'hh:mm:ss')
      let currentTimeStr = app.util.formatTImeBySecond(currentTime, 'hh:mm:ss')
      // console.log(totalTime)
      radio.duration = duration
      radio.totalTime = totalTime
      if (currentTime != 0 && !that.seeking) {
        radio.currentTime = currentTime
        radio.currentTimeStr = currentTimeStr
        radio.currentProgressBarWidth = 611 * currentTime / duration
      }

      let radioStr = 'radioList['+that.radioSelectedIndex+']'
      that.setData({
        [radioStr]: radio
      })
    })
    this.innerAudioContext.startTime = radio.currentTime
    this.innerAudioContext.onCanplay(function(){
      // 进入可以播放状态
      console.log('进入可播放状态')

      // 设置为不熄屏模式
      if (!that.keepScreenOn) {
        wx.setKeepScreenOn({
          keepScreenOn: true,
          success (res) {
            console.log('打开屏幕常亮成功')
            that.keepScreenOn = true
          },
          fail (res) {
            console.log('打开屏幕常亮失败:\n', res)
          }
        })
      }

      let radio = that.data.radioList[that.radioSelectedIndex]
      if (radio.readyPlay) {
        return
      }
      radio.readyPlay = true
      if (radio.currentTime != 0) {
        that.innerAudioContext.seek(radio.currentTime)
      }
    })
    this.innerAudioContext.onSeeking(function(e){
      console.log('跳转中',e)
      that.seeking = true
    })
    this.innerAudioContext.onSeeked(function(e){
      console.log('跳转完成',e)
      that.seeking = false
    })
    this.innerAudioContext.onPlay(function(e){
      console.log('开始播放', e)
      // let radio = that.data.radioList[that.radioSelectedIndex]
      let playStr = 'radioList['+that.radioSelectedIndex+'].playing'
      that.setData({
        [playStr]: true,
      })
      // 继续音频播放次数 计时器
      if (that.countTimer) {
        that.countTimer.resume()
      }
      
      if(!that.durationTimer) {
        // 创建收听时长 计时器
        that.durationTimer = new Timer()
        that.durationTimer.startTimer()
      } else {
        // 恢复收听时长 计时器
        that.durationTimer.resume()
      }
    })
    this.innerAudioContext.onStop(function(){
      console.log('音频停止')
      // 销毁音频播放次数 计时器
      that.clearCountTimer()

      // 销毁收听时长计时器 并上传时长
      that.clearDurationTimer()
    })
    this.innerAudioContext.onWaiting(function() {
      console.log('缓冲中')
      // 暂停音频播放次数 计时器
      if(that.countTimer) {
        that.countTimer.pause()
      }

      // 暂停收听时长 计时器
      if (that.durationTimer) {
        that.durationTimer.pause()
      }
    })
    this.innerAudioContext.onPause(function(e){
      console.log('播放暂停', e)
      let playStr = 'radioList['+that.radioSelectedIndex+'].playing'
      that.setData({
        [playStr]: false
      })
      // 暂停音频播放次数 计时器
      if(that.countTimer) {
        that.countTimer.pause()
      }

      // 暂停 销毁收听时长 计时器 并 上传收听时长
      that.clearDurationTimer()
    })
    this.innerAudioContext.onEnded(function(){
      console.log('播放至自然结束')

      that.playNext()
    })
  },

  /**
   * 播放下一个
  */
  playNext: function() {
    let that = this
    let radio = that.data.radioList[that.radioSelectedIndex]
    radio.currentTime = 0
    radio.currentTimeStr = '00:00:00'
    radio.currentProgressBarWidth = 0
    radio.playing = false
    radio.readyPlay = false
    radio.selected = false
    let radioStr = 'radioList['+that.radioSelectedIndex+']'

    // 销毁音频播放管理对象
    that.clearAudioContent()

    // 关闭音频播放次数 计时器
    that.clearCountTimer()

    // 销毁 收听时长计时器 并上传时长
    that.clearDurationTimer()

    if (that.radioSelectedIndex == that.data.radioList.length -1) {
      // 最后一个
      that.setData({
        [radioStr]: radio
      })
      that.radioSelectedIndex = null
    } else {
      // 不是最后一个
      let newIndex = that.radioSelectedIndex + 1
      let newSelectedRadio = that.data.radioList[newIndex]
      newSelectedRadio.selected = true
      newSelectedRadio.readyPlay = false
      newSelectedRadio.playing = false
      let newAudioStr = 'radioList['+newIndex+']'

      that.setData({
        [radioStr]: radio,
        [newAudioStr]: newSelectedRadio
      })
      that.radioSelectedIndex = newIndex
      that.setInnerAudioControl(newSelectedRadio.audiourl)

      // 打开音频播放次数 计时器
      that.countTimer = new Timer()
      that.countTimer.startTimer(30, function(){
        that.updateAudioListenCount()
        that.countTimer = null
      })
    }
  },

  /**
   * 销毁音频播放管理对象
  */
  clearAudioContent: function () {
    if (this.innerAudioContext) {
      console.log('销毁音频播放管理对象')
      this.innerAudioContext.destroy()
      this.innerAudioContext = null
      let that = this
      // 取消设置不熄屏模式
      if (this.keepScreenOn) {
        wx.setKeepScreenOn({
          keepScreenOn: false,
          success (res) {
            console.log('关闭屏幕常亮成功')
            that.keepScreenOn = false
          },
          fail(res) {
            console.log('关闭屏幕常亮失败：\n', res)
          }
        })
      }
    }
  },

  /**
   * 销毁 播放次数 计时器
  */
  clearCountTimer: function() {
    if(this.countTimer) {
      this.countTimer.clearTimer()
      this.countTimer = null
    }
  },

  /**
   * 销毁 收听时长计时器 并上传时长
  */
  clearDurationTimer: function() {
    if (this.durationTimer) {
      let duration = this.durationTimer.second
      this.durationTimer.clearTimer()
      this.durationTimer = null
      if (duration > 0) {
        this.updateListenTime(duration)
      }
    }
  },

  // --------------------------------------------接口----------------------------------------------------
  /**
   * 获取我的收藏列表
  */
  getFileList: function(keyword) {
    let that = this
    var params = {
      "token": wx.getStorageSync("token"),
      "uid": wx.getStorageSync("uid"),
      type: '1',
    }

    if (keyword && keyword != '') {
      params.keyword = keyword
    }
    app.ljjw.jwGetMyCollection(params).then(d => {
      if (d.data.status == 1) {

        let data = d.data.data

        if (!data || data == '') {
          that.setData({
            mydata: ''
          })
          return
        }
        for (var i = 0; i < data.length; i++) {

          let file = data[i]

          // 截取后缀 获取格式
          let form = null
          if (file.fileurl && file.fileurl != '') {
            let subFileUrlArray = file.fileurl.split(".")
            if (subFileUrlArray && subFileUrlArray.length >= 2) {
              form = subFileUrlArray[subFileUrlArray.length - 1]
            }
          }
          file.form = form

          let formType = 0 // 0-不支持格式 1-图片 2-word 3-pdf 4-ppt 5-jpg
          switch(form) {
            case "png":
            case "jpg":
            case "jpeg": {
              // 图片
              file.fileurl = file.fileurl.split(",")
              formType = 1
              break;
            }
            case "doc":
            case "docx": {
              // word
              formType = 2
              break
            }
            case "pdf": {
              // pdf
              formType = 3
              break
            }
            case "ppt":
            case "pptx": {
              formType = 4
              break
            }
          }
          file.formType = formType

          // 处理日期
          var time = file.col_time.substr(10, 15)
          if (file.col_time.indexOf(that.data.today) != -1) {
            var col_time = "今天" + time
            file.col_time = col_time
          }

          if (file.col_time.indexOf(that.data.yestday) != -1) {
            var col_time = "昨天" + time
            file.col_time = col_time
          }
        }

        that.setData({
          mydata: data
        })

      } else {
        that.setData({
          mydata: ''
        })
      }
    })
  },

  /**
   * 获取音频广播列表
  */
  getAudioList: function (cb) {
    let params = {
      uid: wx.getStorageSync('uid'),
      token: wx.getStorageSync('token'),
      type: '2',
      // page: this.pageData.page,
      // limit: this.pageData.perpage,
    }
    if (this.data.keyword && this.data.keyword != '') {
      params.keyword = this.data.keyword
    }
    let that = this
    app.ljjw.jwGetMyCollection(params).then(d=>{
      if (d.data.status == 1) {
        let radioList = d.data.data
        for(var i = 0; i< radioList.length; i++) {
          let radio = radioList[i]
          // 默认已收藏
          radio.colid = '1'
          // 将标签由字符串拆分为数组
          radio.flags = radio.tags && radio.tags != '' ? radio.tags.split(',') : []
          // 默认未选中
          radio.selected = false
          // 发布时间
          radio.pubtime = app.util.customFormatTimeByTimestamp(radio.createtime*1000, 'yyyy.MM.dd  hh:mm')
          // 修正内容图片
          while (radio.content.indexOf('<img src')>-1) {
            radio.content = radio.content.replace('<img src', '<img style="max-width:100%;" src')
          }
          // 默认播放进度
          radio.currentTime = 0 // 单位s
          radio.currentTimeStr = '00:00:00'
          radio.currentProgressBarWidth = 0 // 单位rps
          radio.totalTime = '00:00:00'
          radio.duration = 0 // 单位s
          radio.playing = false
          radio.readyPlay = false
        }
        // // 判断是否可以加载下一页
        // if (!radioList || radioList == '' || radioList.length < that.pageData.perpage) {
        //   that.pageData.canLoadNextPage = false
        // } else {
        //   that.pageData.canLoadNextPage = true
        // }
        // // 处理分页数据
        // let newList = []
        // if (that.pageData.page == 1) {
        //   newList = radioList
        // } else {
        //   newList = that.data.radioList.concat(radioList)
        // }
        that.setData({
          radioList: radioList
        })
        typeof cb == "function" && cb(true)
      } else {
        // if (that.pageData.page == 1) {
          that.setData({
            radioList: []
          })
        // }
        typeof cb == "function" && cb(false)
      }
    })
  },

  /**
   * 收藏/取消收藏音频广播 接口
  */
  collectionAudio: function(index) {
    let radio = this.data.radioList[index]
    let params = {
      uid: wx.getStorageSync('uid'),
      token: wx.getStorageSync('token'),
      type: radio.colid == null ? "1" : "2",
      lb: '2',
      fileid: radio.id
    }
    let that = this
    app.ljjw.jwStudentAddCollection(params).then(d=>{
      if (d.data.status == 1) {
        let collectionStr = 'radioList['+index+'].colid'
        if (radio.colid == null) {
          that.setData({
            [collectionStr] : '1'
          })
        } else {
          // 取消收藏
          if (index == that.radioSelectedIndex) {
            // 若取消收藏的广播为当前正在播放的广播
            // 销毁 音频播放管理对象
            that.clearAudioContent()

            // 销毁次数计时器
            that.clearCountTimer()

            // 销毁 时长计时器 并上传时长
            that.clearDurationTimer()
            that.radioSelectedIndex = null
          }
          that.data.radioList.splice(index, 1)
          that.setData({
            radioList: that.data.radioList
          })
        }
      }
    })
  },

  /**
   * 更新用户收听时长
  */
  updateListenTime: function(second) {
    let params = {
      uid: wx.getStorageSync('uid'),
      token: wx.getStorageSync('token'),
      thistime: second
    }
    app.ljjw.jwUpdateUserAudioTime(params).then(d=>{
      if(d.data.status == 1) {

      }
    })
  },

  /**
   * 更新音频收听次数
  */
  updateAudioListenCount: function() {
    if (this.data.role != 4) {
      return
    }
    let audio = this.data.radioList[this.radioSelectedIndex]
    let params = {
      uid: wx.getStorageSync('uid'),
      token: wx.getStorageSync('token'),
      id: audio.id
    }
    let that = this
    app.ljjw.updateAudioPlayCount(params).then(d=>{
      if (d.data.status == 1) {

      }
    })
  },

  // --------------------------------------------交互事件-----------------------------------
  /**
   * 导航栏 返回按钮 点击事件
  */
  back: function () {
    wx.navigateBack({
      delta: 1  // 返回上一级页面。
    })
  },

  /**
   * 打开文件
  */
  open_file:function(e){
    if (this.loading) {
      return
    }
    
    let that = this
    var file_xb = e.currentTarget.dataset.file_xb
    
    console.log(file_xb)

    let file = that.data.mydata[file_xb]

    switch (file.formType) {
      case 0:{
        // 不支持格式
        wx.showToast({
          title: (file.fileurl && file.fileurl != '') ? '不支持该文件格式' : '文件不存在',
          icon: 'none'
        })
        break
      }
      case 1:{
        // 图片
        let pics = file.fileurl
        that.previewImage(pics)
        break
      }
      default:{
        this.loading = true
        // 其他支持的文件格式
        let timestamp = Date.parse(new Date()); 
        // let fileTypeArray = that.data.mydata.files[file_xb].fileurl.split(".")
        let fileType = file.form
        let customFilePath = wx.env.USER_DATA_PATH+"/"+timestamp+"."+fileType
        console.log('得到自定义路径：')
        console.log(customFilePath)
        wx.showLoading({
          title: '资料打开中...',
        })
        wx.downloadFile({
          url: file.fileurl, //仅为示例，并非真实的资源
          filePath: customFilePath,
          success(res) {
            // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容

            console.log(res)
            var filePath = res.filePath
            console.log('返回自定义路径：')
            console.log(filePath)

            that.openFilePath = filePath
            wx.setStorageSync('openFilePath', filePath)
            wx.openDocument({
              showMenu: true,
              filePath: filePath,
              success: function (res) {
                console.log('打开文档成功')
                wx.hideLoading()
                that.loading = false
              },

              fail: function (res) {
                console.log("打开文档失败");
                console.log(res)
                wx.hideLoading({
                  complete: (res) => {
                    wx.showToast({
                      title: '文件打开失败',
                      icon: 'none'
                    })
                  },
                })
                that.loading = false
              },
              complete: function (res) {
                console.log("complete");
                console.log(res)
              }


            })
          },
          fail: function(res) {
            console.log('文件下载失败')
            console.log(res)
            wx.hideLoading({
              complete: (res) => {
                wx.showToast({
                  title: '文件下载失败',
                  icon: 'none'
                })
              },
            })
            that.loading = false
          }
        })
        break
      }
    }
  },

  /**
   * 顶部菜单栏 点击事件
  */
  topMenuSelected: function(e) {
    let index = e.currentTarget.dataset.index
    if (index == this.data.selectedMenuIndex) {
      return
    }
    this.setData({
      selectedMenuIndex: index
    })
    if (index == 0) {
      // 资料
      // 销毁音频播放管理对象
      this.clearAudioContent()
      // 销毁 次数计时器
      this.clearCountTimer()
      // 销毁 时长计时器 并上传时长
      this.clearDurationTimer()

      this.radioSelectedIndex =null
      this.getFileList()
    } else {
      // 音频
      this.getAudioList()
    }
  },

  /**
   * 广播 查看详情按钮 点击事件
  */
  radioShowDetail: function(e) {
    // console.log(e)
    let index = e.currentTarget.dataset.index
    let radio = this.data.radioList[index]
    if (!radio.content || radio.content == '') {
      return
    }
    this.setData({
      showAudioDetail: true,
      openDetailRadio: radio
    })
  },

  /**
   * 广播 收藏按钮 点击事件
  */
  radioCollectionButtonClciked: function(e) {
    // console.log(e)
    let index = e.currentTarget.dataset.index
    this.collectionAudio(index)
    
  },

  // /**
  //  * 下拉刷新 触发
  // */
  // refreshList: function() {
  //   this.pageData.page = 1
  //   let that = this
  //   if (this.innerAudioContext) {
  //     this.innerAudioContext.destroy()
  //     this.innerAudioContext = null
  //   }
  //   this.radioSelectedIndex =null
  //   this.getAudioList(function(success){
  //     that.setData({
  //       pullDownRefresh: false
  //     })
  //   })
  // },

  /**
   * 广播单元格 点击事件
  */
  radioCellClicked: function(e) {
    let index = e.currentTarget.dataset.index
    let audio = this.data.radioList[index]
    let that = this
    if (this.radioSelectedIndex != null) {
      if (index == this.radioSelectedIndex) {
        return
      }
      // 销毁 音频管理对象
      this.clearAudioContent()

      // 销毁 收听时长计时器 并上传时长
      this.clearDurationTimer()
      audio.selected = true
      audio.readyPlay = false
      audio.playing = false
      // audio.currentTime = this.innerAudioContext.currentTime
      // radio.currentProgressBarWidth = this.data.progressBarWidth
      let radioSelectedStr = 'radioList['+index+']'
      let oldSelectedAudio = this.data.radioList[this.radioSelectedIndex]
      let radioOldSelectedStr = 'radioList['+this.radioSelectedIndex+'].selected'
      this.setData({
        [radioSelectedStr]: audio,
        [radioOldSelectedStr]: false,
        // progressBarWidth: oldSelectedAudio.progressBarWidth,
      })
      this.radioSelectedIndex = index
      this.setInnerAudioControl(audio.audiourl)
      
    } else {
      let radioSelectedStr = 'radioList['+index+'].selected'
      this.setData({
        [radioSelectedStr]: true,
        // progressBarWidth: 0,
      })
      this.radioSelectedIndex = index
      this.setInnerAudioControl(audio.audiourl)
    }
    // 关闭音频播放次数 计时器
    this.clearCountTimer()
    // 打开新的 音频播放次数计时器
    this.countTimer = new Timer()
    this.countTimer.startTimer(30, function(){
      that.updateAudioListenCount()
      that.countTimer = null
    })
  },

  /**
   * 拖动进度条 进度回调
  */
  changeProgress: function(e) {
    if (e.detail.source == '') {
      // setData导致的回调
      return
    }
    let index = e.currentTarget.dataset.index
    let radio = this.data.radioList[index]
    // console.log('拖动进度条:\n',e)
    let moveX = e.detail.x*750.0/this.data.pageSize.screenWidth
    // console.log(moveX)
    radio.currentProgressBarWidth = moveX
    
    let currentTime = Math.ceil(moveX * radio.duration/611)
    radio.currentTime = currentTime
    console.log('拖动进度条至：', currentTime, 's')
    let radioMoveXStr = 'radioList['+index+']'
    this.setData({
      [radioMoveXStr]: radio
    })
  },

  /**
   * 拖动进度条结束
  */
  changeProgressEnd: function(e) {
    console.log('拖动结束', e)
    let radio = this.data.radioList[this.radioSelectedIndex]
    if (radio.currentTime < radio.duration) {
      // 不是结束
      this.innerAudioContext.seek(radio.currentTime)
      this.innerAudioContext.play()
    } else {
      // 拖到结束
      this.playNext()
    }
  },

  /**
   * 拖动进度条开始
  */
  changeProgressStart: function(e){
    console.log('拖动开始', e)
    this.innerAudioContext.pause()
  },

  /**
   * 播放/暂停按钮 点击事件
  */
  audioPlayButtonClciked: function(e) {
    let index = e.currentTarget.dataset.index
    let audio = this.data.radioList[index]
    if (audio.playing) {
      this.innerAudioContext.pause()
    } else {
      this.innerAudioContext.play()
    }
  },

  /**
   * 广播详情弹框
  */
  closeAudioDetailView: function() {
    this.setData({
      showAudioDetail: false,
      openDetailRadio: null
    })
  },

  detailViewClciked: function(){

  },

  /**
   * 搜索框 输入回调
  */
  searchBarInput: function(e) {
    console.log(e)
    let keyword = e.detail.value
    this.setData({
      keyword: keyword
    })

    this.clearAudioContent()

    this.clearCountTimer()

    this.clearDurationTimer()

    this.radioSelectedIndex = null

    this.getAudioList()
  },
})