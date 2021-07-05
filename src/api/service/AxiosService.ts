import axios, {AxiosResponse, AxiosRequestConfig} from 'axios';
import router from '@/router';
import store from '@/store';
import {GET_REFRESH_TOKEN, GET_TOKEN, LOGOUT} from '@/store/mutation-auth-types';
import {REMOVE_CLASS_DATA} from '@/store/mutation-class-types';
import AuthService from '@/api/service/AuthService';

axios.defaults.baseURL = process.env.VUE_APP_API_BASE_URL;
axios.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8';
axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';
// axios.defaults.timeout=1000;


const cancelTokenSource = axios.CancelToken.source();
let pendingCount: number=0;


/**
 * 로그아웃 시키기
 */
const onUnauthorized = () => {
  router.push(`/login?rPath=${encodeURIComponent(location.pathname)}`)
    .then(() => {
      // console.log( res );
      store.commit(`Auth/${LOGOUT}`);
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
  pendingCount++;
  return config;
}, (error: any) => {
  // Do something with request error
  return Promise.reject(error);
});

const  definedRefreshToken=async ( error: any )=>{
  const { refresh_token }= localStorage;
  // alert('사용자 세션이 만료되었습니다. 다시 로그인 해주세요~');
  // console.log(error.config, error.config.retry);
  //refresh_token
  // console.log('store.getters.isAuth='+store.getters['Auth/isAuth'], 'refresh_token='+refresh_token);
  if(error.config.retry===undefined){
    console.log('refresh_token 구문 접근');
    error.config.retry=true;
    await AuthService.sendRefreshToken( refresh_token  ).then((data)=>{
      // console.log('access_token='+data.access_token, 'refresh_token='+data.refresh_token);
      store.commit( `Auth/${GET_TOKEN}`, data.access_token );
      store.commit( `Auth/${GET_REFRESH_TOKEN}`, data.refresh_token );
    });
    return axios(error.config);
  }
};

const mismatchAccess=( config: any, data: any )=>{
  if( store.getters['Auth/isAuth'] ){
    console.log('접근 error / url =', config.url, ':: method=', config.method );

    alert('잘못된 접근입니다. 메인 페이지로 이동합니다.');
    router.push('/').then(() => {
      console.log('메인으로 이동');
    });

  }
};

/**
 * response interceptor
 */
axios.interceptors.response.use((response: AxiosResponse) => {
  // Do something with response data
  pendingCount--;
  // console.log(pendingCount);
  if (pendingCount > 15) {
    // console.log(pendingCount);
    // cancelTokenSource.cancel('데이터 대기 상태가 길어져서 요청을 취소 합니다.');
    // pendingCount=0;
  }
  return response;
}, (error: any) => {

  const {status, data, config} = error.response;
  // let errorMsg: any = error;
  // console.log('error=', error);
  // console.log(':::status=', status);
  if (status === 401) {
    definedRefreshToken( error );
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
    //여기서 별도로 error.response 를 넘겨 줘야 각 api 호출시 catch 부분에서 error 의 인자값을 확인할 수 있다.
    // console.log(`error_code=${error.response.data.error_code}\n${error.response.data.message}\n url=${url}\n method=${method}`);
    throw error.response;
  });
};

export {request, setAuthorization};
