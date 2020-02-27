import axios from "axios";
import { Notification } from "element-ui";
const service = axios.create({
  timeout: 10000
});

service.interceptors.request.use(
  config => {
    return config;
  },
  error => {
    Notification({
      title: "错误提示",
      message: error,
      type: "error",
      duration:2000
    });
    return Promise.reject();
  }
);

service.interceptors.response.use(
  response => {
    if (response.status === 200) {
      return response.data;
    } else {
      Promise.reject();
    }
  },
  error => {
    Notification({
      title: "错误提示",
      message: error,
      type: "error",
      duration:2000
    });
    return Promise.reject();
  }
);

export default service;
