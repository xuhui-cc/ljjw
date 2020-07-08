// components/null_image/null_image.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    title:{
      type: String,
      value: '暂无内容'
    },
    /**
     * 1，暂无内容
     * 2，暂无考勤内容
     * 3，暂无课程安排
     * 4，暂无请假内容
     * 5，暂无资料
     * 6，暂无任务内容
     * 7，该班级暂无学员
    */
    type: {
      type: Number,
      value: 1
    },

    z_index: {
      type: Number,
      value: -1
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    srcDic: {
      // 暂无内容
      1: '../../components/null_image/images_null/null_content.png',
      // 暂无考勤内容
      2: '../../components/null_image/images_null/null_checkon.png',
      // 暂无课程安排
      3: '../../components/null_image/images_null/null_class.png',
      // 暂无请假内容
      4: '../../components/null_image/images_null/null_leave.png',
      // 暂无资料
      5: '../../components/null_image/images_null/null_source.png',
      // 暂无任务内容
      6: '../../components/null_image/images_null/null_task.png',
      // 该班级暂无学员
      7: '../../components/null_image/images_null/null_student.png'
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})
