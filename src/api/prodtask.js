import service from "@/utils/request";

const HOME_API = window.globalUrl.HOME_API;
export function getProdTask(params) {
  return service.post(`${HOME_API}/project/productive-task/page`, params);
}
export function addProdTask(params) {
  return service.post(`${HOME_API}/project/productive-task/save`, params);
}
export function updateProdTask(params) {
  return service.post(`${HOME_API}/project/productive-task/update`, params);
}
export function delProdTask(params) {
  return service({
    url: `${HOME_API}/project/productive-task/delete?${params}`,
    method: "delete"
  });
}
