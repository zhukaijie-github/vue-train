import axios from 'axios';
import { Message } from 'element-ui';
import get from 'lodash/get';
import Store from '../store/index';
import LimitPromise from './limit-promise';

// 请求上限
const MAX = 2;
// 核心控制器 , 限制并发数
const limitP = new LimitPromise(MAX);

const server = axios.create({
  baseURL:
    process.env.NODE_ENV === 'development'
      ? '/api'
      : process.env.VUE_APP_BASEURL,
  timeout: 60000000000
});

// axios 取消请求
const CancelToken = axios.CancelToken;

// 异常拦截处理器
const errorHandler = error => {
  console.log(error.toString());

  const status = get(error, 'response.status');

  switch (status) {
    /* eslint-disable no-param-reassign */
    case 400:
      error.message = '请求错误';
      break;
    case 401:
      error.message = '未授权，请登录';
      break;
    case 403:
      error.message = '拒绝访问';
      break;
    case 404:
      error.message = `请求地址出错: ${error.response.config.url}`;
      break;
    case 408:
      error.message = '请求超时';
      break;
    case 500:
      error.message = '服务器内部错误';
      break;
    case 501:
      error.message = '服务未实现';
      break;
    case 502:
      error.message = '网关错误';
      break;
    case 503:
      error.message = '服务不可用';
      break;
    case 504:
      error.message = '网关超时';
      break;
    case 505:
      error.message = 'HTTP版本不受支持';
      break;
    default:
      break;
    /* eslint-disabled */
  }

  Message.error(error.message);
  return Promise.reject(error);
};

// 请求拦截
server.interceptors.request.use(
  config => {
    if (config.reqType === 'upload') {
      config.cancelToken = new CancelToken(cancel => {
        let list = Store.getters.requestList;
        // list.push(cancel);
        list.push(function _cancel() {
          limitP.cancelToken();
          cancel('请求已取消');
        });
        Store.dispatch('setRequestList', list);
      });
    }

    return config;
  },
  error => {
    Message.error(error);
    return Promise.reject(error);
  }
);

// 响应拦截
server.interceptors.response.use(response => {
  const { code, msg, data } = response.data;
  if (code) {
    switch (code) {
      case 200:
        // [ 示例 ] code === 200 代表没有错误
        return Promise.resolve(data);
      case 'xxx':
        // [ 示例 ] 其它和后台约定的 code
        return 'xxx';
      default:
        // 不是正确的 code
        return '不是正确的code';
    }
  } else {
    return Promise.reject(msg);
  }
}, errorHandler);

const headersContentType = {
  upload: 'multipart/form-data'
};

function request(params) {
  const { url, method, data, onUploadProgres, reqType } = params;
  const reqParams = {
    url,
    method: method.toLocaleLowerCase() || 'post',
    headers: {
      'Content-Type': headersContentType[reqType]
        ? headersContentType[reqType]
        : 'application/json'
    },
    reqType,
    onUploadProgress: onUploadProgres
  };
  if (method.toLocaleLowerCase() === 'get') {
    reqParams.params = data;
  } else {
    reqParams.data = data;
  }

  // return limitP.call(server, reqParams);
  return server(reqParams);
}

export default request;
