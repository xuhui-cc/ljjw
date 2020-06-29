// pages/stu_jcxx/stu_jcxx.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  timestampToTime: function (timestamp) {
    var date = new Date(timestamp*1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
    var Y = date.getFullYear() + '-';
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
    var D = date.getDate() + ' ';
    var h = (date.getHours() < 10 ? '0' + (date.getHours()) : date.getHours()) + ':';
    var m = (date.getMinutes() < 10 ? '0' + (date.getMinutes()) : date.getMinutes());
    var s = date.getSeconds();
    return Y + M;
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getStudentBaseInfo()
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

  },

  /**
   * 获取学生基本信息
   * 参数：token、uid
  */
  getStudentBaseInfo: function () {
    let that = this
    // 获取用户信息
    var params = {
      "token": wx.getStorageSync("token"),
      "uid": wx.getStorageSync("uid"),
    }
    // console.log(params)
    app.ljjw.jwGetStudentMainPage(params).then(d => {
      if (d.data.status == 1) {
        var infoData = d.data.data
        let graduate_time = that.timestampToTime(infoData.graduate_time)
        infoData.graduate_time = graduate_time
        let eduList = [
          {
            "item": "邮箱",
            "iconPath": "../../images/email.png",
            "value": infoData.email,
            "identifier": "email"
          },
          {
            "item": "毕业院校",
            "iconPath": "../../images/byyx.png",
            "value": infoData.graduate_school,
            "identifier": "school"
          },
          {
            "item": "毕业时间",
            "iconPath": "../../images/bysj.png",
            "value": infoData.graduate_time,
            "identifier": "end_time"
          },
          {
            "item": "专业",
            "iconPath": "../../images/zhuanye.png",
            "value": infoData.subject,
            "identifier": "subject"
          },
          {
            "item": "班级",
            "iconPath": "../../images/banji.png",
            "value": infoData.classes[0].classname,
            "identifier": "class"
          },
          {
            "item": "在校时间",
            "iconPath": "../../images/zxsj.png",
            "value": infoData.study_time,
            "identifier": "class"
          },
          {
            "item": "市场老师",
            "iconPath": "../../images/scls.png",
            "value": infoData.market_teacher,
            "identifier": "teacher"
          }]
        infoData.eduList = eduList

        let avatar = infoData.avatar
        if (!avatar || avatar.indexOf('http') == -1) {
          infoData.avatar = '../../images/avatar_null.png'
        }

        that.setData({
          mydata: infoData,
        })
      }
    })
  }
})