// pages/stu-record/stu-record.js
import * as echarts from '../../ec-canvas/echarts';
const app = getApp()

var dataList = [];
var k = 0;
var Chart = null;


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
    hh: [80, 115, 90, 95, 83]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    this.echartsComponnet = this.selectComponent('#mychart-dom-line');
    this.getData(); //获取数据

    


    var params = {
      "token": wx.getStorageSync("token"),
      "uid": wx.getStorageSync("uid"),
      "sid":1,
      "type": 1    //type->1是总分 2是行测分数 3是申论分数
    }
    console.log(params)
    app.ljjw.jwGetStudentSortScore(params).then(d => {
      console.log(d)
      if (d.data.status == 1) {
        console.log(d.data.data)
        that.setData({
          score: d.data.data
        })
        
        console.log("总成绩获取成功")
      }


    })
  },

  getData: function () {
  	/**
  	 * 此处的操作：
  	 * 获取数据json
  	 */
    dataList = [80, 115, 90, 95, 83]
    // if (k % 2) {
    //   dataList = [1, 2, 3, 4, 5, 6];
    // } else {
    //   dataList = [7, 6, 9, 2, 5, 6];
    // }
    // k++;
    //如果是第一次绘制
    if (!Chart) {
      this.init_echarts(); //初始化图表
    } else {
      this.setOption(Chart); //更新数据
    }
    /*  wx.request({
        url: url, //仅为示例，并非真实的接口地址
        data: data,
        method: 'POST',
        header: { 'content-type': 'application/x-www-form-urlencoded' },
        success: (res) => {
          dataList = res.data;
          this.init_echarts();//初始化图表
        }
      });  */
  },
  //初始化图表
  init_echarts: function () {
    this.echartsComponnet.init((canvas, width, height) => {
      // 初始化图表
      Chart = echarts.init(canvas, null, {
        width: width,
        height: height
      });
      // Chart.setOption(this.getOption());
      this.setOption(Chart);
      // 注意这里一定要返回 chart 实例，否则会影响事件处理等
      return Chart;
    });
  },
  setOption: function (Chart) {
    Chart.clear();  // 清除
    Chart.setOption(this.getOption());  //获取新数据
  },
  getOption: function () {
    // 指定图表的配置项和数据
    var option = {
      color: ["#37A2DA", "#67E0E3", "#9FE6B8"],
      // legend: {
      //   data: ['A', 'B', 'C'],
      //   top: 50,
      //   left: 'center',
      //   backgroundColor: 'red',
      //   z: 100
      // },
      grid: {
        containLabel: true
      },
      tooltip: {
        show: true,
        trigger: 'axis'
      },
      xAxis: {
        axisLabel: {//坐标轴刻度标签的相关设置。
          formatter: function (params) {
            var newParamsName = "";// 最终拼接成的字符串
            var paramsNameNumber = params.length;// 实际标签的个数
            var provideNumber = 3;// 每行能显示的字的个数
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
        data: ['判断推理模拟测试', '判断推理模拟测试', '判断推理模拟测试', '判断推理模拟测试', '判断推理模拟测试'],
        
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
        data: dataList,
        type: 'line'
      }]
    }
    return option;
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

  },

  aud_select: function (e) {
    let that = this
    var aud = e.currentTarget.dataset.aud
    that.setData({
      aud: aud
    })
    var params = {
      "token": wx.getStorageSync("token"),
      "uid": wx.getStorageSync("uid"),
      "sid": 1,
      "type": aud + 1    //type->1是总分 2是行测分数 3是申论分数
    }
    console.log(params)
    app.ljjw.jwGetStudentSortScore(params).then(d => {
      console.log(d)
      if (d.data.status == 1) {
        console.log(d.data.data)
        that.setData({
          score: d.data.data
        })
        console.log("总成绩获取成功")
      }


    })
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