const URI = 'http://cs.szgk.cn/api.php'    //测试接口

// const URI = 'https://www.szgk.cn/api.php'    //正式接口


const fetch = require('./fetch')

//提交考场
function xcxjwlogin(params) {
  return fetch.ljjwfetch(URI, 'xcxjwlogin', params)
}





module.exports = { xcxjwlogin}