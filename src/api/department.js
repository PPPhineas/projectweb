import service from "@/utils/request";

const HOME_API = window.globalUrl.HOME_API;

// 获取列表
export function getDepList(params) {
  return service.post(`${HOME_API}/project/department/page`, params);
}

// 新增
export function addDepInfo(params) {
  return service.post(`${HOME_API}/project/department/save`, params);
}

// 删除
export function delDepInfo(params) {
  return service({
    url: `${HOME_API}/project/department/delete?${params}`,
    method: "delete"
  });
}

// 编辑更新
export function updateDepInfo(params) {
  return service.post(`${HOME_API}/project/department/update`, params);
}