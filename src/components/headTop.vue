<template>
  <div class="header_container" :class="getColor" v-on:keyup.enter="submit">
    <el-row :gutter="24" style="margin-left:0;">
      <el-col :span="19" style="padding-left:0;">
        <RouteGuidance></RouteGuidance>
      </el-col>
      <el-col :span="5" class='textRight customer' style="padding-right:30px;line-height:50px;">
        <el-dropdown @command="handleCommand" placement='top-start'>
          <span class="el-dropdown-link pointer">  
            <img :src="coustomerImage" height="50" alt="" style='height: 32px;vertical-align: -7px;'>
            <span class='coutomer'> {{coutomer}} </span>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item style="font-size:14px;" command="singout">退出</el-dropdown-item>
            <el-dropdown-item style="font-size:14px;" command="password">修改密码</el-dropdown-item>
            <el-dropdown-item style="font-size:14px;" command="saveimage">更换头像</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown> 
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { login,loginOut } from "@/api/getData";
import { mapActions, mapState } from 'vuex'
import RouteGuidance from '@/components/routeGuidance';

export default {
  data() {
    return {
      bcolor:'colorDefault',
      bcolor1:'silver',
      bcolor2:'blue',
      bcolor3:'darkBlue',
      isA: false,
      coutomer:'',
      coustomerImage:require('../assets/img/heads/heads_2.png')

    }
  },
  created() {
    this.coutomer = JSON.parse(sessionStorage.getItem("userInfo")).name
    let images = sessionStorage.getItem("image")
    if(images){
      this.coustomerImage= require('../assets/img/heads/'+images+'.png')
    }
  },
  computed: {
    // ...mapState(['adminInfo']),
    getColor (){
      return this.$store.state.bgcolor.colorDefaultName
    },
    getImage (){
      return this.$store.state.coustomerImage
    }
  },
  watch: {
    '$route'(to, from) {
    },
    getImage: {
      handler: function (val, oldVal) {
        this.coustomerImage = require('../assets/img/heads/'+val+'.png')
      },
      deep: true
    }
  },
  components: {
    RouteGuidance
  },
  methods: {
    async handleCommand(command) {
      if (command == 'home') {
        this.$router.push('/manage');
      } else if (command == 'singout') {
        this.$router.push('/login')
        sessionStorage.clear()
        const logout = await loginOut()
      }else if (command == 'password') {
        this.$router.push('/password')
      }else if (command == 'saveimage') {
        this.$router.push('/saveimage')
      }
    },
    setColor (command){
      if(command == 0) {
        this.$store.dispatch('setColor',this.bcolor)
      }else if(command == 1) {
        this.$store.dispatch('setColor',this.bcolor1)
      }else if(command == 2) {
        this.$store.dispatch('setColor',this.bcolor2)
      }else if(command == 3) {
        this.$store.dispatch('setColor',this.bcolor3)
      }
    },
    // 实现F11功能
    toggle () {
        this.isA=!this.isA
        if(this.isA == true){
            var docElm = document.documentElement;
            if(docElm.requestFullscreen) {
              docElm.requestFullscreen();
            }
            //FireFox
            else if(docElm.mozRequestFullScreen) {
              docElm.mozRequestFullScreen();
            }

            //Chrome等
            else if(docElm.webkitRequestFullScreen) {
              docElm.webkitRequestFullScreen();
            }

            //IE11
            else if(elem.msRequestFullscreen) {
              elem.msRequestFullscreen();
            }
          }else if( this.isA == false){
            //W3C
            if (document.exitFullscreen) {
              document.exitFullscreen();
            }
            //FireFox
            else if (document.mozCancelFullScreen) {
              document.mozCancelFullScreen();
            }
            //Chrome等
            else if (document.webkitCancelFullScreen) {
              document.webkitCancelFullScreen();
            }
            //IE11
            else if (document.msExitFullscreen) {
              document.msExitFullscreen();
            }
          }
        }
      }
    }
</script>

<style lang="less">
.header_container {
  background-color: #475669;
  height: 50px;
  overflow: hidden;
  //display: flex;
  //justify-content: center;
  //align-items: center;
  .textRight{
    text-align:right;
  }
}
.coutomer{
  font-size: 13px;
  color:#fff;
  margin-right:10px;
}
.avator {
  border-radius: 50%;
  margin-right: 37px;
  margin-top: 18px;
}

.el-dropdown-menu__item {
  text-align: center;
}

.el-icon-dt-usered {
  color: #fff;
  cursor: pointer;
  font-size: 24px;
  padding-top: 16px;
}
.el-icon-dt-z-clothes {
  color: #fff;
  cursor: pointer;
  font-size: 24px;
  padding-top: 16px;
  margin-right:10px;
}
.el-icon-dt-msnui-fullscreen,.el-icon-dt-tuichuquanping-copy,.el-icon-dt-quanping{
  color: #fff;
  cursor: pointer;
  font-size: 24px;
  margin-right:10px;
}
.el-icon-view {
  color: #fff;
  font-size: 24px;
  padding-right:10px;
}
.customer{
  img{
    vertical-align:middle;
  }
}
</style>
