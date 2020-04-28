// pages/add_read/add_read.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    img: [],
    imgs: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  back: function () {
    wx.navigateBack({
      delta: 1  // 返回上一级页面。
    })
  },

  input_title: function (e) {
    let that = this
    var title = e.detail.value
    console.log(title)
    that.setData({
      title: title
    })
    if (that.data.title != '' || that.data.imgs != '') {
      that.setData({
        submit: true
      })
    } else {
      that.setData({
        submit: false
      })
    }
  },

  del_img: function (e) {
    let that = this
    var xb = e.currentTarget.dataset.xb
    console.log(xb)
    that.data.imgs.splice(xb, 1);
    that.setData({
      imgs: that.data.imgs
    })
    if (that.data.title != '' || that.data.imgs != '') {
      that.setData({
        submit: true
      })
    } else {
      that.setData({
        submit: false
      })
    }
  },

  submit: function () {
    let that = this

    var pics = that.data.imgs.join(",");
    var params = {
      "token": wx.getStorageSync("token"),
      "uid": wx.getStorageSync("uid"),
      "title": that.data.title,
      "pics": pics
    }
    console.log(params)
    app.ljjw.jwTeacherAddMessages(params).then(d => {
      console.log(d)
      if (d.data.status == 1) {
        wx.showToast({
          title: '创建成功',
          duration:1500
        })
        console.log("创建成功,back")
        wx.navigateBack({
          delta: 1  // 返回上一级页面。
        })
      }

    })
  },


  chooseImg() {
    let that = this;
    let count_img = 3

    let len = that.data.imgs.length;
    if (len < 3) {
      count_img = 3 - len
      console.log(count_img)
      wx.chooseImage({
        count: count_img,
        success: (res) => {
          let tempFilePaths = res.tempFilePaths;
          console.log(tempFilePaths)
          let imgs = [];

          for (let i = 0; i < tempFilePaths.length; i++) {

            var token = wx.getStorageSync('token');

            wx.uploadFile({
              // url: 'http://cs.szgk.cn/api.php?',
              url: 'https://szgk.cn/api.php?',
              filePath: tempFilePaths[i],
              name: 'file',
              formData: {
                'file': tempFilePaths[i],
                "token": token,
                "action": "jwUploadAvatar", //action=uploads&authhash=445454554
              },
              success(r) {
                let hhh = JSON.parse(r.data);
                console.log(hhh)
                if (hhh.status == 1) {
                  that.data.img.unshift(hhh.data)

                  that.setData({
                    imgs: that.data.img
                  })
                  if (that.data.title != '' || that.data.imgs != '') {
                    that.setData({
                      submit: true
                    })
                  } else {
                    that.setData({
                      submit: false
                    })
                  }
                  console.log(that.data.img)

                  // console.log(imgs)

                } else {
                  // that.setData({
                  //   img : imgs
                  // })
                  console.log('失败')
                  console.log(hhh.status)
                }




              }
            })

          }

        }
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