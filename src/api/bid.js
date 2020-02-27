import service from "@/utils/request";

const HOME_API = window.globalUrl.HOME_API;

export function getDictlist(params) {
  return service({
    url: `${HOME_API}/project/employee/dict`,
    method: "get",
    params:params
  });
}

// 录入投标信息
export function saveBidInfo(params) {
  return service.post(`${HOME_API}/project/bid/save`, params);
}

// 获取列表
export function getBidList(params) {
  return service.post(`${HOME_API}/project/bid/page`, params);
}

// 删除
export function delBid(params) {
  return service({
    url: `${HOME_API}/project/bid/delete?${params}`,
    method: "delete"
  });
}

// 编辑更新
export function updateBidInfo(params) {
  return service.post(`${HOME_API}/project/bid/update`, params);
}