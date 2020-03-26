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
    var params = {
      "token": wx.getStorageSync("token"),
      "uid": wx.getStorageSync("uid"),
      "mid": that.data.mid,                   //that.data.mid,
      "type": that.data.aud    //type=1总分type=2行测 type=3 申论
    }
    console.log(params)
    app.ljjw.jwTeacherScoreSubPage(params).then(d => {
      console.log(d)
      if (d.data.status == 1) {
        console.log(d.data.data)
        that.setData({
          totalscore: d.data.data,
          scorelist: d.data.data.splice(3),
        })
        
        for(var i=0;i<that.data.scorelist.length;i++){
          var cs = "scorelist[" + i + "].fold"
          that.setData({
            [cs]:true
          })
        }
        console.log("老师d 成绩详情页获取成功")
      }


    })
  },

  aud_select: function (e) {
    let that = this
    var aud = e.currentTarget.dataset.aud
    that.setData({
      aud: aud,
      click_detail: '',
      click_rank: -1
    })
    
    var params = {
      "token": wx.getStorageSync("token"),
      "uid": wx.getStorageSync("uid"),
      "mid": that.data.mid,                   //that.data.mid,
      "type": that.data.aud    //type=1总分type=2行测 type=3 申论
    }
    console.log(params)
    app.ljjw.jwTeacherScoreSubPage(params).then(d => {
      console.log(d)
      if (d.data.status == 1) {
        console.log(d.data.data)
        if (that.data.aud == 2){
          for(var i=0;i<d.data.data.length;i++){
            if (d.data.data[i].xc_score == null){
              that.setData({
                totalscore: '',
                scorelist: '',
              })
            }
            else{
              that.setData({
                totalscore: d.data.data,
                scorelist: d.data.data.splice(3),
              })
            }
          }
        } else if (that.data.aud == 3){
          for (var i = 0; i < d.data.data.length; i++) {
            if (d.data.data[i].sl_score == null) {
              that.setData({
                totalscore: '',
                scorelist: '',
              })
            }
            else {
              that.setData({
                totalscore: d.data.data,
                scorelist: d.data.data.splice(3),
              })
            }
        }
        }else{
          that.setData({
            totalscore: d.data.data,
            scorelist: d.data.data.splice(3),
          })
        }
        
        // that.setData({
        //   click_detail: that.data.totalscore[that.data.click_rank]
        // })
        
        for (var i = 0; i < that.data.scorelist.length; i++) {
          var cs = "scorelist[" + i + "].fold"
          that.setData({
            [cs]: true
          })
        }

        if(that.data.aud == 2){
          for (var i = 0; i < that.data.scorelist.length; i++) {
            for (var j = 0; j < that.data.scorelist[i].xc_scoreinfo.length; j++){
              if (that.data.scorelist[i].xc_scoreinfo[j].child){
                var cs = "scorelist[" + i + "].xc_scoreinfo[" + j + "].child_fold"
                that.setData({
                  [cs]: true
                })
              }
              else{
                var cs = "scorelist[" + i + "].xc_scoreinfo[" + j + "].child_fold"
                that.setData({
                  [cs]: 'null'
                })
              }
            }
          }

          for (var i = 0; i < that.data.totalscore.length; i++) {
            for (var j = 0; j < that.data.totalscore[i].xc_scoreinfo.length; j++) {
              if (that.data.totalscore[i].xc_scoreinfo[j].child) {
                var cs = "totalscore[" + i + "].xc_scoreinfo[" + j + "].child_fold"
                that.setData({
                  [cs]: true
                })
              }
              else {
                var cs = "totalscore[" + i + "].xc_scoreinfo[" + j + "].child_fold"
                that.setData({
                  [cs]: 'null'
                })
              }
            }
          }
        }
        
        // if (that.data.fold_num >= 0){
        //   var cs1 = "scorelist[" + that.data.fold_num + "].fold"
        //   that.setData({
        //     [cs1]: !that.data.scorelist[that.data.fold_num].fold
        //   })
        // }
        
        console.log("老师成绩详情页获取成功")
      }


    })
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

  }
})