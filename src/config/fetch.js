import { Loading, Message } from "element-ui";
import router from "../router/index";
import { mergeProperties } from "@/config/tool";
import { message } from "@/config/message";

function callBack(ballback, param){
  if (ballback) {
    try {
      ballback(param)
    } catch (e) {
      console.log(e)
    }
  }
}

export default async (data = {}, url = "") => {
  // 设置参数默认值
  let defaultParam = {
    url: "",
    data: {},
    type: "POST",
    method: "fetch",
    showLoading: true,
    loadingTime: 0,
    callback : null
  };

  mergeProperties(defaultParam, data) 
  defaultParam.url = url;

  // 判断是fetch请求是GET请求还是POST请求
  defaultParam.type = defaultParam.type.toUpperCase();
  // 如果是GET请求对data中的数据进行打散拼接
  if (defaultParam.type == "GET") {
    let dataStr = "";
    Object.keys(defaultParam.data).forEach(key => {
      dataStr += key + "=" + defaultParam.data[key] + "&";
    });
    if (dataStr !== "") {
      dataStr = dataStr.substr(0, dataStr.lastIndexOf("&"));
      defaultParam.url = defaultParam.url + "?" + dataStr;
    }
  }
  // 检测浏览器是否支持fetch请求以及判断接口请求是否为fetch请求
  if (window.fetch && defaultParam.method == "fetch") {
    let requestConfig = {
      credentials: "include",
      method: defaultParam.type,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        'Cache-Control': 'no-cache'
      },
      mode: "cors",
      cache: "force-cache"
    };
    // 如果是POST请求，将data转成字符串，作为requestConfig.body的值
    if (defaultParam.type == "POST") {
      Object.defineProperty(requestConfig, "body", {
        value: JSON.stringify(defaultParam.data)
      });
    }

    //添加遮罩
    let loadingInstance
    if (defaultParam.showLoading) {
      loadingInstance = Loading.service({
        fullscreen:false,
        target:document.getElementById('mainContent')
      });
    }
     
    let response;
    try {
      response = await fetch(defaultParam.url, requestConfig);
    } catch (e) {
      Message.error(e)
      callBack(defaultParam.callback, response);
    }  

    //移除遮罩
    if (loadingInstance) {
      if (defaultParam.loadingTime > 0) {
        let timer = setTimeout(() => {
          loadingInstance.close();
        }, defaultParam.loadingTime);
      }
      else {
        loadingInstance.close();
      }
    }  
    
    const responseJson = await response.json();
    // console.log(responseJson+1111)
    //异常
    if (responseJson.status == "0") {
      if (responseJson.msg) {
        let msg = responseJson.msg
        // console.log(message[responseJson.msg])
        if (message[responseJson.msg]) {
          msg = message[responseJson.msg]
        }
        Message.error(msg)
      } else { 
        Message.error("网络异常！")
      } 
      callBack(defaultParam.callback, response);
      return
    }
    //超时,会话失效
    else if (responseJson.status == "2") {
      // Message.error("会话失效，请重新登录！")
      router.replace("/login");
    }
    
    return responseJson.data
    /*
    // 判断该接口请求是否需要显示loading
    // let responseJson;
    if (defaultParam.showLoading) {
      if (defaultParam.loadingTime === 0) {
        // 打开loading
        let loadingInstance = Loading.service();
        const response = await fetch(defaultParam.url, requestConfig);
        // 关闭loading
        loadingInstance.close();
        // 序列化response，response为一个promise对象
        responseJson = await response.json();
      } else if (defaultParam.loadingTime > 0) {
        let timeout = defaultParam.loadingTime;
        let loadingInstance = Loading.service();
        const response = await fetch(defaultParam.url, requestConfig);
        responseJson = await response.json();
        let timer = setTimeout(() => {
          loadingInstance.close();
        }, timeout);
        if (responseJson) {
          clearTimeout(timer);
        }
      }
    } else {
      const response = await fetch(defaultParam.url, requestConfig);
      const responseJson = await response.json();
      // 判断请求是否成功，异常等信息
      if (responseJson.status == "0") {
        // 根据返回信息抛出对应异常
      } else if (responseJson.status == "1") {
        // 成功，返回数据
        return responseJson.data;
      } else if (responseJson.status == "2") {
        // 登录拦截器
        router.replace("/login");
      }
    }
    */
  } else {
    // 如果浏览器不支持fetch请求或者接口使用ajax请求
    return new Promise((resolve, reject) => {
      // 判断浏览器是否支持ajax请求
      let requestObj;
      if (window.XMLHttpRequest) {
        requestObj = new XMLHttpRequest();
      } else {
        requestObj = new ActiveXObject();
      }

      let sendData = "";
      if (defaultParam.type == "POST") {
        sendData = JSON.stringify(defaultParam.data);
      }
      requestObj.open(defaultParam.type, defaultParam.url, true);
      requestObj.setRequestHeader(
        "Content-type",
        "application/x-www-form-urlencoded"
      );
      requestObj.send(sendData);

      requestObj.onreadystatechange = () => {
        if (requestObj.readyState == 4) {
          if (requestObj.status == 200) {
            let obj = requestObj.response;
            if (typeof obj !== "object") {
              obj = JSON.parse(obj);
            }
            resolve(obj);
          } else {
            reject(requestObj);
          }
        }
      };
    });
  }
};
