import service from "@/utils/request";

const HOME_API = window.globalUrl.HOME_API;

export function getDictlist() {
  return service({
    url: `${HOME_API}/project/employee/dict`,
    method: "get"
  });
}
export function getPersonlist(params) {
  return service({
    url: `${HOME_API}/project/employee/page`,
    method: "get",
    params: params
  });
}
export function addEmployee(params) {
  return service({
    url: `${HOME_API}/project/employee/save`,
    method: "post",
    params: params
  });
}
export function updateEmployee(params) {
  return service({
    url: `${HOME_API}/project/employee/update`,
    method: "put",
    params: params
  });
}
export function deleteEmployee(params) {
  // return service({
  //   url: `${HOME_API}/project/employee/delete`,
  //   method: "delete",
  //   params: params
  // });
  return service.delete(`${HOME_API}/project/employee/delete`, params);
}
