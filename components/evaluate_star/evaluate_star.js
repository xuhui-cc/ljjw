// evaluate_star/evaluate_star.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    // 是否可以选择 0-不可选 1-可选
    canSelect: {
      type: Number,
      value: 1
    },
    // 得分
    score: {
      type: Number,
      value: 0
    },
    // 高
    height: {
      type: String,
      value: '38rpx'
    },
    // 宽
    width: {
      type: String,
      value: '271rpx'
    },

    // 标签
    tag: {
      type: Number,
      value: 0
    },

  },

  /**
   * 组件的初始数据
   */
  data: {
    starDataArray: [
      {
        type: 0, // 0-未选中  1-已选中
      },
      {
        type: 0,
      },
      {
        type: 0,
      },
      {
        type: 0,
      },
      {
        type: 0,
      }
    ]
  },

  observers: {
    'score': function(score) {
      for (var i = 0; i < this.data.starDataArray.length; i++) {
        let starData = this.data.starDataArray[i]
        if (i < score) {
          starData.type = 1
        } else {
          starData.type = 0
        }
      }
      this.setData({
        starDataArray: this.data.starDataArray
      })
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 星星 点击事件
    */
    _starClicked: function (e) {
      // console.log(this.data.canSelect)
      
      if (this.data.canSelect == 0) {
        return
      }
      let index = e.currentTarget.dataset.index
      for (var i = 0; i < this.data.starDataArray.length; i++) {
        let starData = this.data.starDataArray[i]
        if (i <= index) {
          starData.type = 1
        } else {
          starData.type = 0
        }
      }
      this.setData({
        starDataArray: this.data.starDataArray,
      })
      this.triggerEvent('starClicked', {score: index+1, tag: this.data.tag})
    }
  }
})
