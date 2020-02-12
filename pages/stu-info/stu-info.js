// pages/stu-info/stu-info.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sex: ['请选择', '男', '女'],
    stu_class:[],
    stu_class_index:-1,
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

    var params = {
      "token": wx.getStorageSync("token"),
    }
    console.log(params)
    app.ljjw.jwGetAllClass(params).then(d => {
      if (d.data.status == 1) {
        console.log(d.data.data)
        that.setData({
          stu_class: d.data.data
        })
        console.log("所有班级获取成功")
      } 


    })





  },

  chooseImg() {
    let that = this;
    wx.chooseImage({
      success: (res) => {
        let tempFilePaths = res.tempFilePaths;
        console.log(tempFilePaths)

        var token = wx.getStorageSync('token');
        wx.uploadFile({
          url: 'http://cs.szgk.cn/api.php?',
          filePath: tempFilePaths[0],
          name: 'file',
          formData: {
            'file': tempFilePaths[0],
            "token": token,
            "action": "jwUploadAvatar", //action=uploads&authhash=445454554
          },
          header: {
            'content-type': 'multipart/form-data'
          },
          success(r) {
            let d = JSON.parse(r.data);
            console.log(d.data)
            if(d.status == 1){
              that.setData({
                avatar : d.data
              })
              // console.log(that.data.input_name + "=======that.data.input_name")
              //提交判断
              if (that.data.input_name != undefined ){
                if (that.data.input_phone != undefined){
                  if (that.data.sex_index != 0){
                    if (that.data.input_school.indexOf("请选择") == -1){
                      if (that.data.graduation_time != 0){
                        if (that.data.input_major != undefined){
                          if (that.data.input_email != undefined){
                            if (that.data.stu_class_index != -1){
                              that.setData({
                                issubmit:true
                              })
                              console.log(that.data.issubmit)
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
              //提交判断结束
            }
          }
        })
          


        

          
       
        }

      
    })
  },

  sex_picker: function (e) {
    let that = this
    console.log('picker发送选择改变，携带值为', e.detail.value)
    that.setData({
      sex_index: e.detail.value
    })
    if (that.data.sex_index != 0){
    //提交判断
      if (that.data.input_name != undefined) {
        if (that.data.input_phone != undefined ) {
        if (that.data.avatar != undefined) {
          if (that.data.input_school.indexOf("请选择") == -1) {
            if (that.data.graduation_time != 0) {
              if (that.data.input_major != undefined ) {
                if (that.data.input_email != undefined ) {
                  if (that.data.stu_class_index != -1) {
                    that.setData({
                      issubmit: true
                    })
                    console.log(that.data.issubmit)
                  }
                }
              }
            }
          }
        }
      }
    }
    //提交判断结束
  }else{
      that.setData({
        issubmit: false
      })
  }
  },
  stu_class_picker: function (e) {
    let that = this
    console.log('picker发送选择改变，携带值为', e.detail.value)
    that.setData({
      stu_class_index: e.detail.value
    })
    // console.log(that.data.input_name, that.data.input_phone, that.data.avatar, that.data.input_school.indexOf("请选择"), that.data.graduation_time, that.data.input_major, that.data.input_email, that.data.sex_index)
    if(that.data.stu_class_index != -1){
    //提交判断
      if (that.data.input_name != undefined) {
        if (that.data.input_phone != undefined ) {
        if (that.data.avatar != undefined) {
          if (that.data.input_school.indexOf("请选择") == -1) {
            if (that.data.graduation_time != 0) {
              if (that.data.input_major != undefined) {
                if (that.data.input_email != undefined ) {
                  if (that.data.sex_index != 0) {
                    that.setData({
                      issubmit: true
                    })
                    console.log(that.data.issubmit)
                  }
                }
              }
            }
          }
        }
      }
    }
    //提交判断结束
    } else {
      that.setData({
        issubmit: false
      })
    }
  },
  graduation_time: function (e) {
    let that = this
    console.log('picker发送选择改变，携带值为', e.detail.value)
    that.setData({
      graduation_time: e.detail.value
    })
    if(that.data.graduation_time != 0){
    //提交判断
      if (that.data.input_name != undefined ) {
        if (that.data.input_phone != undefined ) {
        if (that.data.avatar != undefined) {
          if (that.data.input_school.indexOf("请选择") == -1) {
            if (that.data.sex_index != 0) {
              if (that.data.input_major != undefined ) {
                if (that.data.input_email != undefined ) {
                  if (that.data.stu_class_index != -1) {
                    that.setData({
                      issubmit: true
                    })
                    console.log(that.data.issubmit)
                  }
                }
              }
            }
          }
        }
      }
    }
    //提交判断结束
    } else {
      that.setData({
        issubmit: false
      })
    }
  },

  input_name:function(e){
    let that = this
    console.log(e.detail.value)
    that.setData({
      input_name: e.detail.value
    })
    if (that.data.input_name == '') {
      that.setData({
        input_name: undefined
      })
    }
    if (that.data.input_name != undefined) {
    //提交判断
    if (that.data.sex_index != 0) {
      if (that.data.input_phone != undefined ) {
        if (that.data.avatar != undefined) {
          if (that.data.input_school.indexOf("请选择") == -1) {
            if (that.data.graduation_time != 0) {
              if (that.data.input_major != undefined ) {
                if (that.data.input_email != undefined ) {
                  if (that.data.stu_class_index != -1) {
                    that.setData({
                      issubmit: true
                    })
                    console.log(that.data.issubmit)
                  }
                }
              }
            }
          }
        }
      }
    }
    //提交判断结束
    } else {
      that.setData({
        issubmit: false
      })
    }
  },
  input_phone: function (e) {
    let that = this
    console.log(e.detail.value)
    that.setData({
      input_phone: e.detail.value
    })
    if (that.data.input_phone == '') {
      that.setData({
        input_phone: undefined
      })
    }
    if (that.data.input_phone != undefined) {
    //提交判断
      if (that.data.input_name != undefined ) {
      if (that.data.sex_index != 0) {
        if (that.data.avatar != undefined) {
          if (that.data.input_school.indexOf("请选择") == -1) {
            if (that.data.graduation_time != 0) {
              if (that.data.input_major != undefined ) {
                if (that.data.input_email != undefined ) {
                  if (that.data.stu_class_index != -1) {
                    that.setData({
                      issubmit: true
                    })
                    console.log(that.data.issubmit)
                  }
                }
              }
            }
          }
        }
      }
    }
    //提交判断结束
    } else {
      that.setData({
        issubmit: false
      })
    }
  },
  // input_school: function (e) {
  //   let that = this
  //   console.log(e.detail.value)
  //   that.setData({
  //     input_school: e.detail.value
  //   })
  // },
  to_graduation_school:function(){
    wx.navigateTo({
      url: '../../pages/graduation_school/graduation_school',
    })
  },

  input_major: function (e) {
    let that = this
    console.log(e.detail.value)
    that.setData({
      input_major: e.detail.value
    })
    if (that.data.input_major == ''){
      that.setData({
        input_major: undefined
      })
    }
    if (that.data.input_major != undefined){
    //提交判断
      if (that.data.input_name != undefined ) {
        if (that.data.input_phone != undefined ) {
        if (that.data.avatar != undefined) {
          if (that.data.input_school.indexOf("请选择") == -1) {
            if (that.data.graduation_time != 0) {
              if (that.data.sex_index != 0) {
                if (that.data.input_email != undefined ) {
                  if (that.data.stu_class_index != -1) {
                    that.setData({
                      issubmit: true
                    })
                    console.log(that.data.issubmit)
                  }
                }
              }
            }
          }
        }
      }
    }
    //提交判断结束
    } else {
      that.setData({
        issubmit: false
      })
    }
  },
  input_email: function (e) {
    let that = this
    console.log(e.detail.value)
    that.setData({
      input_email: e.detail.value
    })
    if (that.data.input_email == '') {
      that.setData({
        input_email: undefined
      })
    }
    if (that.data.input_email != undefined) {
    //提交判断
      if (that.data.input_name != undefined ) {
        if (that.data.input_phone != undefined ) {
        if (that.data.avatar != undefined) {
          if (that.data.input_school.indexOf("请选择") == -1) {
            if (that.data.graduation_time != 0) {
              if (that.data.input_major != undefined || that.data.input_major != ' ') {
                if (that.data.sex_index != 0) {
                  if (that.data.stu_class_index != -1) {
                    that.setData({
                      issubmit: true
                    })
                    console.log(that.data.issubmit)
                  }
                }
              }
            }
          }
        }
      }
    }
    //提交判断结束
    } else {
      that.setData({
        issubmit: false
      })
    }
  },

  submit:function(){
    let that = this
    if(that.data.issubmit){
      var params = {
        "token": wx.getStorageSync("token"),
        "uid": wx.getStorageSync("uid"),
        "avatar": that.data.avatar,
        "realname": that.data.input_name,
        "phone": that.data.input_phone,
        "school": that.data.input_school,
        "graduate_time": that.data.graduation_time,
        "subject": that.data.input_major,
        "email": that.data.input_email,
        "class_id": that.data.stu_class[that.data.stu_class_index].id,
        "sex": that.data.sex_index,
        
      }
      console.log(params)
      app.ljjw.jwSaveStudentBaseInfo(params).then(d => {
        console.log(d)
        // if (d.data.status == 1) {
        //   console.log(d.data.data)
        //   that.setData({
        //     stu_class: d.data.data
        //   })
        //   console.log("所有班级获取成功")
        // }


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
    var input_school = wx.getStorageSync("input_school")
    if (input_school) {
      that.setData({
        input_school: input_school
      })
      if(that.data.input_school.indexOf("请选择") == -1){
      //提交判断
        if (that.data.input_name != undefined ) {
          if (that.data.input_phone != undefined ) {
          if (that.data.avatar != undefined) {
            if (that.data.sex_index != 0) {
              if (that.data.graduation_time != 0) {
                if (that.data.input_major != undefined ) {
                  if (that.data.input_email != undefined ) {
                    if (that.data.stu_class_index != -1) {
                      that.setData({
                        issubmit: true
                      })
                      console.log(that.data.issubmit)
                    }
                  }
                }
              }
            }
          }
        }
      }
    //提交判断结束
      } else {
        that.setData({
          issubmit: false
        })
      }
    }
    else {
      that.setData({
        input_school: "请输入"
      })
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

  }
})