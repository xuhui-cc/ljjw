// pages/stu_mornread/stu_mornread.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page :1,
    ispage : false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    var class_id = options.class_id
    that.setData({
      class_id: class_id
    })
    var role = wx.getStorageSync("role")
    if (!role) {
      that.setData({
        role: -1
      })
    } else {
      that.setData({
        role: role
      })
    }
  },

  back: function () {
    wx.navigateBack({
      delta: 1  // 返回上一级页面。
    })
  },

  
  to_stu_rearch:function(){
    let that = this
    var type = 1
    wx.navigateTo({
      url: '../../pages/stu-rearch/stu-rearch?type=' + type + '&class_id=' + that.data.class_id,
    })
  },

  previewImg:function(e){
    let that = this
    var xb = e.currentTarget.dataset.xb
    var dxb = e.currentTarget.dataset.dxb
    console.log(dxb)
    var imgs = that.data. csmorningRead[dxb].pics
    wx.previewImage({
      current: that.data.csmorningRead[dxb].pics[xb],
      urls: imgs
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
    setTimeout(() => {
      wx.startPullDownRefresh()//通过方法调用刷新
    }, 1000)
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
    let that = this
    if(!that.data.ispage){
      if (that.data.role == 4) {
        var params = {
          "token": wx.getStorageSync("token"),
          "uid": wx.getStorageSync("uid"),
          "class_id": that.data.class_id,
          "page": 1
        }
        console.log(params)
        app.ljjw.jwGetMorningReadMore(params).then(d => {
          // console.log(d)
          if (d.data.status == 1) {
            // console.log(d.data.data)
            that.setData({
              morningRead: d.data.data
            })
            that.setData({
              ispage:true
            })

            for (var i = 0; i < that.data.morningRead.length; i++) {
              var cs = 'morningRead[' + i + '].pics'
              that.setData({
                [cs]: that.data.morningRead[i].pics.split(",")
              })
            }
            that.setData({
              csmorningRead: that.data.morningRead
            })
            console.log(that.data.morningRead)
            console.log("学生每日晨读获取成功")
          }


        })
      } else if (that.data.role <= 2) {
        var params = {
          "token": wx.getStorageSync("token"),
          "uid": wx.getStorageSync("uid"),
          "page": 1,
          "class_id": that.data.class_id
        }
        console.log(params)
        app.ljjw.jwTeacherMorningReadMore(params).then(d => {
          // console.log(d)
          if (d.data.status == 1) {
            // console.log(d.data.data)
            that.setData({
              morningRead: d.data.data
            })
            that.setData({
              ispage: true
            })

            for (var i = 0; i < that.data.morningRead.length; i++) {
              var cs = 'morningRead[' + i + '].pics'
              that.setData({
                [cs]: that.data.morningRead[i].pics.split(",")
              })
            }
            that.setData({
              csmorningRead: that.data.morningRead
            })
            console.log(that.data.morningRead)
            console.log("老师每日晨读获取成功")
          }


        })
      }
    }
    else{
      if (that.data.page == 1) {
        wx.showToast({
          title: '已经是第一页咯~',
          icon: "none",
          duration: 3000
        })
      } else {
        if (that.data.role == 4) {
          var params = {
            "token": wx.getStorageSync("token"),
            "uid": wx.getStorageSync("uid"),
            "class_id": that.data.class_id,
            "page": that.data.page - 1
          }
          console.log(params)
          app.ljjw.jwGetMorningReadMore(params).then(d => {
            // console.log(d)
            if (d.data.status == 1) {
              if (d.data.data != '') {
                that.setData({
                  morningRead: d.data.data
                })
                that.setData({
                  page: that.data.page - 1
                })

                for (var i = 0; i < that.data.morningRead.length; i++) {
                  var cs = 'morningRead[' + i + '].pics'
                  that.setData({
                    [cs]: that.data.morningRead[i].pics.split(",")
                  })
                }
                that.setData({
                  csmorningRead: that.data.morningRead
                })
                console.log(that.data.morningRead)
              } else {
                wx.showToast({
                  title: '到头咯~',
                  icon: "none",
                  duration: 3000
                })
              }
              // console.log(d.data.data)

              console.log("学生每日晨读获取成功")
            }


          })
        } else if (that.data.role <= 2) {
          var params = {
            "token": wx.getStorageSync("token"),
            "uid": wx.getStorageSync("uid"),
            "page": that.data.page - 1,
            "class_id": that.data.class_id
          }
          console.log(params)
          app.ljjw.jwTeacherMorningReadMore(params).then(d => {
            // console.log(d)
            if (d.data.status == 1) {
              if (d.data.data != "") {
                that.setData({
                  morningRead: d.data.data
                })
                that.setData({
                  page: page - 1
                })

                for (var i = 0; i < that.data.morningRead.length; i++) {
                  var cs = 'morningRead[' + i + '].pics'
                  that.setData({
                    [cs]: that.data.morningRead[i].pics.split(",")
                  })
                }
                that.setData({
                  csmorningRead: that.data.morningRead
                })
                console.log(that.data.morningRead)
              }
              else {
                wx.showToast({
                  title: '到头咯~',
                  icon: "none",
                  duration: 3000
                })
              }
              // console.log(d.data.data)

              console.log("老师每日晨读获取成功")
            }


          })
        }
      }
      
    }
    
    

    wx.stopPullDownRefresh()//结束刷新
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let that = this
    // 显示加载图标
    wx.showLoading({
      title: '玩命加载中',
      duration:2000
    })
    if(that.data.role == 4){
      var params = {
        "token": wx.getStorageSync("token"),
        "uid": wx.getStorageSync("uid"),
        "class_id": that.data.class_id,
        "page": that.data.page +1
      }
      console.log(params)
      app.ljjw.jwGetMorningReadMore(params).then(d => {
        console.log(d)
        if (d.data.status == 1) {
          if(d.data.data != ''){
            that.setData({
              morningRead: d.data.data
            })
            that.setData({
              page: that.data.page + 1
            })

            for (var i = 0; i < that.data.morningRead.length; i++) {
              var cs = 'morningRead[' + i + '].pics'
              that.setData({
                [cs]: that.data.morningRead[i].pics.split(",")
              })
            }
            that.setData({
              csmorningRead: that.data.morningRead
            })
            console.log(that.data.morningRead)
          }else{
            console.log(d.data.data +"d.data.data")
            wx.showToast({
              title: '没有更多晨读咯~',
              icon: "none",
              duration: 3000
            })
          }
          console.log(d.data.data + "d.data.data")
          console.log("学生每日晨读获取成功")
        }

        // 隐藏加载框
        // wx.hideLoading();
      })
    }else if(that.data.role  <= 2){
      var params = {
        "token": wx.getStorageSync("token"),
        "uid": wx.getStorageSync("uid"),
        "page": that.data.page +1,
        "class_id": that.data.class_id
      }
      console.log(params)
      app.ljjw.jwTeacherMorningReadMore(params).then(d => {
        // console.log(d)
        if (d.data.status == 1) {
          if(d.data.data != ""){
            // console.log(d.data.data)
            that.setData({
              morningRead: d.data.data
            })
            that.setData({
              page: page + 1
            })

            for (var i = 0; i < that.data.morningRead.length; i++) {
              var cs = 'morningRead[' + i + '].pics'
              that.setData({
                [cs]: that.data.morningRead[i].pics.split(",")
              })
            }
            that.setData({
              csmorningRead: that.data.morningRead
            })
            console.log(that.data.morningRead)
          }else{
            wx.showToast({
              title: '没有更多晨读咯~',
              icon: "none",
              duration: 3000
            })
          }
          
          console.log("老师每日晨读获取成功")
          wx.hideLoading();
        }


      })
    }
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})