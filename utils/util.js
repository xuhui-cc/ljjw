const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const customFormatTimeByDate = (date, format) => {
  var data = {
    "M+": date.getMonth() + 1,                 //月   
    "d+": date.getDate(),                    //日   
    "h+": date.getHours(),                   //小时   
    "m+": date.getMinutes(),                 //分   
    "s+": date.getSeconds(),                 //秒   
    "q+": Math.floor((date.getMonth() + 3) / 3), //季度   
    "S": date.getMilliseconds()             //毫秒   
  };
  if (!format) {
    format = "yyyy-mm-dd hh:ii:ss"
  }
  if (/(y+)/.test(format)) {
    // date.getFullYear() + ""  转为字符串
    format = format.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length))
  }
  console.log(format)
  for (var k in data) {
    if (new RegExp("(" + k + ")").test(format)) {
      format = format.replace(RegExp.$1, (RegExp.$1.length === 1) ? (data[k]) : (("00" + data[k]).substring(("" + data[k]).length)))
    }
  }
  return format
}

const customFormatTimeByTimestamp = (timestamp, format) => {
  var obj = parseInt(timestamp)
  var date = new Date(obj)
  var data = {
    "M+": date.getMonth() + 1,                 //月   
    "d+": date.getDate(),                    //日   
    "h+": date.getHours(),                   //小时   
    "m+": date.getMinutes(),                 //分   
    "s+": date.getSeconds(),                 //秒   
    "q+": Math.floor((date.getMonth() + 3) / 3), //季度   
    "S": date.getMilliseconds()             //毫秒   
  };
  if (!format) {
    format = "yyyy-mm-dd hh:ii:ss"
  }
  if (/(y+)/.test(format)) {
    // date.getFullYear() + ""  转为字符串
    format = format.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length))
  }
  // console.log(format)
  for (var k in data) {
    if (new RegExp("(" + k + ")").test(format)) {
      format = format.replace(RegExp.$1, (RegExp.$1.length === 1) ? (data[k]) : (("00" + data[k]).substring(("" + data[k]).length)))
    }
  }
  return format
}

const formatDate = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  return [year, month, day].map(formatNumber).join('-')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

module.exports = {
  formatTime: formatTime,
  formatDate: formatDate,
  customFormatTimeByDate: customFormatTimeByDate,
  customFormatTimeByTimestamp, customFormatTimeByTimestamp
}
