/*
*api    根地址
*path   请求路径
*params 请求参数
*return 返回任务的Promise
*/

function ljjwfetch(api, path, params, info, loadingShow, loadingMsg) {
  return new Promise((resolve, reject) => {

    if(loadingShow) {
      wx.showLoading({
        title: loadingMsg?loadingMsg:"加载中",
      })
    }
    console.log(info+" "+path+" 参数：")
    console.log(params)
    

    wx.request({
      url: `${api}?action=${path}`,
      data: Object.assign({}, params),
      header: { 'Content-Type': 'json' },
      success: resolve,
      fail: reject,
      complete (res) {
        if (loadingShow) {
          wx.hideLoading({
            complete: (res) => {},
          })
        }
        if (res.errMsg == "request:ok"){
          console.log(info+" 返回数据：")
          console.log(res.data)
          // status为-9，token过期
          if (res.data.status && res.data.status == -9) {
            wx.showToast({
              title: '登录过期',
              icon: 'none'
            })
            wx.clearStorage({
              complete: (res) => {
                wx.switchTab({
                  url: '/pages/my/my',
                })
              },
            })
          } else if (res.data.status && res.data.status != 1) {
            if (loadingShow) {
              wx.showToast({
                title: res.data.msg ? res.data.msg : "数据有误",
                icon: "none"
              })
            }
          }
        } else {
          if (loadingShow) {
            wx.showToast({
              title: '加载失败',
              icon: 'none'
            })
          }
          console.log(info+" 加载失败")
        }
      }
    })
  })
}


function ljjwfetchpost(api, path, params, info, loadingShow, loadingMsg) {
  return new Promise((resolve, reject) => {

    if(loadingShow) {
      wx.showLoading({
        title: loadingMsg?loadingMsg:"加载中",
      })
    }
    console.log(info+" "+path+" 参数：")
    console.log(params)

    wx.request({
      url: `${api}?action=${path}`,
      data: Object.assign({}, params),
      method: 'POST',
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      success(res){
        if (loadingShow) {
          wx.hideLoading({
            complete: () => {
            },
          })
        }
        console.log(info+" 返回数据：")
        console.log(res.data)
        // status为-9，token过期
        if (res.data.status && res.data.status == -9) {
          wx.showToast({
            title: '登录过期',
            icon: 'none'
          })
          wx.clearStorage({
            complete: (res) => {
              wx.switchTab({
                url: '/pages/my/my',
              })
            },
          })
        } else if (res.data.status && res.data.status != 1) {
          if (loadingShow) {
            wx.showToast({
              title: res.data.msg ? res.data.msg : "数据有误",
              icon: "none"
            })
          }
        }
        resolve(res)
      },
      fail(res) {
        if (loadingShow) {
          wx.hideLoading({
            complete: (res) => {
              wx.showToast({
                title: '加载失败',
                icon: 'none'
              })
            },
          })
        }
        console.log(info+" 加载失败:")
        console.log(res)
        reject(res)
      },
    })
  })
}

function get(url, params, info, showLoading, loadingMsg) {
  return new Promise((resolve, reject) => {

    if (showLoading) {
      wx.showLoading({
        title: loadingMsg?loadingMsg:"加载中",
      })
    }

    console.log(info+" "+url+" 参数：")
    console.log(params)

    wx.request({
      url: url,
      data: Object.assign({}, params),
      success(res) {
        if (showLoading) {
          wx.hideLoading({
            complete: () => {
            },
          })
        }
        console.log(info+" 返回数据：")
        console.log(res)
        resolve(res)
      },
      fail(res) {
        if (showLoading) {
          wx.hideLoading({
            complete: () => {
              wx.showToast({
                title: '加载失败',
                icon: 'none'
              })
            },
          })
        }
        console.log(info+" 加载失败:")
        console.log(res)
        reject(res)
      }
    })
  })
}


module.exports = { ljjwfetch, ljjwfetchpost, get}