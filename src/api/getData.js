import fetch from "@/config/fetch";
import {
    baseUrl,
    rootPath
} from "@/config/env";

/**
 * 登陆
 * @param loginName
 * @param password
 */
export const login = param => {
    let req = {
        data: param
    };
    return fetch(req, `${rootPath}/login`);
};
/**
 * 退出
 * @param loginName
 * @param password
 */
export const loginOut = param => {
    let req = {
        data: param
    };
    return fetch(req, `${rootPath}/logout`);
};

/**
 * 字典
 * @param loginName
 * @param password
 */
export const dicsQueryDics = param => {
    let req = {
        data: param
    };
    return fetch(req, `${rootPath}/logout`);
};

