<template>
  <div class="tabsView">
    <!-- <transition-group name="list" class='tabList'>
    </transition-group> -->
      <el-tag v-for="(item,index) in list" :class="curTab==index?'':'el-tag--gray'" :key="index">
        <span>{{item.meta.links[item.meta.links.length-1]}} <span v-if='item.meta.productName'>{{ item.meta.productName}}</span></span>
        <i class="el-icon-close" @click.stop="close(index)"></i>
        <span class="test" @click='show(index)'></span>
      </el-tag>
  </div>
</template>
<script>
import { clone } from "@/config/mUtils";
export default {
  data() {
    return {
      list: [],
      curTab: 0,
      cpName:''
    }
  },
  created(){
    // if(this.$route.meta.links){
    //   this.list.push(this.$route)
    // }
    // if(/isTab/.test(this.$route.name)&&!/isTabCP/.test(this.$route.name)){
    //   this.list.push(this.$route)
    //   // this.list.push('/home')
    //   return
    // }else{
    //   return
    // }
      this.$router.push({ path: '/home' })

    
  },
  watch: {
    $route(to, from) {
      let productName= this.$store.state.productName
      if (/isTab/.test(to.name)) {
        for (let i = 0; i < this.list.length; i++) {
          if (to.path == this.list[i].path) {
            for (var j = 0; j < this.list.length; j++) {
              if(to.fullPath==this.list[j].fullPath){
                this.curTab = j
                return
              }
            }
            if(/isTabCP/.test(to.name)){
              // let newTos = clone(to)
              // newTo.meta.productName = productName
              let newTo={
                fullPath:to.fullPath,
                hash:to.hash,
                matched:to.matched,
                meta:{
                  keepAlive:to.meta.keepAlive,
                  links:to.meta.links,
                  productName:productName
                },
                name:to.name,
                params:to.params,
                query:to.query,
                path:to.path
              }

              // let newTo = this.cloneObj(to)
              this.list.push(newTo)
              this.curTab = this.list.length - 1 
              if (this.list.length > 5) {
                this.list.shift()
                this.curTab = this.list.length - 1
              }
              return
            }
            this.list[i] = to
            this.curTab = i
            return
          }
        }

        if(/isTabCP/.test(to.name)){
            let newTo={
                fullPath:to.fullPath,
                hash:to.hash,
                matched:to.matched,
                meta:{
                  keepAlive:to.meta.keepAlive,
                  links:to.meta.links,
                  productName:productName
                },
                name:to.name,
                params:to.params,
                query:to.query,
                path:to.path
              }

          // let newTo = this.cloneObj(to)
          // newTo.meta.productName = productName

          this.list.push(newTo)
          this.curTab = this.list.length - 1
          if (this.list.length > 5) {
            this.list.shift()
            this.curTab = this.list.length - 1
          }
          return
        }
        this.list.push(to)
        this.curTab = this.list.length - 1
        if (this.list.length > 5) {
          this.list.shift()
          this.curTab = this.list.length - 1
        }
      }

    }
  },
  methods: {
    show(index) {
      this.$store.commit('slideMenu',false)
      // console.log(this.$store.state.slideMenu)
      // this.$store.commit('getCurRoute', this.list[index].path.slice(1))
      this.$router.push({ path: this.list[index].fullPath })

    },
    close(index) {
      this.list.splice(index, 1)
      if (this.list.length == 0) {
        this.$router.push('/home')
      } else {
        console.log(this.list)
        this.$router.push(this.list[this.list.length - 1].fullPath)
      }
    },
    cloneObj(to){
      let productName= this.$store.state.productName
      return {
            fullPath:to.fullPath,
            hash:to.hash,
            matched:to.matched,
            meta:{
              keepAlive:to.meta.keepAlive,
              links:to.meta.links,
              productName:productName
            },
            name:to.name,
            params:to.params,
            query:to.query,
            path:to.path
          }
    }
  }
}
</script>
<style lang="less" type="text/less">
.tabsView {
  //display: inline-block;
  //.tabList 
  .el-tag {
    position: relative;
    padding-right: 20px;
    height: 26px;
    line-height: 26px;
    background: #fff;
    margin-right: 8px;
    cursor: pointer;
    position: relative;
    .el-icon-close {
      position: absolute;
      right: 0px;
      top: 4px;
    }
  }

  .el-tag--gray {

    background-color: rgba(64, 158, 255, .1);
  }

  .list-enter-active {
    transition: transform .3s;
  }

  .list-enter,
  .list-leave-to {
    transform: rotate3d(0, 1, 0, 60deg);
  }

  .test {
    position: absolute;
    left: 0;
    top: 0;
    width: 75%;
    height: 100%;
    opacity: 0;
  }
}
</style>
