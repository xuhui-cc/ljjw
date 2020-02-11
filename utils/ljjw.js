const URI = 'http://cs.szgk.cn/api.php'    //测试接口

// const URI = 'https://www.szgk.cn/api.php'    //正式接口


const fetch = require('./fetch')

//登录
function xcxjwlogin(params) {
  return fetch.ljjwfetch(URI, 'xcxjwlogin', params)
}

//获取学生某日期课程列表
function jwGetDayCourse(params) {
  return fetch.ljjwfetch(URI, 'jwGetDayCourse', params)
}

//获取学生某月课程列表
function jwGetMonthCourse(params) {
  return fetch.ljjwfetch(URI, 'jwGetMonthCourse', params)
}

//获取学生某月考勤列表
function jwGetMonthCheckon(params) {
  return fetch.ljjwfetch(URI, 'jwGetMonthCheckon', params)
}

//获取学生某日期考勤列表
function jwGetDayCheckon(params) {
  return fetch.ljjwfetch(URI, 'jwGetDayCheckon', params)
}

//获取学生请假列表
function jwGetStudentAskforleave(params) {
  return fetch.ljjwfetch(URI, 'jwGetStudentAskforleave', params)
}





module.exports = { xcxjwlogin, jwGetDayCourse, jwGetMonthCourse, jwGetMonthCheckon, jwGetDayCheckon, jwGetStudentAskforleave}