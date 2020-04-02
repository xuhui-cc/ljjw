// pages/stu-record/stu-record.js
import * as echarts from '../../ec-canvas/echarts';
const app = getApp()

// var dataList = [];
// var x_name = []
// var k = 0;
// var Chart = null;

function setOption(chart, xdata, ydata) {
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
      
    },
    tooltip: {
      show: true,
      trigger: 'axis',
      
      
    },
    
    xAxis: {
      
      axisLabel: {//坐标轴刻度标签的相关设置。
        nameLocation: 'end',//坐标轴名称显示位置。
        axisLabel: {//坐标轴刻度标签的相关设置。
          interval: 0,
          rotate: "45"
        }
        // formatter: function (params) {
        //   var newParamsName = "";// 最终拼接成的字符串
        //   var paramsNameNumber = params.length;// 实际标签的个数
        //   var provideNumber = 3;// 每行能显示的字的个数
        //   var rowNumber = Math.ceil(paramsNameNumber / provideNumber);
        //   /**
        //                            * 判断标签的个数是否大于规定的个数， 如果大于，则进行换行处理 如果不大于，即等于或小于，就返回原标签
        //                             */
        //   // 条件等同于rowNumber>1
        //   if (paramsNameNumber > provideNumber) {
        //     /** 循环每一行,p表示行 */
        //     for (var p = 0; p < rowNumber; p++) {
        //       var tempStr = "";// 表示每一次截取的字符串
        //       var start = p * provideNumber;// 开始截取的位置
        //       var end = start + provideNumber;// 结束截取的位置
        //       // 此处特殊处理最后一行的索引值
        //       if (p == rowNumber - 1) {
        //         // 最后一次不换行
        //         tempStr = params.substring(start, paramsNameNumber);

        //       } else {
        //         // 每一次拼接字符串并换行
        //         tempStr = params.substring(start, end) + "\n";

        //       }
        //       newParamsName += tempStr;// 最终拼成的字符串

        //     }
        //   } else {
        //     // 将旧标签的值赋给新标签
        //     newParamsName = params;
        //   }
        //   //将最终的字符串返回
        //   return newParamsName

        // }
      },
      
      data: xdata
      
      // data: ["hhh","hhhh","hh"]

    },
    yAxis: {
      x: 'center',
      type: 'value',
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
      // data: [80,50,99],
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
    x_name:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    var sid = options.sid
    console.log(sid)
    that.setData({
      sid:sid
    })
    this.echartsComponnet = this.selectComponent('#mychart-dom-line');
    that.getOneOption();
    


    
  },

  child_fold: function (e) {
    let that = this
    var child_xb = e.currentTarget.dataset.child_xb
    console.log(child_xb)
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
        height: height
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
    console.log(params)
    app.ljjw.jwGetStudentSortScore(params).then(d => {
      console.log(d)
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
          console.log(that.data.position +"=================position")
          console.log(that.data.score_change + "=================score_change")
        }
        
        
        if(that.data.score != ''){
          for (var i = 0; i < that.data.score.score_data.length; i++) {
            that.data.num.push(that.data.score.score_data[i].scores)
            that.data.x_name.push(that.data.score.score_data[i].mock_name)
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
          // that.setData({
          //   num: that.data.last_num,
          //   x_name: that.data.last_name
          // })
          // this.echartsComponnet = this.selectComponent('#mychart-dom-line');
          // that.init_one(that.data.x_name, that.data.num)
        }
        
        // that.getData(); //获取数据
        console.log("总成绩获取成功")
      }


    })
    // wx.request({
    //   url: 'https://xxxxxxx.com',    //你请求数据的接口地址
    //   method: 'POST',
    //   header: {
    //     "Content-Type": "application/json"
    //   },
    //   data: {               //传的参数，这些都不用多说了吧
    //     id: xxxx
    //   },
    //   success: function (res) {
    //     //我这里就假设res.xdata和res.ydata是我们需要的数据，即在x轴和y轴展示的数据，记住一定是数组哦！
    //     _this.init_one(res.xdata, res.ydata)
    //   }
    // })
  },
  
 

  // getData: function () {
  //   let that = this
  // 	/**
  // 	 * 此处的操作：
  // 	 * 获取数据json
  // 	 */
  //   dataList = that.data.num
  //   x_name = that.data.x_name
  //   // if (k % 2) {
  //   //   dataList = [1, 2, 3, 4, 5, 6];
  //   // } else {
  //   //   dataList = [7, 6, 9, 2, 5, 6];
  //   // }
  //   // k++;
  //   //如果是第一次绘制
  //   if (!Chart) {
  //     that.init_echarts(); //初始化图表
  //   } else {
  //     that.setOption(Chart); //更新数据
  //   }
  //   /*  wx.request({
  //       url: url, //仅为示例，并非真实的接口地址
  //       data: data,
  //       method: 'POST',
  //       header: { 'content-type': 'application/x-www-form-urlencoded' },
  //       success: (res) => {
  //         dataList = res.data;
  //         this.init_echarts();//初始化图表
  //       }
  //     });  */
  // },
  //初始化图表
  // init_echarts: function () {
  //   this.echartsComponnet.init((canvas, width, height) => {
  //     // 初始化图表
  //     Chart = echarts.init(canvas, null, {
  //       width: width,
  //       height: height
  //     });
  //     // Chart.setOption(this.getOption());
  //     this.setOption(Chart);
  //     // 注意这里一定要返回 chart 实例，否则会影响事件处理等
  //     return Chart;
  //   });
  // },

  // setOption: function (Chart) {
  //   // Chart = null;
  //   Chart.clear();  // 清除
  //   // console.log(Chart)
  //   Chart.setOption(this.getOption());  //获取新数据
  // },
  // getOption: function () {
  //   // 指定图表的配置项和数据
  //   var option = {
  //     color: ["#37A2DA", "#67E0E3", "#9FE6B8"],
  //     // legend: {
  //     //   data: ['A', 'B', 'C'],
  //     //   top: 50,
  //     //   left: 'center',
  //     //   backgroundColor: 'red',
  //     //   z: 100
  //     // },
  //     grid: {
  //       containLabel: true
  //     },
  //     tooltip: {
  //       show: true,
  //       trigger: 'axis'
  //     },
  //     xAxis: {
  //       axisLabel: {//坐标轴刻度标签的相关设置。
  //         formatter: function (params) {
  //           var newParamsName = "";// 最终拼接成的字符串
  //           var paramsNameNumber = params.length;// 实际标签的个数
  //           var provideNumber = 3;// 每行能显示的字的个数
  //           var rowNumber = Math.ceil(paramsNameNumber / provideNumber);
  //           /**
  //                                    * 判断标签的个数是否大于规定的个数， 如果大于，则进行换行处理 如果不大于，即等于或小于，就返回原标签
  //                                     */
  //           // 条件等同于rowNumber>1
  //           if (paramsNameNumber > provideNumber) {
  //             /** 循环每一行,p表示行 */
  //             for (var p = 0; p < rowNumber; p++) {
  //               var tempStr = "";// 表示每一次截取的字符串
  //               var start = p * provideNumber;// 开始截取的位置
  //               var end = start + provideNumber;// 结束截取的位置
  //               // 此处特殊处理最后一行的索引值
  //               if (p == rowNumber - 1) {
  //                 // 最后一次不换行
  //                 tempStr = params.substring(start, paramsNameNumber);

  //               } else {
  //                 // 每一次拼接字符串并换行
  //                 tempStr = params.substring(start, end) + "\n";

  //               }
  //               newParamsName += tempStr;// 最终拼成的字符串

  //             }
  //           } else {
  //             // 将旧标签的值赋给新标签
  //             newParamsName = params;
  //           }
  //           //将最终的字符串返回
  //           return newParamsName

  //         }
  //       },
  //       data: x_name
        
  //     },
  //     yAxis: {
  //       x: 'center',
  //       type: 'value',
  //       splitLine: {
  //         lineStyle: {
  //           type: 'dashed'
  //         }
  //       }
  //       // show: false
  //     },
  //     series: [{
  //       data: dataList,
  //       type: 'line'
  //     }]
  //   }
  //   return option;
  // },

  


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
    
    console.log(that.data.num,that.data.x_name)
    
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

  }
})