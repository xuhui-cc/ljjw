// pages/tea_sinfo/tea_sinfo.js
var __importDefault = (this && this.__importDefault) || function (mod) {
  return (mod && mod.__esModule) ? mod : { "default": mod };
};
const pinyin = __importDefault(require('../../utils/wl-pinyin/wl-pinyin.js')).default
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
  isActive: null,
  tea_class_index:0,
  toView: 'inTo0',
  oHeight: [],
  scroolHeight: 0,
  },

  


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this.getNaviSzie()

    let that = this
    var params = {
      "token": wx.getStorageSync("token"),
      "uid": wx.getStorageSync("uid"),
    }
    
    // console.log(params)
    app.ljjw.jwTeacherClassStudents(params).then(d => {
      // console.log(d)
      if (d.data.status == 1) {
        that.setData({
          tea_class: d.data.data.classes,
          cs: d.data.data.students
        })
        that.getdata(that.data.cs)

        that.getSectionHeaderTop()
      }

    })
  },

  back:function(){
    wx.navigateBack({
      delta: 1  // 返回上一级页面。
    })
  },

  getdata: function (arr){
    let that = this
 
    var studentGroup  = {}, noneCharArray = []
    // 便利学生数组
    for (var i = 0; i < arr.length; i++){
      let student = arr[i]
      let upperChar = pinyin.getFirstLetter(student.realname).toUpperCase()
      if (!upperChar || upperChar == '') {
        noneCharArray.push(student)
      } else {
        let firsrChar = upperChar[0]
        let ascii = firsrChar.charCodeAt()
        if (ascii >= 65 && ascii <= 90) {
          // A-Z
          var group = studentGroup[firsrChar]
          if (group) {
            group.users.push(student)
          } else {
            studentGroup[firsrChar] = {
              groupName : firsrChar,
              users : [student]
            }
          }
        } else {
          // 其他字符
          noneCharArray.push(student)
        }
      }

      // 处理头像
      if (!student.avatar || student.avatar.indexOf('http') == -1) {
        student.avatar = '../../images/avatar_null.png'
      }
    }

    // 排序
    var groupArray = Object.values(studentGroup)
    groupArray.sort(function(a,b){
      let aChar = a.groupName.charCodeAt()
      let bChar = b.groupName.charCodeAt()
      
      return (aChar - bChar)
    })
    
    // 添加#组
    if (noneCharArray.length != 0) {
      groupArray.push({
        groupName: '#',
        users: noneCharArray
      })
    }

    if (groupArray.length != 0) {
      this.setData({
        isActive: 0
      })
    }

    that.setData({
      dataarr: groupArray
    })
  },


  tea_class_picker: function (e) {
    let that = this
    console.log('picker发送选择改变，携带值为', e.detail.value)
    that.setData({
      tea_class_index: e.detail.value
    })
    var params = {
      "token": wx.getStorageSync("token"),
      "uid": wx.getStorageSync("uid"),
      "class_id": that.data.tea_class[that.data.tea_class_index].id,
    }
    console.log(params)
    app.ljjw.jwTeacherClassStudents(params).then(d => {
      console.log(d)
      if (d.data.status == 1) {
        that.setData({
          cs:d.data.data.students
        })
        console.log(that.data.cs)
        that.getdata(that.data.cs)
        


        
        
        console.log("老师学生档案获取成功")
      }

    })
  },

  to_tea_xsda:function(e){
    let that = this
    var xb = e.currentTarget.dataset.xb
    var dxb = e.currentTarget.dataset.dxb
    console.log(dxb)
    wx.navigateTo({
      url: '../../pages/tea_xsda/tea_xsda?stu_id=' + that.data.dataarr[dxb].users[xb].stu_id,
    })
  },

  to_tea_sjcxx: function (e) {
    let that = this
    var xb = e.currentTarget.dataset.xb
    var dxb = e.currentTarget.dataset.dxb
    console.log(dxb)
    wx.navigateTo({
      url: '../../pages/tea_sjcxx/tea_sjcxx?stu_id=' + that.data.dataarr[dxb].users[xb].uid,
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that = this;

    // that.getBrands();
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

  },

  //点击右侧字母导航定位触发
  scrollToViewFn: function (e) {
    console.log('点击了')
    console.log(e)
    var that = this;
    var _id = e.target.dataset.id;
    if (_id == that.data.isActive) {
      return
    }
    // let group = that.data.dataarr[_id]
    that.setData({
      isActive: _id,
      toView: 'inToView' + _id
    })
  },
  // 页面滑动时触发
  onPageScroll: function (e) {
    console.log(e)
    let scrollTopConstant = e.detail.scrollTop
    let selectMinus = this.data.headerTopArray[this.data.isActive]
    var minConstant = Math.abs(scrollTopConstant - selectMinus)
    var newSelected = this.data.isActive
    for (var i = 0; i < this.data.headerTopArray.length; i++) {
      let headerTop = this.data.headerTopArray[i]
      let minuts = Math.abs(scrollTopConstant - headerTop)
      if (minuts < minConstant) {
        minConstant = minuts
        newSelected = i
      }
    }
    if (newSelected != this.data.isActive) {
      this.setData({
        isActive: newSelected
      })
    }
  },


  /**
   * 获取页面辅助尺寸
  */
  getNaviSzie: function () {
    let menuButtonRect = wx.getMenuButtonBoundingClientRect()
    let systemInfo = wx.getSystemInfoSync()
    let naviHeight = menuButtonRect.bottom + 10
    let saveBottom = systemInfo.screenHeight-systemInfo.safeArea.bottom
    this.setData({
      naviBarHeight: naviHeight,
      statusBarHeight: systemInfo.statusBarHeight,
      naviBarContentHeight: naviHeight - systemInfo.statusBarHeight,
      contentHeight: systemInfo.screenHeight - naviHeight,
      safeAreaBottom: saveBottom
    })
  },

  /**
   * 获取字母分区头顶部高度
  */
  getSectionHeaderTop: function () {
    let that = this
    let query = wx.createSelectorQuery()
    query.selectAll(".address_top").boundingClientRect(function (rects) {
      let headerArray = []
      rects.forEach(function (rect) {
        let top = rect.top-that.data.naviBarHeight
        headerArray.push(top)
      })
      that.setData({
        headerTopArray: headerArray
      })
    }).exec()
  }

})