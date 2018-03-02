/**
 * 配置编译环境和线上环境之间的切换
 */
let baseUrl = "";
let rootPath = "";
// let uploadUrl = "http://localhost:6201/market";
let uploadUrl = "http://localhost:6201/market";
let reViewUploadUrl = "http://10.78.8.136:8081/market/filemarket/download?path=";
let reView = "&isOnline=true";
let downLoad = "&isOnline=false";

if (process.env.NODE_ENV == "development") {
  let API_URL = "http://10.78.8.136";
  let API_PORT = "8081";
  rootPath = "/market";
  baseUrl = API_URL + ":" + API_PORT;
} else {
  uploadUrl = "http://10.78.8.136:8081/market";
  let API_URL = "http://10.78.8.136";
  let API_PORT = "8081";
  rootPath = "/market";
  baseUrl = API_URL + ":" + API_PORT;
}

export { baseUrl, rootPath, uploadUrl, reViewUploadUrl, downLoad, reView };
