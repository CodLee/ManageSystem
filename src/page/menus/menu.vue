<template>
  <div class="dt-page">
    <div class='dt-top-tools'>
      <el-button @click='queryDialogFormVisible=true' type="text" icon='el-icon-search'>查询</el-button>
      <el-button @click="" type="text" class="iconfont el-icon-dt-upload">上架</el-button>
      <el-button @click="" type="text" class="iconfont el-icon-dt-download">下架</el-button>
    </div>
    <div class="dt-table-title list-title">
      <el-row>
        <el-col :span='5' class='dt-table-titleName'>
          主险列表
        </el-col>
        <el-col :span='19' class='dt-table-titleOptions'>
          <div class='dt-select dt-inline'>
            <span class='dt-select-label'>状态：</span>
            <el-select v-model="queryForm.statu" placeholder="请选择" @change='query' size='mini' class='inline-select' style='margin-right:30px;'>
              <el-option key='1' label="是" value='1'></el-option>
              <el-option key='0' label="否" value='0'></el-option>
              <el-option key="2" label="全部" value="2"></el-option>
            </el-select>
          </div>
          <el-checkbox v-model="queryForm.param" @change="query">是否</el-checkbox>
          <el-checkbox v-model="queryForm.param" @change="query">是否</el-checkbox>
          <el-checkbox v-model="queryForm.param" @change="query">是否</el-checkbox>
        </el-col>
      </el-row>
    </div>
    <el-table :data="tableData" @selection-change="handleSelectionChange" :highlight-current-row="true" border style="width: 100%">
      <el-table-column align='center' type="selection" label="全选/反选"></el-table-column>
      <el-table-column align='center' prop="name" width="220" label="名称">
        <template slot-scope="scope">
          <el-tooltip placement="top">
            <div slot="content">{{scope.row.name}}</div>
            <p>{{scope.row.name}}</p>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column align='center' prop="date" label="日期"></el-table-column>
      <el-table-column align='center' prop="address" label="地址"></el-table-column>
      <el-table-column align='center' width="100" label="选择">
        <template slot-scope="scope">
          <span @click.prevent="switchListShow(scope.row)">
            <el-checkbox v-model="scope.row.isListShow"></el-checkbox>
          </span>
        </template>
      </el-table-column>
      <el-table-column align='center' label="操作">
        <template slot-scope="scope">
          <el-button class="btn-center" type="text" size="mini">查看</el-button>
          <el-button class="btn-center" type="text" size="mini">编辑</el-button>
          <el-button class="btn-center" type="text" size="mini">删除</el-button>
          <el-button class="btn-center" type="text" size="mini">配置</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="dt-pagination" style="text-align: left;margin-top: 10px;">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="initParam.pageNum" :page-sizes="[20, 30, 50, 100]" :page-size="initParam.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
    <el-row class='dt-tree-section tree' :gutter='20'>
      <el-col :span="10" class="dt-tree">
        <el-tree
          :data="treeData"
          :props="defaultProps"
          node-key="id"
          default-expand-all
          show-checkbox
          :expand-on-click-node="false"
          :render-content="renderContent"
          :highlight-current="true"
          @node-click="nodeClick">
        </el-tree>
      </el-col>
      <el-col :span="14" class="tag-list">
        <el-col v-if="selectiveGroupType == 1" :span="24" class="tag">
          <div class="lists">
            <span>已选标签</span>
              <div class="block">
                <!-- <el-button @click="editSelectedTag" type="text" icon='el-icon-edit' size="small">编辑</el-button> -->
                <el-button @click="delSelectedTag" type="text" icon='el-icon-delete' size="small">删除</el-button>
              </div>
          </div>
          <el-checkbox-group v-model="checkSelectedTags">
            <el-checkbox v-for="(item, index) in selectedTags" :key="index" :label="item.labelName" ></el-checkbox>
          </el-checkbox-group>
        </el-col>
        <el-col :span="24" class="tag" :class="{ tag2: selectiveGroupType == 2 || selectiveGroupType == 3 || !selectiveGroupType}">
          <div class="lists">
            <span><span v-if="selectiveGroupType == 1">可选</span>标签</span>
              <div v-if="selectiveGroupType == 1" class="block">
                <el-button @click="addOfTag" type="text" icon='el-icon-plus' size="small">新增</el-button>
                <el-button @click="doOfTag" type="text" icon='el-icon-check' size="small">确定</el-button>
                <el-button @click="editOfTag" type="text" icon='el-icon-edit' size="small">编辑</el-button>
                <el-button @click="delOfTag" type="text" icon='el-icon-delete' size="small">删除</el-button>
              </div> 
              <div v-if="!selectiveGroupType" class="block">
                <el-button @click="delTagSelect" type="text" icon='el-icon-delete' size="small">删除已选</el-button>
                <el-button @click="delTagAll" type="text" icon='el-icon-delete' size="small">全部删除</el-button>
              </div>
          </div>
          <el-checkbox-group v-model="checkSelectiveTags" v-if='selectiveGroupType == 1?true:false'>
            <el-checkbox v-for="(item, index) in selectiveTags" :key="index" :label="item.labelName"></el-checkbox>
          </el-checkbox-group>
          <div  v-if='!selectiveGroupType||selectiveGroupType == 1?false:true' class='taglists'>
            <span v-for="(item, index) in selectiveTags" :key="index">
              {{item.labelName}}
            </span>
          </div>
          <div  v-if='!selectiveGroupType ' class='taglists'>
            <span v-for="(item, index) in selectiveTags" :key="index" @click='selectItem(item.id,index)' :class='{active:item.active}'>
              <i class="el-icon-error del" @click='delTagOne(item.id,$event)'></i>
              <i class="el-icon-success select"></i>
              {{item.labelName}}
            </span>
          </div>
        </el-col>
      </el-col>    
    </el-row>


    <!-- 查询弹窗 -->
    <el-dialog title="标题" :visible.sync="queryDialogFormVisible" :beforeClose="resetQuery" :closeOnClickModal="false" class='dt-dialog'>
      <el-form :inline="true" :model="initParam" ref="queryRuleForm">
        <el-form-item label="名称" prop="name" :label-width="formLabelWidth">
          <el-input v-model="initParam.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="地区" prop="companyId" :label-width="formLabelWidth">
          <el-select v-model="initParam.Id" filterable placeholder="请选择">
            <el-option v-for='item in areaList' :label="item.dicItemName" :value="item.dicItemCode" :key='item.dicItemCode'></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="活动形式" :label-width="formLabelWidth">
          <el-input type="textarea" v-model="initParam.Id"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetQuery">取 消</el-button>
        <el-button @click="query" type="primary">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {} from "@/api/getData"
import { fetchDics } from '@/config/tool'
import { clone } from '@/config/mUtils'
export default {
  data() {
    return {
      areaList:[
        {dicItemName:'北京',dicItemCode:'100010'}
      ],
      formLabelWidth:'80px',
      initParam:{},
      queryDialogFormVisible:false,
      queryForm:{
        param:false,
        statu:'' 
      },
      tableData:[
        {
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1517 弄'
        }
      ],
      treeData: [
        {
          id: 1,
          label: '一级 1',
          children: [{
            id: 4,
            label: '二级 1-1',
            children: [{
              id: 9,
              label: '三级 1-1-1'
            }, {
              id: 10,
              label: '三级 1-1-2'
            }]
          }]
        }, {
          id: 2,
          label: '一级 2',
          children: [{
            id: 5,
            label: '二级 2-1'
          }, {
            id: 6,
            label: '二级 2-2'
          }]
        }, {
          id: 3,
          label: '一级 3',
          children: [{
            id: 7,
            label: '二级 3-1'
          }, {
            id: 8,
            label: '二级 3-2'
          }]
        }
      ],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      checkSelectiveTags: [],
      checkSelectedTags: [],
      selectiveTags: [],
      selectedTags: [],
      selectiveGroupId: '',
      selectiveGroupType: '1',
      dicationary: [
        { id: "market.company", property: "labelName", force: false }
      ],
      groupId:'',
      total:200
      seletList:[]
    }
  },
  created() {
    this.init()
  },
  methods: {
    handleCurrentChange(){},
    handleSizeChange(){},
    resetQuery(){
      this.queryDialogFormVisible=false
    },
    switchListShow(data){},
    handleSelectionChange(){},
    query(){},
    async init() {},
    delTagAll(){
      this.$confirm('此操作将删除全部标签, 是否继续?', '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        let result = await delTag([])
        this.$message({
          showClose: true,
          type: 'success',
          message: '删除成功!'
        })
        this.init()
      }).catch(() => {
        this.$message({
          showClose: true,
          type: 'info',
          message: '已取消删除'
        });
      })
    },
    delTagOne(data,event){
      event.cancelBubble = true;
      this.$confirm('是否删除该标签?', '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        let result = await delTag([data])
        this.$message({
          showClose: true,
          type: 'success',
          message: '删除成功!'
        })
        this.init()
      }).catch(() => {
        this.$message({
          showClose: true,
          type: 'info',
          message: '已取消删除'
        });
      })
    },
    delTagSelect(data,event){
      // event.cancelBubble = true;
      if(this.seletList.length==0){
        this.$message({
          showClose: true,
          type: 'warning',
          message: '请选择标签!'
        })
        return
      }
      this.$confirm('是否删除该标签?', '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        let result = await delTag(this.seletList)
        this.$message({
          showClose: true,
          type: 'success',
          message: '删除成功!'
        })
        this.init()
      }).catch(() => {
        this.$message({
          showClose: true,
          type: 'info',
          message: '已取消删除'
        });
      })
    },
    selectItem(id,index){
      this.selectiveTags[index].active = ! this.selectiveTags[index].active
      for (var i = 0; i < this.seletList.length; i++) {
        if(id==this.seletList[i]){
          this.seletList.splice(i,1)
          // console.log(this.seletList,123)
          return
        }
      };
      this.seletList.push(id)
          // console.log(this.seletList)
    },
    append(data) {
      let temp = {
        parentId: data.groupId,
        groupName: data.groupName
      }
      this.$router.push({ path: "/tagGroupAdd", query: temp })
    },
    async remove(data) {
      this.$confirm('此操作将删除标签组, 是否继续?', '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        await delTreeGroup({ groupId: data.groupId })
        this.$message({
          showClose: true,
          type: 'success',
          message: '删除成功!'
        })
        this.init()
      }).catch(() => {
        this.$message({
          showClose: true,
          type: 'info',
          message: '已取消删除'
        });
      })
    },
    view(data) {
      let temp = {
        groupName: data.groupName,
        groupId: data.groupId,
        groupType: data.groupType,
        selectType: data.selectType
      }
      this.$router.push({ path: "/tagGroupView", query: temp })
    },
    edit(data) {
      let temp = {
        groupName: data.groupName,
        groupId: data.groupId,
        groupType: data.groupType,
        selectType: data.selectType,
        type:data.groupType
      }
      this.$router.push({ path: "/tagGroupEdit", query: temp })
    },
    async up(data,e) {
      await moveUpTreeGroup({ groupId: data.groupId })
      this.init()
    },
    async down(data,e) {
      // console.log(data,e,13)
      await moveDownTreeGroup({ groupId: data.groupId })
      this.init()
    },
    addOfTag() {
      this.$router.push({ path: "/tagAdd", query: {groupId:this.groupId,type:this.selectiveGroupType} })
      // this.$router.push({"/tagAdd",query:{groupId:this.groupId}})
    },
    nodeClick(data) {
       let dom = document.getElementById('is-select')
        if(dom){
          dom.parentNode.parentNode.classList.remove("is-current")
        }
      this.seletList=[]
      // console.log(1,data)
      this.checkSelectiveTags = []
      this.checkSelectedTags = []
      if (data) {
        this.groupId = data.groupId
        this.selectiveGroupId = data.groupId
        this.selectiveGroupType = data.groupType

        this.showSelectedTag()
        this.showSelectiveTag()
        return
      } else  if(this.$route.query.groupId){
        // console.log(this.$route.query.groupId)
        this.groupId = this.$route.query.groupId
        this.selectiveGroupId = this.$route.query.groupId
        this.selectiveGroupType = this.$route.query.type
        // console.log(this.selectiveGroupType)
        this.showSelectedTag()
        this.showSelectiveTag()
        return
      }else{
        this.selectiveGroupId = 1
        this.selectiveGroupType = null

        this.showSelectedTag()
        this.showSelectiveTag()
        return
      }
    },
    async showSelectiveTag() {
      let selectiveTags = await querySelectiveTag({ groupId: this.selectiveGroupId })

      await fetchDics(this.dicationary, selectiveTags);
      this.selectiveTags = selectiveTags
      for (var i = 0; i < this.selectiveTags.length; i++) {
        this.selectiveTags[i].active=false
      };
      this.selectiveTags=clone(this.selectiveTags)
    },
    async showSelectedTag() {
      let selectedTags = await queryTagByTree({ groupId: this.selectiveGroupId })
      this.selectedTags = selectedTags
    },
    async doOfTag() {
      let arr = this.switchLabelName() || []
      if (arr.length < 1) {
        this.$message({
          showClose: true,
          type: 'warning',
          message: '请先选择标签！'
        })
      } else {
        let temp = {
          groupId: this.selectiveGroupId,
          labelIds: arr
        }
        await addTagByTree(temp)
        this.$message({
          showClose: true,
          type: 'success',
          message: '添加成功!'
        })
        this.showSelectedTag()
        this.showSelectiveTag()
      }
    },
    editSelectedTag() {
      let arr = this.switchSelectedLabelName() || []
      if (arr.length < 1) {
        this.$message({
          showClose: true,
          type: 'warning',
          message: '请先选择标签！'
        })
      } else if (arr.length > 1) {
        this.$message({
          showClose: true,
          type: 'warning',
          message: '每次只能选择一个标签编辑！'
        })
      } else {
        let temp = {
          id: arr[0],
          labelName: this.checkSelectedTags[0]
        }
        this.$router.push({ path: "/tagEdit", query: temp })
      }
    },
    editOfTag() {
      let arr = this.switchLabelName() || []
      if (arr.length < 1) {
        this.$message({
          showClose: true,
          type: 'warning',
          message: '请先选择标签！'
        })
      } else if (arr.length > 1) {
        this.$message({
          showClose: true,
          type: 'warning',
          message: '每次只能选择一个标签编辑！'
        })
      } else {
        let temp = {
          id: arr[0],
          labelName: this.checkSelectiveTags[0],
          groupId:this.groupId,
          type:this.selectiveGroupType
        }
        this.$router.push({ path: "/tagEdit", query: temp })
      }
    },
    async delOfTag() {
      let arr = this.switchLabelName() || []
      if (arr.length < 1) {
        this.$message({
          showClose: true,
          type: 'warning',
          message: '请先选择标签！'
        })
      } else {
        await delTag(arr)
        this.$message({
          showClose: true,
          type: 'success',
          message: '删除成功!'
        })
        this.showSelectiveTag()
      }
    },
    async delSelectedTag() {
      let arr = this.switchSelectedLabelName() || []
      if (arr.length < 1) {
        this.$message({
          showClose: true,
          type: 'warning',
          message: '请先选择标签！'
        })
      } else {
        let temp = {
          groupId: this.selectiveGroupId,
          labelIds: arr
        }
        await delTagByTree(temp)
        this.$message({
          showClose: true,
          type: 'success',
          message: '删除成功!'
        })
        this.showSelectedTag()
        this.showSelectiveTag()
      }
    },
    switchLabelName() {
      let that = this
      let arr = []
      that.selectiveTags.forEach(element => {
        that.checkSelectiveTags.forEach(ele => {
          if (element.labelName == ele) {
            arr.push(element.id)
          }
        })
      })
      return arr
    },
    switchSelectedLabelName() {
      let that = this
      let arr = []
      that.selectedTags.forEach(element => {
        that.checkSelectedTags.forEach(ele => {
          if (element.labelName == ele) {
            arr.push(element.id)
          }
        })
      })
      return arr
    },
    renderContent(h, { node, data, store }) {
      if (data.groupId == 1) {
        if(this.$route.query.groupId){
        return (
          <span style="flex: 1; display: flex; align-items: center; justify-content: space-between; font-size: 14px; padding-right: 8px;">
            <span>
              <span>{data.label}</span>
            </span>
            <span>
              <i class="font-color-default el-icon-plus" on-click={() => this.append(data)} title="新增"></i>&nbsp;
            </span>
          </span>)
        }else{
        return (
          <span  id='is-select' style="flex: 1; display: flex; align-items: center; justify-content: space-between; font-size: 14px; padding-right: 8px;">
            <span>
              <span>{data.label}</span>
            </span>
            <span>
              <i class="font-color-default el-icon-plus" on-click={() => this.append(data)} title="新增"></i>&nbsp;
            </span>
          </span>)
        }
      } else if(data.groupId==this.$route.query.groupId){
        if (data.groupType == 1) {
          return (
            <span id='is-select' style="flex: 1; display: flex; align-items: center; justify-content: space-between; font-size: 14px; padding-right: 8px;">
              <span>
                <span>{data.label}</span>
              </span>
              <span>
                <i class="font-color-default el-icon-view" on-click={() => this.view(data)} title="查看"></i>&nbsp;&nbsp;
              <i class="font-color-default el-icon-edit" on-click={() => this.edit(data)} title="编辑"></i>&nbsp;&nbsp;
              <i class="font-color-default el-icon-delete" on-click={() => this.remove(data)} title="删除"></i>&nbsp;&nbsp;
              <i class="font-color-default el-icon-plus" on-click={() => this.append(data)} title="新增" ></i>&nbsp;
              <i class="font-color-default el-icon-sort-up" on-click={() => this.up(data)} title="上移"></i>&nbsp;&nbsp;
              <i class="font-color-default el-icon-sort-down" on-click={() => this.down(data)} title="下移"></i>
              </span>
            </span>)
        } else {
          return (
            <span id='is-select' style="flex: 1; display: flex; align-items: center; justify-content: space-between; font-size: 14px; padding-right: 8px;">
              <span>
                <span>{data.label}</span>
              </span>
              <span>
                <i class="font-color-default el-icon-view" on-click={() => this.view(data)} title="查看"></i>&nbsp;&nbsp;
              <i class="font-color-default el-icon-edit" on-click={() => this.edit(data)} title="编辑"></i>&nbsp;&nbsp;
              <i class="font-color-default el-icon-delete" on-click={() => this.remove(data)} title="删除"></i>&nbsp;&nbsp;
              <i class="font-color-default el-icon-plus" style='color:#ccc;cursor:not-allowed' title="新增" ></i>&nbsp;
              <i class="font-color-default el-icon-sort-up" on-click={($event) => this.up(data,$event)} title="上移"></i>&nbsp;&nbsp;
              <i class="font-color-default el-icon-sort-down" on-click={($event) => this.down(data,$event)} title="下移"></i>
              </span>
            </span>)
        }
      }else{
        if (data.groupType == 1) {
          return (
            <span style="flex: 1; display: flex; align-items: center; justify-content: space-between; font-size: 14px; padding-right: 8px;">
              <span>
                <span>{data.label}</span>
              </span>
              <span>
                <i class="font-color-default el-icon-view" on-click={() => this.view(data)} title="查看"></i>&nbsp;&nbsp;
              <i class="font-color-default el-icon-edit" on-click={() => this.edit(data)} title="编辑"></i>&nbsp;&nbsp;
              <i class="font-color-default el-icon-delete" on-click={() => this.remove(data)} title="删除"></i>&nbsp;&nbsp;
              <i class="font-color-default el-icon-plus" on-click={() => this.append(data)} title="新增" ></i>&nbsp;
              <i class="font-color-default el-icon-sort-up" on-click={() => this.up(data)} title="上移"></i>&nbsp;&nbsp;
              <i class="font-color-default el-icon-sort-down" on-click={() => this.down(data)} title="下移"></i>
              </span>
            </span>)
        } else{
          return (
            <span style="flex: 1; display: flex; align-items: center; justify-content: space-between; font-size: 14px; padding-right: 8px;">
              <span>
                <span>{data.label}</span>
              </span>
              <span>
                <i class="font-color-default el-icon-view" on-click={() => this.view(data)} title="查看"></i>&nbsp;&nbsp;
              <i class="font-color-default el-icon-edit" on-click={() => this.edit(data)} title="编辑"></i>&nbsp;&nbsp;
              <i class="font-color-default el-icon-delete" on-click={() => this.remove(data)} title="删除"></i>&nbsp;&nbsp;
              <i class="font-color-default el-icon-plus" style='color:#ccc;cursor:not-allowed' title="新增" ></i>&nbsp;
              <i class="font-color-default el-icon-sort-up" on-click={($event) => this.up(data,$event)} title="上移"></i>&nbsp;&nbsp;
              <i class="font-color-default el-icon-sort-down" on-click={($event) => this.down(data,$event)} title="下移"></i>
              </span>
            </span>)
        }

      }
    }
  }
};
</script>
<style lang="less" scope>
</style>
