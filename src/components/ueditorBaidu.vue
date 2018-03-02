<template>
  <script  ref="editor" type="text/plain"></script>
</template>

<script>
  /* eslint-disable */
  import '../../static/ueditor/ueditor.config.js'
  import '../../static/ueditor/ueditor.all.js'
  import '../../static/ueditor/lang/zh-cn/zh-cn.js'
  export default {
    name:"ueditor",
    data() {
      return {
        id:'ueditorId'+Math.random().toString(16).substring(2) ,
        editor:null
      };
    },
    props: {
      value: {
        type: String,
        default: null,
      },
      config: {
        type: Object,
        default: function(){
          return {
            autoHeightEnabled: false,
            autoFloatEnabled: true,
            initialContent: "",
            autoClearinitialContent: true,
            initialFrameWidth: null,
            initialFrameHeight: 450,
            BaseUrl: "",
            UEDITOR_HOME_URL: "static/ueditor/"
          }
        },
      }
    },
    watch: {
    },
    mounted() {
    // console.log('挂在编辑器')
      this.$nextTick(function f1() {
        console.log(123)
        // 保证 this.$el 已经插入文档
        this.$refs.editor.id = this.id;
        this.editor= UE.getEditor(this.id, this.config);
        this.editor.ready(function f2() {
          console.log('ready')
        }.bind(this));
      });
    },
    methods: {
      getUEContent: function () {
        return this.editor.getContent();
      },
      setUEContent: function (data) {

        console.log(123456789)
        // this.editor.setContent(data, false);
        this.editor.ready(function f2() {
          console.log('ready')
          // this.editor.setContent('<p>添加问题之类的手段ad的撒的</p>', false);
          this.editor.setContent('<p>'+data+'</p>', false);
        }.bind(this));
      },
      destroyUE(){
        // this.editor1.destroy();
      }
    }
  }
</script>

<style>
</style>