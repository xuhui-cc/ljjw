// components/alertView/alertView.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    /**
     * 弹框标题
    */
    title: {
      type: String,
      value: ''
    },
    /**
     * 标题样式 目前仅支持 font-size font-weight font color
    */
    titleStyle: {
      type: String,
    },
    /**
     * 是否展示 textarea
    */
    showTextarea: {
      type: Boolean,
      value: false
    },
    /**
     * textarea 占位符
    */
    placehoulder: {
      type: String,
      value: '请输入...'
    },
    /**
     * textarea 占位符样式
    */
    placehoulderStyle: {  
      type: String,
      value: 'font-size: 28rpx; color:#B4B4B4;'
    },
    /**
     * textarea 是否必填
    */
    textareaImportment: {
      type: String,
      value: true
    },
    /**
     * 确认按钮 标题
    */
    sureButtonTitle: {
      type: String,
      value: '确认'
    },
    /**
     * 确认按钮 样式
    */
    sureButtonStyle: {
      type: String,
    },
    /**
     * 是否展示 取消按钮
    */
    showCancelButton: {
      type: Boolean,
      value: true
    },
    /**
     * 取消按钮 样式
    */
    cancelButtonStyle: {
      type: String,
    },
    /**
     * 取消按钮 标题
    */
    cancelButtonTitle: {
      type:String,
      value: '再想想'
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    // 输入框内容
    textareaValue: '',
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 输入框textarea 内容改变
    */
    alertViewTextareaChange: function(e) {
      let value = e.detail.value
      if (value == ' ') {
        value = ''
      }
      this.setData({
        textareaValue: value
      })
    },

    /**
     * 确认按钮 点击事件
    */
    sureButtonClciked: function() {
      if(this.data.showTextarea && this.data.textareaImportment && this.data.textareaValue == '') {
        wx.showToast({
          title: '请输入内容',
          icon: 'none'
        })
        return
      }
      this.triggerEvent('sure', {content: this.data.textareaValue})
    },

    /**
     * 关闭弹窗
    */
    closeWindow: function() {
      this.triggerEvent('close')
    },

    /**
     * 弹框 点击事件
    */
    alertViewClicked: function() {

    }
  }
})
