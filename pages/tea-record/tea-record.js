// pages/tea-record/tea-record.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    aud:3,
    click_detail:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    // var mid = options.mid
    // that.setData({
    //   mid : mid
    // })
    var params = {
      "token": wx.getStorageSync("token"),
      "uid": wx.getStorageSync("uid"),
      "mid": 1,                   //that.data.mid,
      "type": that.data.aud    //type=1总分type=2行测 type=3 申论
    }
    console.log(params)
    app.ljjw.jwTeacherScoreSubPage(params).then(d => {
      console.log(d)
      if (d.data.status == 1) {
        console.log(d.data.data)
        that.setData({
          totalscore: d.data.data,
          
        })
        console.log("老师成绩详情页获取成功")
      }


    })
  },

  aud_select: function (e) {
    let that = this
    var aud = e.currentTarget.dataset.aud
    that.setData({
      aud: aud
    })
  },

  click_rank:function(e){
    let that = this
    var rank = e.currentTarget.dataset.rank
    that.setData({
      click_rank : rank
    })
    console.log(that.data.click_rank)
    
    that.setData({
      click_detail: that.data.totalscore[that.data.click_rank]
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