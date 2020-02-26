import service from "@/utils/request";

const HOME_API = window.globalUrl.HOME_API;

// 获取列表
export function getDocumentList(params) {
  return service.get(`${HOME_API}/project/project-data/page`, {params});
}

// 获取子级列表
export function getDocumentChildList(params) {
  return service.get(`${HOME_API}/project/project-data/child`, {params});
}

// 新增
export function addDocumentInfo(params) {
  return service({
    url:`${HOME_API}/project/project-data/add`, 
    method: 'post',
    params: params
  });
}

// 删除
export function delDocumentInfo(params) {
  return service({
    url: `${HOME_API}/project/project-data/delete?${params}`,
    method: "delete"
  });
}

// 编辑更新
export function updateDocumentInfo(params) {
  return service({
    url: `${HOME_API}/project/project-data/edit`,
    method: "put",
    params: params
  });
}