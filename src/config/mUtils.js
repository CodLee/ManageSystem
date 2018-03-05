/**
 * 存储localStorage
 */
export const setStore = (name, content) => {
  if (!name) return;
  if (typeof content !== "string") {
    content = JSON.stringify(content);
  }
  window.localStorage.setItem(name, content);
};

/**
 * 获取localStorage
 */
export const getStore = name => {
  if (!name) return;
  return window.localStorage.getItem(name);
};

/**
 * 删除localStorage
 */
export const removeStore = name => {
  if (!name) return;
  window.localStorage.removeItem(name);
};

/**
 * 获取style样式
 */
export const getStyle = (element, attr, NumberMode = "int") => {
  let target;
  // scrollTop 获取方式不同，没有它不属于style，而且只有document.body才能用
  if (attr === "scrollTop") {
    target = element.scrollTop;
  } else if (element.currentStyle) {
    target = element.currentStyle[attr];
  } else {
    target = document.defaultView.getComputedStyle(element, null)[attr];
  }
  //在获取 opactiy 时需要获取小数 parseFloat
  return NumberMode == "float" ? parseFloat(target) : parseInt(target);
};

/**
 * 页面到达底部，加载更多
 */
export const loadMore = (element, callback) => {
  let windowHeight = window.screen.height;
  let height;
  let setTop;
  let paddingBottom;
  let marginBottom;
  let requestFram;
  let oldScrollTop;

  document.body.addEventListener(
    "scroll",
    () => {
      loadMore();
    },
    false
  );
  //运动开始时获取元素 高度 和 offseTop, pading, margin
  element.addEventListener(
    "touchstart",
    () => {
      height = element.offsetHeight;
      setTop = element.offsetTop;
      paddingBottom = getStyle(element, "paddingBottom");
      marginBottom = getStyle(element, "marginBottom");
    },
    {
      passive: true
    }
  );

  //运动过程中保持监听 scrollTop 的值判断是否到达底部
  element.addEventListener(
    "touchmove",
    () => {
      loadMore();
    },
    {
      passive: true
    }
  );

  //运动结束时判断是否有惯性运动，惯性运动结束判断是非到达底部
  element.addEventListener(
    "touchend",
    () => {
      oldScrollTop = document.body.scrollTop;
      moveEnd();
    },
    {
      passive: true
    }
  );

  const moveEnd = () => {
    requestFram = requestAnimationFrame(() => {
      if (document.body.scrollTop != oldScrollTop) {
        oldScrollTop = document.body.scrollTop;
        loadMore();
        moveEnd();
      } else {
        cancelAnimationFrame(requestFram);
        //为了防止鼠标抬起时已经渲染好数据从而导致重获取数据，应该重新获取dom高度
        height = element.offsetHeight;
        loadMore();
      }
    });
  };

  const loadMore = () => {
    if (
      document.body.scrollTop + windowHeight >=
      height + setTop + paddingBottom + marginBottom
    ) {
      callback();
    }
  };
};

/**
 * 显示返回顶部按钮，开始、结束、运动 三个过程中调用函数判断是否达到目标点
 */
export const showBack = callback => {
  let requestFram;
  let oldScrollTop;

  document.addEventListener(
    "scroll",
    () => {
      showBackFun();
    },
    false
  );
  document.addEventListener(
    "touchstart",
    () => {
      showBackFun();
    },
    {
      passive: true
    }
  );

  document.addEventListener(
    "touchmove",
    () => {
      showBackFun();
    },
    {
      passive: true
    }
  );

  document.addEventListener(
    "touchend",
    () => {
      oldScrollTop = document.body.scrollTop;
      moveEnd();
    },
    {
      passive: true
    }
  );

  const moveEnd = () => {
    requestFram = requestAnimationFrame(() => {
      if (document.body.scrollTop != oldScrollTop) {
        oldScrollTop = document.body.scrollTop;
        moveEnd();
      } else {
        cancelAnimationFrame(requestFram);
      }
      showBackFun();
    });
  };

  //判断是否达到目标点
  const showBackFun = () => {
    if (document.body.scrollTop > 500) {
      callback(true);
    } else {
      callback(false);
    }
  };
};

/**
 * 运动效果
 * @param {HTMLElement} element   运动对象，必选
 * @param {JSON}        target    属性：目标值，必选
 * @param {number}      duration  运动时间，可选
 * @param {string}      mode      运动模式，可选
 * @param {function}    callback  可选，回调函数，链式动画
 */
export const animate = (
  element,
  target,
  duration = 400,
  mode = "ease-out",
  callback
) => {
  clearInterval(element.timer);

  //判断不同参数的情况
  if (duration instanceof Function) {
    callback = duration;
    duration = 400;
  } else if (duration instanceof String) {
    mode = duration;
    duration = 400;
  }

  //判断不同参数的情况
  if (mode instanceof Function) {
    callback = mode;
    mode = "ease-out";
  }

  //获取dom样式
  const attrStyle = attr => {
    if (attr === "opacity") {
      return Math.round(getStyle(element, attr, "float") * 100);
    } else {
      return getStyle(element, attr);
    }
  };
  //根字体大小，需要从此将 rem 改成 px 进行运算
  const rootSize = parseFloat(document.documentElement.style.fontSize);

  const unit = {};
  const initState = {};

  //获取目标属性单位和初始样式值
  Object.keys(target).forEach(attr => {
    if (/[^\d^\.]+/gi.test(target[attr])) {
      unit[attr] = target[attr].match(/[^\d^\.]+/gi)[0] || "px";
    } else {
      unit[attr] = "px";
    }
    initState[attr] = attrStyle(attr);
  });

  //去掉传入的后缀单位
  Object.keys(target).forEach(attr => {
    if (unit[attr] == "rem") {
      target[attr] = Math.ceil(parseInt(target[attr]) * rootSize);
    } else {
      target[attr] = parseInt(target[attr]);
    }
  });

  let flag = true; //假设所有运动到达终点
  const remberSpeed = {}; //记录上一个速度值,在ease-in模式下需要用到
  element.timer = setInterval(() => {
    Object.keys(target).forEach(attr => {
      let iSpeed = 0; //步长
      let status = false; //是否仍需运动
      let iCurrent = attrStyle(attr) || 0; //当前元素属性址
      let speedBase = 0; //目标点需要减去的基础值，三种运动状态的值都不同
      let intervalTime; //将目标值分为多少步执行，数值越大，步长越小，运动时间越长
      switch (mode) {
        case "ease-out":
          speedBase = iCurrent;
          intervalTime = duration * 5 / 400;
          break;
        case "linear":
          speedBase = initState[attr];
          intervalTime = duration * 20 / 400;
          break;
        case "ease-in":
          let oldspeed = remberSpeed[attr] || 0;
          iSpeed = oldspeed + (target[attr] - initState[attr]) / duration;
          remberSpeed[attr] = iSpeed;
          break;
        default:
          speedBase = iCurrent;
          intervalTime = duration * 5 / 400;
      }
      if (mode !== "ease-in") {
        iSpeed = (target[attr] - speedBase) / intervalTime;
        iSpeed = iSpeed > 0 ? Math.ceil(iSpeed) : Math.floor(iSpeed);
      }
      //判断是否达步长之内的误差距离，如果到达说明到达目标点
      switch (mode) {
        case "ease-out":
          status = iCurrent != target[attr];
          break;
        case "linear":
          status =
            Math.abs(Math.abs(iCurrent) - Math.abs(target[attr])) >
            Math.abs(iSpeed);
          break;
        case "ease-in":
          status =
            Math.abs(Math.abs(iCurrent) - Math.abs(target[attr])) >
            Math.abs(iSpeed);
          break;
        default:
          status = iCurrent != target[attr];
      }

      if (status) {
        flag = false;
        //opacity 和 scrollTop 需要特殊处理
        if (attr === "opacity") {
          element.style.filter = "alpha(opacity:" + (iCurrent + iSpeed) + ")";
          element.style.opacity = (iCurrent + iSpeed) / 100;
        } else if (attr === "scrollTop") {
          element.scrollTop = iCurrent + iSpeed;
        } else {
          element.style[attr] = iCurrent + iSpeed + "px";
        }
      } else {
        flag = true;
      }

      if (flag) {
        clearInterval(element.timer);
        if (callback) {
          callback();
        }
      }
    });
  }, 20);
};

/**
 * 手机验证规则
 */
export const validateMobile = (rule, value, callback) => {
  if (!/^1[34578]\d{9}$/.test(value)) {
    callback(new Error("请输入正确的手机号"));
  }
  callback();
};

/**
 * 邮箱验证规则
 */
export const validateEmail = (rule, value, callback) => {
  if (
    !/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/.test(
      value
    )
  ) {
    callback(new Error("请输入正确的邮箱号码"));
  }
  callback();
};

/**
 * 日期格式化
 */
export const formateDate = function(date, formate) {
  if (!date) {
    return "";
  }
  var o = {
    "M+": date.getMonth() + 1, // 月份
    "d+": date.getDate(), // 日
    "[hH]+": date.getHours(), // 小时
    "m+": date.getMinutes(), // 分
    "s+": date.getSeconds(), // 秒
    "q+": Math.floor((date.getMonth() + 3) / 3), // 季度
    S: date.getMilliseconds() // 毫秒
  };
  if (/(y+)/.test(formate)) {
    formate = formate.replace(
      RegExp.$1,
      (date.getFullYear() + "").substr(4 - RegExp.$1.length)
    );
  }
  for (var k in o) {
    if (new RegExp("(" + k + ")").test(formate)) {
      formate = formate.replace(
        RegExp.$1,
        RegExp.$1.length === 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length)
      );
    }
  }
  return formate;
};

/*
*  2-15英文和字母
 */

export const verificationEN215 = (rule, value, callback) => {
  if (!/^[a-z0-9]{2,15}$/i.test(value)) {
    callback(new Error("请输入2-15位英文或数字"));
  }
  callback();
};


/*
*  匹配大于0的整数数字
 */
export const verificationNG0 = (rule, value, callback) => {
  if (!/^\+?(?!0)\d*$/.test(value)) {
    callback(new Error("请输入大于0的整数"));
  }
  callback();
};

/*
*  ulr
 */

export const verificationU = (rule, value, callback) => {
  if (
    !/(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/.test(
      value
    )
  ) {
    callback(new Error("请输入正确的"));
  }
  callback();
};

// 数字数组排序
export const sortNumber = function(a, b) {
  return a - b;
};

/*
 *  数组排序
 *  @param propertyName   根据某个属性进行排序
 */
export const sortBy = function(propertyName) {
  return function(object1, object2) {
    var value1 = object1[propertyName];
    var value2 = object2[propertyName];
    if (value1 < value2) {
      return -1;
    } else if (value1 > value2) {
      return 1;
    } else {
      return 0;
    }
  };
};

/*
 *  数组排序
 *  @param prop   根据某个属性进行排序,支持字符串排序
 */
export const compare = function(prop) {
  return function(obj1, obj2) {
    let val1 = obj1[prop];
    let val2 = obj2[prop];
    if (!isNaN(Number(val1)) && !isNaN(Number(val2))) {
      val1 = Number(val1);
      val2 = Number(val2);
    }
    if (val1 < val2) {
      return -1;
    } else if (val1 > val2) {
      return 1;
    } else {
      return 0;
    }
  };
};
/*
 *  数组 一维删除某项
 *  @param propertyName   根据某个属性进行删除
 */
export const arrDel = function(arr, str) {
  var index = arr.indexOf(str);
  if (index > -1) {
    arr.splice(index, 1);
  }
  return arr;
};

/*
 *  页面按钮控制
 *
 *
 *
*/
export const hasRights = function(authCode) {
  let rightLists = JSON.parse(sessionStorage.getItem("userMenu"))[1];
  let len = rightLists.length;
  for (var i = 0; i < len; i++) {
    for (var j = 0; j < rightLists[i].auths.length; j++) {
      if (authCode == rightLists[i].auths[j].auth) {
        return true;
      }
    }
  }
  return true;
};

/*
* 数组去重
* */
export const unique = function(array) {
  var n = [];
  for (var i = 0; i < array.length; i++) {
    if (n.indexOf(array[i]) == -1) n.push(array[i]);
  }
  return n;
};

/**
 *  根据出生日期计算年龄
 */
export const countAge = function(params) {
  let r = params.match(/^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2})$/);
  if (r == null) return false;
  let d = new Date(r[1], r[3] - 1, r[4]);
  if (
    d.getFullYear() == r[1] &&
    d.getMonth() + 1 == r[3] &&
    d.getDate() == r[4]
  ) {
    let Y = new Date().getFullYear();
    return Y - r[1];
  }
  return "输入的日期格式错误！";
};

// 对象clone
export const clone = function(obj) {
  var o;
  if (typeof obj == "object") {
    if (obj === null) {
      o = null;
    } else {
      if (obj instanceof Array) {
        o = [];
        for (var i = 0, len = obj.length; i < len; i++) {
          o.push(clone(obj[i]));
        }
      } else {
        o = {};
        for (var k in obj) {
          o[k] = clone(obj[k]);
        }
      }
    }
  } else {
    o = obj;
  }
  return o;
};

// 导出功能拼接导出参数
export const getDeriveParam = function (obj) {
  let temp = ''
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      temp = temp + key + ":" + obj[key] + "/";
    }
  }
  return temp
};