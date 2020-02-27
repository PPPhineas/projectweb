import service from "@/utils/request";

const HOME_API = window.globalUrl.HOME_API;

// 获取列表
export function getRoleList(params) {
  return service.get(`${HOME_API}/project/role/page`, params);
}

// 新增
export function addRoleInfo(params) {
  return service.post(`${HOME_API}/project/role/save`, params);
}

// 删除
export function delRoleInfo(params) {
  return service({
    url: `${HOME_API}/project/role/delete?${params}`,
    method: "delete"
  });
}

// 编辑更新
export function updateRoleInfo(params) {
  return service({
    url: `${HOME_API}/project/role/update`,
    method: "put",
    params: params
  });
}