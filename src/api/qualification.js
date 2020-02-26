import service from "@/utils/request";

const HOME_API = window.globalUrl.HOME_API;

// 获取列表
export function getQuaList(params) {
  return service.post(`${HOME_API}/project/qualification/page`, params);
}

// 新增
export function addQuaInfo(params) {
  return service.post(`${HOME_API}/project/qualification/save`, params);
}

// 删除
export function delQuaInfo(params) {
  return service({
    url: `${HOME_API}/project/qualification/delete?${params}`,
    method: "delete"
  });
}

// 编辑更新
export function editQuaInfo(params) {
  return service.post(`${HOME_API}/project/qualification/update`, params);
}