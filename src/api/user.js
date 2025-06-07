import request from "@/utils/axios";
// 根据id查询用户信息
export const getUserInfo = (id) => {
    return request.get('/user/getUserInfo', {
        params: {
            id
        }
    });
}
//登录用户信息
export const getPersonInfo = () => {
    return request.get('/user/userInfo')
}
//获取所有用户信息
export const getAllUserInfo = () => {
    return request.get('/user/list');
}
//批量获取用户信息
export const batchUserInfoByIds = (ids) => {
    return request.post('/user/batchUserInfoByIds',ids);
}