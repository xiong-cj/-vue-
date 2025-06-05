import request from "@/utils/axios";
// 登录
export const userLogin = (data) => {
    return request.post('/user/login', data);
}
