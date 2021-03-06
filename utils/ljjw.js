const Base_URI = 'http://cs.szgk.cn' // 测试
// const Base_URI = 'https://www.szgk.cn' // 正试

const URI = Base_URI + '/apiv2.php'    //接口

const uploadFileURI = Base_URI + '/apiv2.php?' // 上传文件接口

const baiduMapAK = 'RRbyUafOYr3koAXqmP24ke7dSnLpMckY'

/**
 * 获取上传文件URI
*/
function getUploadFileURI() {
  return uploadFileURI
}



const fetch = require('./fetch')

//登录
function xcxjwlogin(params) {
  return fetch.ljjwfetch(URI, 'xcxjwlogin', params, "登录", true, "登录中")
}

//获取学生某日期课程列表
function jwGetDayCourse(params) {
  return fetch.ljjwfetch(URI, 'jwGetDayCourse', params, "获取学生某日期课程列表", true)
}

//获取学生某月课程列表
function jwGetMonthCourse(params) {
  return fetch.ljjwfetch(URI, 'jwGetMonthCourse', params, "获取学生某月课程列表")
}

//获取学生某月考勤列表
function jwGetMonthCheckon(params) {
  return fetch.ljjwfetch(URI, 'jwGetMonthCheckon', params, "获取学生某月考勤列表")
}

//获取学生某日期考勤列表
function jwGetDayCheckon(params) {
  return fetch.ljjwfetch(URI, 'jwGetDayCheckon', params, "获取学生某日期考勤列表", true)
}

//获取学生请假列表
function jwGetStudentAskforleave(params) {
  return fetch.ljjwfetch(URI, 'jwGetStudentAskforleave', params, "获取学生请假列表", true)
}

//我的主页
function jwGetStudentMainPage(params) {
  return fetch.ljjwfetch(URI, 'jwGetStudentMainPage', params, "我(学生)的主页", true)
}

//我的收藏,内含搜索
function jwGetMyCollection(params) {
  return fetch.ljjwfetch(URI, 'jwGetMyCollection', params, "我的收藏,内含搜索", true)
}

//我的普通跳转搜索
function jwGetFilesByKeyword(params) {
  return fetch.ljjwfetch(URI, 'jwGetFilesByKeyword', params, "我的普通跳转搜索")
}

//获取所有班级
function jwGetAllClass(params) {
  return fetch.ljjwfetch(URI, 'jwGetAllClass', params, "获取所有班级", true)
}

//完善学生信息提交
function jwSaveStudentBaseInfo(params) {
  return fetch.ljjwfetch(URI, 'jwSaveStudentBaseInfo', params, "完善学生信息提交", true, "提交中")
}

//学生成绩首页
function jwGetStudentScore(params) {
  return fetch.ljjwfetch(URI, 'jwGetStudentScore', params, "学生成绩首页", true)
}

//学生任务首页
function jwGetStudentTaskMain(params) {
  return fetch.ljjwfetch(URI, 'jwGetStudentTaskMainNew', params, "学生任务首页", true)
}

//学生成绩详情
function jwGetStudentSortScore(params) {
  return fetch.ljjwfetch(URI, 'jwGetStudentSortScore', params, "学生成绩详情", true)
}

//学生每日晨读
function jwGetMorningReadMore(params) {
  return fetch.ljjwfetch(URI, 'jwGetMorningReadMore', params, "学生每日晨读", true)
}

//学生任务待完成
function jwStudentTaskNotFinished(params) {
  return fetch.ljjwfetch(URI, 'jwStudentTaskNotFinishedNew', params, "学生任务待完成", true)
}

//学生任务已完成
function jwStudentTaskFinished(params) {
  return fetch.ljjwfetch(URI, 'jwStudentTaskFinishedNew', params, "学生任务已完成", true)
}

//学生任务中考勤的确认与驳回
function jwStudentCheckonVerify(params) {
  return fetch.ljjwfetch(URI, 'jwStudentCheckonVerify', params, "学生任务中考勤的确认与驳回", "提交中")
}

//学生我的收藏与取消收藏
function jwStudentAddCollection(params) {
  return fetch.ljjwfetch(URI, 'jwStudentAddCollection', params, "学生我的收藏与取消收藏", true)
}

//小程序管理员-获取请假列表 （1.4.5废弃）
function jwAdminGetAskforleaveList(params) {
  return fetch.ljjwfetch(URI, 'jwAdminGetAskforleaveList', params, "小程序管理员-获取请假列表", true)
}

// 管理员-获取请假列表 （>=1.4.5）
function jwAdminViewAskforleaveList(params) {
  return fetch.ljjwfetch(URI, 'jwAdminViewAskforleaveList', params, "管理员-获取请假列表 （>=1.4.5）", true)
}

//学生提交请假申请
function jwSaveAskforleave(params) {
  return fetch.ljjwfetch(URI, 'jwSaveAskforleave', params, "学生提交请假申请", true)
}

//小程序管理员请假审批  type=1通过 type=2驳回 （1.4.5废弃）
function jwAdminAskforleaveVerify(params) {
  return fetch.ljjwfetch(URI, 'jwAdminAskforleaveVerify', params, "小程序管理员请假审批", true, "提交中")
}

//教务请假列表  type=1未审核 type=2 已审核
function jwJiaowuGetAskforleaveList(params) {
  return fetch.ljjwfetch(URI, 'jwJiaowuGetAskforleaveList', params, "教务请假列表", true)
}

//教务请假审核  type=1通过 2-驳回
function jwJiaowuAskforleaveVerify(params) {
  return fetch.ljjwfetch(URI, 'jwJiaowuAskforleaveVerify', params, "教务请假审核", true, "提交中")
}

//老师首页
function jwTeacherMyPage(params) {
  return fetch.ljjwfetch(URI, 'jwTeacherMyPage', params, "老师首页", true)
}

//老师班级资料
function jwTeacherClassFiles(params) {
  return fetch.ljjwfetch(URI, 'jwTeacherClassFiles', params, "老师班级资料")
}

//老师学生档案
function jwTeacherClassStudents(params) {
  return fetch.ljjwfetch(URI, 'jwTeacherClassStudents', params, "老师学生档案", true)
}

//老师某一天课程
function jwGetCheckOnList(params) {
  return fetch.ljjwfetch(URI, 'jwGetCheckOnList', params, "老师某一天考勤", true)
}

//老师-获取课程学生列表，点名页面
function jwTeacherClassSignIn(params) {
  return fetch.ljjwfetch(URI, 'jwTeacherClassSignIn', params, "老师-获取课程学生列表，点名页面", true)
}

//老师点名学生状态更改
function jwSaveStudentSignIn(params) {
  return fetch.ljjwfetchpost(URI, 'jwSaveStudentSignIn', params, "老师点名学生状态更改", true, "提交中")
}

//老师查看学生基础信息
function jwViewStudentProfile(params) {
  return fetch.ljjwfetch(URI, 'jwViewStudentProfile', params, "老师查看学生基础信息")
}

//老师查看学生档案——成绩
function jwViewStudentScores(params) {
  return fetch.ljjwfetch(URI, 'jwViewStudentScores', params, "老师查看学生档案——成绩")
}

//老师查看学生档案——概况
function jwViewStudentSumary(params) {
  return fetch.ljjwfetch(URI, 'jwViewStudentSumary', params, "老师查看学生档案——概况")
}

//老师查看学生档案——学情
function jwViewStudentStudyInfo(params) {
  return fetch.ljjwfetch(URI, 'jwViewStudentStudyInfo', params, "老师查看学生档案——学情")
}

//老师查看学生档案——新建学情
function jwAddStudyInfo(params) {
  return fetch.ljjwfetch(URI, 'jwAddStudyInfo', params, "老师查看学生档案——新建学情")
}

//老师——成绩首页
function jwTeacherScoreMainPage(params) {
  return fetch.ljjwfetch(URI, 'jwTeacherScoreMainPage', params, "老师——成绩首页", true)
}

//老师——成绩详情页
function jwTeacherScoreSubPage(params) {
  return fetch.ljjwfetch(URI, 'jwTeacherScoreSubPage', params, "老师——成绩详情页")
}

//老师——任务首页
function jwTeacherTasksMainPage(params) {
  return fetch.ljjwfetch(URI, 'jwTeacherTasksMainPage', params, "老师——任务首页", true)
}

//老师——每日晨读列表页
function jwTeacherMorningReadMore(params) {
  return fetch.ljjwfetch(URI, 'jwTeacherMorningReadMore', params, "老师——每日晨读列表页", true)
}

//老师——新建每日晨读
function jwTeacherAddMorningRead(params) {
  return fetch.ljjwfetch(URI, 'jwTeacherAddMorningRead', params, "老师——新建每日晨读", true, "提交中")
}

//老师——任务列表
function jwTeacherTasks(params) {
  return fetch.ljjwfetch(URI, 'jwTeacherTasksNew', params, "老师——任务列表", true)
}

//老师——查看某节课考勤
function jwViewScheduleCheckOn(params) {
  return fetch.ljjwfetch(URI, 'jwViewScheduleCheckOn', params, "老师——查看某节课考勤", true)
}

//老师——新建消息
function jwTeacherAddMessages(params) {
  return fetch.ljjwfetch(URI, 'jwTeacherAddMessages', params, "老师——新建消息", true, "提交中")
}

//学生——提交任务
function jwStudentSaveTask(params) {
  return fetch.ljjwfetch(URI, 'jwStudentSaveTask', params, "学生——提交任务", true, "提交中")
}

//学生——毕业院校
function jwGetSchoolList(params) {
  return fetch.ljjwfetch(URI, 'jwGetSchoolList', params, "学生——毕业院校")
}

//教务/管理员——请假待审核红点
function jwGetAskforleaveCount(params) {
  return fetch.ljjwfetch(URI, 'jwGetAskforleaveCount', params, "教务/管理员——请假待审核红点")
}

// 学生--按日期段获取课程信息
function jwGePeriodCourse(params) {
  return fetch.ljjwfetch(URI, 'jwGePeriodCourse', params, "学生--按日期段获取课程信息")
}

// 学生-按日期段获取考勤信息
function jwGetPeriodsCheckon(params) {
  return fetch.ljjwfetch(URI, 'jwGetPeriodsCheckon', params, "学生-按日期段获取考勤信息")
}

// 老师/教务/管理员 按日期段获取考勤信息
function jwGetDayList(params) {
  return fetch.ljjwfetch(URI, 'jwGetDayList', params, "老师/教务/管理员 按日期段获取考勤信息")
}

// 学生/老师/教务 获取tabbar任务item小红点
function jwTaskBarRedPoint(params) {
  return fetch.ljjwfetch(URI, 'jwTaskBarRedPointNew', params, "学生/老师/教务 获取tabbar任务item小红点")
}

// 消息阅读
function jwReadMsg(params) {
  return fetch.ljjwfetch(URI, 'jwReadMsg', params, "消息阅读")
}

// 管理员-获取未读请假消息数量
function jwAdminGetUnreadAskforleave(params) {
  return fetch.ljjwfetch(URI, 'jwAdminGetUnreadAskforleave', params, "管理员获取未读请假消息数量")
}

// 管理员 将请假信息变为已读
function jwUpdateAdminsaw(params) {
  return fetch.ljjwfetchpost(URI, 'jwUpdateAdminsaw', params, '管理员 将请假信息变为已读', true)
}

// 获取问题反馈类型列表
function getFeedbackType(params) {
  return fetch.ljjwfetch(URI, 'getFeedbackType', params, "获取问题反馈类型列表", true)
}

// 获取学生已处理反馈未读数量
function getUnreadCount(params) {
  return fetch.ljjwfetch(URI, 'getUnreadCount', params, "获取学生已处理反馈未读数量")
}

// 提交问题反馈
function saveFeedback(params) {
  return fetch.ljjwfetchpost(URI, 'saveFeedback', params, '提交问题反馈', true, '提交中')
}

// 学生获取反馈列表
function getFeedBackList(params) {
  return fetch.ljjwfetch(URI, 'getFeedBackList', params, '学生获取反馈列表', true)
}

// 问题反馈 学生提交评分
function saveStudentScore(params) {
  return fetch.ljjwfetchpost(URI, 'saveStudentScore', params, '问题反馈 学生提交评分', true, '提交中')
}

// 问题反馈 学生提交归还
function submitReturn(params) {
  return fetch.ljjwfetchpost(URI, 'submitReturn', params, '问题反馈 学生提交归还', true, '提交中')
}

// 学生问题反馈变为已读
function setFeedbackSaw(params) {
  return fetch.ljjwfetchpost(URI, 'setFeedbackSaw', params, '学生问题反馈变为已读', true)
}

// 老师获取待处理反馈数量
function getTeacherUnreadCount(params) {
  return fetch.ljjwfetch(URI, 'getTeacherUnreadCount', params, '老师获取待处理反馈数量')
}

// 老师获取反馈列表
function getTeacherFeedbackList(params) {
  return fetch.ljjwfetch(URI, 'getTeacherFeedbackList', params, '老师获取反馈列表', true)
}

// 问题反馈 老师获取关联的分类列表
function getTeacherAttachSort(params) {
  return fetch.ljjwfetch(URI, 'getTeacherAttachSort', params, '问题反馈 老师获取关联的分类列表', true)
}

// 老师审批问题反馈
function teacherConfirmFeedback(params) {
  return fetch.ljjwfetchpost(URI, 'teacherConfirmFeedback', params, '老师审批问题反馈', true, "提交中")
}

// 老师审批归还
function teacherConfirmReturn(params) {
  return fetch.ljjwfetchpost(URI, 'teacherConfirmReturn', params, '老师审批归还', true, '提交中')
}

// 刷新用户信息
function jwgetUserinfoByUid(params) {
  return fetch.ljjwfetch(URI, 'jwgetUserinfoByUid', params, '刷新用户信息')
}

// 学生资料列表
function jwGetStudentClassFiles(params) {
  return fetch.ljjwfetch(URI, 'jwGetStudentClassFiles', params, '学生资料接口列表', true)
}

// 更改用户信息
function jwUpdateStudentBaseInfo(params) {
  return fetch.ljjwfetchpost(URI, 'jwUpdateStudentBaseInfo', params, '更改用户信息', true, '提交中')
}

// 获取音频广播列表
function jwGetAudiolist(params) {
  return fetch.ljjwfetch(URI, 'jwGetAudiolist', params, '获取音频广播列表', true)
}

// 获取用户收听音频广播时长
function jwGetUserAudioTime(params) {
  return fetch.ljjwfetch(URI, 'jwGetUserAudioTime', params, '获取用户收听音频广播时长')
}

// 更新音频广播用户收听时长
function jwUpdateUserAudioTime(params) {
  return fetch.ljjwfetchpost(URI, 'jwUpdateUserAudioTime', params, '更新音频广播用户收听时长')
}

// 更新音频收听次数
function updateAudioPlayCount(params) {
  return fetch.ljjwfetchpost(URI, 'updateAudioPlayCount', params, '更新音频收听次数')
}

// 课程预约列表
function courseAppointmentList(params) {
  return fetch.ljjwfetch(URI, 'jwGetyuekeList', params, '课程预约列表', true)
}

// 课程预约 简介 h5
function courseAppointmentDetail_h5(cate_id) {
  return Base_URI + '/jwyueke/h5yuekedetail?cate_id=' + cate_id
}

// 获取约课内容条目列表
function getCourseAppointmentItemList(params) {
  return fetch.ljjwfetch(URI, 'jwGetYueketype', params, '获取约课内容条目列表', true)
}

// 提交约课
function submitCourseAppointment(params) {
  return fetch.ljjwfetchpost(URI, 'jwStuSubmitYueke', params, '提交约课', true, '提交中')
}

// 我的课程预约列表
function myCourseAppointmentList(params) {
  return fetch.ljjwfetch(URI, 'jwStuYuekeBmlist', params, '我的课程预约列表', true)
}

// 取消课程预约
function cancelCourseAppointment(params) {
  return fetch.ljjwfetchpost(URI, 'jwStuYuekeCancel', params, ' 取消课程预约', true, '取消中')
}

// 获取提交预约详情信息
function getCourseAppointmentDetailInfo(params) {
  return fetch.ljjwfetch(URI, 'jwGetProValue', params, '获取提交预约详情信息', true)
}

// 获取最新用户填写的信息
function getNewCourseAppointmentDetail(params) {
  return fetch.ljjwfetch(URI, 'jwGetStuBminfo', params, '获取最新用户填写的信息', true)
}

// 修改课程续约提交接口
function submitChangeCourseAppointment(params) {
  return fetch.ljjwfetchpost(URI, 'jwStuSubmitYueke', params, '修改课程续约提交接口', true, '提交中')
}

// 修改课程预约 判断选中的期是否可约
function checkAppointmentCateCanUse(params) {
  return fetch.ljjwfetchpost(URI, 'jwHandleCateid', params, '修改课程预约 判断选中的期是否可约', true)
}

// 学生获取课程预约模块小红点
function studentGetCourseAppointmentRedCount(params) {
  return fetch.ljjwfetch(URI, 'jwGetStuYuekeCount', params, '学生获取课程预约模块小红点')
}

// 老师获取课程预约模块小红点
function teacherGetCourseAppointmentRedCount(params) {
  return fetch.ljjwfetch(URI, 'jwTeaGetHandnum', params, '老师获取课程预约模块小红点')
}

// 老师获取 课程预约 待审核列表
function teacherGetCourseAppointmentList(params) {
  return fetch.ljjwfetch(URI, 'jwTeaYuekeWeiList', params, '老师获取 课程预约 待审核列表', true)
}

// 老师获取课程预约 数据详情
function teacherGetCourseAppointmentAnalysis(params) {
  return fetch.ljjwfetch(URI, 'jwTeaYuekeList', params, '老师获取课程预约 数据详情', true)
}

// 课程预约老师审批
function teacherDealCourseAppointment(params) {
  return fetch.ljjwfetchpost(URI, 'jwTeaYuekeShenhe', params, '课程预约老师审批', true, '提交中')
}

// 老师 获取课程预约 预约人列表
function teacherGetCourseAppointmentStudentList(params) {
  return fetch.ljjwfetch(URI, 'jwTeaYuekeBmlist', params, '老师 获取课程预约 预约人列表', true)
}

// 课程预约 根据报名ID获取审批流程
function getAppointmentProcessListByID(params) {
  return fetch.ljjwfetch(URI, 'jwTeaYuekeBmdetail', params, '课程预约 根据报名ID获取审批流程', true)
}

// 获取课程预约须知
function getCourseAppointmentNotice(params) {
  return fetch.ljjwfetch(URI, 'jwGetYuekeCateNotice', params, '获取课程预约须知', true)
}

/**
 * 拼接任务做题 h5
 * type:1-做题，2-做题详情
 * stu_is:学生id
 * parperID：试卷ID
*/
function getTaskDetailH5(type, stu_id, parperID, classID) {
  return Base_URI + '/jwpaper/xcxh5?paperID=' + parperID + '&stu_id=' + stu_id + '&type=' + type +'&classID=' + classID
}

/**
 * 老师端 修改学情/概况
*/
function jwUpdateStudyInfo(params) {
  return fetch.ljjwfetchpost(URI, 'jwUpdateStudyInfo', params, '老师端 修改学情/概况', true, '修改中')
}

// 老师端 删除学情/概况
function jwDeleteStudy(params) {
  return fetch.ljjwfetchpost(URI, 'jwDeleteStudy', params, '老师端 删除学情/概况', true, '删除中')
}

// 获取基础信息被驳回原因
function jwGetRejection(params) {
  return fetch.ljjwfetch(URI, 'jwGetRejection', params, '获取基础信息被驳回原因')
}

// 老师端 课程预约待审核 批量审核
function jwTeaYuekeShenheData(params) {
  return fetch.ljjwfetchpost(URI, 'jwTeaYuekeShenheData', params, '老师端 课程预约待审核 批量审核', true)
}

// 获取区域列表
function jwZoneList(params) {
  return fetch.ljjwfetchpost(URI, 'jwZoneList', params, '获取区域列表', false)
}

// 修改老师当前区域
function jwZoneCurrentZoneId(params) {
  return fetch.ljjwfetchpost(URI, 'jwZoneCurrentZoneId', params, '修改老师当前区域', true, '提交中')
}

// 百度地图根据经纬度逆地理编码
function getLoacationAddress(latitude, longitude) {
  let params = {
    ak: baiduMapAK,
    type: 'wgs84ll',
    location: latitude + ',' + longitude,
    output: 'json'
  }
  return fetch.get('https://api.map.baidu.com/reverse_geocoding/v3/', params, '百度地图根据经纬度逆地理编码', true)
}

module.exports = {getUploadFileURI, xcxjwlogin, jwGetDayCourse, jwGetMonthCourse, jwGetMonthCheckon, jwGetDayCheckon, jwGetStudentAskforleave, jwGetStudentMainPage, jwGetMyCollection, jwGetFilesByKeyword, jwGetAllClass, jwSaveStudentBaseInfo, jwGetStudentScore, jwGetStudentTaskMain, jwGetStudentSortScore, jwGetMorningReadMore, jwStudentTaskNotFinished, jwStudentTaskFinished, jwStudentCheckonVerify, jwStudentAddCollection, jwAdminGetAskforleaveList, jwSaveAskforleave, jwAdminAskforleaveVerify, jwJiaowuGetAskforleaveList, jwJiaowuAskforleaveVerify, jwTeacherMyPage, jwTeacherClassFiles, jwTeacherClassStudents, jwGetCheckOnList, jwTeacherClassSignIn, jwSaveStudentSignIn, jwViewStudentProfile, jwViewStudentScores, jwViewStudentStudyInfo, jwViewStudentSumary, jwAddStudyInfo, jwTeacherScoreMainPage, jwTeacherScoreSubPage, jwTeacherTasksMainPage, jwTeacherMorningReadMore, jwTeacherAddMorningRead, jwTeacherTasks, jwViewScheduleCheckOn, jwTeacherAddMessages, jwStudentSaveTask, jwGetSchoolList, jwGetAskforleaveCount, jwGePeriodCourse, jwGetPeriodsCheckon, jwGetDayList, jwTaskBarRedPoint, jwReadMsg, jwAdminGetUnreadAskforleave, jwAdminViewAskforleaveList, jwUpdateAdminsaw, getFeedbackType, getUnreadCount, saveFeedback, getFeedBackList, saveStudentScore, submitReturn, setFeedbackSaw, getTeacherUnreadCount, getTeacherFeedbackList, getTeacherAttachSort, teacherConfirmFeedback, teacherConfirmReturn, jwgetUserinfoByUid, jwGetStudentClassFiles, jwUpdateStudentBaseInfo, testAPi, jwGetAudiolist, jwGetUserAudioTime, jwUpdateUserAudioTime, updateAudioPlayCount, courseAppointmentList, courseAppointmentDetail_h5, getCourseAppointmentItemList, submitCourseAppointment, myCourseAppointmentList, cancelCourseAppointment, getCourseAppointmentDetailInfo, getNewCourseAppointmentDetail, submitChangeCourseAppointment, checkAppointmentCateCanUse, studentGetCourseAppointmentRedCount, teacherGetCourseAppointmentRedCount, teacherGetCourseAppointmentList, teacherGetCourseAppointmentAnalysis, teacherDealCourseAppointment, teacherGetCourseAppointmentStudentList, getAppointmentProcessListByID, getCourseAppointmentNotice, getTaskDetailH5, jwUpdateStudyInfo, jwDeleteStudy, jwGetRejection, jwTeaYuekeShenheData, jwZoneList, jwZoneCurrentZoneId, getLoacationAddress}

//测试正式服接口
function testAPi(api, params) {
  return fetch.ljjwfetch('https://www.szgk.cn/api.php', api, params, '测试正式服接口')
}