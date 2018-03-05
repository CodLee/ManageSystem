<template>
  <div class="source">
    <el-row>
      <el-col :span="1" style="margin-top:0px">
        <i id="font-size" :class="toggleClass" class="iconfont el-icon-dt-shousuozhankai top-icon icon-zhankai" @click="toggleClick"></i>
      </el-col>
      <el-col :span="22">
        <TabsView></TabsView>
        <!-- <el-breadcrumb separator="/">
          <el-breadcrumb-item v-for="(item, index) in $route.meta.links" :key="index">{{item}}</el-breadcrumb-item>
        </el-breadcrumb> -->
      </el-col>
    </el-row>
  </div>
</template>

<script>
import TabsView from '../components/tabsView'
export default {
  data() {
    return {
      showSidebar: false
    }
  },
  computed: {
    toggleClass() {
      if (this.showSidebar == false) {
        return "is-active "
      } 
    }
  },
  components: {
    TabsView
  },
  mounted() {
    this.showSidebar = this.$store.state.showSidebar
  },
  methods: {
    toggleClick() {
      if (this.showSidebar == true) {
        this.showSidebar = false
      } else {
        this.showSidebar = true
      }
      this.$store.commit('SETSIDBAR', this.showSidebar)
    }
  }
};
</script>

<style lang="less">
.source {
  //padding: 11px;
  padding:5px 0 5px 20px;
  height:40px;
  line-height:40px;
}

.el-icon-dt-gonggao {
  font-size: 18px;
  color: red;
}

.scroll-wrap {
  height: 18px;
  line-height: 18px;
  text-align: left;
  overflow: hidden;
  font-size: 13px;
}

.scroll-content {
  position: relative;
  transition: 0.5s;
}

.scroll-content li {
  cursor: pointer;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}


.source .icon-zhankai {
  color:#909399;
  cursor: pointer;
  font-size: 32px;
  -webkit-transform: rotate(90deg);
  transform: rotate(90deg);
  -webkit-transition: .38s;
  transition: .38s;
  -webkit-transform-origin: 50% 50%;
  transform-origin: 50% 50%;
}
.source .icon-zhankai:hover {
  color:#ccd3e2;
}

.source .is-active {
  -webkit-transform: rotate(0deg);
  transform: rotate(0deg);
}

#font-size {
  font-size: 20px !important;
}
</style>
