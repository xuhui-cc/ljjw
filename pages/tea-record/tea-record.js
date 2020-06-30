// pages/tea-record/tea-record.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    aud:1,
    click_detail:[],
    fold_detail: [],
    click_rank:-1,
    fold_num:-1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    var mid = options.mid
    that.setData({
      mid : mid
    })
    this.getPageInfo(that.data.aud)
  },

  aud_select: function (e) {
    let that = this
    var aud = e.currentTarget.dataset.aud
    that.setData({
      aud: aud,
      click_detail: '',
      click_rank: -1
    })
    this.getPageInfo(aud)
  },

  //折叠展开
  fold:function(e){
    let that = this
    var xb = e.currentTarget.dataset.xb
    console.log(xb)
    var cs = "scorelist[" + xb + "].fold"
    that.setData({
      [cs]: !that.data.scorelist[xb].fold
    })
    if (!that.data.scorelist[xb].fold){
      that.setData({
        fold_num:xb
      })
    }else{
      that.setData({
        fold_num: -1
      })
    }

  
  },

  child_fold:function(e){
    let that = this
    var child_xb = e.currentTarget.dataset.child_xb
    console.log(child_xb)
    var cs = "scorelist[" + that.data.fold_num + "].xc_scoreinfo[" + child_xb +"].child_fold"
    that.setData({
      [cs]: !that.data.scorelist[that.data.fold_num].xc_scoreinfo[child_xb].child_fold
    })
  },

  rank_child_fold: function (e) {
    let that = this
    var child_xb = e.currentTarget.dataset.child_xb
    console.log(child_xb + "=======xb")
    var cs = "click_detail.xc_scoreinfo[" + child_xb + "].child_fold"
    that.setData({
      [cs]: !that.data.click_detail.xc_scoreinfo[child_xb].child_fold
    })
  },

  click_rank:function(e){
    let that = this
    var rank = e.currentTarget.dataset.rank
    
    if (that.data.click_detail == '' || rank != that.data.click_rank){
      that.setData({
        click_rank: rank
      })
      console.log(that.data.click_rank)
      that.setData({
        click_detail: that.data.totalscore[that.data.click_rank]
      })
      console.log(that.data.click_detail)
    }else{
      that.setData({
        click_detail: '',
        click_rank: -1
      })
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
    let that = this
    
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

  // ----------------------------------------------------------- 接口 -----------------------------------------------------------
  /**
   * 老师成绩详情页数据
  */
  getPageInfo: function (type) {
    let that = this
    var params = {
      "token": wx.getStorageSync("token"),
      "uid": wx.getStorageSync("uid"),
      "mid": that.data.mid,                   //that.data.mid,
      "type": type    //type=1总分type=2行测 type=3 申论
    }
    app.ljjw.jwTeacherScoreSubPage(params).then(d => {
      if (d.data.status == 1) {
        let scoreList = d.data.data.splice(3)
        for(var i=0; i<scoreList.length; i++){
          let score = scoreList[i]
          if (!score.avatar || score.avatar.indexOf('http') == -1) {
            score.avatar = '../../images/avatar_null.png'
          }
          score.fold = true
          if (type == 2) {
            if (score.xc_scoreinfo && score.xc_scoreinfo != '') {
              for (var j = 0; j < score.xc_scoreinfo.length; j++) {
                let scoreInfo = score.xc_scoreinfo[j]
                if (scoreInfo.child && scoreInfo.child != '') {
                  scoreInfo.child_fold = true
                } else {
                  scoreInfo.child_fold = 'null'
                }

              }
            }
          }
        }
        let totalSocre = d.data.data
        if (totalSocre && totalSocre != '') {
          for (var i = 0; i < totalSocre.length; i++) {
            let score = totalSocre[i]
            if (!score.avatar || score.avatar.indexOf('http') == -1) {
              score.avatar = '../../images/avatar_null.png'
            }
            if (type == 2) {
              if (score.xc_scoreinfo && score.xc_scoreinfo != '') {
                for (var j = 0; j < score.xc_scoreinfo.length; j++) {
                  let scoreInfo = score.xc_scoreinfo[j]
                  if (scoreInfo.child) {
                    scoreInfo.child_fold = true
                  }
                  else {
                    scoreInfo.child_fold = 'null'
                  }
                }
              }
            }
          }
        }
        that.setData({
          totalscore: d.data.data,
          scorelist: scoreList,
        })
      }
    })
  },
})