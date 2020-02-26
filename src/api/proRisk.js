import service from "@/utils/request";

const HOME_API = window.globalUrl.HOME_API;

// 获取列表
export function getProRiskList(params) {
  return service.get(`${HOME_API}/project/project_risk/page`, {params});
}

// 新增
export function addProRiskInfo(params) {
  return service.post(`${HOME_API}/project/project_risk/save`, params);
}

// 删除
export function delProRiskInfo(params) {
  return service({
    url: `${HOME_API}/project/project_risk/delete?${params}`,
    method: "delete"
  });
}

// 编辑更新
export function updateProRiskInfo(params) {
  return service.post(`${HOME_API}/project/project_risk/update`, params);
}