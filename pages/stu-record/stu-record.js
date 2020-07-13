// pages/stu-record/stu-record.js
import * as echarts from '../../ec-canvas/echarts';
const app = getApp()

// var dataList = [];
// var x_name = []
// var k = 0;
// var Chart = null;
var cxnum=[];
function setOption(chart, xdata, ydata) {
  let that=this;
  var option = {
    color: ["#2DC1A0", "#2DC1A0" ],
    // legend: {
    //   data: ['A', 'B', 'C'],
    //   top: 50,
    //   left: 'center',
    //   backgroundColor: 'red',
    //   z: 100
    // },
    grid: {
      containLabel: true,
      left: '3%',
      right:'4%',
      bottom: '3%'
    },
    tooltip: {
      show: true,
      trigger: 'axis',
      textStyle:{
        fontSize:14
      },
      position: ['40%', '50%'],
      formatter: function (params, ticket, callback) {
        // console.log(params);
        // console.log(params[0].dataIndex);
        // console.log(that.data.cnum);
        console.log(cxnum);
        
         return "总分："+cxnum[params[0].dataIndex];
     }
    
    },
    
    xAxis: {
      
      axisLabel: {//坐标轴刻度标签的相关设置。
        // nameLocation: 'end',//坐标轴名称显示位置。
        // axisLabel: {//坐标轴刻度标签的相关设置。
        //   interval: 0,
        //   rotate: "45"
        // }
        formatter: function (params) {
          var newParamsName = "";// 最终拼接成的字符串
          var paramsNameNumber = params.length;// 实际标签的个数
          var provideNumber = 2;// 每行能显示的字的个数
          var rowNumber = Math.ceil(paramsNameNumber / provideNumber);
          /**
                                   * 判断标签的个数是否大于规定的个数， 如果大于，则进行换行处理 如果不大于，即等于或小于，就返回原标签
                                    */
          // 条件等同于rowNumber>1
          if (paramsNameNumber > provideNumber) {
            /** 循环每一行,p表示行 */
            for (var p = 0; p < rowNumber; p++) {
              var tempStr = "";// 表示每一次截取的字符串
              var start = p * provideNumber;// 开始截取的位置
              var end = start + provideNumber;// 结束截取的位置
              // 此处特殊处理最后一行的索引值
              if (p == rowNumber - 1) {
                // 最后一次不换行
                tempStr = params.substring(start, paramsNameNumber);

              } else {
                // 每一次拼接字符串并换行
                tempStr = params.substring(start, end) + "\n";

              }
              newParamsName += tempStr;// 最终拼成的字符串

            }
          } else {
            // 将旧标签的值赋给新标签
            newParamsName = params;
          }
          //将最终的字符串返回
          return newParamsName

        }
      },
      
      data: xdata
      
      // data: ["hhh","hhhh","hh"]

    },
    yAxis: {
      x: 'center',
      type: 'value',
      name:'单位：%',
      axisLabel:{
        fontSize:16
      },
      nameTextStyle:{
        fontSize:16
      },
      splitLine: {
        lineStyle: {
          type: 'dashed'
        }
      }
      // show: false
    },
    series: [{
      name: '总分',
      data: ydata,
      score_data:xdata,
      // data: [80,50,99],
      // smooth: true,
      type: 'line'
    }]
  }
  chart.setOption(option)
}



// function initChart(canvas, width, height) {
//   chart = echarts.init(canvas, null, {
//     width: width,
//     height: height
//   });
//   canvas.setChart(chart);
  
//   weightCanvasone = canvas;
  

  

//   // chart.setOption(option);
//   return chart;
// }

Page({

  /**
   * 页面的初始数据
   */
  data: {
    aud: 0,
    ec: {
      lazyLoad: true // 延迟加载
    },
    // hh: [80, 115, 90, 95, 83]
    num:[],
    x_name:[],
    cnum:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getPageSize()
    let that = this
    var sid = options.sid
    that.setData({
      sid:sid
    })
    this.echartsComponnet = this.selectComponent('#mychart-dom-line');
    that.getOneOption();
    


    
  },

  child_fold: function (e) {
    let that = this
    var child_xb = e.currentTarget.dataset.child_xb
    var cs = "score.score_info[" + child_xb + "].child_fold"
    that.setData({
      [cs]: !that.data.score.score_info[child_xb].child_fold
    })
  },

  back: function () {
    wx.navigateBack({
      delta: 1  // 返回上一级页面。
    })
  },

  init_one: function (xdata, ydata) {           //初始化第一个图表
    this.echartsComponnet.init((canvas, width, height) => {
      const chart = echarts.init(canvas, null, {
        width: width,
        height: height,
      });
      setOption(chart, xdata, ydata)
      this.chart = chart;
      return chart;
    });
  },

  getOneOption: function () {        //这一步其实就要给图表加上数据
    var that = this;
    var params = {
      "token": wx.getStorageSync("token"),
      "uid": wx.getStorageSync("uid"),
      "sid": that.data.sid,
      "type": that.data.aud + 1    //type->1是总分 2是行测分数 3是申论分数
    }
    app.ljjw.jwGetStudentSortScore(params).then(d => {
      if (d.data.status == 1) {
        console.log(d.data.data)
        if (that.data.aud + 1 == 2){
          if (d.data.data.scores == null){
            that.setData({
              score: ''
            })
          } else {
            that.setData({
              score: d.data.data
            })
          }
        } else if (that.data.aud + 1 == 3){
          if (d.data.data.scores == null) {
            that.setData({
              score: ''
            })
          }else{
            that.setData({
              score: d.data.data
            })
          }
        }else{
          that.setData({
            score: d.data.data
          })
        }
        if (that.data.aud == 1 && that.data.score != ''){
          if (that.data.score.score_info){

          
          for (var i = 0; i < that.data.score.score_info.length; i++) {
            
              if (that.data.score.score_info[i].child) {
                var cs = "score.score_info[" + i + "].child_fold"
                that.setData({
                  [cs]: true
                })
              }
              else {
                var cs = "score.score_info[" + i + "].child_fold"
                that.setData({
                  [cs]: 'null'
                })
              }
          }
          }
        }

        if (that.data.score != '') {
          that.setData({
            position:Math.abs(that.data.score.position_change),
            score_change: Math.abs(that.data.score.score_change)
          })
        }
        
        
        if(that.data.score != ''){
          var newdata=[];
          var cdata=[];
          if(that.data.score.score_data.length>5){
            newdata=that.data.score.score_data.slice(that.data.score.score_data.length-5);
          } else {
            newdata = that.data.score.score_data
          }
          cxnum = []
          for (var i = 0; i < newdata.length; i++) {
            var lastdata;
            if(that.data.aud==0){
              lastdata=parseInt(newdata[i].sl_marks) + parseInt(newdata[i].xc_marks);
            }else if(that.data.aud==1){
              lastdata=parseInt(newdata[i].xc_marks);
            }else{
              lastdata=parseInt(newdata[i].sl_marks);
            }
          
            if(((newdata[i].scores/(lastdata*1.0))*100)>100){
              that.data.num.push(100)
            }else{
              that.data.num.push((newdata[i].scores/(lastdata*1.0))*100)
            }
            cxnum.push(newdata[i].scores);
            that.data.x_name.push(newdata[i].mock_name)
            // that.setData({
            //   num: num,
            //   x_name: x_name
            // })
            that.setData({
              num: that.data.num,
              x_name: that.data.x_name
            })
          }
          this.echartsComponnet = this.selectComponent('#mychart-dom-line');
          that.init_one(that.data.x_name, that.data.num)
        } else {
      
        }
        

        console.log("总成绩获取成功")
      }


    })
  },
  
 




  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // this.echartsComponnet = this.selectComponent('#mychart-dom-line');
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // this.echartsComponnet = this.selectComponent('#mychart-dom-line');
  },

  aud_select: function (e) {
    let that = this
    var aud = e.currentTarget.dataset.aud
    that.setData({
      last_num: that.data.num,
      last_name: that.data.x_name
    })
    that.setData({
      aud: aud,
      num:[],
      x_name:[]
    })
    
    
    that.echartsComponnet = that.selectComponent('#mychart-dom-line');
    that.getOneOption();

    
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


  // -----------------------------------------私有方法------------------------------------
  /**
   * 获取页面辅助尺寸
  */
  getPageSize: function() {
    let systemInfo = wx.getSystemInfoSync()
    let menuBounding = wx.getMenuButtonBoundingClientRect()
    let naviHeight = menuBounding.bottom + 10
    let statusBarHeight = systemInfo.statusBarHeight
    let safeareaBottom = systemInfo.screenHeight - systemInfo.safeArea.bottom
    console.log("屏幕高度:"+systemInfo.screenHeight+"  safearea底部:"+systemInfo.safeArea.bottom)
    this.setData({
      pageSize: {
        naviHeight: naviHeight,
        statusBarHeight: statusBarHeight,
        naviContentHeight: naviHeight - statusBarHeight,
        safeareaBottom: safeareaBottom,
        screenWidth: systemInfo.screenWidth,
      }
    })
  },
})