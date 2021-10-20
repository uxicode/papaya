import axios, {AxiosRequestConfig, AxiosResponse} from 'axios';
import router from '@/router';
import store from '@/store';
import {LoginMutationType, TokenMutationType} from '@/store/mutation-auth-types';
import {REMOVE_CLASS_DATA} from '@/store/mutation-class-types';
import AuthService from '@/api/service/AuthService';

axios.defaults.baseURL = process.env.VUE_APP_API_BASE_URL;
axios.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8';
axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';
// axios.defaults.timeout=1000;

/**
 * 로그아웃 시키기
 */
const onUnauthorized = () => {
  router.push(`/login?rPath=${encodeURIComponent(location.pathname)}`)
    .then(() => {
      // console.log( res );
      store.commit(`Auth/${[LoginMutationType.LOGOUT]}`);
      store.commit(`MyClass/${REMOVE_CLASS_DATA}`);
    });
};
const setAuthorization = (token: string) => {
  axios.defaults.headers.common.Authorization = (token) ? `Bearer ${token}` : null;
};
//test userid - mobilej / pw - 0000
//test id - sstest07 / pw - 0000 ---> curriculum_list 있음 해당 클래스 아이디 : 724
/**
 * request interceptor
 */
axios.interceptors.request.use((config: AxiosRequestConfig) => {
  // Do something before request is sent
  // console.log('(localStorage.getItem='+localStorage.getItem('token'));
  config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`;
  return config;
}, (error: any) => {
  // Do something with request error
  console.log('interceptors.request=' + error);
  return Promise.reject(error);
});


const mismatchAccess=( config: any, data: any )=>{
  if( store.getters['Auth/isAuth'] ){
    console.log('접근 error / url =', config.url, ':: method=', config.method );

    alert('잘못된 접근입니다. 메인 페이지로 이동합니다.');
    router.push('/').then(() => {
      console.log('메인으로 이동');
    });

  }
};

//콜백함수 타입의 배열
const refreshSubscribers: Array<(token: string) => void> = [];
let isTokenRefreshCheck: boolean = false;
//실행 콜백함수 배열 대입.
const addRefreshSubscriber = (callback: (token: string) => void) => {
  refreshSubscribers.push( callback );
};
//배열에 저장된 콜백함수 실행.
const getTokenRefreshed = (token: string) => {
  refreshSubscribers.map( (callback) => callback(token) );
};


//test ex token eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwidXNlcl9pZCI6InRlc3QxMjM0IiwiZnVsbG5hbWUiOiLtmY0iLCJpYXQiOjE1Njg1OTY5NjEsImV4cCI6MTU2ODY4MzM2MX0.0EIZguQhhe3UUCXTX_UGAkAuf0bf18pqEyLTsoAU6mI
/**
 * response interceptor
 */
axios.interceptors.response.use((response: AxiosResponse) => {
  return response;
}, async (error: any) => {
  const {status, data, config} = error.response;
  // let errorMsg: any = error;
  // console.log('error=', error);

  if (status === 401 && data.message==='TokenExpiredError') {
    if (!isTokenRefreshCheck) {
      // isTokenRefreshing 이 false 인 경우에만 token refresh 요청
      isTokenRefreshCheck = true;

      const refreshToken = await localStorage.getItem('refresh_token');
      const tokenData= await AuthService.sendRefreshToken( refreshToken );
      const {access_token, refresh_token} = tokenData;
      // console.log('access_token=' + access_token, '\n refresh_token=' + refresh_token);
      //header 에 재발급된 token 을 심어놔야 한다.
      // AuthService.setAuthToken(this.token) 함수가 내부에서 아래 내용을 이미 호출하고 있음.
      //axios.defaults.headers.common.Authorization = `Bearer ${access_token}`;
      await store.commit(`Auth/${TokenMutationType.GET_TOKEN}`, access_token);
      await store.commit(`Auth/${TokenMutationType.GET_REFRESH_TOKEN}`, refresh_token);

      isTokenRefreshCheck = false;
      // 새로운 토큰으로 지연되었던 요청 진행
      getTokenRefreshed(access_token);

      console.log('refreshSubscribers=', refreshSubscribers);
    }
    // config.headers.Authorization = `Bearer ${access_token}`;
    ///axios( config );
    //  token 이 재발급 되는 동안의 요청은 refreshSubscribers 에 저장
    return new Promise((resolve) => {
      addRefreshSubscriber((token: string) => {
        config.headers.Authorization = `Bearer ${token}`;
        resolve( axios(config) );
        console.log(':::status=', data, config);
      });
    });
  }else if (status === 400) {
    mismatchAccess(config, data);
  }else{
    if( data.message !=='클래스에 해당 닉네임의 사용자 정보가 없습니다.'){
      mismatchAccess(config, data);
    }
  }

  // Do something with response error
  return Promise.reject(error);
});

const request = (method: string, url: string, data: any | null = null ): Promise<any> => {
  // console.log( 'data status=', method, data, url );
  let reqObj: object;
  /*const cancel={
    cancelToken:cancelTokenSource.token
  };*/
  if (method === 'get') {
    reqObj = (data !== null)? {method, url, params: data} : {method, url};
  } else if(method === 'upload'){
    reqObj = { method:'post', url, data, headers: {
      'Content-Type': 'multipart/form-data;charset=utf-8;'
    }};
  }else{
    reqObj = {method, url, data };
  }
  return axios(reqObj).then((res: AxiosResponse) => {
    // console.log( res.data )
    return res.data;
  }).catch((error: any) => {
    console.log(error.response);
    //여기서 별도로 error.response 를 넘겨 줘야 각 api 호출시 catch 부분에서 error 의 인자값을 확인할 수 있다.
    // console.log(`error_code=${error.response.data.error_code}\n${error.response.data.message}\n url=${url}\n method=${method}`);
    throw error.response;
  });
};

export {request, setAuthorization};
