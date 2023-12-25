//定制请求的实例

//导入axios  npm install axios
import axios from 'axios';

import { ElMessage } from 'element-plus'
//定义一个变量,记录公共的前缀  ,  baseURL
const baseURL = 'https://47.115.229.197:8443';
// const baseURL = '/api';
// const baseURL = '';
const instance = axios.create({baseURL})

import { useTokenStore } from '@/stores/token.js';
//添加请求拦截器
instance.interceptors.request.use(
    (config) => {
        //  请求前回调
        const tokenStore = useTokenStore();
        if (tokenStore.token) {
            config.headers.Authorization = tokenStore.token;
        }
        return config;
    },
    (err) => {
        Promise.reject(err);
    }
)


// import { useRoute } from 'vue-router';
// const router = useRoute();
import router from '@/router/index.js'
//添加响应拦截器
instance.interceptors.response.use(
    result=>{

        if (result.data.code === 0) {
            return result.data;
        }
        console.log('qweqweqweqweqwe');
        // alert(result.data.message ? result.data.message : '服务异常。。。。。。');
        ElMessage.error(result.data.message ? result.data.message : "服务异常。。");
        return Promise.reject(result.data);
    },
    err=>{
        if (err.response.status === 401) {
            ElMessage.error('请先登陆lll');
            router.push('/login');
        }
        else {
            ElMessage.error('服务异常cc');
        }
        return Promise.reject(err);//异步的状态转化成失败的状态
    }
)

export default instance;