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
//用户修改密码
export const updatePwd= (data) => {
    return request.patch('/user/updatePwd', data);
}
//更新头像
export const updateAvatar = (avatarUrl) => {
    console.log('头像参数',avatarUrl);
    return request.patch('/user/updateAvatar', null,//null告诉axios没有请求体
        // 直接将参数作为请求参数传递
        {params: { avatarUrl }}
    );
}