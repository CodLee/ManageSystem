import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
const MAPDICDATA = 'MAPDICDATA'  //字典数据
const EUMSET = "EUMSET"
const SETSIDBAR = 'SETSIDBAR'


const state = {
  bgcolor: {
    colorDefaultName: "colorDefault"
  },
  dicMap : new Map(),
  showSidebar:false,
  productName:'',
  coustomerImage:'',
  slideMenu:true
};

const mutations = {
  [MAPDICDATA](state, d) {
    state.dicMap.set(d.dic.dicCode, d.dicItems)
  },
  [SETSIDBAR](state, showSidebar) {
    state.showSidebar = showSidebar;
  },
  setProductName(state,name){
    state.productName = name
  },
  coustomerImage(state,coustomerImage){
    state.coustomerImage = coustomerImage
  },
  slideMenu(state,slideMenu){
    state.slideMenu = slideMenu
  }

};

const actions = {

};

export default new Vuex.Store({
  state,
  actions,
  mutations,
})

//枚举对象
let ENUM = {
  //责任来源
  "liabSource.enum": [
    { dicItemCode: "1", dicItemName: "产品" },
    { dicItemCode: "2", dicItemName: "自定义" }
  ],
  //性别
  "gender.enum": [
    { dicItemCode: "M", dicItemName: "男" },
    { dicItemCode: "F", dicItemName: "女" }
  ],
  "salesType.enum": [
    { dicItemCode: "0", dicItemName: "保额算保费" },
    { dicItemCode: "1", dicItemName: "保费算保额" },
    { dicItemCode: "2", dicItemName: "按档次销售" },
    { dicItemCode: "3", dicItemName: "按份数销售" }
  ],
  "isIllustration.enum": [
    { dicItemCode: "0", dicItemName: "否" },
    { dicItemCode: "1", dicItemName: "是" }
  ],
  "productState.enum": [
    { dicItemCode: "0", dicItemName: "下架" },
    { dicItemCode: "1", dicItemName: "上架" },
    { dicItemCode: "2", dicItemName: "删除" }
  ]
};

for (let i in ENUM) {
  var d = { "dic": {}, dicItems: null}
  d.dic.dicCode = i
  d.dicItems = ENUM[i]
  state.dicMap.set(i, ENUM[i])
}
