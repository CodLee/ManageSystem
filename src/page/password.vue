<template>
  <div>
    <section class="password">
    <el-form :model="passwordForm" :rules="rules" ref="ruleForm" label-width="100px">
      <el-form-item label="密码" prop="pass">
        <el-input type="password" v-model="passwordForm.pass" auto-complete="on"></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="checkPass">
        <el-input type="password" v-model="passwordForm.checkPass" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>
    </section>
  </div>
</template>

<script>
import dtime from "time-formater";
import {  } from "@/api/getData";
export default {
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.passwordForm.checkPass !== "") {
          this.$refs.ruleForm.validateField("checkPass");
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.passwordForm.pass) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      passwordForm: {
        pass: "",
        checkPass: ""
      },
      rules: {
        pass: [
          { required: true, message: "输入密码不能为空", trigger: "blur" },
          { validator: validatePass, trigger: "blur" }
        ],
        checkPass: [
          { required: true, message: "输入密码不能为空", trigger: "blur" },
          { validator: validatePass2, trigger: "blur" }
        ]
      },
      userId: sessionStorage.getItem("userID")
    };
  },
  mounted() {},
  computed: {},
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          this.$confirm("确定修改密码吗？修改完需要重新登录！", "修改密码", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }).then(async () => {
            try{
            let resData = await changePsd({
              userId: this.userId,
              password: this.passwordForm.checkPass
            }); 
            this.$message({
                type: "success",
                message: "修改成功!"
            });
            this.$router.push("/");

            }catch(err){

            }
          });
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.$message({
        type: "info",
        message: "已取消修改"
      });
    }
  }
};
</script>

<style lang="less">
.password {
  padding-top: 20px;
  width: 300px;
}
</style>
