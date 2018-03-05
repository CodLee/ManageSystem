/**
 * 配置组件内公共的属性
 */
import { unionProperties } from "@/config/tool";
import { UEditor ,UEditorOne, UEditorTwo } from '@/components/ueditor/index.js'
import { clone } from "@/config/mUtils";
import { debug } from "util";

let componentConfig = {
  //表格基础配置
  table: {
    data: {
      pageNum: 1, //接口请求初始页码
      pageSize: 20, //接口请求每页数量
      pageChange: [20, 30, 50, 100], //每页显示的数量
      currentPage: 1, //当前页码
      multipleSelection: [], //多选项
      tableData: [] //表格数据
    },
    methods: {
      //表格复选框事件
      handleSelectionChange(val) {
        let temp = [];
        val.forEach(function(ele) {
          temp.push(ele);
        });
        this.multipleSelection = temp;
      }
    }
  },
  //UEditor默认配置
  UEditor: {
    components: { UEditor },
    data: {
      config: {
        autoHeightEnabled: false,
        autoFloatEnabled: true,
        initialContent: "",
        autoClearinitialContent: false,
        initialFrameWidth: null,
        initialFrameHeight: 450,
        BaseUrl: "",
        UEDITOR_HOME_URL: "static/ueditor/"
      }
    }
  },
  //UEditorOne默认配置
  UEditorOne: {
    components: { UEditorOne },
    data: {
      configOne: {
        autoHeightEnabled: false,
        autoFloatEnabled: true,
        initialContent: "",
        autoClearinitialContent: false,
        initialFrameWidth: null,
        initialFrameHeight: 450,
        BaseUrl: "",
        UEDITOR_HOME_URL: "static/ueditor/"
      }
    }
  },
  //UEditorTwo默认配置
  UEditorTwo: {
    components: { UEditorTwo },
    data: {
      configTwo: {
        autoHeightEnabled: false,
        autoFloatEnabled: true,
        initialContent: "",
        autoClearinitialContent: false,
        initialFrameWidth: null,
        initialFrameHeight: 450,
        BaseUrl: "",
        UEDITOR_HOME_URL: "static/ueditor/"
      }
    }
  }
};

export const getTableData = function(data) {
  let c = clone(defaultTableConfig);
  return unionProperties(c, data);
};

export const componentExtend = function (configs, target) {
  let d_data = {}
  let d_method = {}
  let d_components = {}
  if (configs) {
    for (let i = 0; i < configs.length; i++) {
      unionProperties(d_data, componentConfig[configs[i]].data)
      unionProperties(d_method, componentConfig[configs[i]].methods)
      unionProperties(d_components, componentConfig[configs[i]].components)
    }
  }
  
  let t_data = target.data()
  target.data = function () { 
    return unionProperties(d_data, t_data)
  }

  let t_methods = target.methods || {}
  target.methods = unionProperties(d_method, t_methods)

  let t_components = target.components || {}
  target.components = unionProperties(d_components, t_components)

  return target
}
  

