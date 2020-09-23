// components/actionSheet/actionSheet.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    /**
     * 弹框高度 单位rpx
    */
    height:{
      type: Number,
    },
    /**
     * 标题
    */
    title:{
      type: String,
    },
    /**
     * 标题样式，目前仅支持font-size，font-weight，color
    */
    titleStyle: {
      type: String,
    },
    /**
     * 标题高度 单位rpx 默认115
    */
    titleHeight: {
      type: Number,
      value: '115'
    },
    /**
     * 选项数组 选项为字符串
    */
    list:{
      type: Array,
      value: []
    },
    /**
     * 1，若选项数组元素为对象，该字段为标题属性名称，
     * 2，若选项数组元素为字符串，则该不传该字段，或传空字符串
    */
    list_key:{
      type: String,
    },
    /**
     * 选项行高 单位rpx 默认100
    */
    lineHeight: {
      type: Number,
      value: '100'
    },
    /**
     * 选项样式 目前仅支持font-size，font-weight，color
    */
    lineContentStyle: {
      type: String,
    }

  },

  /**
   * 组件的初始数据
   */
  data: {
    
  },

  lifetimes: {
    attached: function () {
      console.log("actionSheet组件进入页面节点树")
      this.getSystemSize()
    },
    detached: function () {
      console.log("actionSheet组件实例被从页面节点树移除")
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 获取系统辅助尺寸
    */
    getSystemSize: function() {
      let systemInfo = wx.getSystemInfoSync()
      let screenWidth = systemInfo.screenWidth
      let safeAreaBottom = (systemInfo.screenHeight - systemInfo.safeArea.bottom)*750.0/screenWidth
      let otherHeight = 443
      this.setData({
        // safeArea底部高度
        safeAreaBottom: safeAreaBottom,
        // 弹框高度
        defoultHeight: otherHeight+safeAreaBottom,
        // 除了safeArea底部高度以外的弹框高度
        otherHeight: otherHeight
      })
    },

    /**
     * 选项点击事件
    */
    optionViewClikced: function(e) {
      let index = e.currentTarget.dataset.index
      this.triggerEvent("optionClick", {"index":index})
    },

    /**
     * 关闭弹框
    */
    closeView: function() {
      this.triggerEvent('close')
    },

    /**
     * 弹框点击
    */
    actionSheetClciked: function() {

    }
  }
})
