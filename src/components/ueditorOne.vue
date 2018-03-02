<template>
  <div>
    <script id="editorOne" type="text/plain"></script>
  </div>
</template>

<script>
import '../../static/ueditor/ueditor.config.js'
import '../../static/ueditor/ueditor.all.js'
import '../../static/ueditor/lang/zh-cn/zh-cn.js'

export default {
  name: "editorOne",
  props: {
  },
  data() {
    return {
      editor1: null,
      config: {
        autoHeightEnabled: false,
        autoFloatEnabled: true,
        initialContent: "123456789",
        autoClearinitialContent: true,
        initialFrameWidth: null,
        initialFrameHeight: 450,
        BaseUrl: "",
        UEDITOR_HOME_URL: "static/ueditor/"
      }
    }
  },
  mounted() {
    console.log('挂在编辑器')

    //初始化UE
    const _this = this;
    this.editor1 = UE.delEditor("editorOne");
    console.log( this.editor1)
    this.editor1 = UE.getEditor('editorOne', this.config)
    this.editor1.ready(function() {
        //设置编辑器的内容
        console.log('数据加载1234')
        _this.editor1.setContent(_this.config.initialContent)
    })
    // console.log(this)
    console.log('数据加载')
  },
  beforeDestroy(){
      this.editor1.destroy();
      this.editor1=null;
      console.log('destroy')
  },
  destoryed() {
    this.editor1.destroy();
  },
  methods: {
    getUEContent: function () {
      return this.editor1.getContent();
    },
    setUEContent: function (data) {
      // this.editor1.setContent('<p>'+data+'</p>', true);
      // this.editor1.setContent('<p>'+data+'</p>', false);
    },
    destroyUE(){
      // this.editor1.destroy();
    }
  }
}
</script>