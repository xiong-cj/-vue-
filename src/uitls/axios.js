import axios from 'axios'

const service = axios.create({
    baseURL: '/api', // 设置基础 URL
    timeout: 5000, // 设置请求超时时间
});
// 添加请求拦截器，设置 token
service.interceptors.request.use(
    config => {
        const token = localStorage.getItem('token'); // 从 localStorage 获取 token
        if (token) {
         config.headers['Authorization'] = token; // 设置请求头的 Authorization 字段
        }
        return config;
    },
    err => {
        console.error('请求拦截器发生错误:', error);
        return Promise.reject(err);
    }
);
// 响应拦截器
service.interceptors.response.use(
    result=>{
        return result.data;
    },
    err=>{
        alert('服务器异常');
        return Promise.reject(err);
    }
)

  
export default service;