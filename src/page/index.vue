<template>
	<div class="dt-app manage_page fillcontain"> 
    <el-row style="height: 100%;">
      <el-col :class="getColor">
        <el-menu style="min-height: 100%; width:100%;" @select='menuChange'  :default-active="selectIndex" class="el-menu-vertical-demo" :collapse="$store.state.showSidebar" background-color="#1F2D3D" text-color="#fff" :unique-opened=true :router='true'>
          <el-menu-item index="home">
            <i class="iconfont el-icon-dt-fenlei"></i>
            <span  slot="title"  >首页</span>
          </el-menu-item>
          <el-submenu index="1">
              <template slot="title">
                <i class="iconfont el-icon-dt-chanpinguanli"></i>
                <span slot="title">菜单一</span>
              </template>
              <el-menu-item index="menus11">菜单11</el-menu-item>
              <el-menu-item index="menus12">菜单12</el-menu-item>
              <el-menu-item index="menus13">菜单13</el-menu-item>
          </el-submenu>
          <el-menu-item index="menus20">
            <i class="iconfont el-icon-dt-gongsi1"></i>
            <span slot="title">菜单二</span>
          </el-menu-item>
          <el-menu-item index="menus30">
            <i class="iconfont el-icon-dt-gongsi1"></i>
            <span slot="title">菜单三</span>
          </el-menu-item>
          <el-submenu index="3">
            <template slot="title">
              <i class="iconfont el-icon-dt-shezhi"></i>
              <span slot="title">菜单四</span>
            </template> 
              <el-menu-item index="menus41">菜单41</el-menu-item>
              <el-menu-item index="menus42">菜单42</el-menu-item>
              <el-menu-item index="menus43">菜单43</el-menu-item>
          </el-submenu>

          <!-- 动态加载列 -->
          <!-- <div v-for='(items, indexs) in menuListData' :index="items.id" :key="indexs+''">
            <div v-if='!items.groupSort'>
              <el-menu-item :index='items.functions[0].url'>
                <i :class="'iconfont '+iconList[items.groupName]"></i>
                <span :class="'menu-title-name'" slot="title"> {{items.groupName}}</span>
              </el-menu-item>
            </div>
            <div v-if='items.groupSort'>
              <el-submenu :index='indexs+""'>
                <template slot="title">
                  <i :class="'iconfont '+iconList[items.groupName]"></i>
                  <span :class="'menu-title-name'" slot="title"> {{items.groupName}}</span>
                </template>
                <el-menu-item v-for='(item, index) in items.functions' :index="item.url" :key="index+''" class="menu-name-color">{{item.funcLangCode}}</el-menu-item>
              </el-submenu>
            </div>
          </div> -->
        </el-menu>
      </el-col>
      <el-col :class="getTextColor">
        <HeadTop></HeadTop>
        <!-- <div class='tabsViews'>
                <TabsView></TabsView>
              </div> -->
        <keep-alive >
          <router-view  v-if="$route.meta.keepAlive"></router-view>
        </keep-alive>
        <router-view id='mainContent'   v-if="!$route.meta.keepAlive">
          <!-- 这里是不被缓存的视图组件，比如 Edit！ -->
        </router-view>

      </el-col>
    </el-row>
  </div>
</template>

<script>
import HeadTop from '@/components/headTop'
import TabsView from '@/components/tabsView'
export default {
  data() {
    return {
      menus:'',
      menuListData:[],
      iconList: {
        '产品销售管理': 'el-icon-dt-chanpinguanli',
        '组合计划书配置': 'el-icon-dt-jihuashu',
        '营销排序': 'el-icon-dt-gongsi1',
        '热搜词': 'el-icon-dt-1',
        '强烈推荐': 'el-icon-dt-gongsi',
        '示例保费': 'el-icon-dt-bianqianmoshi',
        '标签组管理': 'el-icon-dt-shuju1',
        '销售区域管理': 'el-icon-dt-lbs',
        '系统设置': 'el-icon-dt-shezhi'
      }
    }
  },
  components: {
    HeadTop,
    TabsView
  },
  computed: {
    selectIndex(){
      return this.$route.path.slice(1)
    },
    getColor() {
      if (this.$store.state.showSidebar == true) {
        return "sideBar_show"
      } else {
        return "sideBar"
      }
    },
    getTextColor() {
      if (this.$store.state.showSidebar == true) {
        return "sideBarText_show"
      } else {
        return "sideBarText"
      }
    }
  },
  created() {
    if (sessionStorage.getItem("groups")) {
      this.menus = JSON.parse(sessionStorage.getItem("groups"))
      this.initMenu(this.menus)
    } else {
      this.$message({
        type: 'warning',
        message: '请登录'
      })
      this.$router.push("/login")
    }
  },
  mounted() {
    // this.initMenu(this.menus)
  },
  methods: {
    menuChange(menu){
      this.$store.commit('slideMenu',true)
      // console.log(menu,this.$store.state.slideMenu)
    },
    initMenu(lists) {
      for (var i = 0; i < lists.length; i++) {
        if(!lists[i].groupSort){
          lists[i].groupSort=0
        }
        lists[i].functions.sort(this.sortBy('funcSort'))
      }
      lists.sort(this.sortBy('groupSort'))
      this.menuListData = lists


      // let menuList = [],
      //   menuGroup = {}
      // for (var i = 0; i < lists.length; i++) {
      //   if (lists[i].groupLangCode) {
      //   } else {
      //     lists[i].groupLangCode = lists[i].funcLangCode
      //   }
      // }
      // for (var i = 0; i < lists.length; i++) {
      //   if (lists[i].groupLangCode in menuGroup) {
      //   } else {
      //     if (lists[i].groupLangCode) {
      //       menuGroup[lists[i].groupLangCode] = lists[i].groupLangCode
      //     }
      //     menuList.push({
      //       // id: lists[i].groupLangCode,
      //       id: lists[i].groupName,
      //       type: 'group',
      //       sort: lists[i].groupSort ? lists[i].groupSort : 0,
      //       parentId: '',
      //       childern: []
      //     })
      //   }
      // };
      // // console.log(21,menuList)
      // for (var j = 0; j < menuList.length; j++) {
      //   for (var i = 0; i < lists.length; i++) {
      //     if (menuList[j].id == lists[i].groupLangCode) {
      //       console.log(12345)
      //       menuList[j].childern.push({
      //         id: lists[i].funcLangCode,
      //         type: 'func',
      //         sort: lists[i].funcSort,
      //         url: lists[i].url,
      //         parentId: menuList[j].id,
      //         childern: []
      //       })
      //     }
      //   };
      //   menuList[j].childern.sort(this.sortBy('sort'))
      // };
      // menuList.sort(this.sortBy('sort'))
      // this.menuListData = menuList
      // console.log(12,this.menuListData)
    },
    sortBy(propertyName) {
      return function(object1, object2) {
        var value1 = object1[propertyName];
        var value2 = object2[propertyName];
        if (value1 < value2) {
          return -1;
        } else if (value1 > value2) {
          return 1;
        } else {
          return 0;
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
.manage_page {
  #mainContent{
    margin-top:1px;
  }
  .el-submenu .el-menu-item {
    min-width: 50px;
  }

  .tabsViews {
    background: #fff;
    height: 34px;
    border-bottom: 1px solid #d8dce5;
    -webkit-box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12), 0 0 3px 0 rgba(0, 0, 0, 0.04);
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12), 0 0 3px 0 rgba(0, 0, 0, 0.04);
    padding-left: 20px;
  }
  .sideBar {
    transition: width .33s;
    overflow: hidden;
    width: 14%;
    min-height: 100%;
    background-color: #1F2D3D;
    .el-submenu__icon-arrow {
      right: 12px;
    }
    
    
  }

  .sideBar_show {
    transition: width .3s;
    width: 5%;
    min-height: 100%;
    background-color: #1F2D3D;
    .el-submenu__icon-arrow {
      right: 12px;
    }
    span{
      overflow: hidden;
      display: inline-block;
       opacity: 0;
    }

    .el-submenu__icon-arrow{
      opacity: 0;
    }
    .nav_item {

      overflow: hidden;
      display: inline-block;
    }
    .el-icon-arrow-down:before {
      color: rgb(31, 45, 61);
    }
  }
  .sideBarText {
    transition: width .3s;
    width: 86%;
    height: 100%;
    overflow: auto;
  }
  .sideBarText_show {
    transition: width .3s;
    width: 95%;
    height: 100%;
    overflow: auto;
  }
  .el-menu--collapse {
    width: 100%
  }
  .el-submenu {
    width: 100%;
  }
  .el-menu {
    border-right: none
  }


}
</style>