/**
 * Created by Alex on 2018/1/19
 */
let authSet = null;
export const getAuthSet = () => {
  authSet = JSON.parse(sessionStorage.getItem("authSet"));
};

export const hasRights = btn => {
  if (!authSet) {
    authSet = JSON.parse(sessionStorage.getItem("authSet"));
  }
  // 部分权限
  if (btn == '') {
    return true
  }

  for (let i = 0; i < authSet.length; i++) {
    if (btn == authSet[i]) {
      return true;
    }
  }
  return false
};

