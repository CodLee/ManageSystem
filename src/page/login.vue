<template>
  <div class="login_page fillcontain">


    <div class='form_containers'>
       <form class="form" autocomplete="off">
          <p class='shadow' :class='showUser?"active":""'>
            <i class="iconfont el-icon-dt-fl-renyuan"></i>
            <input class="user-ipt" type="text" v-model="loginForm.username" @focus="focusUser"  autocomplete="off">
          </p>
          <p class='shadow' :class='!showUser?"active":""'>
            <i class="iconfont el-icon-dt-suodinglocked35"></i>
            <input class="user-ipt" type="password" v-model="loginForm.password" @focus="focusUsers" autocomplete="off">
          </p>
           <p class='btn'>
              <el-button type="primary" @click="enter" class='login'>登录</el-button>
              <el-button type="primary" @click="reset" class='reset'>重置</el-button>
           </p>
        </form>
    </div>


   <!--  <transition name="form-fade" mode="in-out">
      <div>
        <div class="name-container">
          <img src="../assets/img/projectName.png" alt="">
        </div>
        <div class="form-container">
          <img src="../assets/img/login@2x.png" alt="">
          <form class="form" autocomplete="off">
            <img v-show="showUser" class="user" src="../assets/img/uaerName.png" alt="">
            <img v-show="!showUser" class="user-empty" src="../assets/img/loginBtn-empty.png" alt="">
            <input class="user-ipt" type="text" v-model="loginForm.username" @focus="focusUser" @blur="blurUser" autocomplete="off">
            <img v-show="showPsd" class="password" src="../assets/img/password.png" alt="">
            <img v-show="!showPsd" class="password-empty" src="../assets/img/loginBtn-empty.png" alt="">
            <input class="password-ipt" type="password" v-model="loginForm.password" @focus="focusPsd" @blur="blurPsd" autocomplete="off">
            <img class="sbmt" src="../assets/img/submmit@2x.png" @click="enter" alt="">
          </form>
        </div>
      </div>
    </transition> -->
  </div>
</template>

<script>
import { login,loginOut } from "@/api/getData";
import { verificationEN215 } from "@/config/mUtils";
import { getAuthSet } from "@/config/rightControl";
import { isNotEmpty } from "@/config/objectUtils";

export default {
  data() {
    return {
      loginForm: {
        username: "",
        password: ""
      },
      rules: {
        username: [
          { required: true, message: "用户名不能为空", trigger: "blur" },
          { validator: verificationEN215, trigger: "blur" }
        ],
        password: [{ required: true, message: "密码不能为空", trigger: "blur" }]
      },
      showUser: true,
      showPsd: true
    };
  },
  directives: {
    focus: {
      // 当绑定元素插入到 DOM 中。
      inserted: function (el) {
        // 聚焦元素
        el.focus()
      }
    }
  },
  methods: {
    async enter() {
        const res = await login({
          loginName: this.loginForm.username,
          password: this.loginForm.password
        })
        if(res){
          let authSet = JSON.stringify(res.authSet)
          sessionStorage.setItem("userID", res.userId)
          sessionStorage.setItem("image", res.image)
          sessionStorage.setItem("userInfo", JSON.stringify({userId:res.userId,name:res.name}))
          sessionStorage.setItem("authSet", JSON.stringify(res.authSet))
          sessionStorage.setItem("groups", JSON.stringify(res.groups))
          // getAuthSet()

        }
          this.$router.push("/index")
    },
    focusUser() {
      this.showUser = true
    },
    focusUsers() {
      this.showUser = false
    },
    reset(){
      this.loginForm.username=''
      this.loginForm.password=''
    }
  }
};
</script>

<style lang="less" scoped>
@import "../style/mixin";
.login_page {
  height: 100%;
  background-color: #324057;
  //background-image: url(../assets/img/loginBg.png);
  background-image: url(../assets/img/login.jpg);
  background-repeat: no-repeat;
  background-attachment: fixed;
  background-size: 100% 100%;
  background-position: center;
  position: relative;
    .form_containers{
        position: absolute;
        right:50px;
        top:0;
        height:100%;
        width:347px;
        background-image: url(../assets/img/loginForm1.png);
        background-repeat: no-repeat;
        background-size: 100% 100%;
        .form{
          height:300px;
          width:250px;
          position: absolute;
          left: 50%;
          top:50%;
          transform:translate(-50%,0);
          margin:0 auto;
          p{
            text-align: center;
            margin-top:5px;
            .iconfont{
              color:#fff;
              font-size: 14px;
            }
            input{
              width:200px;
              height:30px;
              line-height: 30px;
              border: 0 none;
              background-color:transparent;
            }
          }
          p.shadow{
            box-shadow: 0px 1px 0px #1a785e;

          }
          p.shadow.active{
            box-shadow: 0px 1px 0px #9eeec5;

          }
          p.btn{

            margin-top:30px;
            .login{
              width:78px;
              background-color:#fceb53;
              border-color:#fceb53;
              color:#34733a;
            }
            .reset{
              width:78px;
              background-color:transparent;
              border-color:#b2f2d3;
              color:#caf7b8;
            }
          }
        }
    }
  
}
</style>
