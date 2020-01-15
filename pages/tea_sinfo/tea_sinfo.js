// pages/tea_sinfo/tea_sinfo.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
  isActive: null,

  listMain: [
    { id: "1", region: "A", items: [{ id: "..", name: "阿明" }, { id: "..", name: "阿乐" }, { id: "..", name: "奥特曼" }, { id: "..", name: "安庆" }] }, 
    { id: "2", region: "B", items: [{ id: "..", name: "爸爸" }, { id: "..", name: "八仔" }] }, 
    { id: "3", region: "C", items: [{ id: "..", name: "车仔面" }, { id: "..", name: "吃货" }, { id: "..", name: "蠢货" }] }, 
    { id: "4", region: "D", items: [{ id: "..", name: "担担面" }, { id: "..", name: "刀仔" }, { id: "..", name: "兑兑" }] }, 
    { id: "5", region: "E", items: [{ id: "..", name: "担担面" }, { id: "..", name: "刀" }, { id: "..", name: "对对" }] }, 
    { id: "6", region: "F", items: [{ id: "..", name: "冯洁" }, { id: "..", name: "峰仔" }, { id: "..", name: "凤姐" }] },],
  toView: 'inTo0',
  oHeight: [],
  scroolHeight: 0,
  

  },

  //点击右侧字母导航定位触发
  scrollToViewFn: function (e) {
    var that = this;
    var _id = e.target.dataset.id;
    for (var i = 0; i < that.data.listMain.length; ++i) {
      if (that.data.listMain[i].id === _id) {
        that.setData({
          isActive: _id,
          toView: 'inToView' + _id
        })
        break
      }
    }
  },
  // 页面滑动时触发
  onPageScroll: function (e) {
    this.setData({
      scroolHeight: e.detail.scrollTop
    });
    for (let i in this.data.oHeight) {
      if (e.detail.scrollTop < this.data.oHeight[i].height) {
        this.setData({
          isActive: this.data.oHeight[i].key,
          fixedTitle: this.data.oHeight[i].name
        });
        return false;
      }
    }
  },
  // 处理数据格式，及获取分组高度
  getBrands: function () {
    var that = this;
    wx.request({
      url: '获取数据地址',
      success(res) {
        if (res.data.status == 0) {
          var someTtitle = null;
          var someArr = [];
          for (var i = 0; i < res.data.data.length; i++) {
            var newBrands = { brandId: res.data.data[i].brandId, name: res.data.data[i].brandName };
            if (res.data.data[i].initial != someTtitle) {
              someTtitle = res.data.data[i].initial
              var newObj = {
                id: i,
                region: someTtitle,
                brands: []
              };
              someArr.push(newObj)
            }
            newObj.brands.push(newBrands);

          };
          //赋值给列表值
          that.setData({
            listMain: someArr
          });
          //赋值给当前高亮的isActive
          that.setData({
            isActive: that.data.listMain[0].id,
            fixedTitle: that.data.listMain[0].region
          });

          //计算分组高度,wx.createSelectotQuery()获取节点信息
          var number = 0;
          for (let i = 0; i < that.data.listMain.length; ++i) {
            wx.createSelectorQuery().select('#inToView' + that.data.listMain[i].id).boundingClientRect(function (rect) {
              number = rect.height + number;
              var newArry = [{ 'height': number, 'key': rect.dataset.id, "name": that.data.listMain[i].region }]
              that.setData({
                oHeight: that.data.oHeight.concat(newArry)
              })

            }).exec();
          };

        }
      }
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that = this;

    that.getBrands();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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