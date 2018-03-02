<template>
  <div class="fillcontain">
    <div class="table_containers pageContent MProduct-content">
      <div class='tools'>
       <el-button type="text" icon='el-icon-search' @click="queryDialogFormVisible = true">查询</el-button>
        <el-button v-if='showBtn("user:save")' type="text" icon='el-icon-plus' @click="addDialogFormVisible = true">新增</el-button>  
        <el-button v-if='showBtn("user:password")' type="text" icon="el-icon-refresh"  @click="resetPSD">密码重置</el-button>  
      </div>
      <div class="list">用户列表</div>
      <el-table :data="tableData" highlight-current-row style="width: 100%" class="table-lr-border" @selection-change="handleSelectionChange">
        <el-table-column align='center' header-align="center" type="selection" min-width="50"></el-table-column>
        <el-table-column align='center' header-align="center" property="loginName" label="登录名"></el-table-column>
        <el-table-column align='center' header-align="center" property="name" label="用户名"></el-table-column>
        <el-table-column align='center' header-align="center" property="userState" label="状态"></el-table-column>
        <el-table-column align='center' header-align="center" label="操作">
          <template slot-scope="scope">
            <el-button size="mini" type="text" @click="look(scope.$index,scope.row)">查看</el-button>
            <el-button v-if='showBtn("user:update")' size="mini" type="text" @click="edit(scope.$index,scope.row)">编辑</el-button>
            <el-button v-if='showBtn("user:del")' size="mini" type="text" @click="deleteHand(scope.row.userId)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="Pagination" style="text-align: left;margin-top: 10px;">
        <el-pagination 
        @size-change="handleSizeChange" 
        @current-change="handleCurrentChange" 
        :current-page="1" 
        :page-sizes="pageChange" 
        :page-size="pageSize" 
        layout="total, sizes, prev, pager, next, jumper" 
        :total="count">
        </el-pagination>
      </div>
      <el-dialog title="查询" :visible.sync="queryDialogFormVisible" :beforeClose="resetQuery" :closeOnClickModal="false">
        <el-form :inline="true" :model="queryForm.param" ref="queryRuleForm">
          <el-form-item label="登录名" prop="loginName" :label-width="formLabelWidth">
            <el-input v-model="queryForm.param.loginName" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="用户名" prop="name" :label-width="formLabelWidth">
            <el-input v-model="queryForm.param.name" auto-complete="off"></el-input>
          </el-form-item>

          <el-form-item label="状态" prop="userState" :label-width="formLabelWidth">
            <el-select v-model="queryForm.param.userState" placeholder="请选择状态">
              <el-option label="启用" value="ENABLE"></el-option>
              <el-option label="禁用" value="DISABLE"></el-option>
              <el-option label="所有" value=""></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="resetQuery">取 消</el-button>
          <el-button type="primary" @click="query">确 定</el-button>
        </div>
      </el-dialog>
      <el-dialog title="新增" :visible.sync="addDialogFormVisible" :beforeClose="resetAdd" :closeOnClickModal="false">
        <el-form :model="addForm" :inline="true" :rules="rules" ref="addRuleForm">
          <el-form-item label="登录名" prop="loginName" :label-width="formLabelWidth">
            <el-input v-model="addForm.loginName" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="用户名" prop="name" :label-width="formLabelWidth">
            <el-input v-model="addForm.name" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="状态" prop="userState" :label-width="formLabelWidth">
            <el-select v-model="addForm.userState">
              <el-option label="启用" value="ENABLE"></el-option>
              <el-option label="禁用" value="DISABLE"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="resetAdd">取 消</el-button>
          <el-button type="primary" @click="toAddForm('addRuleForm')">确 定</el-button>
        </div>
      </el-dialog>
      <el-dialog title="查看" :visible.sync="lookDialogFormVisible" :closeOnClickModal="false">
        <el-form :inline="true">
          <el-form-item label="登录名" :label-width="formLabelWidth">
            <el-input v-model="lookForm.loginName" auto-complete="off" disabled></el-input>
          </el-form-item>
          <el-form-item label="用户名" :label-width="formLabelWidth">
            <el-input v-model="lookForm.name" auto-complete="off" disabled></el-input>
          </el-form-item>
          <el-form-item label="状态" :label-width="formLabelWidth">
            <el-select v-model="lookForm.userState" placeholder="请选择状态" disabled>
              <el-option label="启用" value="ENABLE"></el-option>
              <el-option label="禁用" value="DISABLE"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="lookDialogFormVisible = false">关 闭</el-button>
        </div>
      </el-dialog>
      <el-dialog title="编辑" :visible.sync="editDialogFormVisible" :closeOnClickModal="false" :beforeClose="editDialgOff">
        <el-form :model="editForm" :inline="true" :rules="editrules" ref="editRuleForm">
          <el-form-item label="登录名" :label-width="formLabelWidth" prop="loginName">
            <el-input v-model="editForm.loginName" auto-complete="off" ></el-input> 
          </el-form-item>
          <el-form-item label="用户名" :label-width="formLabelWidth" prop="name">
            <el-input v-model="editForm.name" auto-complete="off" ></el-input>
          </el-form-item>
          <el-form-item label="状态" :label-width="formLabelWidth">
            <el-select v-model="editForm.userState" placeholder="请选择状态" >
              <el-option label="启用" value="ENABLE"></el-option>
              <el-option label="禁用" value="DISABLE"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="editDialgOff">取 消</el-button>
          <el-button type="primary" @click="editDialgOn">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import {   } from "@/api/getData";
import { validate } from '@/config/validation'
import { hasRights } from '@/config/rightControl'

export default {
  data() {
    return {
      isActived :false,
      tableData: [],
      editrules: {
        loginName: [
          { required: true, message: "登录名不能为空", trigger: "blur" },
          { min: 5, max: 30, message: "长度在 5 到 30 个字符", trigger: "blur" }
        ],
        name: [
          { required: true, message: "用户名不能为空", trigger: "blur" },
          { min: 3, max: 30, message: "长度在 3 到 30 个字符", trigger: "blur" }
        ]
      },
      rules: {
        agentNumber: [
          { required: true, message: "输入内容不能为空", trigger: "blur" },
          { min: 5, max: 30, message: "长度在 5 到 30 个字符", trigger: "blur" }
        ],
        nickName: [
          { required: true, message: "输入内容不能为空", trigger: "blur" },
          { min: 5, max: 30, message: "长度在 5 到 30 个字符", trigger: "blur" }
        ],
        loginName: [
          { required: true, message: "输入内容不能为空", trigger: "blur" },
          { min: 5, max: 30, message: "长度在 5 到 30 个字符", trigger: "blur" }
        ],
        name: [
          { required: true, message: "输入内容不能为空", trigger: "blur" },
          { min: 3, max: 30, message: "长度在 3 到 30 个字符", trigger: "blur" }
        ]
      },
      queryForm: {
        pageNum: 1,
        pageSize: 20,
        param: {
          agentNumber: "",
          loginName: "",
          name: "",
          nickName: "",
          mobile: "",
          email: "",
          userState: ""
        }
      },
      addForm: {
        loginName: "",
        agentNumber: "",
        name: "",
        nickName: "",
        gender: "m",
        mobile: "",
        email: "",
        isSys: "y",
        userState: "ENABLE"
      },
      lookForm: {
        loginName: "",
        agentNumber: "",
        name: "",
        nickName: "",
        gender: "",
        mobile: "",
        email: "",
        isSys: "",
        userState: "",
        lastUpdateTime: "",
        lastUpdater: ""
      },
      editForm: {
        userId: "",
        loginName: "",
        agentNumber: "",
        name: "",
        nickName: "",
        gender: "",
        mobile: "",
        email: "",
        isSys: "",
        userState: "",
        lastUpdateTime: "",
        lastUpdater: ""
      },
      formLabelWidth: "100px",
      addDialogFormVisible: false,
      queryDialogFormVisible: false,
      lookDialogFormVisible: false,
      editDialogFormVisible: false,
      currentRow: null,
      offset: 1,
      pageSize: 20,
      pageChange: [20, 30, 50, 100],
      count: 0,
      currentPage: 0,
      multipleSelection:[]
    };
  },
  created() {
  },
  activated () {
  },
  deactivated () {
  },
  methods: {
    showBtn(n){
      return hasRights(n)
    },
    // 添加之后重置
    resetAdd() {
      this.$refs["addRuleForm"].resetFields();
      this.addDialogFormVisible = false;
    },
    // 查询之后重置
    resetQuery() {
      this.$refs["queryRuleForm"].resetFields();
      this.queryDialogFormVisible = false;
    },
    // 添加包括验证
    toAddForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.add();
        } else {
          this.$message("请输入必填项目");
          return false;
        }
      });
    },
    // 查询数据
    query() {
      this.getUsers();
      this.queryDialogFormVisible = false;
    },
    // 添加数据
    async add() {},
    // 查看数据
    look(i,v) {
      this.lookForm = v;
      this.lookDialogFormVisible = true;
    },
    // 分页条目数改变
    handleSizeChange(val) {
      this.pageSize = val;
      this.getUsers();
    },
    // 分页点击某一页
    handleCurrentChange(val) {
      this.queryForm.pageNum = val;
      this.offset = val;
      this.getUsers();
    },
    // 获取用户列表
    async getUsers() {
    },
    async deleteHand(ids) {
      this.$confirm("此操作将永久删除, 是否继续?", "删除", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
            this.$message({
              type: "success",
              message: "删除成功!"
            })
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    edit(index,datas) {
      this.editDialogFormVisible = true;
      let editDatas = JSON.parse(JSON.stringify(datas))
      this.editForm = editDatas;
    },
    editDialgOn() {
      this.$refs["editRuleForm"].validate(valid => {
        if (valid) {
          this.editDialgOns();
        } else {
          return false;
        }
      });
    },
    async editDialgOns() {
      let obj = {
        userId: this.editForm.userId,
        loginName: this.editForm.loginName,
        name: this.editForm.name,
        userState:
          this.editForm.userState == "启用" || this.editForm.userState == "ENABLE"
            ? "ENABLE"
            : "DISABLE"
      }
        this.editDialogFormVisible = false;
        this.getUsers();
    },
    editDialgOff() {
      this.$refs['editRuleForm'].resetFields();
      this.editDialogFormVisible = false;
      // this.getUsers();
    },
    handleSelectionChange(val){
      // console.log(val)
      this.multipleSelection=[]
      val.forEach((item,index)=>{
        this.multipleSelection.push(item.userId)
      }) 
      // console.log(this.multipleSelection)
    },
    resetPSD(){
      if (this.multipleSelection.length === 0) {
        this.$message.error('请先选择需要重置密码的列表项！')
        return
      }
      this.$confirm('此操作将重置密码, 是否继续?', '重置', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try{
          this.$message({
            type: 'success',
            message: '重置成功!'
          }) 
          this.getUsers();
        }catch(err){
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        });
      });
    }
  }
};
</script>

<style lang="less" scope>
.el-row {
  &:last-child {
    margin-bottom: 0;
  }
}

.el-select .el-input {
  width: 176px;
}
</style>

