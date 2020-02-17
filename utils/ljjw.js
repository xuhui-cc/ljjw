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

//我的主页
function jwGetStudentMainPage(params) {
  return fetch.ljjwfetch(URI, 'jwGetStudentMainPage', params)
}

//我的收藏内搜索
function jwGetMyCollection(params) {
  return fetch.ljjwfetch(URI, 'jwGetMyCollection', params)
}

//我的普通跳转搜索
function jwGetFilesByKeyword(params) {
  return fetch.ljjwfetch(URI, 'jwGetFilesByKeyword', params)
}

//获取所有班级
function jwGetAllClass(params) {
  return fetch.ljjwfetch(URI, 'jwGetAllClass', params)
}

//完善学生信息提交
function jwSaveStudentBaseInfo(params) {
  return fetch.ljjwfetch(URI, 'jwSaveStudentBaseInfo', params)
}

//学生成绩首页
function jwGetStudentScore(params) {
  return fetch.ljjwfetch(URI, 'jwGetStudentScore', params)
}

//学生任务首页
function jwGetStudentTaskMain(params) {
  return fetch.ljjwfetch(URI, 'jwGetStudentTaskMain', params)
}

//学生成绩详情
function jwGetStudentSortScore(params) {
  return fetch.ljjwfetch(URI, 'jwGetStudentSortScore', params)
}

//学生每日晨读
function jwGetMorningReadMore(params) {
  return fetch.ljjwfetch(URI, 'jwGetMorningReadMore', params)
}

//学生任务待完成
function jwStudentTaskNotFinished(params) {
  return fetch.ljjwfetch(URI, 'jwStudentTaskNotFinished', params)
}

//学生任务已完成
function jwStudentTaskFinished(params) {
  return fetch.ljjwfetch(URI, 'jwStudentTaskFinished', params)
}

//学生任务中考勤的确认与驳回
function jwStudentCheckonVerify(params) {
  return fetch.ljjwfetch(URI, 'jwStudentCheckonVerify', params)
}

//学生我的收藏与取消收藏
function jwStudentAddCollection(params) {
  return fetch.ljjwfetch(URI, 'jwStudentAddCollection', params)
}

//小程序管理员-获取请假列表
function jwAdminGetAskforleaveList(params) {
  return fetch.ljjwfetch(URI, 'jwAdminGetAskforleaveList', params)
}

//小程序管理员-获取请假列表
function jwSaveAskforleave(params) {
  return fetch.ljjwfetch(URI, 'jwSaveAskforleave', params)
}

//小程序管理员请假审批  type=1通过 type=2驳回
function jwAdminAskforleaveVerify(params) {
  return fetch.ljjwfetch(URI, 'jwAdminAskforleaveVerify', params)
}



module.exports = { xcxjwlogin, jwGetDayCourse, jwGetMonthCourse, jwGetMonthCheckon, jwGetDayCheckon, jwGetStudentAskforleave, jwGetStudentMainPage, jwGetMyCollection, jwGetFilesByKeyword, jwGetAllClass, jwSaveStudentBaseInfo, jwGetStudentScore, jwGetStudentTaskMain, jwGetStudentSortScore, jwGetMorningReadMore, jwStudentTaskNotFinished, jwStudentTaskFinished, jwStudentCheckonVerify, jwStudentAddCollection, jwAdminGetAskforleaveList, jwSaveAskforleave, jwAdminAskforleaveVerify}