import service from "@/utils/request";

const HOME_API = window.globalUrl.HOME_API;
export function getContract(params) {
  return service.post(`${HOME_API}/project/contract/page`, params);
}
export function addContract(params) {
  return service.post(`${HOME_API}/project/contract/save`, params);
}
export function updateContract(params) {
  return service.post(`${HOME_API}/project/contract/update`, params);
}
export function delContract(params) {
  return service({
    url: `${HOME_API}/project/contract/delete?${params}`,
    method: "delete"
  });
}
