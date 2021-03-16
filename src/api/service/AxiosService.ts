import axios, {AxiosResponse, AxiosRequestConfig, AxiosPromise} from 'axios';
import router from '@/router';
import store from '@/store';
import {LOGOUT} from '@/store/mutation-auth-types';

axios.defaults.baseURL = process.env.VUE_APP_BASE_URL;
/**
 * request interceptor
 */
axios.interceptors.request.use((config: AxiosRequestConfig) => {
  // Do something before request is sent
  config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`;
  return config;
}, (error: any) => {
  // Do something with request error
  return Promise.reject(error);
});

/**
 * response interceptor
 */
axios.interceptors.response.use((response: AxiosResponse) => {
  // Do something with response data
  return response;
}, (error: any) => {
  // Do something with response error
  return Promise.reject(error);
});
const onUnauthorized = () => {
  router.push(`/login?rPath=${encodeURIComponent(location.pathname)}`)
    .then(() => {
      // console.log( res );
      store.commit(LOGOUT);
    });
};
const setAuthorization = (token: string) => {
  axios.defaults.headers.common.Authorization = (token) ? `Bearer ${token}` : null;
};
const request = (method: string, url: string, data: any | null = null): Promise<any> => {
  // console.log( 'data status=', method, data, url );
  let reqObj: object;

  if (method === 'get') {
    reqObj = (data !== null)? {method, url, params: data} : {method, url};
  } else {
    reqObj = {method, url, data};
  }
  return axios(reqObj).then((res: AxiosResponse) => {
    // console.log( res.data )
    return res.data;
  }).catch((error: any) => {
    const {status} = error.response;
    //data.error_code 가 존재한다.
    if (status === 401) {
      alert('사용자 세션이 만료되었습니다. 다시 로그인 해주세요~');
      onUnauthorized();
    } else {
      // let errorCode=parseInt(`${ data.error_code }`);
      // alert( `${ data.message }` );
    }
    //error_code
    // error.response.data
    console.log(`error_code=${error.response.data.error_code}\n${error.response.data.message}\n url=${url}\n method=${method}`);

    //여기서 별도로 error.response 를 넘겨 줘야 각 api 호출시 catch 부분에서 error 의 인자값을 확인할 수 있다.
    throw error.response;
  });
};

export {request, setAuthorization};
