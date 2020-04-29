// pages/my/my.js

const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // role:0,
    
    stu_class_index: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */

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

  onLoad: function (options) {
    let that = this
    let nowTime = new Date();
    
    var today = new Date(nowTime.getFullYear(), nowTime.getMonth(), nowTime.getDate()).getTime(); //今天凌晨

    var yestday = new Date(today - 24 * 3600 * 1000).getTime();
    that.setData({
      today: that.timestampToTime(today),
      yestday: that.timestampToTime(yestday)
    })
    
    
    var role = wx.getStorageSync("role")
    var userInfo = wx.getStorageSync("userInfo")
    
    if(!role){
      that.setData({
        role: -1
      })
    }else{
      that.setData({
        role: role
      })
    }
    that.setData({
      userInfo: userInfo
      // name: userInfo.name,
    })

    if(that.data.role == 4){
      var params = {
        "token": wx.getStorageSync("token"),
        "uid": wx.getStorageSync("uid"),
      }
      console.log(params)
      app.ljjw.jwGetStudentMainPage(params).then(d => {
        if(d.data.status == 1){
          that.setData({
            mydata: d.data.data,
            stu_class: d.data.data.classes
            
          })
          console.log(that.data.mydata)
          if (that.data.mydata.status_text.indexOf("请完成您的基础信息") != -1){
            wx.setStorageSync("stu_sta", false)
          }else{
            wx.setStorageSync("stu_sta", true)
          }

          if (that.data.mydata.files){
            for (var i = 0; i < that.data.mydata.files.length; i++) {
              if (that.data.mydata.files[i].fileurl.indexOf(".doc") != -1){
                var form = "mydata.files[" + i + "].form"
                that.setData({
                  [form]: "doc"
                })
              } else if (that.data.mydata.files[i].fileurl.indexOf(".pdf") != -1){
                var form = "mydata.files[" + i + "].form"
                that.setData({
                  [form]: "pdf"
                })
              } else if (that.data.mydata.files[i].fileurl.indexOf(".ppt") != -1) {
                var form = "mydata.files[" + i + "].form"
                that.setData({
                  [form]: "ppt"
                })
              }else if (that.data.mydata.files[i].fileurl.indexOf(".jpg") != -1) {
                var form = "mydata.files[" + i + "].form"
                that.setData({
                  [form]: "jpg"
                })
              } else if (that.data.mydata.files[i].fileurl.indexOf(".png") != -1) {
                var form = "mydata.files[" + i + "].form"
                that.setData({
                  [form]: "png"
                })
              }else {
                var form = "mydata.files[" + i + "].form"
                that.setData({
                  [form]: null
                })
              }

              var d = that.data.mydata.files[i].createtime.substr(10, 15)

              if (that.data.mydata.files[i].createtime.indexOf(that.data.today) != -1) {
                var createtime = "今天" + d
                console.log(createtime)
                var cs = "mydata.files[" + i + "].createtime"
                that.setData({
                  [cs]: createtime
                })
              }
              if (that.data.mydata.files[i].createtime.indexOf(that.data.yestday) != -1) {
                var createtime = "昨天" + d
                console.log(createtime)
                var cs = "mydata.files[" + i + "].createtime"
                that.setData({
                  [cs]: createtime
                })
              }

            }
          }
          
          console.log(that.data.mydata.files)
          console.log("学生——我的主页接口获取成功")
        }
        
        
      })
    } 
    else if (that.data.role == 1){
      var params = {
        "token": wx.getStorageSync("token"),
        "uid": wx.getStorageSync("uid"),
      }
      console.log(params)
      app.ljjw.jwTeacherMyPage(params).then(d => {
        console.log(d)
        


      })
      console.log("老师——我的主页")
    }
    else if (that.data.role == 2) {
      console.log("教务——我的主页")
    }
    else if (that.data.role == 3) {
      console.log("管理员——我的主页")
    }
    
  },

  //学生班级选择器
  stu_class_picker: function (e) {
    let that = this
    console.log('picker发送选择改变，携带值为', e.detail.value)
    that.setData({
      stu_class_index: e.detail.value
    })
    console.log(that.data.stu_class)
    console.log(that.data.stu_class[that.data.stu_class_index].id)
    var params = {
      "token": wx.getStorageSync("token"),
      "uid": wx.getStorageSync("uid"),
      "class_id": that.data.stu_class[that.data.stu_class_index].class_id
    }
    console.log(params)
    app.ljjw.jwGetStudentMainPage(params).then(d => {
      if (d.data.status == 1) {
        that.setData({
          mydata: d.data.data,
          

        })
        if (that.data.mydata.files) {
          for (var i = 0; i < that.data.mydata.files.length; i++) {
            if (that.data.mydata.files[i].fileurl.indexOf(".doc") != -1) {
              var form = "mydata.files[" + i + "].form"
              that.setData({
                [form]: "doc"
              })
            } else if (that.data.mydata.files[i].fileurl.indexOf(".pdf") != -1) {
              var form = "mydata.files[" + i + "].form"
              that.setData({
                [form]: "pdf"
              })
            } else if (that.data.mydata.files[i].fileurl.indexOf(".ppt") != -1) {
              var form = "mydata.files[" + i + "].form"
              that.setData({
                [form]: "ppt"
              })
            } else if (that.data.mydata.files[i].fileurl.indexOf(".jpg") != -1) {
              var form = "mydata.files[" + i + "].form"
              that.setData({
                [form]: "jpg"
              })
            } else if (that.data.mydata.files[i].fileurl.indexOf(".png") != -1) {
              var form = "mydata.files[" + i + "].form"
              that.setData({
                [form]: "png"
              })
            } else {
              var form = "mydata.files[" + i + "].form"
              that.setData({
                [form]: null
              })
            }

            var d = that.data.mydata.files[i].createtime.substr(10, 15)

            if (that.data.mydata.files[i].createtime.indexOf(that.data.today) != -1) {
              var createtime = "今天" + d
              console.log(createtime)
              var cs = "mydata.files[" + i + "].createtime"
              that.setData({
                [cs]: createtime
              })
            }
            if (that.data.mydata.files[i].createtime.indexOf(that.data.yestday) != -1) {
              var createtime = "昨天" + d
              console.log(createtime)
              var cs = "mydata.files[" + i + "].createtime"
              that.setData({
                [cs]: createtime
              })
            }

          }
        }
        console.log(that.data.mydata)
        console.log("学生（班级切换）——我的主页接口获取成功")
      }


    })
  },

  previewImage: function () {
    let that = this
    // var file_xb = e.currentTarget.dataset.file_xb
    console.log("cs")
    var image = []
    
    image.push(that.data.mydata.files[that.data.file_xb].fileurl)
    // var imgs = that.data.mydata.files[file_xb].fileurl
    wx.previewImage({
      current: image[0],
      urls: image
    })

  },

  // 打开文件
  open_file: function (e) {
    let that = this
    var file_xb = e.currentTarget.dataset.file_xb
    that.setData({
      file_xb:file_xb
    })
    console.log(file_xb)
    // console.log(that.data.mydata.files[file_xb].fileurl)
    if (that.data.mydata.files[file_xb].form.indexOf("png") != -1 || that.data.mydata.files[file_xb].form.indexOf("jpg") != -1){
      that.previewImage()
      console.log("图")
    }else{
    wx.downloadFile({
      url: that.data.mydata.files[file_xb].fileurl, //仅为示例，并非真实的资源
      success(res) {
        // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容


        var filePath = res.tempFilePath
        console.log(filePath)
        wx.showLoading({
          title: '资料打开中...',
        })

        wx.openDocument({

          filePath: filePath,

          success: function (res) {

            console.log('打开文档成功')
            wx.hideLoading()

          },

          fail: function (res) {
            console.log("fail");
            console.log(res)
          },
          complete: function (res) {
            console.log("complete");
            console.log(res)
          }


        })
      }


    })
    }
  },

  // 学生查看基本信息
  to_stu_info:function(e){
    let that = this
    var type = e.currentTarget.dataset.type
    console.log(type + "to_stu_info")
    wx.navigateTo({
      url: '../../pages/stu-info/stu-info?type=' + type,
    })

  },

  // 老师基础信息跳转
  to_stu_jcxx: function () {
    let that = this
    wx.navigateTo({
      url: '../../pages/stu_jcxx/stu_jcxx?' ,
    })

  },


  // 老师班级档案跳转
  to_class_data: function () {
    wx.navigateTo({
      url: '../../pages/class_data/class_data',
    })

  },
  
  to_stu_rea:function(){
    wx.navigateTo({
      url: '../../pages/stu-rearch/stu-rearch?type=' + 2 ,
    })
  },

  to_tea_data:function(){
    wx.navigateTo({
      url: '../../pages/tea_data/tea_data',
    })
  },

  to_tea_sinfo: function () {
    wx.navigateTo({
      url: '../../pages/tea_sinfo/tea_sinfo',
    })
  },

  // 收藏
  iscollect:function(e){
    let that = this
    var type
    var file_xb = e.currentTarget.dataset.file_xb
    console.log(file_xb)
    console.log(that.data.mydata.files[file_xb].id)
    console.log(that.data.mydata.files[file_xb].colid   +"是否收藏id")
    if (that.data.mydata.files[file_xb].colid == null){
      type = 1
    }
    else{
      type = 2
    }
    console.log(type)
    
    var params = {
      "token": wx.getStorageSync("token"),
      "uid": wx.getStorageSync("uid"),
      "type":type,  //1-添加，2-取消
      "fileid":that.data.mydata.files[file_xb].id
    }
    console.log(params)
    app.ljjw.jwStudentAddCollection(params).then(d => {
      console.log(d.data.status +"d.data.status")
      if (d.data.status == 1) {
        console.log(d.data.msg)
        var params = {
          "token": wx.getStorageSync("token"),
          "uid": wx.getStorageSync("uid"),
          "class_id": that.data.stu_class[that.data.stu_class_index].class_id
        }
        console.log(params)
        app.ljjw.jwGetStudentMainPage(params).then(d => {
          if (d.data.status == 1) {
            that.setData({
              mydata: d.data.data,
            })
            if (that.data.mydata.files) {
              for (var i = 0; i < that.data.mydata.files.length; i++) {
                if (that.data.mydata.files[i].fileurl.indexOf(".doc") != -1) {
                  var form = "mydata.files[" + i + "].form"
                  that.setData({
                    [form]: "doc"
                  })
                } else if (that.data.mydata.files[i].fileurl.indexOf(".pdf") != -1) {
                  var form = "mydata.files[" + i + "].form"
                  that.setData({
                    [form]: "pdf"
                  })
                } else if (that.data.mydata.files[i].fileurl.indexOf(".ppt") != -1) {
                  var form = "mydata.files[" + i + "].form"
                  that.setData({
                    [form]: "ppt"
                  })
                } else if (that.data.mydata.files[i].fileurl.indexOf(".jpg") != -1) {
                  var form = "mydata.files[" + i + "].form"
                  that.setData({
                    [form]: "jpg"
                  })
                } else if (that.data.mydata.files[i].fileurl.indexOf(".png") != -1) {
                  var form = "mydata.files[" + i + "].form"
                  that.setData({
                    [form]: "png"
                  })
                } else {
                  var form = "mydata.files[" + i + "].form"
                  that.setData({
                    [form]: null
                  })
                }

                var d = that.data.mydata.files[i].createtime.substr(10, 15)

                if (that.data.mydata.files[i].createtime.indexOf(that.data.today) != -1) {
                  var createtime = "今天" + d
                  console.log(createtime)
                  var cs = "mydata.files[" + i + "].createtime"
                  that.setData({
                    [cs]: createtime
                  })
                }
                if (that.data.mydata.files[i].createtime.indexOf(that.data.yestday) != -1) {
                  var createtime = "昨天" + d
                  console.log(createtime)
                  var cs = "mydata.files[" + i + "].createtime"
                  that.setData({
                    [cs]: createtime
                  })
                }

              }
            }
            console.log(that.data.mydata)
            console.log("学生（班级切换）——我的主页接口获取成功")
          }


        })
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
    this.onLoad()
    if (typeof this.getTabBar === 'function' &&
      this.getTabBar()) {
      console.log('my_onshow')
      this.getTabBar().setData({
        selected: 3
      })
    }
    else {
      console.log('未执行')
    }
    
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

  //获取微信绑定手机号登录
  getPhoneNumber: function (e) {
    var that = this
    wx.login({
      success: res => {

        if (e.detail.errMsg == "getPhoneNumber:ok") {
          wx.showLoading({
            title: '登录中...',
          })
          wx.login({
            success(res) {
              console.log("cccs.code" + res.code)

              let iv = encodeURIComponent(e.detail.iv);
              let encryptedData = encodeURIComponent(e.detail.encryptedData);
              let code = res.code
              var params = {
                "code": code,
                "iv": iv,
                "encryptedData": encryptedData
              }
              console.log(params)
              app.ljjw.xcxjwlogin(params).then(d => {
                
                if (d.data.status == 0) {
                  console.log(d.data)
                  var role = d.data.role.split(",")
                  if(role)
                    if (d.data.class_ids != null){
                      var class_ids = d.data.class_ids.split(",")
                      wx.setStorageSync('class_ids', class_ids);
                      console.log(d.data.class_ids)
                    }
                  
                  if(role.length == 2){
                    role[0] = role[1]
                  }
                  console.log("登录成功")

                  wx.setStorageSync('token', d.data.token);
                  wx.setStorageSync('uid', d.data.uid);
                  wx.setStorageSync('userInfo', d.data.userInfo)
                  wx.setStorageSync('role', role[0])
                  
                  if(role[0] != 4){
                    wx.setStorageSync('subject', d.data.cate_info)
                    // wx.setStorageSync('subject_name', d.data.cate_info.name)
                    console.log(d.data.cate_info)
                  }
                  
                  
                  
                  that.onLoad()


                } else {
                  wx.showToast({
                    title: "登陆失败",
                    icon: 'none',
                    duration: 1000
                  })
                  console.log(d.data.msg)
                }
              })
              wx.hideLoading()
            }
          })
        }
      }
    })
  },

})