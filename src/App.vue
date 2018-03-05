<template>
    <div id="app" class="fillcontain">
        <div :class="getColor" id="fillcontain">
            <router-view></router-view>
        </div>
    </div>
</template>

<script>
  export default {
    computed:{
      getColor (){
        return this.$store.state.bgcolor.colorDefaultName
      }
    }
  }
</script>

<style lang="less">
@import "./style/mixin";
@import "./style/main.css";
@import "./style/main.less";
@import './style/common';
#fillcontain{
  width:100%;
  height:100%;
}
</style>