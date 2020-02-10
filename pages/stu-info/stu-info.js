// pages/stu-info/stu-info.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sex: ['请选择', '男', '女'],
    stu_class: ['请选择', '西安国考集训营逻辑班', '西安国考集训营逻辑班', '西安国考集训营逻辑班', '西安国考集训营逻辑班', '西安国考集训营逻辑班'],
    stu_class_index:0,
    sex_index :0 ,
    graduation_time: '请选择',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    var date = new Date()
    var cur_year = date.getFullYear()
    // console.log(cur_year)
    var cur_month = date.getMonth() + 1
    // console.log(cur_month)
    var cur_day = date.getDate()
    // console.log(cur_day)
    var cur_date = cur_year + '-' + (cur_month < 10 ? '0' + (cur_month) : cur_month) + '-' + (cur_day < 10 ? '0' + (cur_day) : cur_day)
    console.log(cur_date)
    that.setData({
      cur_date : cur_date
    })

  },
  sex_picker: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      sex_index: e.detail.value
    })
  },
  stu_class_picker: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      stu_class_index: e.detail.value
    })
  },
  graduation_time: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      graduation_time: e.detail.value
    })
  },

  input_name:function(e){
    let that = this
    console.log(e.detail.value)
    that.setData({
      input_name: e.detail.value
    })
  },
  input_phone: function (e) {
    let that = this
    console.log(e.detail.value)
    that.setData({
      input_phone: e.detail.value
    })
  },
  input_school: function (e) {
    let that = this
    console.log(e.detail.value)
    that.setData({
      input_school: e.detail.value
    })
  },
  input_major: function (e) {
    let that = this
    console.log(e.detail.value)
    that.setData({
      input_major: e.detail.value
    })
  },
  input_email: function (e) {
    let that = this
    console.log(e.detail.value)
    that.setData({
      input_email: e.detail.value
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