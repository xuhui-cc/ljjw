var __importDefault = (this && this.__importDefault) || function (mod) {
  return (mod && mod.__esModule) ? mod : { "default": mod };
};
const pinyin = __importDefault(require('./wl-pinyin/wl-pinyin.js')).default

/**
 * 分局拼音分组
*/
function groupByFirstChar(range, range_key){

  var studentGroup  = {}, noneCharArray = []
  // 便利数组
  for (var i = 0; i < range.length; i++){
    let student = range[i]
    // 获取大写字母
    let upperChar = pinyin.getFirstLetter(student[range_key]).toUpperCase()
    if (!upperChar || upperChar == '') {
      noneCharArray.push(student)
    } else {
      // 首字母
      let firsrChar = upperChar[0]
      // 首字母的ascii码
      let ascii = firsrChar.charCodeAt()
      if (ascii >= 65 && ascii <= 90) {
        // A-Z
        var group = studentGroup[firsrChar]
        if (group) {
          group.users.push(student)
        } else {
          studentGroup[firsrChar] = {
            groupName : firsrChar,
            users : [student]
          }
        }
      } else {
        // 其他字符
        noneCharArray.push(student)
      }
    }
  }

  // 排序
  var groupArray = Object.values(studentGroup)
  groupArray.sort(function(a,b){
    let aChar = a.groupName.charCodeAt()
    let bChar = b.groupName.charCodeAt()
    
    return (aChar - bChar)
  })
  
  // 添加#组
  if (noneCharArray.length != 0) {
    groupArray.push({
      groupName: '#',
      users: noneCharArray
    })
  }

  return groupArray
}

module.exports={
  groupByFirstChar
}