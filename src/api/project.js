import service from "@/utils/request";

const HOME_API = window.globalUrl.HOME_API;

export function getProjectlist(params) {
  return service({
    url: `${HOME_API}/project/project/page`,
    method: "get",
    params: params
  });
}
export function addProject(params) {
  return service.post(`${HOME_API}/project/project/save`, params);
  // return service({
  //   url: `${HOME_API}/project/project/save`,
  //   method: "post",
  //   params: params
  // });
}
export function delProject(params) {
  return service({
    url: `${HOME_API}/project/project/delete`,
    method: "delete",
    params: params
  });
}
export function getProjPersonlist(params) {
  return service({
    url: `${HOME_API}/project/project/project-employees/${params}`,
    method: "get"
  });
}

// 检查项目编码
export function checkProNum(params) {
  return service({
    url: `${HOME_API}/project/project/check/${params}`,
    method: "get"
  });
}

export function getYears() {
  return service({
    url: `${HOME_API}/project/project/years`,
    method: "get"
  });
}