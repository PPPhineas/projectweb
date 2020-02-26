import service from "@/utils/request";

const HOME_API = window.globalUrl.HOME_API;

// 获取列表
export function getProIssueList(params) {
  return service.get(`${HOME_API}/project/project_issue/page`, params);
}

// 新增
export function addProIssueInfo(params) {
  return service.post(`${HOME_API}/project/project_issue/save`, params);
}

// 删除
export function delProIssueInfo(params) {
  return service({
    url: `${HOME_API}/project/project_issue/delete?${params}`,
    method: "delete"
  });
}

// 编辑更新
export function updateProIssueInfo(params) {
  return service.post(`${HOME_API}/project/project_issue/update`, params);
}