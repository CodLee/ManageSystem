import Vue from "vue";
import Router from "vue-router";
/*-----所有组件均在此引入------*/
import login from "@/page/login"; //登录
import index from "@/page/index"; //主页
import home from "@/page/home"; //首页
import password from "@/page/password"; //修改密码
import menu from "@/page/menus/menu"; //修改密码

/**********路由配置项*************/
Vue.use(Router);
const routes = [
    {
        path: "/",
        redirect: "/login",
        children: [],
    },
    {
        path: "/login",
        component: login
    },

    {
        path: "/index",
        component: index,
        children:[
            {
                path: "/home",
                component: home,
                name: "isTab00",
                meta: {
                    keepAlive: false, // 是否需要被缓存
                    links: ["首页"]
                }
            },     
            {
                path: "/password",
                component: password,
                name: "isTab01",
                meta: {
                    keepAlive: false, // 是否需要被缓存
                    links: ["修改密码"]
                }
            },     
            {
                path: "/menus11",
                component: menu,
                name: "isTab02",
                meta: {
                    keepAlive: false, // 是否需要被缓存
                    links: ["菜单11"]
                }
            },     
            {
                path: "/menus12",
                component: menu,
                name: "isTab03",
                meta: {
                    keepAlive: false, // 是否需要被缓存
                    links: ["菜单12"]
                }
            },     
            {
                path: "/menus13",
                component: menu,
                name: "isTab04",
                meta: {
                    keepAlive: false, // 是否需要被缓存
                    links: ["菜单13"]
                }
            },     
            {
                path: "/menus20",
                component: menu,
                name: "isTab05",
                meta: {
                    keepAlive: false, // 是否需要被缓存
                    links: ["菜单20"]
                }
            },     
            {
                path: "/menus30",
                component: menu,
                name: "isTab06",
                meta: {
                    keepAlive: false, // 是否需要被缓存
                    links: ["菜单30"]
                }
            },     
            {
                path: "/menus41",
                component: menu,
                name: "isTab07",
                meta: {
                    keepAlive: false, // 是否需要被缓存
                    links: ["菜单41"]
                }
            },     
            {
                path: "/menus42",
                component: menu,
                name: "isTab08",
                meta: {
                    keepAlive: false, // 是否需要被缓存
                    links: ["菜单42"]
                }
            },     
            {
                path: "/menus43",
                component: menu,
                name: "isTab09",
                meta: {
                    keepAlive: false, // 是否需要被缓存
                    links: ["菜单43"]
                }
            }

        ]
    },
   
];

export default new Router({
    mode: "history",
    routes
});